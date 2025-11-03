// Loads .env (if present) and applies sane defaults for tests.
import dotenv from 'dotenv';
dotenv.config();

export function ensurePortalEnv() {
  const base = process.env.PORTAL_BASE_URL || 'https://bluesprig-pediatrics.github.io/automation_engineer_takehome/mock-portal/';
  const user = process.env.PORTAL_USERNAME || 'test_user';
  const pass = process.env.PORTAL_PASSWORD || 'test_pass123';
  process.env.PORTAL_BASE_URL = base;
  process.env.PORTAL_USERNAME = user;
  process.env.PORTAL_PASSWORD = pass;
  // Make browser invisible on CI by default
  process.env.HEADLESS = process.env.HEADLESS ?? 'true';
  process.env.PW_ACTION_TIMEOUT = process.env.PW_ACTION_TIMEOUT ?? '10000';
}
