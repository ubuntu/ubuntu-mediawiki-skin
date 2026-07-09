<?php
# See https://www.mediawiki.org/wiki/Manual:Configuration_settings

if (!defined('MEDIAWIKI')) {
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
wfLoadSkin('Ubuntu');
$wgDefaultSkin = 'ubuntu';

# Logo — uses the Ubuntu logo bundled in the skin.
# Replace with your own image path to use a custom logo.
$wgLogos = [
    '1x'   => "$wgResourceBasePath/skins/Ubuntu/resources/images/Tag-CoF-Orange-Digital.svg",
    'icon' => "$wgResourceBasePath/skins/Ubuntu/resources/images/Tag-CoF-Orange-Digital.svg",
];

unset($wgFooterIcons['poweredby']);

$wgUbuntuNightMode = [
    'beta'      => false,
    'logged_in' => true,
    'logged_out' => true,
];

# Cookie consent & Google Tag Manager
# Enable the Canonical cookie policy consent banner.
$wgUbuntuCookieConsentEnabled = true;

# Google Tag Manager container ID (leave empty/null to disable GTM).
# The GTM snippet is injected via the BeforePageDisplay hook below.
$wgGTMContainerID = '';

# Footer "Manage your tracker settings" button — allows users to reconfigure consent.
$wgHooks['SkinAddFooterLinks'][] = function (MediaWiki\Skin\Skin $skin, string $key, array &$footerlinks) {
    if ($key === 'places') {
        $footerlinks['cookie-settings'] = MediaWiki\Html\Html::element('button', [
            'class' => 'js-revoke-cookie-manager',
            'type'  => 'button',
            'style' => 'cursor:pointer;background:none;border:none;padding:0;color:inherit;',
        ], $skin->msg('ubuntu-manage-trackers-button-label')->text());
    }
};

# Google Tag Manager injection.
# The cookie-policy vendor IIFE is loaded by the skin's ResourceLoader module
# (skins.ubuntu.cookieConsent). Its addGoogleConsentMode() sets
# gtag('consent','default',...) with all categories denied. The GTM snippet
# must load AFTER the vendor so that consent defaults are set before GTM
# initialises. When the user accepts cookies, the vendor library calls
# gtag('consent','update',...) automatically.
$wgHooks['BeforePageDisplay'][] = function (MediaWiki\Output\OutputPage $out, MediaWiki\Skin\Skin $skin) use (&$wgGTMContainerID) {
    if ($wgGTMContainerID) {
        $id = htmlspecialchars($wgGTMContainerID, ENT_QUOTES);

        // Google Tag Manager — official <head> snippet
        // https://developers.google.com/tag-manager/quickstart
        $out->addHeadItem(
            'gtm-head',
            <<<HTML
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{$id}');</script>
<!-- End Google Tag Manager -->
HTML
        );

        // Google Tag Manager — official <noscript> body snippet
        $out->addHTML(
            <<<HTML
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={$id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
HTML
        );
    }
};

# Extensions
wfLoadExtension('WikiEditor');
wfLoadExtension('VisualEditor');
wfLoadExtension('SyntaxHighlight_GeSHi');

$wgDefaultUserOptions['visualeditor-newwikitext'] = 1;
$wgHiddenPrefs[] = 'visualeditor-newwikitext';

# Debug (disable in production)
$wgShowExceptionDetails = true;
