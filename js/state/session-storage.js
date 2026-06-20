// @ts-check
import { appConfig } from '../config.js';
const KEY = `slp-estimator-v${appConfig.schemaVersion}`;
export function saveScenarioToSession(scenario) { try { sessionStorage.setItem(KEY, JSON.stringify({ schemaVersion: appConfig.schemaVersion, scenario })); return true; } catch { return false; } }
export function loadScenarioFromSession() { try { const raw = sessionStorage.getItem(KEY); if (!raw) return null; const parsed = JSON.parse(raw); return parsed?.schemaVersion === appConfig.schemaVersion && typeof parsed.scenario === 'object' ? parsed.scenario : null; } catch { clearScenarioSession(); return null; } }
export function clearScenarioSession() { try { sessionStorage.removeItem(KEY); } catch {} }
export function getSessionKey() { return KEY; }
