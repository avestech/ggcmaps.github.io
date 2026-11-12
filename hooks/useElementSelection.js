/**
 * useElementSelection - Custom hook for SVG element selection and highlighting
 * Handles selecting elements, managing highlight state, and cleaning up previous selections
 */

import { useState, useEffect, useRef } from 'react';
import { escapeSelectorId } from '../lib/svgUtils';

/**
 * Custom hook for managing SVG element selection and visual highlighting
 * Automatically handles adding/removing the 'active-room' class and aria-selected attribute
 * @param {HTMLElement} container - The container element with the SVG
 * @param {*} triggerDependency - Dependency that triggers selection effects (e.g., svgContent)
 * @returns {Array} [selectedId, setSelectedId] - State and setter for selected element ID
 */
export const useElementSelection = (container, triggerDependency) => {
  const [selectedId, setSelectedId] = useState(null);
  const prevRef = useRef(null);

  useEffect(() => {
    if (!container) return;

    // Clean up previous selection
    if (prevRef.current?.isConnected) {
      prevRef.current.classList.remove('active-room');
      prevRef.current.removeAttribute('aria-selected');
      prevRef.current = null;
    }

    if (!selectedId) return;

    // Escape the selector ID to handle special characters
    const escapedId = escapeSelectorId(selectedId);
    if (!escapedId) return;

    // Find the target element
    const target = container.querySelector(`#${escapedId}`);

    if (target) {
      // Add highlighting class and accessibility attribute
      target.classList.add('active-room');
      target.setAttribute('aria-selected', 'true');
      prevRef.current = target;
    }
  }, [selectedId, triggerDependency, container]);

  return [selectedId, setSelectedId];
};
