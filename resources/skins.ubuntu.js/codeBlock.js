const BLOCK_SELECTOR = ".ubuntu-code-block",
  BOUND_CLASS = "ubuntu-code-block--bound",
  BUTTON_SELECTOR = ".ubuntu-code-block-copy",
  CAPTCHA_BLOCK_CLASS = "ubuntu-code-block--captcha",
  FOCUSABLE_SELECTOR =
    "a[href], button, input, textarea, select, [tabindex]",
  STATUS_CLASS = "ubuntu-code-block-copy-status";

/**
 * @param {HTMLButtonElement} button
 * @return {string}
 */
function getCopyLabel(button) {
  const block = button.closest(BLOCK_SELECTOR);

  if (button.dataset.copyLabel) {
    return button.dataset.copyLabel;
  }

  if (block instanceof HTMLElement && block.dataset.copyLabel) {
    return block.dataset.copyLabel;
  }

  if (
    block instanceof HTMLElement &&
    block.classList.contains(CAPTCHA_BLOCK_CLASS)
  ) {
    return mw.msg("ubuntu-skin-button-copy-captcha-command");
  }

  return mw.msg("ubuntu-skin-button-copy");
}

/**
 * @param {Element} element
 * @return {boolean}
 */
function isFocusable(element) {
  return (
    element instanceof HTMLElement &&
    element.tabIndex >= 0 &&
    !element.hasAttribute("disabled") &&
    !element.matches("input[type='hidden']")
  );
}

/**
 * @param {Element} block
 * @return {number|null}
 */
function getFollowingPositiveTabIndex(block) {
  const focusableElements = document.querySelectorAll(FOCUSABLE_SELECTOR);

  for (let i = 0; i < focusableElements.length; i++) {
    const element = focusableElements[i];

    if (
      block.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING
    ) {
      return isFocusable(element) && element.tabIndex > 0
        ? element.tabIndex
        : null;
    }
  }

  return null;
}

/**
 * @param {Element|Document} root
 * @return {void}
 */
function bindBlocks(root) {
  root
    .querySelectorAll(`${BLOCK_SELECTOR}:not( .${BOUND_CLASS} )`)
    .forEach((block) => {
      const code = block.querySelector("pre, code");

      if (!block.querySelector(BUTTON_SELECTOR)) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = mw.msg("ubuntu-skin-button-copy");
        button.className = BUTTON_SELECTOR.slice(1);
        button.addEventListener("blur", () => {
          button.setAttribute("aria-label", getCopyLabel(button));
        });
        const tabIndex = getFollowingPositiveTabIndex(block);
        if (tabIndex !== null) {
          button.tabIndex = tabIndex;
        }
        block.insertBefore(button, code);
        button.setAttribute("aria-label", getCopyLabel(button));
      }

      block.classList.add(BOUND_CLASS);
    });
}

/**
 * @param {HTMLButtonElement} button
 * @return {string|null}
 */
function getCodeText(button) {
  const block = button.closest(BLOCK_SELECTOR),
    code = block && block.querySelector("pre, code");

  return code ? code.textContent.trim() : null;
}

/**
 * @return {HTMLElement|null}
 */
function getStatusElement() {
  let status = document.querySelector(`.${STATUS_CLASS}`);

  if (status instanceof HTMLElement) {
    return status;
  }

  if (!document.body) {
    return null;
  }

  status = document.createElement("span");
  status.className = STATUS_CLASS;
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  document.body.append(status);

  return status;
}

/**
 * @param {HTMLElement} status
 * @param {string} message
 * @return {void}
 */
function announceStatus(status, message) {
  status.textContent = "";
  setTimeout(() => {
    status.textContent = message;
  }, 100);
}

/**
 * @param {HTMLButtonElement} button
 * @param {string} text
 * @param {string} label
 * @return {void}
 */
function resetButtonLabel(button, text, label) {
  button.textContent = text;
  if (document.activeElement !== button) {
    button.setAttribute("aria-label", label);
  }
}

/**
 * @return {void}
 */
function init() {
  if (!(navigator.clipboard && "writeText" in navigator.clipboard)) {
    return;
  }

  getStatusElement();
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

    const copyButtonLabel = mw.msg("ubuntu-skin-button-copy"),
      copyLabel = getCopyLabel(button),
      copiedLabel =
      button.dataset.copiedLabel || mw.msg("ubuntu-skin-button-copied");
    const status = getStatusElement();

    button.setAttribute("aria-label", copyLabel);

    let copyPromise;
    try {
      copyPromise = navigator.clipboard.writeText(text);
    } catch (e) {
      return;
    }

    copyPromise.then(
      () => {
        button.textContent = copiedLabel;
        button.setAttribute("aria-label", copiedLabel);
        if (status) {
          announceStatus(status, copiedLabel);
        }

        setTimeout(() => {
          resetButtonLabel(button, copyButtonLabel, copyLabel);
        }, 5000);
      },
      () => undefined
    );
  });
}

module.exports = {
	init
};
