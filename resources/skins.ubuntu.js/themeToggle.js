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

	button.addEventListener( 'click', () => {
		const current = String( mw.user.clientPrefs.get( featureName ) );
		const currentIndex = cycle.indexOf( current );
		const nextValue = cycle[ ( currentIndex + 1 ) % cycle.length ];
		clientPreferences.toggleDocClassAndSave( featureName, nextValue, config, userPreferences );
	} );
}

module.exports = { init };
