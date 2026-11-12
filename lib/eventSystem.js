/**
 * Event System - Centralized custom event dispatching
 * Handles hover events, selection events, and other component communication
 */

/**
 * Unified hover event manager
 * Simplifies component communication without prop drilling
 */
class HoverEventManager {
  /**
   * Highlight elements by ID or selector
   * @param {string} source - The source identifier (e.g., 'sidebar:building-a')
   * @param {string|null} selector - Optional CSS selector for elements to highlight
   * @param {Array<string>|null} ids - Optional array of element IDs to highlight
   */
  static highlight(source, { selector = null, ids = null } = {}) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('ggcmap-hover', {
      detail: { source, selector, ids }
    }));
  }

  /**
   * Clear highlights from a specific source or all sources
   * @param {string|null} source - The source identifier to clear, or null to clear all
   */
  static clear(source = null) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('ggcmap-hover-clear', {
      detail: { source }
    }));
  }

  /**
   * Create mouse/focus event handlers for hover interactions
   * @param {string} source - The source identifier
   * @param {Object} detail - The detail payload ({ selector, ids })
   * @returns {Object} Object with onMouseEnter, onMouseLeave, onFocus, onBlur handlers
   */
  static createHandlers(source, detail = {}) {
    return {
      onMouseEnter: () => {
        if (detail.selector || detail.ids) {
          this.highlight(source, detail);
        }
      },
      onMouseLeave: () => this.clear(source),
      onFocus: () => {
        if (detail.selector || detail.ids) {
          this.highlight(source, detail);
        }
      },
      onBlur: () => this.clear(source),
    };
  }
}

// Export for backward compatibility with cleaner API
export const dispatchHoverEvent = (source, detail) => HoverEventManager.highlight(source, detail);
export const createHoverHandlers = (source, detail) => HoverEventManager.createHandlers(source, detail);
export const clearHoverEvents = (source) => HoverEventManager.clear(source);

// Export the manager class for new usage patterns
export default HoverEventManager;
