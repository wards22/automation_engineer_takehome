export function getTestPatient(number = 1) {
  const prefix = number === 1 ? 'TEST_PATIENT' : `TEST_PATIENT${number}`;
  
  return {
    patientId: `P00${number}`,
    firstName: process.env[`${prefix}_FIRST_NAME`],
    lastName: process.env[`${prefix}_LAST_NAME`],
    dateOfBirthISO: process.env[`${prefix}_DOB`],
    insuranceProvider: process.env[`${prefix}_INSURANCE`],
    memberId: process.env[`${prefix}_MEMBER_ID`],
  };
}

export function getE2EPatient(number = 1) {
  const prefix = `E2E_PATIENT${number}`;
  
  return {
    patientId: process.env[`${prefix}_ID`],
    firstName: process.env[`${prefix}_FIRST_NAME`],
    lastName: process.env[`${prefix}_LAST_NAME`],
    dateOfBirth: process.env[`${prefix}_DOB`],
    insuranceProvider: process.env[`${prefix}_INSURANCE`],
    memberId: process.env[`${prefix}_MEMBER_ID`],
  };
}

export function ensureTestPatientEnv(number = 1) {
  const prefix = number === 1 ? 'TEST_PATIENT' : `TEST_PATIENT${number}`;
  const missing = [];
  
  if (!process.env[`${prefix}_FIRST_NAME`]) missing.push(`${prefix}_FIRST_NAME`);
  if (!process.env[`${prefix}_LAST_NAME`]) missing.push(`${prefix}_LAST_NAME`);
  if (!process.env[`${prefix}_DOB`]) missing.push(`${prefix}_DOB`);
  if (!process.env[`${prefix}_INSURANCE`]) missing.push(`${prefix}_INSURANCE`);
  if (!process.env[`${prefix}_MEMBER_ID`]) missing.push(`${prefix}_MEMBER_ID`);
  
  if (missing.length) {
    throw new Error(`Missing test patient env vars: ${missing.join(', ')}`);
  }
}

export function ensureE2EPatientEnv(number = 1) {
  const prefix = `E2E_PATIENT${number}`;
  const missing = [];
  
  if (!process.env[`${prefix}_ID`]) missing.push(`${prefix}_ID`);
  if (!process.env[`${prefix}_FIRST_NAME`]) missing.push(`${prefix}_FIRST_NAME`);
  if (!process.env[`${prefix}_LAST_NAME`]) missing.push(`${prefix}_LAST_NAME`);
  if (!process.env[`${prefix}_DOB`]) missing.push(`${prefix}_DOB`);
  if (!process.env[`${prefix}_INSURANCE`]) missing.push(`${prefix}_INSURANCE`);
  if (!process.env[`${prefix}_MEMBER_ID`]) missing.push(`${prefix}_MEMBER_ID`);
  
  if (missing.length) {
    throw new Error(`Missing E2E patient env vars: ${missing.join(', ')}`);
  }
}
