'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { getUIText } from '../lib/i18n';

const STORAGE_KEY = 'helpfulLinksOpen';

const LINKS = [
  {
    id: 'tour',
    href: 'https://www.ggc.edu/about-ggc/maps-and-directions',
    labelKey: 'tour',
  },
  {
    id: 'homepage',
    href: 'https://www.ggc.edu/',
    labelKey: 'homepage',
  },
  {
    id: 'original-map',
    href: 'http://ggcmaps.com/#Campus',
    labelKey: 'original',
  },
];

export default function Links({ className = '', forceOpen }) {
  const [open, setOpen] = useState(forceOpen ?? true);
  const { locale } = useLanguage();
  const copy = getUIText(locale);
  const linkCopy = copy.links;

  useEffect(() => {
    if (forceOpen !== undefined) return; // don't apply persisted state when forced
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === '0') {
      setOpen(false);
    }
  }, [forceOpen]);

  useEffect(() => {
    if (forceOpen !== undefined) return; // don't persist when forced
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, open ? '1' : '0');
  }, [open, forceOpen]);

  const slotClassName = ['legend-slot', className, open ? '' : 'is-collapsed'].filter(Boolean).join(' ');
  const panelClassName = ['legend-panel', 'link-panel', open ? '' : 'legend-panel--collapsed']
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={slotClassName} aria-labelledby="helpful-links-title">
      <div className={panelClassName}>
        <div className="legend-header d-flex align-items-center gap-2">
          <h2 id="helpful-links-title" className="legend-title link-panel-title fw-bold mb-0">
            {linkCopy.title}
          </h2>
          
        </div>
        <div id="helpful-links-body" className="legend-body link-panel-body" hidden={!open}>
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-panel-button"
            >
              <span className="link-panel-button-secondary">
                {linkCopy.buttonSecondaryPrefix} {linkCopy.items[link.labelKey] ?? link.labelKey}
              </span>
              <span className="link-panel-button-primary">{linkCopy.buttonPrimary}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
