import { verifyOne } from './automation/verifyOne.js';
import dotenv from 'dotenv';

dotenv.config();

const patient = {
  patientId: process.env.DEMO_PATIENT_ID || 'P-DEMO',
  firstName: process.env.DEMO_PATIENT_FIRST_NAME,
  lastName: process.env.DEMO_PATIENT_LAST_NAME,
  dateOfBirthISO: process.env.DEMO_PATIENT_DOB,
  insuranceProvider: process.env.DEMO_PATIENT_INSURANCE,
  memberId: process.env.DEMO_PATIENT_MEMBER_ID,
};

// Validate required fields
const missing = [];
if (!patient.firstName) missing.push('DEMO_PATIENT_FIRST_NAME');
if (!patient.lastName) missing.push('DEMO_PATIENT_LAST_NAME');
if (!patient.dateOfBirthISO) missing.push('DEMO_PATIENT_DOB');
if (!patient.insuranceProvider) missing.push('DEMO_PATIENT_INSURANCE');
if (!patient.memberId) missing.push('DEMO_PATIENT_MEMBER_ID');

if (missing.length) {
  console.error(`Error: Missing required environment variables: ${missing.join(', ')}`);
  console.error('Please add these to your .env file.');
  process.exit(1);
}

const res = await verifyOne(patient);
console.log(res);
