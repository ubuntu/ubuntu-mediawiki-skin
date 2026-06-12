<?php
# See https://www.mediawiki.org/wiki/Manual:Configuration_settings

if ( !defined( 'MEDIAWIKI' ) ) {
exit;
}

# Site
$wgSitename = "Ubuntu Wiki";
$wgServer = "http://localhost:8080";
$wgScriptPath = "";
$wgResourceBasePath = $wgScriptPath;
$wgLanguageCode = "en";
$wgLocaltimezone = "UTC";

# Database (matches docker-compose.yml defaults)
$wgDBtype = "mysql";
$wgDBserver = "db";
$wgDBname = "mediawiki";
$wgDBuser = "mediawiki";
$wgDBpassword = "mediawiki";

# Keys — replace with unique values for any non-local deployment
$wgSecretKey = "change-me";
$wgUpgradeKey = "change-me";

# Uploads
$wgEnableUploads = false;
$wgUseInstantCommons = true;

# Skin
wfLoadSkin( 'Ubuntu' );
$wgDefaultSkin = 'ubuntu';

# Logo — uses the Ubuntu logo bundled in the skin.
# Replace with your own image path to use a custom logo.
$wgLogos = [
'1x'   => "$wgResourceBasePath/skins/Ubuntu/resources/images/Tag-CoF-Orange-Digital.svg",
'icon' => "$wgResourceBasePath/skins/Ubuntu/resources/images/Tag-CoF-Orange-Digital.svg",
];

unset( $wgFooterIcons['poweredby'] );

$wgUbuntuNightMode = [
'beta'      => false,
'logged_in' => true,
'logged_out' => true,
];

# Extensions
wfLoadExtension( 'WikiEditor' );
wfLoadExtension( 'VisualEditor' );
wfLoadExtension( 'SyntaxHighlight_GeSHi' );

$wgDefaultUserOptions['visualeditor-newwikitext'] = 1;
$wgHiddenPrefs[] = 'visualeditor-newwikitext';

# Debug (disable in production)
$wgShowExceptionDetails = true;
