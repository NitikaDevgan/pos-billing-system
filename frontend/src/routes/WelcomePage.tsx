import { apiClient } from '../services/apiClient';
export function WelcomePage() {
  return <section className="welcome-card"><p className="eyebrow">Café POS & Billing</p><h1>Project foundation is ready.</h1><p>The tablet-ready POS workspace is configured for future products, cart, payments, inventory, and reports.</p><p className="api-note">API base URL: <code>{apiClient.defaults.baseURL}</code></p></section>;
}
