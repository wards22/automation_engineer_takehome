// Prefer role/label locators for resilience (Playwright auto-maps accessible names)
export const selectors = {
  login: {
    username: { by: 'label', name: /user(name)?/i },
    password: { by: 'label', name: /pass(word)?/i },
    submit:   { by: 'role',  role: 'button', name: /log\s*in|sign\s*in/i },
    // optional portal-level error banner
    errorBanner: { by: 'role', role: 'alert' },
  },
  form: {
    firstName:  { by: 'label', name: /first\s*name/i },
    lastName:   { by: 'label', name: /last\s*name/i },
    dob:        { by: 'label', name: /(date\s*of\s*birth|dob)/i },
    provider:   { by: 'label', name: /provider|insurer|payer/i },
    memberId:   { by: 'label', name: /member\s*id|policy|subscriber/i },
    submit:     { by: 'role',  role: 'button', name: /verify|check|submit/i },
  },
  result: {
    eligibility: { by: 'role', role: 'status', name: /eligibility/i }, // try ARIA first
    coverage:    { by: 'role', role: 'status', name: /coverage/i },
    // fallbacks by text ids if needed
    eligibilityId: '#eligibilityStatus',
    coverageId:    '#coverageType',
    errorId:       '#errorMessage',
  },
};
