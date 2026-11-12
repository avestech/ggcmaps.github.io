'use client';

import { useLanguage } from './LanguageContext';
import { getUIText, isSpanish } from '../lib/i18n';

const SWITCH_ID = 'language-toggle-switch';

export default function LanguageToggle({ className = '' }) {
  const { locale, setLocale } = useLanguage();
  const copy = getUIText(locale);
  const spanish = isSpanish(locale);
  const classes = ['language-toggle', 'form-check', 'form-switch', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={SWITCH_ID}
        checked={spanish}
        onChange={(event) => setLocale(event.target.checked ? 'es' : 'en')}
        aria-label={copy.general.languageToggleAria}
      />
      <label className="form-check-label" htmlFor={SWITCH_ID}>
        {copy.general.languageToggleLabel}
      </label>
    </div>
  );
}
