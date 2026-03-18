# Ubuntu Skin

This is a modified version of the Vector-2022 skin for use in the upcoming Ubuntu wiki.

## Installation

### Requirements

- MediaWiki 1.44 or later
- Composer

### Install via Composer

Add the following to your wiki's `composer.local.json`:

```json
{
	"repositories": [
		{
			"type": "vcs",
			"url": "https://github.com/ubuntu/ubuntu-mediawiki-skin"
		}
	],
	"require": {
		"ubuntu/mediawiki-ubuntu-skin": "dev-main"
	}
}
```

Then run:

```sh
composer update
```

### Configure

Add the following to `LocalSettings.php`:

```php
wfLoadSkin( 'Ubuntu' );
$wgDefaultSkin = 'ubuntu';

# Logo — uses the Ubuntu logo bundled in the skin.
$wgLogos = [
	'1x'   => "$wgResourceBasePath/skins/Ubuntu/resources/images/ubuntu-logo.png",
	'icon' => "$wgResourceBasePath/skins/Ubuntu/resources/images/ubuntu-logo.png",
];

# Enable dark mode for all users
$wgUbuntuNightMode = [
	'beta'       => false,
	'logged_in'  => true,
	'logged_out' => true,
];
```

---

## Testing

This section includes guidelines for testing the skin locally.

### Requirements

- Docker and Docker Compose
- Make

### Quick start

```sh
make setup
```

Visit http://localhost:8080 — username: `admin`, password: `UbuntuWiki2024!`

### Clean up

```sh
make clean
```

## Compared to Vector 2022

The Ubuntu skin is a standalone MediaWiki skin based on Vector 2022 (the default Wikipedia skin), customised for the Ubuntu community wiki. It is loaded as a Composer package and registered as the skin key `ubuntu`.

### Relationship to Vector 2022

Ubuntu is a **full fork** of Vector 2022, not a child skin. All Vector 2022 templates, JavaScript, PHP components, and LESS stylesheets are included and maintained independently. The skin is functionally identical to Vector 2022 except for the changes listed below.

The HTML class names in the page (e.g. `vector-page-toolbar-container`, `vector-menu-tabs`) are intentionally preserved from Vector 2022. Only the internal PHP namespaces, resource module names, and config keys have been renamed.

### Changes from Vector 2022

#### Visual / CSS

- **Dark header bar** (`#333` background) applied to `.vector-header-container`, `.vector-header-start`, `.vector-header-end`
- **Ubuntu font** applied to all body text, headings, and UI elements — self-hosted as woff2 files, no Google Fonts request
- **Ubuntu logo** displayed in the header instead of the wiki logo wordmark
- **Search box** styled with dark background (`#3d3d3d`) to match the header
- **Icon colours** set to `#919191` (grey) across header and user links, with hover colour `#cccccc`
- **Sticky search toggle** (duplicate search icon) hidden
- **Footer links** for privacy, about, and disclaimers hidden
- **"Powered by MediaWiki"** footer icon removed (via `LocalSettings.php`)
- **Custom template styles** for Ubuntu-specific wiki templates: note, warning, tip, info, doccan, inuse, message, related-articles

#### Defaults

These are set in `skin.json` under `DefaultUserOptions` and apply to new users only:

| Preference | Vector 2022 default | Ubuntu default |
|---|---|---|
| Main menu pinned | 1 (pinned) | 0 (collapsed) |
| Page tools pinned | 1 (pinned) | 0 (collapsed) |
| TOC pinned | 1 (pinned) | 1 (pinned) |
| Appearance panel pinned | 1 (pinned) | 0 (collapsed) |
| Limited width | 1 (on) | 1 (on) |
| Font size | 0 (default) | 0 (default) |
| Theme | day | day |

#### Responsive

- `UbuntuResponsive` defaults to `true` (Vector 2022 defaults to `false`)

#### Naming / Registration

| Thing | Vector 2022 | Ubuntu |
|---|---|---|
| Skin key | `vector-2022` | `ubuntu` |
| PHP namespace | `MediaWiki\Skins\Vector` | `MediaWiki\Skins\Ubuntu` |
| Composer package | `mediawiki/vector-skin` | `mediawiki/ubuntu-skin` |
| Resource modules | `skins.vector.*` | `skins.ubuntu.*` |
| Config keys | `wgVector*` | `wgUbuntu*` |
| Main skin class | `SkinVector22` | `SkinUbuntu` |
| i18n name message | `vector-specialversion-name` | `ubuntu-specialversion-name` |
| i18n description message | `vector-skin-desc` | `ubuntu-skin-desc` |

#### Bundled Assets

- `resources/fonts/` — 16 Ubuntu font woff2 files (latin + latin-ext, all weights and styles)
- `resources/images/ubuntu-logo.png` — Ubuntu logo for the header
- `resources/skins.ubuntu.styles/ubuntu-custom.css` — all custom CSS overrides
- `resources/skins.ubuntu.styles/ubuntu-fonts.css` — `@font-face` declarations for self-hosted fonts
