import { inflateSync } from 'node:zlib';

const POBB_HOSTS = new Set(['pobb.in', 'www.pobb.in']);

function validatePobbUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`Invalid pobb.in URL: ${value}`);
  }

  if (parsed.protocol !== 'https:' || !POBB_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new Error('Build URL must be an https://pobb.in/... URL.');
  }

  const pathPart = parsed.pathname.replace(/^\/+/, '');
  const buildPath = pathPart.replace(/^pob\//, '');
  if (!buildPath || buildPath.split('/').some((part) => part === '.' || part === '..')) {
    throw new Error('Build URL does not contain a pobb.in build id.');
  }

  return { parsed, buildPath };
}

/**
 * Resolve a public pobb.in preview link to the raw PoB export endpoint used by
 * Path of Building's Import/Export tab.
 */
export function pobbRawUrl(value) {
  const { parsed, buildPath } = validatePobbUrl(value);
  return `https://pobb.in/pob/${buildPath}${parsed.search}`;
}

/** Decode PoB's URL-safe base64 + zlib export into Path of Building XML. */
export function decodePobCode(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('PoB export is empty.');
  }

  const normalized = value.trim().replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(padded) || padded.length % 4 === 1) {
    throw new Error('PoB export is not valid base64.');
  }

  let xml;
  try {
    xml = inflateSync(Buffer.from(padded, 'base64')).toString('utf8');
  } catch (error) {
    throw new Error(`Could not decompress PoB export: ${error.message}`);
  }
  if (!/<PathOfBuilding(?:2)?[\s>]/.test(xml)) {
    throw new Error('Decoded pobb.in payload is not a Path of Building XML export.');
  }
  return xml;
}

/** Fetch and decode a pobb.in build without exposing the raw export to stdout. */
export async function fetchPobbBuildXml(value, { fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('This Node runtime does not provide fetch().');
  const rawUrl = pobbRawUrl(value);
  let response;
  try {
    response = await fetchImpl(rawUrl, {
      headers: {
        accept: 'text/plain',
        'user-agent': 'PathOfEverything/0.0.0',
      },
    });
  } catch (error) {
    throw new Error(`Could not reach pobb.in: ${error.message}`);
  }
  if (!response.ok) throw new Error(`pobb.in returned HTTP ${response.status}.`);

  const xml = decodePobCode(await response.text());
  const { buildPath } = validatePobbUrl(value);
  const name = `pobb-${buildPath.split('/').at(-1)}.xml`;
  return { xml, name, rawUrl };
}
