import test from 'node:test';
import assert from 'node:assert/strict';
import { canOpen, canEdit } from '../scripts/permissions.js';
import { localBoardOptions } from '../src/sync/local.js';
test('GM access survives player restrictions; unauthenticated users are denied', () => {
  assert.equal(canOpen({isGM: true}, false), true);
  assert.equal(canOpen({isGM: false}, false), false);
  assert.equal(canEdit({isGM: false}, true), true);
  assert.equal(canOpen(null, true), false);
});
test('local boards are isolated by world and user', () => {
  assert.notEqual(localBoardOptions('world:a:user:1').persistenceKey, localBoardOptions('world:b:user:1').persistenceKey);
});
