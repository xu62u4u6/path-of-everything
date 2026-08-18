import assert from 'node:assert/strict';
import test from 'node:test';
import { getValidationCase, VALIDATION_CASES } from '../packages/cli/src/validation-cases.mjs';

test('mechanism validation catalog has stable ids and questions', () => {
  assert.ok(VALIDATION_CASES.length >= 10);
  const ids = new Set(VALIDATION_CASES.map((entry) => entry.id));
  assert.equal(ids.size, VALIDATION_CASES.length);
  for (const entry of VALIDATION_CASES) {
    assert.match(entry.id, /^[a-z0-9-]+$/);
    assert.ok(entry.question.length > 20);
    assert.ok(Array.isArray(entry.assert));
  }
  assert.equal(getValidationCase('srs-level-15-base-damage').input.gemLevel, 15);
  assert.equal(getValidationCase('animate-guardian-base-damage').input.itemSet, 'empty');
});
