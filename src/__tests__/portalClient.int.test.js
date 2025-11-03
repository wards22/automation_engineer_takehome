import { describe, it, beforeAll, afterAll, expect, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { PortalClient } from '../automation/portalClient.js';
import { ensurePortalEnv } from './helpers/env.helper.js';

jest.setTimeout(120_000);

describe('PortalClient integration', () => {
  let client;

  beforeAll(async () => {
    ensurePortalEnv();
    jest.setTimeout(120_000);
    client = await PortalClient.create();
  });

  afterAll(async () => {
    await client?.close?.();
  });

  it('verifies a patient and returns status + coverage (or error)', async () => {
    const p = {
      patientId: 'P001',
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirthISO: '1985-03-15', // Fixed: zero-padded month
      insuranceProvider: 'BlueCross BlueShield',
      memberId: 'BCBS123456789',
    };
    
    const res = await client.verifyEligibility(p);
    
    // Basic shape assertions (portal may vary status/coverage)
    assert.ok(['Active', 'Inactive', 'Unknown'].includes(res.status), 
      `Expected valid status, got: ${res.status}`);
    assert.ok(typeof res.raw?.eligibility === 'string', 
      'raw.eligibility should be a string');
    assert.ok(typeof res.raw?.coverage === 'string', 
      'raw.coverage should be a string');
    
    // Verify we get either coverage type or error message
    if (res.status === 'Unknown' && res.errorMessage) {
      assert.ok(res.errorMessage.length > 0, 
        'errorMessage should not be empty when present');
    }
  }, 120_000);

  it('can check another patient in same session (resets to form)', async () => {
    const p2 = {
      patientId: 'P002',
      firstName: 'Michael',
      lastName: 'Chen',
      dateOfBirthISO: '1992-07-22',
      insuranceProvider: 'Aetna',
      memberId: 'AET987654321',
    };
    
    const res2 = await client.verifyEligibility(p2);
    
    assert.ok(['Active', 'Inactive', 'Unknown'].includes(res2.status),
      `Expected valid status, got: ${res2.status}`);
    assert.ok(typeof res2.raw?.eligibility === 'string',
      'raw.eligibility should be a string');
    assert.ok(typeof res2.raw?.coverage === 'string',
      'raw.coverage should be a string');
  }, 120_000);
}, 120_000);
