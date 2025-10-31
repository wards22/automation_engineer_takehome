# Junior Automation Engineer - Take-Home Assignment

Welcome! This assignment evaluates your ability to build browser automation tools for healthcare workflows.

**Time Expectation**: 4-8 hours of coding (48-hour deadline from receipt)

---

## Scenario

BlueSprig clinics need to verify patient insurance eligibility daily. Currently, staff manually visit insurance provider websites, enter patient information, and record the results in a spreadsheet.

Your task is to build an automation script that streamlines this workflow.

---

## Requirements

### Core Functionality

Build a Node.js script that:

1. **Reads patient data** from a CSV file containing:
   - Patient ID
   - First Name
   - Last Name
   - Date of Birth
   - Insurance Provider
   - Member ID

2. **Automates browser interactions** to verify eligibility:
   - Navigate to a mock insurance portal (we'll provide a test site URL)
   - Fill in patient information
   - Extract eligibility status and coverage details
   - Handle common error cases (network issues, invalid credentials, etc.)

3. **Outputs results** to a new CSV file with:
   - All original patient data
   - Eligibility status (Active/Inactive/Unknown)
   - Coverage type
   - Timestamp of verification
   - Any error messages

### Technical Requirements

- **Language**: JavaScript/Node.js
- **Automation Framework**: Choose one:
  - Stagehand (preferred)
  - Puppeteer
  - Playwright
- **Package Manager**: npm or yarn
- **Version Control**: Git with clear commit history

### Quality Standards

✅ **Tests**: Include both unit and integration tests
- Test CSV parsing logic
- Test error handling scenarios
- At least one end-to-end test of the automation flow

✅ **Documentation**:
- Clear README with setup and usage instructions
- Code comments explaining non-obvious logic
- Inline JSDoc comments for functions

✅ **Code Quality**:
- Clean, readable code following JavaScript best practices
- Proper error handling and logging
- Configuration separated from code (e.g., `.env` for credentials)

---

## Deliverables

Submit your work via **Pull Request** to this repository:

1. **Source code** in `/src` directory
2. **Tests** in `/tests` or `/__tests__` directory
3. **Documentation**:
   - Updated README with:
     - Setup instructions
     - How to run the script
     - How to run tests
     - Design decisions and tradeoffs
   - Any additional documentation you find necessary

4. **Sample output**: Include an example output CSV (with fake data)

5. **Pull Request Description** should include:
   - Summary of your approach
   - Key design decisions
   - Known limitations or future improvements
   - Time spent (approximate)

---

## Getting Started

### 1. Fork and Clone

```bash
# Fork this repository on GitHub, then clone your fork:
git clone https://github.com/YOUR-USERNAME/automation_engineer_takehome.git
cd automation_engineer_takehome
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Review Test Data

See `data/patients_sample.csv` for input format.

**Important**: The sample data includes edge cases designed to test robustness:
- Special characters in names (O'Brien, García-López)
- Missing fields
- Invalid date formats
- Whitespace handling
- Invalid member IDs

See `EDGE_CASES.md` for complete documentation of all test scenarios.

### 4. Mock Insurance Portal

Use this test site for browser automation: `https://bluesprig-pediatrics.github.io/automation_engineer_takehome/mock-portal/`

**Test Credentials**:
- Username: `test_user`
- Password: `test_pass123`

### 5. Start Coding!

Create your solution in the `/src` directory. We recommend:
- Starting with CSV parsing and validation
- Then building the browser automation flow
- Adding error handling and logging
- Writing tests throughout
- Documenting as you go

---

## Evaluation Criteria

We'll review your submission based on:

| Criteria | Weight | What We're Looking For |
|----------|--------|------------------------|
| **Functionality** | 30% | Does it work? Does it handle edge cases? |
| **Code Quality** | 25% | Is it clean, readable, and maintainable? |
| **Testing** | 20% | Are tests comprehensive and meaningful? |
| **Documentation** | 15% | Can someone else understand and run it? |
| **Product Thinking** | 10% | Does it consider user experience and real-world usage? |

---

## Guidelines

### ✅ You May

- Use AI coding tools (Claude Code, GitHub Copilot, Cursor, etc.)
- Reference documentation and Stack Overflow
- Ask clarifying questions via GitHub Issues
- Take longer than 48 hours if needed (but let us know)

### ❌ Please Don't

- Copy existing automation scripts wholesale
- Submit work that isn't your own
- Overcomplicate the solution

---

## Questions?

Open a GitHub Issue in this repository and we'll respond within 24 hours.

---

## Tips for Success

1. **Start simple**: Get a basic version working first, then enhance
2. **Commit frequently**: Show your development process
3. **Think about the user**: How would a clinic staff member use this?
4. **Document decisions**: Explain *why* you made specific choices
5. **Test edge cases**: What happens when the website is slow? When data is malformed?
6. **Use AI tools effectively**: Show us how you leverage modern development tools

---

Good luck! We're excited to see your approach to this problem.

**Questions or issues?** Contact: michelle.pellon@bluesprigpediatrics.com
