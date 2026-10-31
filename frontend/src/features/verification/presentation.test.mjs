import test from 'node:test';
import assert from 'node:assert/strict';
import {presentVerification} from './presentation.mjs';
test('muestra un resultado demo', () => {
  const r = presentVerification({status:'success', code:'001234', reference:'DEMO-1001'});
  assert.equal(r.code, '001234');
  assert.match(r.message, /DEMO-1001/);
});
test('rechaza resultado malformado', () => {
  assert.equal(presentVerification({status:'success',code:123456}).type,'error');
  assert.equal(presentVerification({status:'success',code:'abc123'}).type,'error');
});
test('distingue estados', () => {
  assert.equal(presentVerification({status:'not_found'}).type,'empty');
  assert.equal(presentVerification({status:'invalid_input'}).type,'error');
  assert.equal(presentVerification({status:'unavailable'}).retryable,true);
});
test('no filtra detalles internos', () => {
  const r = presentVerification({status:'error', message:'secret: sample-internal-host'});
  assert.doesNotMatch(r.message,/secret|sample-internal-host/);
});
test('rechaza respuestas nulas', () => {
  assert.equal(presentVerification(null).type,'error');
});
