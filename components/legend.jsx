// components/legend.jsx
"use client";

import { useMemo } from "react";
import { dispatchHoverEvent, clearHoverEvents } from "../lib/eventSystem";
import { useLanguage } from "./LanguageContext";
import { normalizeLocale } from "../lib/i18n";

const HOVER_TARGETS = {
  academicBuilding: { selector: ".building-group:not(.student-housing)" },
  studentHousing: { selector: ".building-group.student-housing" },
  parkingFacultyStaff: { selector: ".staff-parking" },
  parkingResidents: { selector: ".resident-parking" },
  parkingStudents: { selector: ".student-parking" },
  parkingHandicap: { selector: ".handicap-parking" },
  restrictedArea: { selector: ".restricted-area" },
};

const TRANSLATIONS = {
  en: {
    legendTitle: "Legend",
    languageLabel: "Language",
    languageEnglish: "English",
    languageSpanish: "Spanish",
    academicBuilding: "Academic Building",
    studentHousing: "Student Housing",
    parking: "Parking",
    parkingFacultyStaff: "Faculty/Staff",
    parkingResidents: "Residents",
    parkingStudents: "Students",
    parkingHandicap: "Handicap",
    restrictedArea: "Restricted Area",
  },
  es: {
    legendTitle: "Leyenda",
    languageLabel: "Idioma",
    languageEnglish: "Ingl\u00e9s",
    languageSpanish: "Espa\u00f1ol",
    academicBuilding: "Edificio acad\u00e9mico",
    studentHousing: "Residencias estudiantiles",
    parking: "Estacionamiento",
    parkingFacultyStaff: "Personal/Profesorado",
    parkingResidents: "Residentes",
    parkingStudents: "Estudiantes",
    parkingHandicap: "Acceso para discapacitados",
    restrictedArea: "\u00c1rea restringida",
  },
};

const FALLBACK_LOCALE = "en";

const BASE_ITEMS = [
  { color: "#0f5132", labelKey: "academicBuilding" },
  { color: "#6b21a8", labelKey: "studentHousing" },
];

const PARKING_ITEMS = [
  { color: "#e874be", labelKey: "parkingFacultyStaff" },
  { color: "#e8bf74", labelKey: "parkingResidents" },
  { color: "#86efac", labelKey: "parkingStudents" },
  { color: "#93c5fd", labelKey: "parkingHandicap" },
];

const FLOATING_CONTAINER_STYLE = {
  top: "clamp(80px, 15vh, 250px)",
  right: "clamp(40px, 6vw, 200px)",
  zIndex: 1000,
  pointerEvents: "auto",
};

/** Reusable row with color square + label */
function SwatchItem({ color, label, className = "", onEnter, onLeave }) {
  const classes = ["legend-item d-flex align-items-center gap-2", className].filter(Boolean).join(" ");
  return (
    <li
      className={classes}
      onMouseEnter={() => onEnter?.()}
      onMouseLeave={() => onLeave?.()}
      style={{ wordBreak: "break-word" }}
    >
      <span
        className="legend-swatch d-inline-block border rounded"
        style={{ width: "14px", height: "14px", backgroundColor: color, flexShrink: 0 }}
      />
      <span className="legend-item-label">{label}</span>
    </li>
  );
}

export default function Legend({ locale = FALLBACK_LOCALE, mapScopeSelector, floating = false, className = "" }) {
  void mapScopeSelector;

  const { locale: contextLocale } = useLanguage();
  const activeLocale = normalizeLocale(contextLocale ?? locale) ?? FALLBACK_LOCALE;

  const messages = useMemo(
    () => TRANSLATIONS[activeLocale] ?? TRANSLATIONS[FALLBACK_LOCALE],
    [activeLocale]
  );
  const fallbackMessages = TRANSLATIONS[FALLBACK_LOCALE];
  const t = (key) => messages[key] ?? fallbackMessages[key] ?? key;

  const sendHover = (source, detail) => {
    if (typeof window === "undefined" || !detail) return;
    dispatchHoverEvent(source, detail);
  };

  const clearHover = (source) => {
    if (typeof window === "undefined") return;
    clearHoverEvents(source);
  };

  const getHoverHandlers = (key) => {
    const detail = HOVER_TARGETS[key];
    if (!detail) return {};
    const source = `legend:${key}`;
    return {
      onEnter: () => sendHover(source, detail),
      onLeave: () => clearHover(source),
    };
  };

  const legendBody = (
    <div
      className="legend-panel shadow rounded-4"
      role="region"
      aria-label={t("legendTitle")}
      >
        {/* Header row: legend title */}
        <div className="legend-header d-flex align-items-center gap-2 mb-2">
          <div className="legend-title fw-bold">{t("legendTitle")}</div>

      </div>

      <div id="legend-body" className="legend-body pt-2">
        <ul className="list-unstyled mb-0">
          {BASE_ITEMS.map((item) => (
            <SwatchItem
              key={item.labelKey}
              color={item.color}
              label={t(item.labelKey)}
              className="mb-2"
              {...getHoverHandlers(item.labelKey)}
            />
          ))}

          <li className="mt-3">
            <div className="fw-semibold legend-section-heading">
              {t("parking")}
            </div>
            <ul className="list-unstyled mb-0 ps-3 mt-2">
              {PARKING_ITEMS.map((item) => (
                <SwatchItem
                  key={item.labelKey}
                  color={item.color}
                  label={t(item.labelKey)}
                  className="mb-2"
                  {...getHoverHandlers(item.labelKey)}
                />
              ))}
            </ul>
          </li>

          <SwatchItem
            color="#9ca3af"
            label={t("restrictedArea")}
            className="mt-3 mb-0"
            {...getHoverHandlers("restrictedArea")}
          />
        </ul>
      </div>
    </div>
  );

  if (floating) {
    return (
      <div className="legend-floating position-absolute" style={FLOATING_CONTAINER_STYLE}>
        {legendBody}
      </div>
    );
  }

  const rootClassName = ["legend-slot", className].filter(Boolean).join(" ");

  return (
    <aside className={rootClassName} aria-label={t("legendTitle")}>
      {legendBody}
    </aside>
  );
}
