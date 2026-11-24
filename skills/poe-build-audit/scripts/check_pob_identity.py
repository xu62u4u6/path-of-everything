#!/usr/bin/env python3
"""Reject compact PoB results when the runtime or loaded build identity is wrong."""
import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def read_compact(path):
    text = path.read_text(encoding='utf-8')
    try:
        value = json.loads(text)
    except json.JSONDecodeError:
        # npm's banner precedes the CLI's one-line JSON output.
        for line in reversed(text.splitlines()):
            try:
                value = json.loads(line)
            except json.JSONDecodeError:
                continue
            if isinstance(value, dict) and 'build' in value and 'selection' in value:
                break
        else:
            raise ValueError('No compact JSON result found')
    if not isinstance(value, dict) or not all(isinstance(value.get(k), dict) for k in ['build', 'selection', 'engine']):
        raise ValueError('Expected compact output with build, selection and engine objects')
    return value


def check(args):
    root = ET.parse(args.build).getroot()
    source = root.find('Build')
    tree = root.find('Tree')
    if source is None or tree is None:
        raise ValueError('Source XML is missing Build or Tree')
    specs = tree.findall('Spec')
    active = int(tree.get('activeSpec', '1'))
    if not 1 <= active <= len(specs):
        raise ValueError('Source XML has no valid active tree spec')
    version = specs[active - 1].get('treeVersion', '')
    if not re.fullmatch(r'\d+_\d+(?:_[a-z0-9]+)*', version):
        raise ValueError('Source XML has no recognized treeVersion')
    result = read_compact(args.compact)
    loaded = result['build']
    selection = result['selection']
    errors = []
    src = args.pob_path if args.pob_path.name == 'src' else args.pob_path / 'src'
    if not (src / 'TreeData' / version / 'tree.lua').is_file():
        errors.append('runtime_tree_missing: ' + version)
    for field, xml_name in [('className', 'className'), ('ascendancy', 'ascendClassName'), ('level', 'level')]:
        expected = source.get(xml_name)
        actual = loaded.get(field)
        if expected is None:
            errors.append('source_identity_missing: ' + xml_name)
        elif str(actual) != str(expected):
            errors.append(f'identity_mismatch: {field} expected={expected} actual={actual}')
    expected_selection = {'socketGroup': args.socket_group, 'activeSkill': args.active_skill, 'skillName': args.skill_name}
    if args.minion_skill is not None:
        expected_selection['minionSkill'] = args.minion_skill
    if args.skill_part_name is not None:
        expected_selection['skillPartName'] = args.skill_part_name
    for field, expected in expected_selection.items():
        if selection.get(field) != expected:
            errors.append(f'selection_mismatch: {field} expected={expected} actual={selection.get(field)}')
    if args.skill_name == 'Raise Spectre' and not source.findall('Spectre'):
        errors.append('spectre_species_missing: record confirmed species in a separate input XML')
    return {'status': 'reject' if errors else 'pass', 'errors': errors,
            'source': {'className': source.get('className'), 'ascendancy': source.get('ascendClassName'),
                       'level': source.get('level'), 'treeVersion': version},
            'loaded': {key: loaded.get(key) for key in ['className', 'ascendancy', 'level']},
            'selection': selection, 'engine': result['engine'],
            'scope': 'Technical identity check only; does not verify DPS, overlap, uptime or game behavior.'}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--build', type=Path, required=True)
    p.add_argument('--compact', type=Path, required=True)
    p.add_argument('--pob-path', type=Path, required=True)
    p.add_argument('--socket-group', type=int, required=True)
    p.add_argument('--active-skill', type=int, required=True)
    p.add_argument('--skill-name', required=True)
    p.add_argument('--minion-skill', type=int)
    p.add_argument('--skill-part-name')
    args = p.parse_args()
    try:
        report = check(args)
    except (OSError, ValueError, ET.ParseError) as exc:
        print(json.dumps({'status': 'reject', 'errors': ['invalid_input: ' + str(exc)]}))
        return 2
    print(json.dumps(report, ensure_ascii=False))
    return 1 if report['errors'] else 0


if __name__ == '__main__':
    sys.exit(main())
