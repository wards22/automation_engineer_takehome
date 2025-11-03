import path from 'node:path';
import { readPatientCsv } from '../csv/patientCsv.js';
import { writeCsv } from './csvOut.js';
import { PortalClient } from '../automation/portalClient.js';
import { AuthError } from '../automation/errors.js';

/**
 * @param {string} inCsvPath
 * @param {string} outCsvPath
 */
export async function runBatch(inCsvPath, outCsvPath) {
  const start = Date.now();
  const { rows: valid, errors: invalids } = await readPatientCsv(inCsvPath);

  const outRows = [];

  // 1) Add all invalid rows to the output right away with error messages
  for (const e of invalids) {
    const orig = e.original ?? {};
    outRows.push({
      // Include the "original" canonical fields if present; otherwise blank
      patientId: orig.patientId ?? '',
      firstName: orig.firstName ?? '',
      lastName: orig.lastName ?? '',
      dateOfBirth: orig.dateOfBirth ?? '',
      insuranceProvider: orig.insuranceProvider ?? '',
      memberId: orig.memberId ?? '',
      // New columns
      eligibility_status: 'Unknown',
      coverage_type: '',
      verified_at: new Date().toISOString(),
      error_message: e.issues?.join('; ') ?? e.message ?? 'Invalid input row',
    });
  }

  if (valid.length === 0) {
    await writeCsv({
      rows: outRows,
      headers: [
        'patientId','firstName','lastName','dateOfBirth','insuranceProvider','memberId',
        'eligibility_status','coverage_type','verified_at','error_message'
      ],
      outPath: outCsvPath,
    });
    console.log(`Finished with only invalid rows. Wrote ${outRows.length} rows to ${path.resolve(outCsvPath)} in ${Date.now()-start}ms.`);
    return;
  }

  // 2) Verify valid rows using a single portal session
  let client;
  try {
    client = await PortalClient.create();

    for (const { original, normalized } of valid) {
      try {
        const r = await client.verifyEligibility(normalized);

        outRows.push({
          // All original patient data (canonical headers)
          patientId: original.patientId,
          firstName: original.firstName,
          lastName: original.lastName,
          dateOfBirth: original.dateOfBirth,            // raw as provided
          insuranceProvider: original.insuranceProvider,
          memberId: original.memberId,

          // New outputs
          eligibility_status: r.status,
          coverage_type: r.coverageType ?? '',
          verified_at: new Date().toISOString(),
          error_message: r.errorMessage ?? '',
        });

        // tiny politeness delay (helps avoid flakiness on some portals)
        await new Promise(res => setTimeout(res, 250));

      } catch (err) {
        // Per-row failure: continue, but capture the error
        outRows.push({
          patientId: original.patientId,
          firstName: original.firstName,
          lastName: original.lastName,
          dateOfBirth: original.dateOfBirth,
          insuranceProvider: original.insuranceProvider,
          memberId: original.memberId,

          eligibility_status: 'Unknown',
          coverage_type: '',
          verified_at: new Date().toISOString(),
          error_message: (err?.info?.cause?.message ?? err?.message ?? 'Verification error'),
        });
      }
    }
  } catch (err) {
    // Fatal (e.g., bad credentials): mark all remaining valid rows as Unknown with a shared error
    const fatalMsg = err instanceof AuthError ? 'Authentication failed' : (err?.message ?? 'Portal error');
    console.error('[batch] Fatal error during portal setup/login:', fatalMsg);

    for (const { original } of valid) {
      outRows.push({
        patientId: original.patientId ?? '',
        firstName: original.firstName ?? '',
        lastName: original.lastName ?? '',
        dateOfBirth: original.dateOfBirth ?? '',
        insuranceProvider: original.insuranceProvider ?? '',
        memberId: original.memberId ?? '',
        eligibility_status: 'Unknown',
        coverage_type: '',
        verified_at: new Date().toISOString(),
        error_message: fatalMsg,
      });
    }
  } finally {
    await client?.close?.();
  }

  // 3) Write CSV
  await writeCsv({
    rows: outRows,
    headers: [
      'patientId','firstName','lastName','dateOfBirth','insuranceProvider','memberId',
      'eligibility_status','coverage_type','verified_at','error_message'
    ],
    outPath: outCsvPath,
  });

  console.log(`Wrote ${outRows.length} rows to ${path.resolve(outCsvPath)} in ${Date.now()-start}ms.`);
}
