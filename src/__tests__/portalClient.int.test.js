import { describe, it, beforeAll, afterAll, expect, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { PortalClient } from '../automation/portalClient.js';
import { ensurePortalEnv } from './helpers/env.helper.js';
import { getTestPatient, ensureTestPatientEnv } from './helpers/testData.helper.js';

jest.setTimeout(120_000);

describe('PortalClient integration', () => {
  let client;

  beforeAll(async () => {
    ensurePortalEnv();
    ensureTestPatientEnv(1);
    ensureTestPatientEnv(2);
    jest.setTimeout(120_000);
    client = await PortalClient.create();
  });

  afterAll(async () => {
    await client?.close?.();
  });

  it('verifies a patient and returns status + coverage (or error)', async () => {
    const p = getTestPatient(1);
    
    const res = await client.verifyEligibility(p);
    
    assert.ok(['Active', 'Inactive', 'Unknown'].includes(res.status), 
      `Expected valid status, got: ${res.status}`);
    assert.ok(typeof res.raw?.eligibility === 'string', 
      'raw.eligibility should be a string');
    assert.ok(typeof res.raw?.coverage === 'string', 
      'raw.coverage should be a string');
    
    if (res.status === 'Unknown' && res.errorMessage) {
      assert.ok(res.errorMessage.length > 0, 
        'errorMessage should not be empty when present');
    }
  }, 120_000);

  it('can check another patient in same session (resets to form)', async () => {
    const p2 = getTestPatient(2);
    
    const res2 = await client.verifyEligibility(p2);
    
    assert.ok(['Active', 'Inactive', 'Unknown'].includes(res2.status),
      `Expected valid status, got: ${res2.status}`);
    assert.ok(typeof res2.raw?.eligibility === 'string',
      'raw.eligibility should be a string');
    assert.ok(typeof res2.raw?.coverage === 'string',
      'raw.coverage should be a string');
  }, 120_000);
}, 120_000);
