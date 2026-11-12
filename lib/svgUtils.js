/**
 * SVG Utilities - Shared functions for SVG handling across components
 * Consolidates sanitization, selector escaping, and event handling
 */

/**
 * Sanitizes SVG markup by removing scripts and potentially harmful attributes
 * @param {string} markup - Raw SVG markup
 * @returns {string} Sanitized SVG markup
 */
export const sanitizeSvgMarkup = (markup) =>
  markup
    .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove script tags
    .replace(/\son\w+="[^"]*"/gi, '') // Remove inline event handlers (double quotes)
    .replace(/\son\w+='[^']*'/gi, '') // Remove inline event handlers (single quotes)
    .replace(/\s(xlink:)?href=["']\s*javascript:[^"']*["']/gi, ' '); // Remove JavaScript hrefs

/**
 * Escapes special characters in CSS selectors
 * Uses native CSS.escape when available, falls back to manual escaping
 * @param {string|null} value - The value to escape
 * @returns {string} Escaped value safe for use in CSS selectors
 */
export const escapeSelectorId = (value) => {
  if (!value) return '';
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return String(value).replace(/([ -\\/:-@[-`{-~])/g, '\\$1');
};

/**
 * Creates a unified SVG click handler that finds and selects interactive elements
 * Handles both individual elements and grouped elements (room-group, building-group)
 * @param {string} interactiveSelector - CSS selector for interactive elements
 * @param {Function} onSelect - Callback function called with selected ID
 * @returns {Function} Click event handler
 */
export const createSvgClickHandler = (interactiveSelector, onSelect) => (e) => {
  const clickable = e.target.closest(interactiveSelector) || e.target.closest('[id]');
  if (!clickable) return;

  // Try to find the closest group element (room-group or building-group)
  const group = clickable.closest('.room-group') || clickable.closest('.building-group');
  const id = (group?.id || clickable.id || clickable.getAttribute('id') || '').trim();

  if (id) {
    onSelect?.(id);
  }
};

/**
 * Infers the type of an SVG element based on its CSS classes
 * @param {Element} el - The SVG element to infer the type of
 * @returns {string} The inferred element type ('room', 'building', 'parking', 'poi')
 */
export const inferElementKind = (el) => {
  const cls = (el.className && el.className.baseVal) || el.getAttribute('class') || '';
  const c = cls.toLowerCase();
  if (c.includes('room')) return 'room';
  if (c.includes('building')) return 'building';
  if (c.includes('parking')) return 'parking';
  if (c.includes('poi') || c.includes('store') || c.includes('dining')) return 'poi';
  return 'poi';
};
