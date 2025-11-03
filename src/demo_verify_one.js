import { verifyOne } from './automation/verifyOne.js';

const patient = {
  patientId: 'P-DEMO',
  firstName: 'Sarah',
  lastName: 'Johnson',
  dateOfBirthISO: '1985-03-15',
  insuranceProvider: 'BlueCross BlueShield',
  memberId: 'BCBS123456789',
};

const res = await verifyOne(patient);
console.log(res);
