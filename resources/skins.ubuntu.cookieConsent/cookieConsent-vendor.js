/**
 * Shim that executes the @canonical/cookie-policy vendor IIFE so that cpNs is
 * available as a global (window.cpNs) for cookieConsent.js.
 *
 * The vendored build is rewritten at vendor time so its top-level
 * `var cpNs = ...` becomes `window.cpNs = ...` (see the vendoring workflow).
 * That lets us `require()` the vendor file directly — ResourceLoader runs it in
 * a module closure, and the explicit `window.` assignment exposes cpNs globally
 * without needing indirect eval (which is blocked under a strict CSP that
 * disallows `unsafe-eval`).
 *
 * Only executes when UbuntuCookieConsentEnabled is true, so the vendor IIFE
 * (and its addGoogleConsentMode()) doesn't run when consent is disabled.
 */
var config = require( './config.json' );

if ( config.UbuntuCookieConsentEnabled ) {
	// Executing the vendor file assigns window.cpNs as a side effect.
	require( './vendor/cookie-policy.js' );
}
