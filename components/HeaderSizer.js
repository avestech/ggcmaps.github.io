'use client';

import { useEffect } from 'react';

/**
 * HeaderSizer component that measures the actual header height
 * and updates the CSS variable --header-height dynamically.
 * This ensures floor/campus viewers respect the actual header size on all screen sizes.
 */
export default function HeaderSizer() {
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('.header');
      if (header) {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // Measure on mount
    updateHeaderHeight();

    // Measure on window resize (for responsive changes)
    window.addEventListener('resize', updateHeaderHeight);

    // Also use ResizeObserver to catch header content changes
    const header = document.querySelector('.header');
    if (header && typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateHeaderHeight);
      observer.observe(header);
      
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateHeaderHeight);
      };
    }

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return null;
}
