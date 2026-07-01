const BLOCK_SELECTOR = ".ubuntu-code-block",
  BOUND_CLASS = "ubuntu-code-block--bound",
  BUTTON_SELECTOR = ".ubuntu-code-block-copy";

/**
 * @param {Element|Document} root
 * @return {void}
 */
function bindBlocks(root) {
  root
    .querySelectorAll(`${BLOCK_SELECTOR}:not( .${BOUND_CLASS} )`)
    .forEach((block) => {
      if (!block.querySelector(BUTTON_SELECTOR)) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = mw.msg("ubuntu-skin-button-copy");
        button.className = BUTTON_SELECTOR.slice(1);
        block.append(button);
      }

      block.classList.add(BOUND_CLASS);
    });
}

/**
 * @param {HTMLButtonElement} button
 * @return {string|null}
 */
function getCodeText( button ) {
	const block = button.closest( BLOCK_SELECTOR ),
		code = block && block.querySelector( 'pre, code' );

	return code ? code.textContent.replace( /^\n+/, '' ).replace( /\n+$/, '' ) : null;
}

/**
 * @return {void}
 */
function init() {
  if (!(navigator.clipboard && "writeText" in navigator.clipboard)) {
    return;
  }

  bindBlocks(document);
  mw.hook("wikipage.content").add(($content) => {
    bindBlocks($content[0]);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest(BUTTON_SELECTOR);

    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const text = getCodeText(button);

    if (text === null) {
      return;
    }

    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      return;
    }

    button.textContent =
      button.dataset.copiedLabel || mw.msg("ubuntu-skin-button-copied");
    setTimeout(() => {
      button.textContent =
        button.dataset.copyLabel || mw.msg("ubuntu-skin-button-copy");
    }, 5000);
  });
}

module.exports = {
	init
};
