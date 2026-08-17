#!/usr/bin/env python3
"""Fetch a public poe.ninja PoE 1 character model and decode its PoB export."""

from __future__ import annotations

import argparse
import base64
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
import zlib
from pathlib import Path
from typing import Any


BASE_URL = "https://poe.ninja"
USER_AGENT = "Codex-PoE-Build-Audit/1.0"


def fetch_json(path: str) -> Any:
    request = urllib.request.Request(BASE_URL + path, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")[:500]
        raise RuntimeError(f"poe.ninja returned HTTP {exc.code}: {detail}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Could not reach poe.ninja: {exc.reason}") from exc


def account_slug(account: str) -> str:
    return account.strip().replace("#", "-")


def quote(value: str, *, keep_hyphen: bool = False) -> str:
    return urllib.parse.quote(value, safe="-" if keep_hyphen else "")


def decode_pob(export: str) -> str:
    normalized = export.strip().replace("-", "+").replace("_", "/")
    normalized += "=" * ((4 - len(normalized) % 4) % 4)
    return zlib.decompress(base64.b64decode(normalized)).decode("utf-8")


def pob_config(xml_text: str) -> dict[str, Any]:
    root = ET.fromstring(xml_text)
    config = root.find("./Config/ConfigSet")
    if config is None:
        return {"inputs": [], "placeholders": []}
    return {
        "inputs": [dict(node.attrib) for node in config.findall("Input")],
        "placeholders": [dict(node.attrib) for node in config.findall("Placeholder")],
    }


def item_summary(entry: dict[str, Any]) -> dict[str, Any]:
    item = entry.get("itemData") or {}
    return {
        "slot": entry.get("itemSlot"),
        "name": item.get("name"),
        "typeLine": item.get("typeLine"),
        "frameType": item.get("frameTypeId"),
        "implicitMods": item.get("implicitMods") or [],
        "explicitMods": item.get("explicitMods") or [],
        "craftedMods": item.get("craftedMods") or [],
        "enchantMods": item.get("enchantMods") or [],
        "mutatedMods": item.get("mutatedMods") or [],
    }


def skill_summary(group: dict[str, Any]) -> dict[str, Any]:
    gems = []
    for gem in group.get("allGems") or []:
        gems.append(
            {
                "name": gem.get("name"),
                "level": gem.get("level"),
                "quality": gem.get("quality"),
                "builtIn": gem.get("isBuiltInSupport", False),
            }
        )
    return {"slot": group.get("itemSlot"), "gems": gems, "dps": group.get("dps") or []}


def build_summary(model: dict[str, Any], config: dict[str, Any]) -> dict[str, Any]:
    return {
        "identity": {
            "account": model.get("account"),
            "name": model.get("name"),
            "league": model.get("league"),
            "level": model.get("level"),
            "class": model.get("class"),
            "ascendancy": model.get("ascendancyClassName"),
            "secondaryAscendancy": model.get("secondaryAscendancyClassName"),
            "updatedUtc": model.get("updatedUtc"),
            "lastCheckedUtc": model.get("lastCheckedUtc"),
        },
        "defensiveStats": model.get("defensiveStats") or {},
        "items": [item_summary(entry) for entry in model.get("items") or []],
        "flasks": [item_summary(entry) for entry in model.get("flasks") or []],
        "jewels": [item_summary(entry) for entry in model.get("jewels") or []],
        "skills": [skill_summary(group) for group in model.get("skills") or []],
        "keystones": model.get("keyStones") or [],
        "masteries": model.get("masteries") or [],
        "pantheonMajor": model.get("pantheonMajor"),
        "pantheonMinor": model.get("pantheonMinor"),
        "bandit": model.get("banditChoice"),
        "pobConfig": config,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--account", required=True, help="Account name, preferably with # discriminator")
    parser.add_argument("--character", help="Character name; omit to list public characters")
    parser.add_argument("--league", help="poe.ninja league slug, required with --character")
    parser.add_argument("--output", type=Path, help="Directory for model.json, build.xml, and summary.json")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    slug = quote(account_slug(args.account), keep_hyphen=True)

    if not args.character:
        characters = fetch_json(f"/poe1/api/profile/characters/{slug}/0")
        print(json.dumps(characters, ensure_ascii=False, indent=2))
        return 0

    if not args.league or not args.output:
        raise RuntimeError("--character requires both --league and --output")

    path = (
        f"/poe1/api/profile/characters/{slug}/{quote(args.league.lower())}/"
        f"{quote(args.character)}/model/0"
    )
    payload = fetch_json(path)
    if payload.get("type") != "found" or not payload.get("charModel"):
        raise RuntimeError(f"Character model was not found: {payload}")

    model = payload["charModel"]
    export = model.get("pathOfBuildingExport")
    xml_text = decode_pob(export) if export else ""
    config = pob_config(xml_text) if xml_text else {"inputs": [], "placeholders": []}
    summary = build_summary(model, config)

    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "model.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (args.output / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    if xml_text:
        (args.output / "build.xml").write_text(xml_text, encoding="utf-8")

    print(json.dumps(summary["identity"], ensure_ascii=False, indent=2))
    print(f"Wrote audit inputs to {args.output}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError, ValueError, zlib.error, ET.ParseError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
