/**
 * Theme toggle button - cycles through os → night → day → os.
 *
 * @param {Record<string,import('./clientPreferences.js').ClientPreference>} config
 * @param {import('./userPreferences.js').UserPreferencesApi} userPreferences
 */
function init( config, userPreferences ) {
	const button = document.querySelector( '.theme-toggle' );
	if ( !button ) {
		return;
	}

	const featureName = 'skin-theme';
	const cycle = [ 'day', 'night', 'os' ];
	const clientPreferences = require( /** @type {string} */ ( 'skins.ubuntu.clientPreferences' ) );

	// Maps each theme value to the message key describing the *next* theme in the cycle.
	const nextThemeMessageKey = {
		day: 'skin-theme-toggle-switch-to-night',
		night: 'skin-theme-toggle-switch-to-os',
		os: 'skin-theme-toggle-switch-to-day'
	};

	function updateAriaLabel( currentValue ) {
		const msgKey = nextThemeMessageKey[ currentValue ] || 'skin-theme-toggle-label';
		button.setAttribute( 'aria-label', mw.msg( msgKey ) );
	}

	updateAriaLabel( String( mw.user.clientPrefs.get( featureName ) ) );

	button.addEventListener( 'click', () => {
		const current = String( mw.user.clientPrefs.get( featureName ) );
		const currentIndex = cycle.indexOf( current );
		const nextValue = cycle[ ( currentIndex + 1 ) % cycle.length ];
		clientPreferences.toggleDocClassAndSave( featureName, nextValue, config, userPreferences );
		updateAriaLabel( nextValue );
	} );
}

module.exports = { init };
