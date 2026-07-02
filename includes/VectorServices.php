<?php

namespace MediaWiki\Skins\Ubuntu;

use MediaWiki\Skins\Ubuntu\Services\LanguageService;

/**
 * A service locator for services specific to Vector.
 *
 * @package Ubuntu
 * @internal
 */
final class VectorServices {

	public static function getLanguageService(): LanguageService {
		return new LanguageService();
	}
}
