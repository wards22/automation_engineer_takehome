// src/automation/portalClient.js
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
    case 'role':  return page.getByRole(desc.role, { name: desc.name, exact: false });
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
      // If no username/password fields are present, assume no login is needed.
      const usernameCount = await sel(this.#page, S.login.username).count().catch(() => 0);
      const passwordCount = await sel(this.#page, S.login.password).count().catch(() => 0);

      if (usernameCount === 0 || passwordCount === 0) {
        // Check if the patient form is already visible (either label locators or test id fallbacks)
        const formField = this.#page.locator(S.form.firstNameTestId).first();
        const submitBtn = this.#page.locator(S.form.submitTestId).first();
        await Promise.race([
          formField.waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
          submitBtn.waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
          sel(this.#page, S.form.firstName).waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
          sel(this.#page, S.form.submit).waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
        ]);
        this.#loggedIn = true;
        return;
      }

      // Otherwise, perform login.
      await sel(this.#page, S.login.username).fill(username);
      await sel(this.#page, S.login.password).fill(password);
      await sel(this.#page, S.login.submit).click();

      // Wait until the form is available post-login using race of separate waits.
      await Promise.race([
        sel(this.#page, S.form.firstName).waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
        sel(this.#page, S.form.submit).waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
        this.#page.locator(S.form.firstNameTestId).first().waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
        this.#page.locator(S.form.submitTestId).first().waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
      ]);

      // Optional explicit auth banner check
      const banner = sel(this.#page, S.login.errorBanner);
      if (await banner.isVisible().catch(() => false)) {
        throw new AuthError('Portal shows authentication error');
      }

      this.#loggedIn = true;
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new NetworkError('Login failed', { cause: err });
    }
  }

  async verifyEligibility(p) {
    if (!this.#loggedIn) await this.login();

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

      // Fill form
      await firstNameLocator.fill(p.firstName);
      await lastNameLocator.fill(p.lastName);
      const dobDisplay = new Date(p.dateOfBirthISO).toLocaleDateString('en-US', { timeZone: 'UTC' });
      await dobLocator.fill(dobDisplay);

      // Provider: select vs input
      const tag = await providerLocator.evaluate(el => el.tagName.toLowerCase()).catch(() => 'input');
      if (tag === 'select') {
        await providerLocator.selectOption({ label: p.insuranceProvider }).catch(async () => {
          const options = await providerLocator.evaluate(s => [...s.options].map(o => ({ value: o.value, label: o.label })));
          const match = options.find(o => o.label.toLowerCase().includes(p.insuranceProvider.toLowerCase()));
          if (match) await providerLocator.selectOption(match.value);
        });
      } else {
        await providerLocator.fill(p.insuranceProvider);
      }

      await memberIdLocator.fill(p.memberId);
      await submitLocator.click();

      // Wait for result or error
      const resultElig = this.#page.locator(S.result.eligibilityId);
      const resultCov  = this.#page.locator(S.result.coverageId);
      const resultErr  = this.#page.locator(S.result.errorId);

      await Promise.race([
        resultElig.waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
        resultErr.waitFor({ state: 'visible', timeout: ACTION_TIMEOUT }),
      ]).catch(() => {});

      const [eligText, covText, errText] = await Promise.all([
        resultElig.isVisible().then(v => v ? resultElig.innerText() : null),
        resultCov.isVisible().then(v => v ? resultCov.innerText() : null),
        resultErr.isVisible().then(v => v ? resultErr.innerText() : null),
      ]);

      if (errText) {
        return { status: 'Unknown', errorMessage: errText.trim(), raw: { eligibility: eligText ?? '', coverage: covText ?? '' } };
      }

      const status = (eligText ?? '').trim() || 'Unknown';
      const coverageType = (covText ?? '').trim() || undefined;
      const normalized =
        /active/i.test(status) ? 'Active' :
        /inactive/i.test(status) ? 'Inactive' :
        'Unknown';

      return { status: normalized, coverageType, raw: { eligibility: eligText ?? '', coverage: covText ?? '' } };
    } catch (err) {
      throw new FormError('Verification failed', { cause: err, patientId: p.patientId });
    }
  }

  async close() {
    await this.#page?.close().catch(() => {});
    await this.#browser?.close().catch(() => {});
  }
}
