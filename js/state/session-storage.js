// @ts-check

const KEY = 'slp-estimator-scenario-v1';

export function saveScenarioToSession(scenario) {
  sessionStorage.setItem(KEY, JSON.stringify(scenario));
}

export function loadScenarioFromSession() {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function clearScenarioSession() {
  sessionStorage.removeItem(KEY);
}
