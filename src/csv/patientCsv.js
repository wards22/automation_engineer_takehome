import fs from 'node:fs';
import { parse } from 'csv-parse';
import { canonicalizeHeader } from './headerMap.js';
import { normalizeDob, requireNonEmpty, validateMemberId } from './validators.js';

/**
 * Reads and validates a patient CSV.
 * Returns { rows: PatientRow[], errors: CsvRowError[] }
 *
 * @param {string} filePath
 * @returns {Promise<{rows: Array, errors: Array}>}
 */
export async function readPatientCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const errors = [];

    let firstRowLogged = false; // for optional debug
    let unknownCounter = 0;

    const stream = fs
      .createReadStream(filePath)
      .pipe(parse({
        bom: true,
        skip_empty_lines: true,
        relax_column_count: true,
        trim: true,
        // Map CSV headers -> our canonical keys here
        columns: (headers) => headers.map((h) => {
          const canon = canonicalizeHeader(h);
          // If we don't recognize a header, keep it but mark unknown to avoid collisions
          return canon ?? `__unknown_${unknownCounter++}`;
        }),
      }));

    let rowIndex = 1; // header = 1, first data row = 2

    stream.on('readable', () => {
      let record;
      while ((record = stream.read()) !== null) {
        rowIndex++;

        // Optional one-time debug: see what keys we have for the first data row
        if (!firstRowLogged) {
          // console.log('Debug - first row keys:', Object.keys(record));
          firstRowLogged = true;
        }

        // Pull the canonical fields directly (unknowns are ignored)
        const original = { ...record };

        const mapped = {
          patientId: record.patientId,
          firstName: record.firstName,
          lastName: record.lastName,
          dateOfBirth: record.dateOfBirth,
          insuranceProvider: record.insuranceProvider,
          memberId: record.memberId,
        };

        const errs = [];
        const pid = requireNonEmpty('Patient ID', mapped.patientId);
        const first = requireNonEmpty('First Name', mapped.firstName);
        const last = requireNonEmpty('Last Name', mapped.lastName);
        const provider = requireNonEmpty('Insurance Provider', mapped.insuranceProvider);
        const member = validateMemberId(mapped.memberId);
        const dob = normalizeDob(mapped.dateOfBirth);

        for (const check of [pid, first, last, provider, member, dob]) {
          if (!check.ok) errs.push(check.error);
        }

        if (errs.length > 0) {
          errors.push({
            rowNumber: rowIndex,
            message: 'Validation error',
            issues: errs,
            original,
          });
          continue;
        }

        rows.push({
          original,
          normalized: {
            patientId: pid.value,
            firstName: first.value,
            lastName: last.value,
            dateOfBirthISO: dob.value,
            insuranceProvider: provider.value,
            memberId: member.value,
          },
        });
      }
    });

    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve({ rows, errors }));
  });
}
