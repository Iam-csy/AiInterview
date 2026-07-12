import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, comparePassword, signAccessToken } from '../src/utils/auth.js';

test('password hashing and comparison work', async () => {
  const password = 'SuperSecure123!';
  const hashed = await hashPassword(password);

  assert.notEqual(hashed, password);
  assert.equal(await comparePassword(password, hashed), true);
  assert.equal(await comparePassword('wrong-password', hashed), false);
});

test('access tokens include a user id', async () => {
  const token = signAccessToken({ id: 'user-123' });
  assert.match(token, /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
});
