'use client';

import { useLanguage } from './LanguageContext';
import { getUIText } from '../lib/i18n';

export default function MapHeader() {
  const { locale } = useLanguage();
  const ui = getUIText(locale);

  return (
    <footer className="footer">
      <span className="text-muted small copyright">
        {ui.mapHeader.copyright}
      </span>
    </footer>
  );
}