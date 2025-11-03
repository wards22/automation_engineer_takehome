import { describe, it, beforeAll, expect, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { runBatch } from '../batch/runBatch.js';
import { mkTmpDir, writeFile } from './helpers/tmp.helper.js';
import { ensurePortalEnv } from './helpers/env.helper.js';

jest.setTimeout(120_000);

import { parse } from 'csv-parse/sync';

function parseCsv(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const records = parse(raw, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true, // handles BOM automatically
    });

    // Get headers from first record keys
    const headers = records.length > 0 ? Object.keys(records[0]) : [];

    return { headers, rows: records };
}

describe('Batch runner integration', () => {
    beforeAll(() => {
        ensurePortalEnv();
        jest.setTimeout(120_000);
    });

    it('reads CSV, verifies rows, writes output CSV with required columns', async () => {
        const dir = mkTmpDir('batch-');
        const input = [
            'patient_id,first_name,last_name,date_of_birth,insurance_provider,member_id',
            ',MissingLast,User,1985-03-15,BlueCross BlueShield,BCBS1',
            'P10,Lee,Wong,1990-12-31,Aetna,AET55',
            'P11,Ana,O\'Brien,03/05/1985,UnitedHealthcare,UNI123'
        ].join('\n');
        const inPath = writeFile(dir, 'in.csv', input);
        const outPath = path.join(dir, 'out.csv');

        console.log('Input path:', inPath);
        console.log('Output path:', outPath);
        console.log('Temp dir:', dir);

        await runBatch(inPath, outPath);

        // Give it a moment to flush (shouldn't be needed, but let's try)
        await new Promise(resolve => setTimeout(resolve, 100));

        assert.ok(fs.existsSync(outPath), 'output CSV should exist');

        const stats = fs.statSync(outPath);
        console.log('File size:', stats.size, 'bytes');

        if (stats.size === 0) {
            // Check if the directory has any files
            const dirContents = fs.readdirSync(dir);
            console.log('Directory contents:', dirContents);
            throw new Error('Output CSV file is empty (0 bytes)');
        }

        const { headers, rows } = parseCsv(outPath);

        for (const h of [
            'patientId', 'firstName', 'lastName', 'dateOfBirth', 'insuranceProvider', 'memberId'
        ]) {
            assert.ok(headers.includes(h), `missing expected column: ${h}`);
        }

        assert.equal(rows.length, 3);

        rows.forEach(r => {
            assert.ok((r.verified_at || '').length > 0, 'verified_at should be set');
        });

        const nonEmpty = rows.some(r => r.eligibility_status || r.coverage_type);
        assert.ok(nonEmpty, 'should have some eligibility or coverage content');
    });
}, 120_000);
