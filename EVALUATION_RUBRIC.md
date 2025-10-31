# Junior Automation Engineer - Evaluation Rubric

Use this rubric to evaluate candidate submissions consistently and fairly.

---

## Scoring System

- **5 - Exceptional**: Exceeds expectations, demonstrates mastery
- **4 - Strong**: Meets all expectations with high quality
- **3 - Satisfactory**: Meets core expectations adequately
- **2 - Needs Improvement**: Partially meets expectations, significant gaps
- **1 - Unsatisfactory**: Does not meet basic expectations

---

## 1. Functionality (30 points)

### Core Features (15 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **CSV Input Parsing** | 5 | - Does it correctly read and parse the sample CSV?<br>- Handles all fields properly?<br>- Validates data format? |
| **Browser Automation** | 5 | - Successfully logs into the portal?<br>- Fills forms accurately?<br>- Navigates the multi-step flow?<br>- Extracts results correctly? |
| **CSV Output Generation** | 5 | - Generates correct output format?<br>- Includes all required fields?<br>- Data accuracy maintained?<br>- Timestamps included? |

### Error Handling & Edge Cases (15 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Network/Timeout Handling** | 5 | - Gracefully handles slow responses?<br>- Retry logic implemented?<br>- Appropriate timeouts set? |
| **Data Validation** | 5 | - Validates input before processing?<br>- Handles malformed CSV data?<br>- Clear error messages? |
| **Login Failures** | 5 | - Handles invalid credentials?<br>- Session management?<br>- Appropriate error reporting? |

**Deductions**:
- Script crashes on valid input: -10 points
- Cannot process sample CSV: -15 points
- No error handling whatsoever: -10 points

---

## 2. Code Quality (25 points)

### Structure & Organization (10 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Code Organization** | 5 | - Logical file/folder structure?<br>- Separation of concerns?<br>- Modular design? |
| **Naming & Conventions** | 5 | - Clear variable/function names?<br>- Consistent naming style?<br>- Follows JS best practices? |

### Readability & Maintainability (10 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Code Clarity** | 5 | - Easy to understand logic?<br>- Appropriate comments?<br>- Avoids overly complex solutions? |
| **DRY Principle** | 5 | - Code reuse implemented?<br>- No unnecessary duplication?<br>- Helper functions extracted? |

### Security & Best Practices (5 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Security** | 3 | - Credentials in .env (not hardcoded)?<br>- No sensitive data in git?<br>- Input sanitization? |
| **Dependencies** | 2 | - Appropriate package choices?<br>- No unnecessary dependencies?<br>- Package.json properly configured? |

**Bonus Points** (up to +5):
- Implements logging framework: +2
- Uses TypeScript: +3
- Configuration management: +2
- Implements retry with exponential backoff: +2

---

## 3. Testing (20 points)

### Test Coverage (12 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Unit Tests** | 4 | - Tests for CSV parsing?<br>- Tests for data validation?<br>- Tests for helper functions? |
| **Integration Tests** | 4 | - Tests multi-step workflows?<br>- Tests error scenarios?<br>- Mocks browser interactions appropriately? |
| **E2E Tests** | 4 | - At least one full automation test?<br>- Tests login flow?<br>- Tests complete eligibility check? |

### Test Quality (8 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Test Design** | 4 | - Tests are meaningful?<br>- Good edge case coverage?<br>- Test isolation? |
| **Test Execution** | 4 | - All tests pass?<br>- Tests run reliably?<br>- Clear test descriptions? |

**Deductions**:
- No tests at all: -20 points
- Tests don't run: -10 points
- Tests fail: -5 points per failing test (max -10)

---

## 4. Documentation (15 points)

### README Quality (10 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Setup Instructions** | 3 | - Clear installation steps?<br>- Environment setup documented?<br>- Prerequisites listed? |
| **Usage Instructions** | 3 | - How to run the script?<br>- How to run tests?<br>- Example commands provided? |
| **Design Decisions** | 4 | - Explains approach taken?<br>- Documents tradeoffs?<br>- Discusses limitations?<br>- Future improvements noted? |

### Code Documentation (5 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Inline Comments** | 2 | - Complex logic explained?<br>- Comments are helpful (not obvious)?<br>- No outdated comments? |
| **JSDoc/Function Docs** | 3 | - Functions documented?<br>- Parameters described?<br>- Return values documented? |

**Bonus Points** (up to +3):
- Architecture diagram included: +2
- Workflow visualization: +2
- Video demo: +3

---

## 5. Product Thinking & UX (10 points)

### User-Centric Design (6 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Usability** | 3 | - Easy to set up and use?<br>- Clear output format?<br>- Good error messages for users? |
| **Workflow Design** | 3 | - Considers real-world use cases?<br>- Handles batch processing efficiently?<br>- Progress indicators? |

### Thoughtfulness (4 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Problem Understanding** | 2 | - Demonstrates understanding of healthcare RPA context?<br>- Considers clinic staff perspective? |
| **Innovation** | 2 | - Any creative solutions?<br>- Goes beyond basic requirements?<br>- Suggests valuable enhancements? |

---

## 6. Git & PR Quality (Bonus: up to 10 points)

### Commit History (5 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **Commit Quality** | 3 | - Clear commit messages?<br>- Logical commits (not one giant commit)?<br>- Shows development progression? |
| **Branch Management** | 2 | - Appropriate branch name?<br>- Clean history?<br>- No unnecessary files committed? |

### Pull Request (5 points)

| Criteria | Points | Evaluation Questions |
|----------|--------|---------------------|
| **PR Description** | 3 | - Clear summary of changes?<br>- Explains approach?<br>- Lists limitations? |
| **Professionalism** | 2 | - Well-formatted?<br>- Includes time spent?<br>- Appropriate tone? |

---

## Total Scoring

| Category | Max Points | Candidate Score | Notes |
|----------|------------|-----------------|-------|
| Functionality | 30 | | |
| Code Quality | 25 | | |
| Testing | 20 | | |
| Documentation | 15 | | |
| Product Thinking | 10 | | |
| **Base Total** | **100** | | |
| Bonus Points | +18 max | | |
| **Final Score** | | | |

---

## Evaluation Tiers

- **90-100+**: **Exceptional** - Strong hire, exceeds junior level expectations
- **75-89**: **Strong** - Solid hire, meets all core competencies
- **60-74**: **Satisfactory** - Acceptable, some growth areas
- **45-59**: **Marginal** - Significant concerns, consider for interview discussion
- **Below 45**: **Not Recommended** - Does not meet minimum requirements

---

## Red Flags (Automatic Rejection Criteria)

Regardless of score, reject if:

- [ ] Code is plagiarized or obviously copied wholesale
- [ ] Cannot run the submission after reasonable troubleshooting
- [ ] No tests whatsoever (shows disregard for requirements)
- [ ] Hardcoded credentials committed to git
- [ ] No documentation/README
- [ ] Submitted significantly late without communication

---

## Green Flags (Strong Positive Indicators)

Look for these positive signals:

- [ ] Clean, idiomatic JavaScript
- [ ] Thoughtful error handling with user-friendly messages
- [ ] Evidence of testing throughout development
- [ ] Clear documentation that shows understanding
- [ ] Good use of modern async/await patterns
- [ ] Demonstrates AI tool usage effectively
- [ ] Shows product thinking beyond just coding
- [ ] Professional git commits and PR
- [ ] Asks clarifying questions via GitHub Issues

---

## Evaluation Process

1. **Initial Review (5 minutes)**
   - Can you run it?
   - Are tests present and passing?
   - Is there a README?

2. **Functionality Check (10 minutes)**
   - Run the script with sample data
   - Test error scenarios
   - Review output quality

3. **Code Review (15 minutes)**
   - Read through main code files
   - Assess structure and quality
   - Check for best practices

4. **Testing Review (10 minutes)**
   - Run test suite
   - Review test coverage and quality
   - Check test design

5. **Documentation Review (5 minutes)**
   - Read README and design decisions
   - Review inline documentation
   - Assess clarity

6. **Overall Assessment (5 minutes)**
   - Complete rubric
   - Calculate final score
   - Write summary feedback

**Total Time**: ~50 minutes per candidate

---

## Feedback Template

```markdown
## Evaluation Summary

**Final Score**: [X]/100 + [Y] bonus = [Total]
**Recommendation**: [Exceptional/Strong/Satisfactory/Marginal/Not Recommended]

### Strengths
- [List 3-5 key strengths]

### Areas for Improvement
- [List 2-4 areas for growth]

### Detailed Scores
- Functionality: [X]/30
- Code Quality: [X]/25
- Testing: [X]/20
- Documentation: [X]/15
- Product Thinking: [X]/10
- Bonus: [+X]

### Next Steps
[Recommended next steps: advance to interview, reject, etc.]

### Additional Notes
[Any other observations]
```

---

## Calibration Notes

**For First-Time Evaluators**: Review 2-3 sample submissions together with an experienced evaluator to calibrate scoring.

**Consistency Tips**:
- Don't compare candidates directly; evaluate each against the rubric
- Junior role expectations: focus on fundamentals, not perfection
- Value learning mindset and growth potential
- Remember: this is a 48-hour take-home, not production code
