import { PortalClient } from './portalClient.js';

export async function verifyOne(patient) {
  const client = await PortalClient.create();
  try {
    const out = await client.verifyEligibility(patient);
    return out;
  } finally {
    await client.close();
  }
}
