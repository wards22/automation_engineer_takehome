# Setup Instructions for BlueSprig Team

This document explains how to set up and distribute this take-home assignment.

---

## Initial Repository Setup

### 1. Create GitHub Repository

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: Junior Automation Engineer take-home assignment"

# Create repository on GitHub
# Then push
git remote add origin https://github.com/bluesprig-pediatrics/automation_engineer_takehome.git
git branch -M main
git push -u origin main
```

### 2. Configure Repository Settings

On GitHub:

1. Go to **Settings** → **General**
   - Disable "Allow merge commits" (require clean history)
   - Enable "Automatically delete head branches"

2. Go to **Settings** → **Branches**
   - Add branch protection rule for `main`:
     - ✅ Require pull request before merging
     - ✅ Require approvals (1)

3. Go to **Settings** → **Pages**
   - Enable GitHub Pages
   - Source: Deploy from branch `main`
   - Folder: `/(root)`
   - Wait for deployment (check Actions tab)
   - Portal URL will be: `https://bluesprig-pediatrics.github.io/automation_engineer_takehome/mock-portal/`

### 3. Portal URL Already Updated

The README.md already contains the live portal URL:
`https://bluesprig-pediatrics.github.io/automation_engineer_takehome/mock-portal/`

No additional updates needed!

---

## Distribution Process

### For Each Candidate

1. **Send Initial Email** (use template below)
2. **Grant Repository Access**
   - Add candidate as collaborator with "Write" access
   - Or have them fork if you prefer
3. **Monitor for Questions**
   - Watch GitHub Issues for candidate questions
   - Respond within 24 hours

### Email Template

```
Subject: BlueSprig - Junior Automation Engineer Take-Home Assignment

Hi [Candidate Name],

Thank you for your interest in the Junior Automation Engineer position at BlueSprig!

As the next step, we'd like you to complete a short take-home assignment that reflects the type of work you'd be doing in this role.

ASSIGNMENT DETAILS:
- Repository: https://github.com/BluesprigHealthcare/automation_engineer_takehome
- Time limit: 48 hours from receiving this email
- Estimated effort: 4-8 hours of coding
- Due: [Specific date and time]

INSTRUCTIONS:

1. Review the README.md file in the repository for full requirements
2. Fork the repository (or we can add you as a collaborator - let us know your preference)
3. Complete the assignment following the guidelines
4. Submit your work via Pull Request to the main repository
5. If you have questions, open a GitHub Issue - we'll respond within 24 hours

WHAT WE'RE LOOKING FOR:
- Clean, working code
- Meaningful tests
- Clear documentation
- Good use of modern development tools (including AI assistants)
- Thoughtful design decisions

YOU MAY USE:
- AI coding tools (Claude Code, GitHub Copilot, Cursor, etc.)
- Documentation and online resources
- Any libraries or frameworks you prefer

Please confirm receipt of this email and let us know if you have any questions before starting.

We're excited to see your approach to this problem!

Best regards,
[Your Name]
BlueSprig Healthcare
```

---

## Evaluation Process

### 1. Review Submitted PRs

When a candidate submits their PR:

1. Assign to primary reviewer
2. Use `EVALUATION_RUBRIC.md` for consistent scoring
3. Complete evaluation within 2-3 business days

### 2. Provide Feedback

Even for candidates you don't advance, provide brief constructive feedback:

```markdown
Thank you for your submission! Here's our feedback:

**Strengths:**
- [2-3 specific strengths]

**Areas for Growth:**
- [1-2 specific areas]

[Decision: advancing to next round / not moving forward at this time]
```

### 3. Track Candidates

Create a tracking spreadsheet:

| Candidate | Sent Date | Due Date | Submitted | Score | Recommendation | Reviewer |
|-----------|-----------|----------|-----------|-------|----------------|----------|
| | | | | | | |

---

## Maintenance

### Updating the Assignment

If you need to update the assignment:

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Update version number in README
5. Merge via PR
6. Tag release: `git tag v1.1.0`

### Handling Candidate Questions

Common questions and suggested responses:

**Q: Can I use TypeScript instead of JavaScript?**
A: Yes, absolutely! We support candidates using modern tools.

**Q: Which automation framework should I use?**
A: Your choice - we've listed options in the README. Pick what you're most comfortable with or want to learn.

**Q: The portal URL isn't working**
A: [Check if GitHub Pages is deployed, provide fallback instructions for local testing]

**Q: Can I have more time?**
A: We prefer to keep the 48-hour window, but if you have extenuating circumstances, please let us know and we can discuss.

---

## Troubleshooting

### GitHub Pages Not Deploying

Check:
1. Actions tab for deployment status
2. Settings → Pages for configuration
3. Ensure `index.html` is in `/mock-portal` directory
4. Check for any build errors in Actions

### Candidate Can't Access Repository

1. Verify they're added as collaborator
2. Check if they accepted the invitation
3. Confirm repository is not private (or grant access if it is)

---

## Security Considerations

- **No Real Data**: Ensure all test data is fictional
- **Mock Credentials**: Use obvious test credentials only
- **Review Submissions**: Check that candidates don't commit real credentials
- **Access Control**: Remove candidate access after evaluation

---

## Questions?

Contact: michelle.pellon@bluesprigpediatrics.com
