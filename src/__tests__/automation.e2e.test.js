import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, beforeAll, expect, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import { mkTmpDir, writeFile } from './helpers/tmp.helper.js';
import { ensurePortalEnv } from './helpers/env.helper.js';
import { getE2EPatient, ensureE2EPatientEnv } from './helpers/testData.helper.js';

jest.setTimeout(120_000);

function execNode(file, args = [], env = {}, killAfterMs = 110_000) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      process.execPath,
      [file, ...args],
      { env: { ...process.env, ...env } },
      (err, stdout, stderr) => {
        if (timer) clearTimeout(timer);
        if (err) return reject(Object.assign(new Error('exec failed'), { err, stdout, stderr }));
        resolve({ stdout, stderr });
      }
    );
    // Safety timer: kill if it runs too long
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch {}
      reject(new Error(`exec timeout after ${killAfterMs}ms`));
    }, killAfterMs);
  });
}

describe('E2E CLI test', () => {
  beforeAll(() => {
    ensurePortalEnv();
    ensureE2EPatientEnv(1);
    ensureE2EPatientEnv(2);
  });

  it('produces an output CSV from a small input', async () => {
    const cli = path.resolve('src', 'index.js');
    const dir = mkTmpDir('e2e-');
    
    const patient1 = getE2EPatient(1);
    const patient2 = getE2EPatient(2);
    
    const inCsv = [
      'Patient ID,First Name,Last Name,Date of Birth,Insurance Provider,Member ID',
      `${patient1.patientId},${patient1.firstName},${patient1.lastName},${patient1.dateOfBirth},${patient1.insuranceProvider},${patient1.memberId}`,
      `${patient2.patientId},${patient2.firstName},${patient2.lastName},${patient2.dateOfBirth},${patient2.insuranceProvider},${patient2.memberId}`
    ].join('\n');
    
    const inPath = writeFile(dir, 'in.csv', inCsv);
    const outPath = path.join(dir, 'out.csv');
    
    const { stdout } = await execNode(cli, [inPath, outPath], { HEADLESS: 'true' });
    
    // basic CLI output includes "Wrote X rows"
    expect(stdout).toMatch(/Wrote\s+\d+\s+rows/i);
    expect(fs.existsSync(outPath)).toBe(true);
    
    const out = fs.readFileSync(outPath, 'utf8').trim();
    const lines = out.split(/\r?\n/);
    expect(lines.length).toBeGreaterThan(1); // header + >= 1 row
  }, 120_000);
});
