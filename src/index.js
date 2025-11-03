import path from 'node:path';
import { readPatientCsv } from './csv/patientCsv.js';

async function main() {
  const file = process.argv[2] ?? path.join('data', 'patients_sample.csv');
  const { rows, errors } = await readPatientCsv(file);

  console.log(`Parsed ${rows.length} valid row(s).`);
  if (errors.length) {
    console.log(`Encountered ${errors.length} invalid row(s):`);
    for (const e of errors) {
      console.log(`  Row ${e.rowNumber}: ${e.issues.join('; ')}`);
    }
  }

  // Example: pull out normalized patients for the next step
  const patients = rows.map(r => r.normalized);
  console.log('\nFirst normalized row (if any):');
  console.log(patients[0] ?? '(none)');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
