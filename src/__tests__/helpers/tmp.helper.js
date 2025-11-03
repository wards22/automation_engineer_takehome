import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function mkTmpDir(prefix = 'eligibility-') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return dir;
}

export function writeFile(dir, name, contents) {
  const p = path.join(dir, name);
  fs.writeFileSync(p, contents, 'utf8');
  return p;
}
