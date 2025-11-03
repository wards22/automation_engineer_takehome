import fs from 'node:fs';
import path from 'node:path';
import { runBatch } from './batch/runBatch.js';

async function main() {
  const inPath = process.argv[2] ?? path.join('data', 'patients_sample.csv');
  const outPath = process.argv[3] ?? path.join('out', 'results.csv');

  // ensure output dir exists
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  await runBatch(inPath, outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
