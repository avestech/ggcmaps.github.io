"use client";

/**
 * Shared internationalization helpers and UI copy for the map experience.
 */

export const SUPPORTED_LOCALES = ["en", "es"];

export const normalizeLocale = (value) => {
  if (typeof value !== "string") return "en";
  const lower = value.trim().toLowerCase();
  return SUPPORTED_LOCALES.includes(lower) ? lower : "en";
};

export const isSpanish = (value) => normalizeLocale(value) === "es";

const UI_TEXT = {
  en: {
    roomShare: {
      title: "Share this room",
      close: "Close share popup",
      linkLabel: "Room link",
      copyLink: "Copy link",
      copied: "Link copied!",
      manualCopy: "Select and copy the link above to share it.",
      hint: "Open this link to see the highlighted room.",
    },
    general: {
      languageToggleLabel: "Spanish mode",
      languageToggleAria: "Toggle Spanish translations",
      ok: "OK",
      selectedPrefix: "Selected",
      loading: "Loading...",
      notFound: "Floor not found",
    },
    overlay: {
      mapControls: "Map controls",
      backToolbar: "Navigation back",
      navigationToolbar: "Navigation toggle",
      legendToolbar: "Legend toggle",
      linksToolbar: "Helpful links toggle",
      backToCampus: "Back to campus map",
      showNavigation: "Show navigation",
      hideNavigation: "Hide navigation",
      showLegend: "Show legend",
      hideLegend: "Hide legend",
      showLinks: "Show helpful links",
      hideLinks: "Hide helpful links",
      navigationPanelTitle: "Explore Campus",
      navigationPanelAria: "Navigation panel",
      legendPanelAria: "Legend panel",
      linksPanelAria: "Helpful links panel",
      closeNavigation: "Close navigation",
      closeLegend: "Close legend",
      closeLinks: "Close helpful links",
      floorNavigation: "Floor navigation",
      helpfulLinksTitle: "Helpful Links",
      goUpperFloor: "Go to upper floor",
      goLowerFloor: "Go to lower floor",
      upperFloorTitle: "Upper Floor",
      lowerFloorTitle: "Lower Floor",
      resetLabel: "Reset",
      resetAria: "Reset view",
      menuLabel: "Explore",
      legendLabel: "Legend",
      linksLabel: "Info",
    },
    mapHeader: {
      campusMap: "Campus Map",
      buildingFallback: "Building Map",
      helpHint: "Use +/- buttons or scroll/pinch to zoom; drag to pan",
      copyright: "© 2025 Georgia Gwinnett College"
    },
    links: {
      title: "Helpful Links",
      buttonPrimary: "Click here",
      buttonSecondaryPrefix: "For",
      items: {
        tour: "Virtual Tour",
        homepage: "GGC's Website",
        original: "GGC's Original Map",
      },
    },
    sidebar: {
      campusLabel: "Campus",
      navAria: "Campus navigation",
    },
    find: {
      searchPlaceholder: "AEC, gameroom, library",
      searchAria: "Search for buildings or rooms",
      suggestionsLabel: "Search suggestions",
      buildings: "Buildings",
      places: "Places",
      rooms: "Rooms",
      noSuggestions: "No matching suggestions. Try a building, room, or place name.",
      clearSearch: "Clear search",
      searchButtonLabel: "Find",
      helpButtonLabel: "Help",
      helpPanelTitle: "Search Help",
      searchFormatsTitle: "Search Formats (not case sensitive)",
      buildingLetterKey: "Building letter",
      buildingLetterValue: "e.g., b → Building B",
      letterFloorKey: "Letter + floor",
      letterFloorValue: "e.g., b2 → Building B, Floor 2",
      letterRoomKey: "Letter + room",
      letterRoomValue: "e.g., b2210 → Room 2210, highlighted",
      quickAliasesKey: "Quick aliases",
      quickAliasesValue: "aec, cisco, park, test, den",
      anyTextKey: "Any text",
      anyTextValue: "e.g., gameroom, library → Search results",
      quickExamplesTitle: "Quick Examples",
    },
    campusMapView: {
      restrictionMessage: "Student housing layouts are not available to the public.",
    },
  },
  es: {
    roomShare: {
      title: "Compartir esta sala",
      close: "Cerrar ventana para compartir",
      linkLabel: "Enlace de la sala",
      copyLink: "Copiar enlace",
      copied: "¡Enlace copiado!",
      manualCopy: "Selecciona y copia el enlace de arriba para compartirlo.",
      hint: "Abre este enlace para ver la sala resaltada.",
    },
    general: {
      languageToggleLabel: "Modo en español",
      languageToggleAria: "Activar traducciones al español",
      ok: "Aceptar",
      selectedPrefix: "Seleccionado",
      loading: "Cargando...",
      notFound: "Nivel no encontrado",
    },
    overlay: {
      mapControls: "Controles del mapa",
      backToolbar: "Navegación de regreso",
      navigationToolbar: "Conmutador de navegación",
      legendToolbar: "Conmutador de leyenda",
      linksToolbar: "Conmutador de enlaces útiles",
      backToCampus: "Volver al mapa del campus",
      showNavigation: "Mostrar navegación",
      hideNavigation: "Ocultar navegación",
      showLegend: "Mostrar leyenda",
      hideLegend: "Ocultar leyenda",
      showLinks: "Mostrar enlaces útiles",
      hideLinks: "Ocultar enlaces útiles",
      navigationPanelTitle: "Explorar el campus",
      navigationPanelAria: "Panel de navegación",
      legendPanelAria: "Panel de leyenda",
      linksPanelAria: "Panel de enlaces útiles",
      closeNavigation: "Cerrar navegación",
      closeLegend: "Cerrar leyenda",
      closeLinks: "Cerrar enlaces útiles",
      floorNavigation: "Navegación de niveles",
      helpfulLinksTitle: "Enlaces útiles",
      goUpperFloor: "Ir al nivel superior",
      goLowerFloor: "Ir al nivel inferior",
      upperFloorTitle: "Nivel superior",
      lowerFloorTitle: "Nivel inferior",
      resetLabel: "Reiniciar",
      resetAria: "Reiniciar vista",
      menuLabel: "Explorar",
      legendLabel: "Leyenda",
      linksLabel: "Información",
    },
    mapHeader: {
      campusMap: "Mapa del campus",
      buildingFallback: "Mapa del edificio",
      helpHint: "Usa los botones +/- o pellizca para acercar; arrastra para moverte",
      copyright: "© 2025 Georgia Gwinnett College"
    },
    links: {
      title: "Enlaces útiles",
      buttonPrimary: "Haz clic aquí",
      buttonSecondaryPrefix: "Para",
      items: {
        tour: "Recorrido virtual",
        homepage: "Sitio web de GGC",
        original: "Mapa original de GGC",
      },
    },
    sidebar: {
      campusLabel: "Campus",
      navAria: "Navegación del campus",
    },
    find: {
      searchPlaceholder: "AEC, sala de juegos, biblioteca",
      searchAria: "Buscar edificios o salas",
      suggestionsLabel: "Sugerencias de búsqueda",
      buildings: "Edificios",
      places: "Lugares",
      rooms: "Salas",
      noSuggestions: "No hay sugerencias. Prueba un edificio, sala o lugar.",
      clearSearch: "Borrar búsqueda",
      searchButtonLabel: "Buscar",
      helpButtonLabel: "Ayuda",
      helpPanelTitle: "Ayuda de búsqueda",
      searchFormatsTitle: "Formatos de búsqueda (no distingue mayúsculas)",
      buildingLetterKey: "Letra de edificio",
      buildingLetterValue: "p. ej., b → Edificio B",
      letterFloorKey: "Letra + piso",
      letterFloorValue: "p. ej., b2 → Edificio B, Piso 2",
      letterRoomKey: "Letra + sala",
      letterRoomValue: "p. ej., b2210 → Sala 2210, resaltada",
      quickAliasesKey: "Alias rápidos",
      quickAliasesValue: "aec, cisco, park, test, den",
      anyTextKey: "Cualquier texto",
      anyTextValue: "p. ej., sala de juegos, biblioteca → Resultados de búsqueda",
      quickExamplesTitle: "Ejemplos rápidos",
    },
    campusMapView: {
      restrictionMessage: "Los planos de las residencias estudiantiles no están disponibles para el público.",
    },
  },
};

export const getUIText = (locale) => UI_TEXT[normalizeLocale(locale)];

const buildingReplacements = [
  { match: /Building/gi, value: "Edificio" },
  { match: /Admissions/gi, value: "Admisiones" },
  { match: /Student Center/gi, value: "Centro Estudiantil" },
  { match: /Wellness & Rec Center/gi, value: "Centro de Bienestar y Recreación" },
  { match: /Wellness & Rec/gi, value: "Centro de Bienestar y Recreación" },
  { match: /Library/gi, value: "Biblioteca" },
  { match: /Allied Health & Science/gi, value: "Ciencias y Salud" },
];

export const translateBuildingName = (name, locale) => {
  if (!name || !isSpanish(locale)) return name;
  return buildingReplacements.reduce(
    (result, rule) => result.replace(rule.match, rule.value),
    name.replace(/\bBuilding\b/gi, "Edificio")
  );
};

export const translateFloorLabel = (label, locale) => {
  if (!label || !isSpanish(locale)) return label;
  return label.replace(/\bLevel\b/gi, "Nivel");
};
