import fs from 'node:fs';
import { stringify } from 'csv-stringify';

export async function writeCsv({ rows, headers, outPath }) {
  // Build csv-stringify columns as [{ key, header }]
  const columns = headers.map(h => ({ key: h, header: h }));
   return new Promise((resolve, reject) => {
     const stream = fs.createWriteStream(outPath);

    const stringifier = stringify({
      header: true,
      columns,
      bom: false,
      record_delimiter: 'unix', // ensure \n on all platforms
    });
     stringifier.on('error', reject);
     stream.on('error', reject);
     stringifier.on('finish', resolve);

     stringifier.pipe(stream);
     for (const row of rows) stringifier.write(row);
     stringifier.end();
   });
}
