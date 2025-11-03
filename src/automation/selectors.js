// src/automation/selectors.js
export const selectors = {
  login: {
    username: { by: 'label', name: /user(name)?/i },
    password: { by: 'label', name: /pass(word)?/i },
    submit:   { by: 'role',  role: 'button', name: /log\s*in|sign\s*in/i },
    errorBanner: { by: 'role', role: 'alert' },
  },
  form: {
    firstName:  { by: 'label', name: /first\s*name/i },
    lastName:   { by: 'label', name: /last\s*name/i },
    dob:        { by: 'label', name: /(date\s*of\s*birth|dob)/i },
    provider:   { by: 'label', name: /provider|insurer|payer/i },
    memberId:   { by: 'label', name: /member\s*id|policy|subscriber/i },
    submit:     { by: 'role',  role: 'button', name: /verify|check|submit/i },
    // test id fallbacks
    firstNameTestId: "[data-testid='firstName-input']",
    lastNameTestId:  "[data-testid='lastName-input']",
    dobTestId:       "[data-testid='dob-input']",
    providerTestId:  "[data-testid='provider-input']",
    memberIdTestId:  "[data-testid='memberId-input']",
    submitTestId:    "[data-testid='check-button']",
  },
  result: {
    eligibility: { by: 'role', role: 'status', name: /eligibility/i },
    coverage:    { by: 'role', role: 'status', name: /coverage/i },
    eligibilityId: '#eligibilityStatus',
    coverageId:    '#coverageType',
    errorId:       '#errorMessage',
  },
};
