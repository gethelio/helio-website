/**
 * Cookie consent management
 *
 * Lightweight consent layer for GDPR compliance.
 * Controls GA4 via Google Consent Mode v2.
 */

const CONSENT_KEY = 'helio_cookie_consent'

export type ConsentStatus = 'granted' | 'denied' | 'pending'

export interface ConsentState {
  analytics: ConsentStatus
  timestamp: number
}

/** Read stored consent. Returns null if no decision yet. */
export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ConsentState
  } catch {
    return null
  }
}

/** Persist consent decision */
export function setConsent(analytics: ConsentStatus): void {
  if (typeof window === 'undefined') return

  const state: ConsentState = { analytics, timestamp: Date.now() }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state))

  // Update Google Consent Mode
  updateGoogleConsent(analytics)

  // Dispatch event so other components can react
  window.dispatchEvent(new CustomEvent('consent-updated', { detail: state }))
}

/** Check if user has made a consent decision */
export function hasConsentDecision(): boolean {
  return getConsent() !== null
}

/** Check if analytics consent was granted */
export function isAnalyticsAllowed(): boolean {
  const consent = getConsent()
  return consent?.analytics === 'granted'
}

/** Update Google Consent Mode v2 */
function updateGoogleConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('consent', 'update', {
    analytics_storage: status,
  })
}
