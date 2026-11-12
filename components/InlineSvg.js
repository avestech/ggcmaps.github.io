'use client';
import { getAssetPath } from '../lib/assetUtils';
import { useEffect, useRef, useState } from 'react';
import { sanitizeSvgMarkup, escapeSelectorId, inferElementKind } from '../lib/svgUtils';
import { useElementSelection } from '../hooks/useElementSelection';

// InlineSvg component renders an SVG file and adds interactivity
export default function InlineSvg({
  src, // Path to the SVG file
  className = '', // Additional CSS classes for styling
  interactiveSelector = '.building-group, .building, .room-group', // Selector for interactive elements
  selectedId = null, // ID of the currently selected element
  onSelect, // Callback for when an element is selected
  onReady, // Callback for when the SVG is ready
}) {
  const ref = useRef(null); // Reference to the SVG container
  const [markup, setMarkup] = useState(null); // State to store the sanitized SVG markup
  const [error, setError] = useState(null); // State to store any loading errors
  const [internalSelectedId, setInternalSelectedId] = useElementSelection(ref.current, markup); // Internal selection state
  const hoverRefs = useRef(new Map()); // Track hover highlight nodes by source

  // Sync external selectedId prop with internal state
  useEffect(() => {
    if (selectedId) {
      setInternalSelectedId(selectedId);
    }
  }, [selectedId, setInternalSelectedId]);


  // Fetch and sanitize the SVG content when the source changes
  useEffect(() => {
    let alive = true; // Flag to track component lifecycle
      setMarkup(null); // Reset markup state
      setError(null); // Reset error state
      fetch(getAssetPath(src), { cache: 'no-store' }) // Fetch the SVG file
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); }) // Check response status
        .then(t => { if (alive) setMarkup(sanitizeSvgMarkup(t)); }) // Set sanitized markup
        .catch(err => { if (alive) setError(err.message); }); // Handle errors
    return () => { alive = false; }; // Cleanup function
  }, [src]);

  // Add interactivity and accessibility to the SVG elements
  useEffect(() => {
    if (!markup || !ref.current) return; // Ensure markup and ref are available
    const root = ref.current; // Reference to the SVG root element

    // Handle click events on interactive elements
    const click = (e) => {
      const el = e.target.closest(interactiveSelector); // Find closest interactive element
      if (el) {
        // If the clicked element doesn't have an ID, check its parent group
        const group = el.closest('.building-group') || el.closest('.room-group') || el;
        const normalizedId = (group.id || el.id) ? (group.id || el.id).toLowerCase() : null; // Normalize the ID to lowercase
        onSelect?.(normalizedId, el); // Call onSelect callback
      }
    };

    // Handle keyboard events for accessibility
    const key = (e) => {
      const el = e.target.closest(interactiveSelector); // Find closest interactive element
      if (!el) return; // Exit if no element found
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        // If the focused element doesn't have an ID, check its parent group
        const group = el.closest('.building-group') || el.closest('.room-group') || el;
        const normalizedId = (group.id || el.id) ? (group.id || el.id).toLowerCase() : null;
        onSelect?.(normalizedId, el); // Call onSelect callback
      }
    };

    // Enhance accessibility by adding attributes to interactive elements
    root.querySelectorAll(interactiveSelector).forEach(el => {
      el.hasAttribute('tabindex') || el.setAttribute('tabindex', '0'); // Make elements focusable
      el.hasAttribute('role') || el.setAttribute('role', 'button'); // Add a button role
      if (!el.hasAttribute('aria-label')) {
        const t = el.querySelector('text'); // Get text content for aria-label
        el.setAttribute('aria-label', (t && t.textContent.trim()) || el.id || 'map element'); // Set aria-label
      }
    });

    root.addEventListener('click', click); // Add click event listener
    root.addEventListener('keydown', key); // Add keydown event listener

    // Report the IDs of interactive elements to the parent component
    if (onReady) {
      const items = Array.from(root.querySelectorAll(interactiveSelector))
        .filter(el => el.id && String(el.id).trim().length > 0) // Filter elements with valid IDs
        .map(el => {
          const label = el.querySelector('text')?.textContent?.trim() || ''; // Get label text
          return {
            id: el.id, // Element ID
            kind: inferElementKind(el), // Inferred type of the element
            name: label, // Label text (if available)
            svg: src, // Source of the SVG
          };
        });
      onReady(items); // Call onReady callback with items
    }

    return () => {
      root.removeEventListener('click', click); // Cleanup click event listener
      root.removeEventListener('keydown', key); // Cleanup keydown event listener
    };
  }, [markup, interactiveSelector, onSelect, onReady, src]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const escapeSelector = (value) => {
      if (value === null || value === undefined) return '';
      return escapeSelectorId(value);
    };

    const clearSource = (source) => {
      const nodes = hoverRefs.current.get(source);
      if (nodes) {
        nodes.forEach((node) => node.classList.remove('hover-highlight'));
        hoverRefs.current.delete(source);
      }
    };

    const clearAll = () => {
      hoverRefs.current.forEach((nodes) => nodes.forEach((node) => node.classList.remove('hover-highlight')));
      hoverRefs.current.clear();
    };

    const collectTargets = ({ selector, ids }) => {
      const rootEl = ref.current;
      if (!rootEl) return [];
      const collected = new Set();
      if (selector) {
        rootEl.querySelectorAll(selector).forEach((el) => {
          collected.add(el.closest('.building-group') || el);
        });
      }
      if (Array.isArray(ids)) {
        ids.forEach((id) => {
          if (!id) return;
          const escaped = escapeSelector(id);
          if (!escaped) return;
          const found = rootEl.querySelector(`#${escaped}`);
          if (found) {
            collected.add(found.closest('.building-group') || found);
          }
        });
      }
      return Array.from(collected).filter(Boolean);
    };

    const handleHover = (event) => {
      const detail = event.detail || {};
      const { source } = detail;
      if (!source) return;
      clearSource(source);
      const targets = collectTargets(detail);
      if (targets.length) {
        targets.forEach((node) => node.classList.add('hover-highlight'));
        hoverRefs.current.set(source, targets);
      }
    };

    const handleHoverClear = (event) => {
      const detail = event.detail || {};
      const { source } = detail;
      if (source) {
        clearSource(source);
      } else {
        clearAll();
      }
    };

    window.addEventListener('ggcmap-hover', handleHover);
    window.addEventListener('ggcmap-hover-clear', handleHoverClear);

    return () => {
      window.removeEventListener('ggcmap-hover', handleHover);
      window.removeEventListener('ggcmap-hover-clear', handleHoverClear);
      clearAll();
    };
  }, []);

  useEffect(() => {
    hoverRefs.current.forEach((nodes) => nodes.forEach((node) => node.classList.remove('hover-highlight')));
    hoverRefs.current.clear();
  }, [markup]);

  // Error handling: log the error and display a fallback UI
  if (error) {
    console.error('Error loading SVG:', error); // Log error
    return <div className="svg-error">Error loading SVG: {error}</div>; // Display error message
  }

  return (
    <div
      ref={ref} // Reference to the SVG container
      className={`inline-svg ${className}`} // Apply class names
      dangerouslySetInnerHTML={{ __html: markup }} // Set inner HTML to sanitized markup
      style={{ isolation: 'isolate' }} // Contain the shadow DOM
    />
  );
}
