import { chromium } from 'playwright';
import dotenv from 'dotenv';
import { selectors as S } from './selectors.js';
import { AuthError, NetworkError, FormError } from './errors.js';

dotenv.config();

const BASE_URL = process.env.PORTAL_BASE_URL?.trim();
const USERNAME = process.env.PORTAL_USERNAME ?? '';
const PASSWORD = process.env.PORTAL_PASSWORD ?? '';
const HEADLESS = String(process.env.HEADLESS ?? 'true') === 'true';
const ACTION_TIMEOUT = Number(process.env.PW_ACTION_TIMEOUT ?? 10000);

function sel(page, desc) {
  switch (desc.by) {
    case 'label': return page.getByLabel(desc.name, { exact: false });
    case 'role': return page.getByRole(desc.role, { name: desc.name, exact: false });
    default: throw new Error('Unknown selector type');
  }
}

function assertEnv() {
  const missing = [];
  if (!BASE_URL) missing.push('PORTAL_BASE_URL');
  if (!USERNAME) missing.push('PORTAL_USERNAME');
  if (!PASSWORD) missing.push('PORTAL_PASSWORD');
  if (missing.length) throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}

async function ensureValidUrl(url) {
  try { return new URL(url).toString(); }
  catch { throw new Error(`Invalid PORTAL_BASE_URL: ${url}`); }
}

export class PortalClient {
  #browser; #page; #loggedIn = false;

  static async create() {
    assertEnv();
    const browser = await chromium.launch({ headless: HEADLESS });
    const page = await browser.newPage();
    page.setDefaultTimeout(ACTION_TIMEOUT);
    const client = new PortalClient(browser, page);
    await client.#gotoHome();
    return client;
  }

  constructor(browser, page) {
    this.#browser = browser;
    this.#page = page;
  }

  async #gotoHome() {
    const url = await ensureValidUrl(BASE_URL);
    try {
      await this.#page.goto(url, { waitUntil: 'domcontentloaded' });
    } catch (err) {
      throw new NetworkError('Failed to reach portal', { cause: err, url });
    }
  }

  async login(username = USERNAME, password = PASSWORD) {
    try {
      // 1) If the patient form is already on the page, skip login entirely.
      const formCandidates = [
        this.#page.locator(S.form.firstNameTestId).first(),
        this.#page.locator(S.form.submitTestId).first(),
        sel(this.#page, S.form.firstName),
        sel(this.#page, S.form.submit),
      ];

      // Wait up to ACTION_TIMEOUT for any of those to be visible.
      await Promise.race(
        formCandidates.map(loc => loc.waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }))
      ).then(() => {
        this.#loggedIn = true;
      }).catch(() => { /* no form in view yet, try login fields below */ });

      if (this.#loggedIn) return;

      // 2) If we got here, try to find username/password inputs. If they don't exist, that's fine (no login needed).
      const userLoc = sel(this.#page, S.login.username);
      const passLoc = sel(this.#page, S.login.password);
      const submitLoc = sel(this.#page, S.login.submit);

      const [userCount, passCount] = await Promise.all([
        userLoc.count().catch(() => 0),
        passLoc.count().catch(() => 0),
      ]);

      // No login fields? Then just wait briefly for the form and move on.
      if (userCount === 0 || passCount === 0) {
        await Promise.race(
          formCandidates.map(loc => loc.waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }))
        );
        this.#loggedIn = true;
        return;
      }

      // 3) Perform login.
      await userLoc.fill(username);
      await passLoc.fill(password);
      await submitLoc.click();

      // 4) After submit, wait for the form to appear (no chaining/or locators).
      await Promise.race(
        formCandidates.map(loc => loc.waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }))
      );

      this.#loggedIn = true;
    } catch (err) {
      // Optional: check for explicit auth banner
      // const banner = sel(this.#page, S.login.errorBanner);
      // if (await banner.isVisible().catch(() => false)) throw new AuthError('Portal shows authentication error');

      throw new NetworkError('Login failed', { cause: err });
    }
  }

  async #resetToForm() {
    // Primary: click the "Check Another Patients Info" button
    const checkAnother = this.#page.locator('#check-another');

    try {
      if (await checkAnother.isVisible({ timeout: 500 }).catch(() => false)) {
        await checkAnother.click();
      } else {
        // Fallback: try by accessible name
        const byText = this.#page.getByRole('button', { name: /check another/i });
        if (await byText.isVisible().catch(() => false)) {
          await byText.click();
        } else {
          // Last resort: reload home
          await this.#page.goto(new URL(process.env.PORTAL_BASE_URL).toString(), { waitUntil: 'domcontentloaded' });
        }
      }

      // Wait for results to hide and the form container to show
      const resultsPanel = this.#page.locator('#results');
      const formPanel = this.#page.locator('#eligibility-form'); // container visible
      await Promise.race([
        formPanel.waitFor({ state: 'visible', timeout: 5000 }),
        resultsPanel.waitFor({ state: 'hidden', timeout: 5000 }),
      ]).catch(() => {});

      // If the form element itself exists, ensure it’s reset (optional)
      const formEl = this.#page.locator('#eligibilityForm'); // actual <form id="eligibilityForm">
      if (await formEl.count()) {
        const handle = await formEl.elementHandle();
        await this.#page.evaluate(f => f.reset(), handle).catch(() => {});
      }

      // tiny cushion
      await this.#page.waitForTimeout(100).catch(() => {});
    } catch {
      // Non-fatal: next iteration will try to recover anyway
    }
  }

  // unified helper to clear and type
  async #clearAndFill(locator, value) {
    await locator.click({ clickCount: 3 }).catch(() => {});
    await locator.fill('');
    await locator.type(String(value ?? ''));
  }

  async verifyEligibility(p) {
    if (!this.#loggedIn) await this.login();

    // Ensure the form view is actually visible and ready before selecting locators
    await Promise.race([
      this.#page.locator('#eligibility-form').waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
      this.#page.locator(S.form.firstNameTestId).first().waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
      sel(this.#page, S.form.firstName).waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
    ]).catch(() => {});
    await this.#page.waitForTimeout(100).catch(() => {});

    try {
      // Prefer test IDs when available, else labels.
      const firstName = this.#page.locator(S.form.firstNameTestId).first();
      const lastName  = this.#page.locator(S.form.lastNameTestId).first();
      const dob       = this.#page.locator(S.form.dobTestId).first();
      const provider  = this.#page.locator(S.form.providerTestId).first();
      const memberId  = this.#page.locator(S.form.memberIdTestId).first();
      const submitBtn = this.#page.locator(S.form.submitTestId).first();

      const firstNameLocator = await firstName.count() ? firstName : sel(this.#page, S.form.firstName);
      const lastNameLocator  = await lastName.count()  ? lastName  : sel(this.#page, S.form.lastName);
      const dobLocator       = await dob.count()       ? dob       : sel(this.#page, S.form.dob);
      const providerLocator  = await provider.count()  ? provider  : sel(this.#page, S.form.provider);
      const memberIdLocator  = await memberId.count()  ? memberId  : sel(this.#page, S.form.memberId);
      const submitLocator    = await submitBtn.count() ? submitBtn : sel(this.#page, S.form.submit);

      // Fill form (use clear+type to avoid stale content)
      await this.#clearAndFill(firstNameLocator, p.firstName);
      await this.#clearAndFill(lastNameLocator,  p.lastName);

      // --- DOB handling: adapt to input type ---
      const inputType = await dobLocator.evaluate(el => el.getAttribute('type') || 'text').catch(() => 'text');

      if (inputType.toLowerCase() === 'date') {
        // Use ISO (YYYY-MM-DD) for date inputs
        const iso = p.dateOfBirthISO;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
          throw new FormError('Invalid ISO DOB for date input', { patientId: p.patientId, iso });
        }
        await this.#clearAndFill(dobLocator, iso);
      } else {
        // Fall back to MM/DD/YYYY for text inputs
        const d = new Date(p.dateOfBirthISO + 'T00:00:00Z');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const yyyy = d.getUTCFullYear();
        const display = `${mm}/${dd}/${yyyy}`;
        await this.#clearAndFill(dobLocator, display);
      }

      // Provider: select vs input
      const tag = await providerLocator.evaluate(el => el.tagName.toLowerCase()).catch(() => 'input');
      if (tag === 'select') {
        await providerLocator.selectOption({ label: p.insuranceProvider }).catch(async () => {
          const options = await providerLocator.evaluate(s => [...s.options].map(o => ({ value: o.value, label: o.label })));
          const match = options.find(o => o.label.toLowerCase().includes(p.insuranceProvider.toLowerCase()));
          if (match) await providerLocator.selectOption(match.value);
        });
      } else {
        await this.#clearAndFill(providerLocator, p.insuranceProvider);
      }

      await this.#clearAndFill(memberIdLocator, p.memberId);
      await submitLocator.click();
      await this.#page.waitForLoadState('networkidle', { timeout: ACTION_TIMEOUT }).catch(() => {});

      // Wait for the results section to be displayed
      const resultsPanel = this.#page.locator('#results');
      await resultsPanel.waitFor({ state: 'visible', timeout: ACTION_TIMEOUT });

      // Helper: get the .result-value text for a given label
      const valueFor = async (labelExact) => {
        const row = this.#page
          .locator('#results-content .result-item')
          .filter({ has: this.#page.getByText(labelExact, { exact: true }) });
        const val = row.locator('.result-value').first();
        if (await val.count() === 0) return null;
        const txt = (await val.innerText()).trim();
        return txt || null;
      };

      const eligibilityText = await valueFor('Eligibility Status:');
      const coverageText    = await valueFor('Coverage Type:');

      // Optional: if the portal shows an error banner area
      let errText = null;
      try {
        const errEl = this.#page.locator('#errorMessage');
        if (await errEl.isVisible()) errText = (await errEl.innerText()).trim();
      } catch {}

      const normalizedStatus =
        /active/i.test(eligibilityText ?? '') ? 'Active' :
        /inactive/i.test(eligibilityText ?? '') ? 'Inactive' :
        'Unknown';

      if (errText) {
        const out = {
          status: 'Unknown',
          coverageType: coverageText ?? undefined,
          errorMessage: errText,
          raw: { eligibility: eligibilityText ?? '', coverage: coverageText ?? '' },
        };
        await this.#resetToForm();
        return out;
      }

      const out = {
        status: normalizedStatus,
        coverageType: coverageText ?? undefined,
        raw: { eligibility: eligibilityText ?? '', coverage: coverageText ?? '' },
      };
      await this.#resetToForm();
      return out;

    } catch (err) {
      throw new FormError('Verification failed', { cause: err, patientId: p.patientId });
    }
  }

  async close() {
    await this.#page?.close().catch(() => {});
    await this.#browser?.close().catch(() => {});
  }
}
