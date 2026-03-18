<?php
namespace MediaWiki\Skins\Ubuntu\Components;

/**
 * Component interface for managing Vector-modified components
 *
 * @internal
 */
interface VectorComponent {
	/**
	 * @return array of Mustache compatible data
	 */
	public function getTemplateData(): array;
}
