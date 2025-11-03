import { readPatientCsv } from '../csv/patientCsv.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

function writeTmpCsv(contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'patients-'));
  const file = path.join(dir, 'test.csv');
  fs.writeFileSync(file, contents, 'utf8');
  return file;
}

describe('readPatientCsv', () => {
  test('parses valid rows and reports invalid rows', async () => {
    const csv = [
      'Patient ID,First Name,Last Name,Date of Birth,Insurance Provider,Member ID',
      'P001,Sarah,Johnson,1985-03-15,BlueCross BlueShield,BCBS123',
      'P002,Alan,,03/22/1980,Aetna,AET999', // Missing last name → invalid
      'P003,Rosa,Diaz,1981/12/01,United,UNI-55' // valid
    ].join('\n');

    const file = writeTmpCsv(csv);
    const { rows, errors } = await readPatientCsv(file);

    expect(rows.length).toBe(2);
    expect(errors.length).toBe(1);
    expect(errors[0].issues.join(' ')).toMatch(/Last Name is required/);

    const first = rows[0].normalized;
    expect(first.patientId).toBe('P001');
    expect(first.firstName).toBe('Sarah');
    expect(first.dateOfBirthISO).toBe('1985-03-15');
  });

  test('accepts flexible header names', async () => {
    const csv = [
      'patient_id,first_name,lastname,dob,provider,member_id',
      'P010,Lee,Wong,12/31/1990,Cigna,CIG-777'
    ].join('\n');

    const file = writeTmpCsv(csv);
    const { rows, errors } = await readPatientCsv(file);

    expect(errors.length).toBe(0);
    expect(rows.length).toBe(1);

    const n = rows[0].normalized;
    expect(n.dateOfBirthISO).toBe('1990-12-31');
    expect(n.insuranceProvider).toBe('Cigna');
  });

  test('rejects invalid DOBs', async () => {
    const csv = [
      'Patient ID,First Name,Last Name,Date of Birth,Insurance Provider,Member ID',
      'P020,Maya,Stone,1987-04-31,United,U-1'
    ].join('\n');

    const file = writeTmpCsv(csv);
    const { rows, errors } = await readPatientCsv(file);

    expect(rows.length).toBe(0);
    expect(errors.length).toBe(1);
    expect(errors[0].issues.join(' ')).toMatch(/Unrecognized DOB format/);
  });

  test('handles UTF-8 BOM and whitespace', async () => {
    const csv = [
      '\uFEFFPatient ID , First Name , Last Name , Date of Birth , Insurance Provider , Member ID ',
      '  P030 ,  Ana  ,  O\'Brien  ,  3/5/1985  ,  Aetna  ,  A-123  '
    ].join('\n');

    const file = writeTmpCsv(csv);
    const { rows, errors } = await readPatientCsv(file);

    expect(errors.length).toBe(0);
    const n = rows[0].normalized;
    expect(n.firstName).toBe('Ana');
    expect(n.lastName).toBe("O'Brien");
    expect(n.dateOfBirthISO).toBe('1985-03-05');
  });
});
