/**
 * Cookie consent integration for the Ubuntu skin.
 *
 * Initialises the Canonical cookie-policy library and Google Consent Mode v2.
 * The vendor shim (cookieConsent-vendor.js) uses indirect eval to execute the
 * vendor IIFE in global scope, setting window.cpNs and GTM consent defaults to
 * "denied" before GTM loads.
 *
 * This module handles:
 * - Stubbing the Flask backend endpoints that don't exist on MediaWiki
 * - Calling window.cpNs.cookiePolicy() to show the consent banner
 * - Pushing a custom GTM event when consent changes
 */
require( './cookieConsent-vendor.js' );
var config = require( './config.json' );

if ( config.UbuntuCookieConsentEnabled ) {
	// Use the vendor's own .is-dark class to activate its dark palette.
	// syncDarkMode reads the skin's theme class from <html> (set by MediaWiki
	// before JS runs) and toggles .is-dark on the banner element.
	function syncDarkMode() {
		var el = document.querySelector( '.cookie-policy' );
		if ( !el ) {
			return;
		}
		var html = document.documentElement;
		var isDark = html.classList.contains( 'skin-theme-clientpref-night' ) ||
			( html.classList.contains( 'skin-theme-clientpref-os' ) &&
				window.matchMedia( '(prefers-color-scheme: dark)' ).matches );
		el.classList.toggle( 'is-dark', isDark );
	}

	// Re-sync when the user changes their theme at runtime (e.g. via the
	// appearance panel). This observer fires only on <html> class changes —
	// it does not watch the general DOM.
	new MutationObserver( syncDarkMode ).observe( document.documentElement, {
		attributes: true, attributeFilter: [ 'class' ]
	} );
	window.matchMedia( '(prefers-color-scheme: dark)' )
		.addEventListener( 'change', syncDarkMode );

	// The @canonical/cookie-policy library POSTs to /_cookies/set-preferences
	// and /_cookies/init, which are endpoints that rely on the cookies service python backend.
	// https://github.com/canonical/cookie-policy/issues/207
	var originalFetch = window.fetch;
	window.fetch = function ( url, options ) {
		if ( typeof url === 'string' && url.startsWith( '/_cookies/' ) ) {
			// Return a minimal shape matching what the vendor library expects.
			// It reads `cookies_freshness_ts` from the /_cookies/init and
			// /_cookies/set-preferences responses; returning `{}` would make it
			// store `_cookies_freshness_ts=undefined`, which is avoidable noise.
			var body = JSON.stringify( { cookies_freshness_ts: Date.now() } );
			return Promise.resolve( new Response( body, {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			} ) );
		}
		return originalFetch.apply( this, arguments );
	};

	// window.cpNs.cookiePolicy is exposed by the vendor IIFE loaded via
	// cookieConsent-vendor.js (required above).
	// Parameters: (callback, initWithCookieService)
	//   callback - called after user selects a preference
	//   initWithCookieService - false: local cookie only (no Flask backend)
	//
	// cookiePolicy() runs init() synchronously, which calls renderNotification()
	// if no preference has been selected yet. We call syncDarkMode() immediately
	// after so the initial banner (if shown) gets the correct theme.
	window.cpNs.cookiePolicy( function () {
		// Push a custom GTM event so tags can react to consent changes
		// beyond what setGoogleConsentPreferences() already handles.
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push( { event: 'cookie_consent_updated' } );
	}, false );
	syncDarkMode();

	// Handle the reopen case: vendor attaches a click listener to
	// .js-revoke-cookie-manager in init(), which calls renderNotification()
	// synchronously. Our listener runs after (same element, registered later),
	// so the .cookie-policy element is already in the DOM when syncDarkMode runs.
	var revokeBtn = document.querySelector( '.js-revoke-cookie-manager' );
	if ( revokeBtn ) {
		revokeBtn.addEventListener( 'click', syncDarkMode );
	}
}
