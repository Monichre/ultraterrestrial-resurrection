'use strict';

/**
 * SplitText Plugin for GSAP
 * Splits text into chars, words, and lines for animation purposes
 * @version 0.7.0
 * @author GreenSock
 */
class SplitText {
  /**
   * Creates a new SplitText instance
   * @param {Element|Element[]|String} elements - Target element(s) or selector
   * @param {Object} vars - Configuration options
   */
  constructor(elements, vars = {}) {
    this.elements = this._getElements(elements);
    this.chars = [];
    this.words = [];
    this.lines = [];
    this._originals = [];
    this.vars = vars;
    this.isSplit = false;
    
    if (this.elements) {
      this.split(vars);
    }
  }

  /**
   * Gets computed style of an element
   * @private
   * @param {Element} element
   * @returns {CSSStyleDeclaration}
   */
  _getComputedStyle(element) {
    return window.getComputedStyle(element);
  }

  /**
   * Gets a specific style property value
   * @private
   * @param {Element} element
   * @param {string} prop - CSS property name
   * @param {CSSStyleDeclaration} [computedStyle] - Pre-computed styles
   * @param {boolean} [returnString=false] - Return as string instead of number
   * @returns {number|string}
   */
  _getStyleProperty(element, prop, computedStyle, returnString = false) {
    const cs = computedStyle || this._getComputedStyle(element);
    const val = cs.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
    return returnString ? val : parseInt(val, 10) || 0;
  }

  /**
   * Splits text content into chars, words, and/or lines
   * @param {Object} vars - Split configuration
   * @returns {SplitText}
   */
  split(vars = this.vars) {
    if (this.isSplit) {
      this.revert();
    }

    this._originals = [];
    this.chars = [];
    this.words = [];
    this.lines = [];

    const tag = vars.tag || vars.span ? 'span' : 'div';
    const wordClass = vars.wordsClass || '';
    const charClass = vars.charsClass || '';

    // Process each target element
    this.elements.forEach(element => {
      // Store original content
      this._originals.push(element.innerHTML);

      // Create wrapper elements for words and chars
      const wordWrapper = text => `<${tag} class="${wordClass}">${text}</${tag}>`;
      const charWrapper = text => `<${tag} class="${charClass}">${text}</${tag}>`;

      // Split into words and chars
      const split = this._splitText(element, vars, wordWrapper, charWrapper);

      // Organize split text into arrays
      if (split.chars) this.chars.push(...split.chars);
      if (split.words) this.words.push(...split.words);
      if (split.lines) this.lines.push(...split.lines);
    });

    this.isSplit = true;
    return this;
  }

  /**
   * Core text splitting logic
   * @private
   * @param {Element} element
   * @param {Object} vars
   * @param {Function} wordWrapper
   * @param {Function} charWrapper
   * @returns {Object}
   */
  _splitText(element, vars, wordWrapper, charWrapper) {
    const type = vars.type || vars.split || 'chars,words,lines';
    const hasChars = type.indexOf('chars') !== -1;
    const hasWords = type.indexOf('words') !== -1;
    const hasLines = type.indexOf('lines') !== -1;
    const absolute = vars.position === 'absolute' || vars.absolute === true;
    const wordDelimiter = vars.wordDelimiter || ' ';
    
    let text = element.textContent;
    let splitChars = [];
    let splitWords = [];
    let splitLines = [];

    // Clean up whitespace
    if (vars.reduceWhiteSpace !== false) {
      text = text.replace(/\s+/g, ' ').trim();
    }

    // Split into words
    if (hasWords || hasLines) {
      const words = text.split(wordDelimiter);
      splitWords = words.map(word => {
        const wrapped = wordWrapper(word);
        return {
          element: this._createTempElement(wrapped),
          text: word
        };
      });
    }

    // Split into characters
    if (hasChars) {
      splitChars = Array.from(text).map(char => {
        if (char === ' ') return char;
        const wrapped = charWrapper(char);
        return {
          element: this._createTempElement(wrapped),
          text: char
        };
      });
    }

    // Handle line splitting if needed
    if (hasLines) {
      splitLines = this._createLines(element, splitWords, absolute);
    }

    return { chars: splitChars, words: splitWords, lines: splitLines };
  }

  /**
   * Creates a temporary element from HTML string
   * @private
   * @param {string} html
   * @returns {Element}
   */
  _createTempElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
  }

  /**
   * Reverts text splitting
   * @returns {SplitText}
   */
  revert() {
    if (!this._originals) {
      throw new Error("revert() call wasn't scoped properly.");
    }

    this.elements.forEach((element, i) => {
      element.innerHTML = this._originals[i];
    });

    this.chars = [];
    this.words = [];
    this.lines = [];
    this.isSplit = false;

    return this;
  }

  /**
   * Static method to select elements
   * @static
   * @param {string|Element|Element[]} target
   * @returns {Element|Element[]}
   */
  static selector(target) {
    if (typeof target === 'string') {
      return document.querySelectorAll(target);
    }
    return target;
  }
}

// Version info
SplitText.version = '0.7.0';

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SplitText;
} else if (typeof define === 'function' && define.amd) {
  define(() => SplitText);
}

export default SplitText;