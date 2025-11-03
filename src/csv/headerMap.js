// Maps flexible CSV headers to canonical field keys we use internally.
export const HEADER_ALIASES = {
  patientId: ['patient id', 'patient_id', 'id', 'pid'],
  firstName: ['first name', 'first_name', 'firstname', 'given name', 'given_name'],
  lastName: ['last name', 'last_name', 'lastname', 'family name', 'family_name', 'surname'],
  dateOfBirth: ['date of birth', 'dob', 'birthdate', 'birth date'],
  insuranceProvider: ['insurance provider', 'provider', 'insurer', 'payer'],
  memberId: ['member id', 'member_id', 'policy id', 'policy_id', 'subscriber id', 'subscriber_id'],
};

export function canonicalizeHeader(raw) {
  if (!raw) return null;
  const cleaned = String(raw).trim().toLowerCase().replace(/\s+|_+/g, ' ');
  for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(cleaned)) return canonical;
  }
  // If we see an already-canonical-ish header, allow it
  if (Object.keys(HEADER_ALIASES).includes(cleaned)) return cleaned;
  return null;
}
