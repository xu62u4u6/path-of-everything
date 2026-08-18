import assert from 'node:assert/strict';
import test from 'node:test';
import { deflateSync } from 'node:zlib';
import { decodePobCode, fetchPobbBuildXml, pobbRawUrl } from '../packages/cli/src/pobb-input.mjs';

const xml = `<?xml version="1.0"?><Path${'OfBuilding'}><Build level="1"/></Path${'OfBuilding'}>`;
const exportCode = deflateSync(Buffer.from(xml)).toString('base64url');

test('resolves preview and raw pobb.in links to the official raw endpoint', () => {
  assert.equal(pobbRawUrl('https://pobb.in/TlR6hQlQi3lq'), 'https://pobb.in/pob/TlR6hQlQi3lq');
  assert.equal(pobbRawUrl('https://pobb.in/pob/TlR6hQlQi3lq?version=3_26'), 'https://pobb.in/pob/TlR6hQlQi3lq?version=3_26');
  assert.throws(() => pobbRawUrl('http://example.com/build'), /https:\/\/pobb\.in/);
});

test('decodes a PoB URL-safe base64/zlib export', () => {
  assert.equal(decodePobCode(exportCode), xml);
  assert.throws(() => decodePobCode('not-a-pob-export'), /decompress|base64/);
});

test('fetches and decodes without requiring network access in the test', async () => {
  let requestedUrl;
  const imported = await fetchPobbBuildXml('https://pobb.in/example-build', {
    fetchImpl: async (url, init) => {
      requestedUrl = { url, init };
      return { ok: true, status: 200, text: async () => exportCode };
    },
  });

  assert.equal(requestedUrl.url, 'https://pobb.in/pob/example-build');
  assert.equal(requestedUrl.init.headers.accept, 'text/plain');
  assert.equal(imported.name, 'pobb-example-build.xml');
  assert.equal(imported.xml, xml);
});
