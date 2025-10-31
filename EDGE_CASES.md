# Edge Cases & Test Scenarios

This document describes the edge cases included in the test data to help candidates build robust automation scripts.

---

## Overview

The sample CSV (`data/patients_sample.csv`) contains 20 patient records, including 8 "happy path" cases and 12 edge cases designed to test error handling, data validation, and robustness.

A well-designed solution should handle all these cases gracefully without crashing.

---

## Happy Path Cases (P001-P008)

These are standard, well-formed records that should process successfully:

| Patient ID | Description | Expected Result |
|------------|-------------|-----------------|
| P001 | Standard active coverage | Success - Active PPO |
| P002 | Standard active coverage | Success - Active HMO |
| P003 | Active pediatric coverage | Success - Active EPO |
| P004 | Inactive/expired coverage | Success - Inactive status |
| P005 | Active pediatric services | Success - Active HMO |
| P006 | Active autism services | Success - Active PPO |
| P007 | Active behavioral health | Success - Active HMO |
| P008 | Medicaid coverage | Success - Active Medicaid |

---

## Edge Cases (P009-P020)

### 1. Special Characters in Names

#### P009: Apostrophe in Last Name
```csv
P009,Jennifer,O'Brien,1990-02-14,BlueCross BlueShield,BCBS999888777
```
**Challenge**: Names with apostrophes (O'Brien, D'Angelo, etc.) are common
**Expected Behavior**: Should handle gracefully without escaping issues
**Portal Response**: Active coverage

---

#### P010: International Characters & Hyphens
```csv
P010,José,García-López,2013-12-25,Aetna,AET111222333
```
**Challenge**: Unicode characters (é, í) and hyphenated surnames
**Expected Behavior**: Preserve special characters correctly
**Portal Response**: Active coverage

---

#### P011: Hyphenated Names
```csv
P011,Mary-Anne,Smith-Jones,1988-09-01,UnitedHealthcare,INVALID123
```
**Challenge**: Hyphenated first and last names
**Expected Behavior**: Handle correctly BUT...
**Portal Response**: ❌ Member ID not found
**Testing**: Should capture error and continue processing

---

### 2. Data Length & Formatting

#### P012: Unusually Long Last Name
```csv
P012,Christopher,VeryLongLastNameThatExceedsTypicalLength,2005-03-30,Cigna,CIG555666777
```
**Challenge**: Last name exceeds typical field lengths (45+ characters)
**Expected Behavior**: Should not truncate data
**Portal Response**: Active coverage

---

### 3. Missing Required Fields

#### P013: Missing First Name
```csv
P013,,Wilson,1995-07-15,Humana,HUM444555666
```
**Challenge**: Empty first name field
**Expected Behavior**:
- Option 1: Skip record with warning
- Option 2: Attempt lookup anyway (portal may accept)
- Option 3: Fill with placeholder like "N/A"

**Portal Response**: Active coverage (portal accepts empty first name)

---

#### P014: Missing Last Name and DOB
```csv
P014,Patricia,,,Anthem,ANT888999000
```
**Challenge**: Multiple missing required fields
**Expected Behavior**: Should validate before submission
**Portal Response**: Active coverage (portal is lenient)

**Note**: Real-world portals vary in validation strictness. Your solution should decide:
- Validate strictly and reject incomplete records?
- Or attempt submission and capture portal's response?

---

### 4. Invalid Date Formats

#### P015: Future Date of Birth
```csv
P015,Richard,Davis,2025-01-01,Kaiser Permanente,KP777888999
```
**Challenge**: DOB in the future (impossible)
**Expected Behavior**:
- Validation error before submission, OR
- Submit and capture "Pending" status

**Portal Response**: Pending status (not yet effective coverage)

---

#### P016: Very Old Date (1899)
```csv
P016,Linda,Taylor,1899-12-31,Molina Healthcare,MOL666777888
```
**Challenge**: Unrealistic DOB (125+ years old)
**Expected Behavior**: Should still process (could be data error or centenarian)
**Portal Response**: Active Medicare Advantage coverage

---

#### P018: Alternative Date Format (MM/DD/YYYY)
```csv
P018,Amanda,Johnson,06/15/1985,Aetna,AET333444555
```
**Challenge**: Date format mismatch (MM/DD/YYYY vs YYYY-MM-DD)
**Expected Behavior**:
- Parse and convert to correct format, OR
- Validation error with clear message

**Portal Response**: Active coverage (if properly formatted on submission)

---

#### P019: Invalid Date - Month 13
```csv
P019,Thomas,Brown,1992-13-45,UnitedHealthcare,UHC222333444
```
**Challenge**: Month value of 13 (invalid)
**Expected Behavior**: Validation error - cannot parse date
**Portal Response**: Active coverage exists for this member ID, but date needs correction

---

#### P020: Invalid Date - April 31st
```csv
P020,Barbara,Miller,1987-04-31,Cigna,CIG888777666
```
**Challenge**: April only has 30 days
**Expected Behavior**: Validation error or automatic correction
**Portal Response**: Active coverage exists for this member ID

---

### 5. Whitespace Handling

#### P017: Extra Whitespace in All Fields
```csv
P017,   John   ,   Doe   ,2000-06-15,BlueCross BlueShield,  BCBS111222
```
**Challenge**: Leading and trailing spaces in names and member ID
**Expected Behavior**: Trim whitespace before submission
**Portal Response**: Active coverage (portal trims member ID automatically)

---

## Test Coverage Recommendations

### Must Handle
✅ **Special characters in names** (apostrophes, accents, hyphens)
✅ **Whitespace trimming** (leading/trailing spaces)
✅ **Long text fields** (names, IDs)
✅ **Invalid member IDs** (graceful error handling)

### Should Handle
⚠️ **Missing required fields** (decide on strategy: validate or allow portal to reject)
⚠️ **Date format variations** (normalize to YYYY-MM-DD)
⚠️ **Invalid dates** (validation before submission)

### Nice to Have
💡 **Data normalization** (standardize formats)
💡 **Detailed error reporting** (which validation failed)
💡 **Configurable validation** (strict vs lenient mode)

---

## Expected Output Behavior

### Successful Cases
For valid records (P001-P010, P012-P017, and corrected dates):
- Status: Active/Inactive/Pending
- Coverage details populated
- Timestamp recorded
- Error field: empty

### Error Cases
For invalid records (P011, and potentially P013-P020 depending on validation):
- Status: Unknown or Error
- Coverage details: empty or N/A
- Timestamp: recorded
- Error field: Descriptive message (e.g., "Member ID not found", "Invalid date format")

---

## Evaluation Criteria

Reviewers will assess:

1. **Does the script process all 20 records without crashing?**
2. **Are errors handled gracefully with clear messages?**
3. **Is data validated before submission to the portal?**
4. **Are special characters and formatting preserved correctly?**
5. **Does the output CSV accurately reflect results and errors?**

---

## Tips for Candidates

### Data Validation Strategy

Consider implementing validation at multiple levels:

```javascript
// Example validation approach
function validatePatientRecord(record) {
    const errors = [];

    // Required field validation
    if (!record.member_id || record.member_id.trim() === '') {
        errors.push('Missing member ID');
    }

    // Date format validation
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (record.date_of_birth && !datePattern.test(record.date_of_birth)) {
        errors.push('Invalid date format (expected YYYY-MM-DD)');
    }

    // Date logic validation
    const dob = new Date(record.date_of_birth);
    if (dob > new Date()) {
        errors.push('Date of birth cannot be in the future');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
```

### Error Handling Best Practices

1. **Don't let one bad record crash the entire batch**
   - Use try-catch for each record
   - Log errors and continue processing

2. **Provide actionable error messages**
   - Bad: "Error processing record"
   - Good: "P011: Member ID INVALID123 not found in system"

3. **Categorize errors**
   - Validation errors (caught before portal submission)
   - Portal errors (member not found, system error)
   - Network errors (timeout, connection failed)

4. **Make validation configurable**
   - Strict mode: Reject invalid records
   - Lenient mode: Attempt submission and capture portal response

---

## Testing Your Solution

### Quick Validation Test

Run your script and verify:

```bash
npm start

# Expected output:
# ✅ Processed: 20 records
# ✅ Successful: 16-19 (depending on validation strategy)
# ⚠️  Errors: 1-4
# ❌ Crashed: 0
```

### Check Output CSV

Your output should include all 20 records with:
- Original patient data
- Eligibility status (or "Unknown"/"Error")
- Coverage details (or empty/N/A for errors)
- Clear error messages for failed lookups
- Timestamp for each verification attempt

---

## Questions?

If you're unsure how to handle a specific edge case, document your approach and reasoning in your PR description. There's often no single "correct" answer - we're evaluating your decision-making process.
