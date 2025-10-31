# Mock Insurance Eligibility Portal

This is a mock insurance portal designed for testing browser automation scripts.

## Hosting on GitHub Pages

1. Push the `mock-portal` directory to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to deploy from the main branch, `/mock-portal` folder
4. Access at: `https://[username].github.io/[repo-name]/`

## Test Credentials

- **Username**: `test_user`
- **Password**: `test_pass123`

## Test Data

The portal recognizes the following Member IDs with corresponding eligibility data:

### Standard Test Cases

| Member ID | Status | Coverage Type |
|-----------|--------|---------------|
| BCBS123456789 | Active | PPO - Behavioral Health |
| AET987654321 | Active | HMO - Mental Health Services |
| UHC456789123 | Active | EPO - ABA Therapy |
| CIG789123456 | Inactive | PPO - Behavioral Health |
| HUM321654987 | Active | HMO - Pediatric Services |
| ANT147258369 | Active | PPO - Autism Services |
| KP963852741 | Active | HMO - Behavioral Health |
| MOL258369147 | Active | Medicaid - Full Coverage |

### Edge Case Member IDs

| Member ID | Status | Notes |
|-----------|--------|-------|
| BCBS999888777 | Active | Special characters in name (O'Brien) |
| AET111222333 | Active | International characters (José García-López) |
| INVALID123 | Not Found | ❌ Returns error |
| CIG555666777 | Active | Very long last name |
| HUM444555666 | Active | Missing first name in CSV |
| ANT888999000 | Active | Missing DOB in CSV |
| KP777888999 | Pending | Future DOB / Not yet effective |
| MOL666777888 | Active | Very old DOB (1899) |
| BCBS111222 | Active | Whitespace handling (member ID trimmed) |
| AET333444555 | Active | Alternative date format |
| UHC222333444 | Active | Invalid date (month 13) in CSV |
| CIG888777666 | Active | Invalid date (April 31) in CSV |

**Note**: The portal automatically trims whitespace from Member IDs.

Any Member ID not listed above will return a "not found" error.

For complete edge case documentation, see `../EDGE_CASES.md`.

## Features for Automation Testing

- **Login Form**: Validates credentials with simulated delay
- **Session Management**: Tracks login state
- **Eligibility Lookup**: Returns realistic insurance data
- **Error Handling**: Returns errors for invalid credentials or unknown Member IDs
- **Network Delays**: Simulates realistic API response times (800-1200ms)
- **Data Attributes**: All interactive elements have `data-testid` attributes for easy automation

## Usage with Automation Tools

### Example with Puppeteer

```javascript
await page.goto('https://your-username.github.io/automation_engineer_takehome/');
await page.type('[data-testid="username-input"]', 'test_user');
await page.type('[data-testid="password-input"]', 'test_pass123');
await page.click('[data-testid="login-button"]');
await page.waitForSelector('[data-testid="firstName-input"]');
```

### Example with Playwright

```javascript
await page.goto('https://your-username.github.io/automation_engineer_takehome/');
await page.getByTestId('username-input').fill('test_user');
await page.getByTestId('password-input').fill('test_pass123');
await page.getByTestId('login-button').click();
await page.getByTestId('firstName-input').waitFor();
```

## Local Testing

Open `index.html` in a web browser directly, or serve with a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# Then visit http://localhost:8000
```
