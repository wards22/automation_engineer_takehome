import { DateTime } from 'luxon';

// Accept common DOB formats, normalize to ISO (YYYY-MM-DD)
const DOB_FORMATS = [
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'M/d/yyyy',
  'M/d/yy',
  'MM/dd/yy',
  'yyyy/MM/dd',
];

export function normalizeDob(dobRaw) {
  const val = String(dobRaw ?? '').trim();
  if (!val) return { ok: false, error: 'DOB missing' };

  for (const fmt of DOB_FORMATS) {
    const dt = DateTime.fromFormat(val, fmt);
    if (dt.isValid) {
      return { ok: true, value: dt.toISODate() }; // YYYY-MM-DD
    }
  }

  // Try ISO or RFC-ish direct parse as a fallback
  const dt2 = DateTime.fromISO(val);
  if (dt2.isValid) return { ok: true, value: dt2.toISODate() };

  return { ok: false, error: `Unrecognized DOB format: "${val}"` };
}

export function requireNonEmpty(fieldName, v) {
  const value = String(v ?? '').trim();
  if (!value) return { ok: false, error: `${fieldName} is required` };
  return { ok: true, value };
}

export function validateMemberId(v) {
  // Keep this liberal; different payers vary. Just ensure it's non-empty and alnum-ish with common separators.
  const val = String(v ?? '').trim();
  if (!val) return { ok: false, error: 'Member ID is required' };
  if (!/^[A-Za-z0-9\-_.]+$/.test(val)) {
    return { ok: false, error: 'Member ID contains invalid characters' };
  }
  return { ok: true, value: val };
}
