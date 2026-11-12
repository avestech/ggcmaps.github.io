"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import rooms from "../data/rooms.json";
import buildings from "../data/buildings.json";
import { useRouter } from "next/navigation";
import {
  searchForRoom,
  validateSearchInput,
  parseFloorInput,
  formatNotFoundError,
  extractRoomNavInfo,
  resolveRoomLevelId,
} from "../lib/searchUtils";
import { useLanguage } from "./LanguageContext";
import { getUIText, translateBuildingName, translateFloorLabel } from "../lib/i18n";

const maxCharsAllowed = 100;

// Dynamically generate valid buildings and floors from buildings.json
const validBuildings = buildings.map(b => b.id.toLowerCase());
const validBuildingFloors = buildings.flatMap(b =>
  b.floors.map(f => {
    const floorNum = f.id.match(/\d+/)?.[0] || '';
    return `${b.id.toLowerCase()}${floorNum}`;
  })
);

// Room aliases for quick navigation to common locations
const ALIASES = {
  "belonging center": { building: "B", level: "L1", room: "1000" },
  lvis: { building: "E", level: "L2", room: "lvis" },
  "stephens family executive forum": { building: "W", level: "GL", room: "1210" },
  aec: { building: "W", level: "GL", room: "1160" },
  cisco: { building: "C", level: "L1", room: "1260" },
  park: { building: "D", level: "L1", room: "1125" },
  test: { building: "D", level: "L1", room: "1301" },
  den: { building: "A", level: "L1", room: "1510" },
  library: { building: "L", level: "L1", room: "1000" },
  gameroom: { building: "E", level: "L1", room: "gameroom" },
  food: { building: "A", level: "L1", room: "1800" },
  dining: { building: "A", level: "L1", room: "1850" },
  pod: { building: "A", level: "L1", room: "1825" },
  cfa: { building: "A", level: "L1", room: "chickfila" },
  "moes": { building: "A", level: "L1", room: "moes" },
  moes: { building: "A", level: "L1", room: "moes" },
  panda: { building: "A", level: "L1", room: "pandaexpress" },
  bagel: {building: "B", level: "L1", room: "einsteinbrosbagels"},
  multi: {building: "E", level: "L1", room: "multipurposeroom"},
  pdining: {building: "E", level: "L1", room: "privatedining"},
  outdoordining: {building: "E", level: "L1", room: "outdoordining"},
  dininghall: {building: "E", level: "L1", room: "dininghall"},
  kitchenarea: {building: "E", level: "L1", room: "kitchenarea"},
  foodstations: {building: "E", level: "L1", room: "foodstations"},
  menslockers: {building: "F", level: "L1", room: "menslockers"},
  womenslockers: {building: "F", level: "L1", room: "womenslockers"},
  fclass: {building: "F", level: "L1", room: "classroom"},
  racquet: {building: "F", level: "L1", room: "racquetballcourt1"},
  racquet1: {building: "F", level: "L1", room: "racquetballcourt1"},
  racquet2: {building: "F", level: "L1", room: "racquetballcourt2"},
  racquet3: {building: "F", level: "L1", room: "racquetballcourt3"},
  pool: {building: "F", level: "L1", room: "jrolympicpool"},
  basketball: {building: "F", level: "L1", room: "basketballcourt"},
  bball: {building: "F", level: "L1", room: "basketballcourt"},
  "cc basketball": {building: "CC", level: "L1", room: "Basketball_Court"},
  "cc basketball court": {building: "CC", level: "L1", room: "Basketball_Court"},
  "cc bball": {building: "CC", level: "L1", room: "Basketball_Court"},
  ccbasketball: {building: "CC", level: "L1", room: "Basketball_Court"},
  ccbball: {building: "CC", level: "L1", room: "Basketball_Court"},
  "cc-basketballcourt": {building: "CC", level: "L1", room: "Basketball_Court"},
  "cc event space": {building: "CC", level: "L2", room: "Event_Space"},
  mech: {building: "F", level: "L1", room: "mechanical"},
  track: {building: "F", level: "L2", room: "elevatedtrack"},
  aerobics: {building: "F", level: "L2", room: "aerobics"},
  freeweights: {building: "F", level: "L2", room: "freeweights"},
  cardio: {building: "F", level: "L2", room: "cardio"},
  weightmachines: {building: "F", level: "L2", room: "weightmachines"},
  weight: {building: "F", level: "L2", room: "weightmachines"},
  weightroom: {building: "F", level: "L2", room: "weightmachines"},
  gym: {building: "F", level: "L2", room: "freeweights"},
  spin: {building: "F", level: "L2", room: "spinroom"},
  
};

// Spanish translations of aliases
const ALIASES_ES = {
  aec: { building: "W", level: "GL", room: "1160" },
  cisco: { building: "C", level: "L1", room: "1260" },
  park: { building: "D", level: "L1", room: "1125" },
  test: { building: "D", level: "L1", room: "1301" },
  den: { building: "A", level: "L1", room: "1510" },
  biblioteca: { building: "L", level: "L1", room: "1000" }, // library
  "sala de juegos": { building: "E", level: "L1", room: "gameroom" }, // gameroom
  cfa: { building: "A", level: "L1", room: "chickfila" },
  moes: { building: "A", level: "L1", room: "moes" },
  pandaexpress: { building: "A", level: "L1", room: "pandaexpress" }
};

const normalizeSuggestion = value => value.toLowerCase().replace(/[\s_-]/g, "");
const PLACE_LABELS = {
  "belonging center": "Belonging Center", lvis: "LVIS",
  "stephens family executive forum": "Stephens Family Executive Forum",
  "cc basketball": "CC Basketball", "cc event space": "CC Event Space",
  aec: "AEC", cisco: "Cisco", gameroom: "Game room", cfa: "Chick-fil-A",
  moes: "Moe's", panda: "Panda Express", bagel: "Einstein Bros. Bagels",
  multi: "Multipurpose room", pdining: "Private dining", outdoordining: "Outdoor dining",
  dininghall: "Dining hall", kitchenarea: "Kitchen area", foodstations: "Food stations",
  menslockers: "Men's lockers", womenslockers: "Women's lockers", fclass: "Classroom",
  racquet: "Racquetball court 1", racquet2: "Racquetball court 2", racquet3: "Racquetball court 3",
  basketball: "Basketball court", mech: "Mechanical", track: "Elevated track",
  freeweights: "Free weights", weightmachines: "Weight machines", spin: "Spin room",
};

export default function Find() {
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState("");
  const [findValue, setFindValue] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listId = useId();
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const { locale } = useLanguage();
  const ui = getUIText(locale);
  const suggestionIndex = useMemo(() => {
    const entries = buildings.map(building => ({
      group: "buildings", query: building.id,
      label: translateBuildingName(building.name, locale),
      detail: building.floors.map(floor => translateFloorLabel(floor.label, locale)).join(" · "),
      terms: [building.id, building.name, translateBuildingName(building.name, locale)],
    }));
    const locationDetail = (building, level) => {
      const floor = buildings.find(item => item.id === building)?.floors.find(item => item.id === level);
      return `${translateBuildingName(`Building ${building}`, locale)} · ${translateFloorLabel(floor?.label || level, locale)}`;
    };
    const destinations = new Map();
    // Prefer Spanish labels where available, while accepting the English aliases too.
    const aliases = locale === "es" ? { ...ALIASES_ES, ...ALIASES } : ALIASES;
    Object.entries(aliases).forEach(([alias, destination]) => {
      const key = `${destination.building}/${destination.level}/${destination.room}`;
      const existing = destinations.get(key);
      if (existing) { existing.terms.push(alias); return; }
      const label = PLACE_LABELS[alias] || alias.replace(/\b\w/g, letter => letter.toUpperCase());
      const entry = {
        group: "places", query: alias, label,
        detail: locationDetail(destination.building, destination.level), terms: [alias, label],
      };
      destinations.set(key, entry);
      entries.push(entry);
    });
    rooms.forEach(room => {
      const nav = extractRoomNavInfo(room);
      if (!nav) return;
      const level = resolveRoomLevelId(nav);
      if (!buildings.some(building => building.id === nav.building && building.floors.some(floor => floor.id === level))) return;
      const id = typeof room === "string" ? room : room.uniqueId;
      entries.push({ group: "rooms", query: id, label: id, detail: locationDetail(nav.building, level), terms: [id] });
    });
    return entries.map(entry => ({ ...entry, terms: entry.terms.map(normalizeSuggestion) }));
  }, [locale]);
  const suggestions = useMemo(() => {
    const query = normalizeSuggestion(findValue.trim());
    if (!query) return [];
    const matches = suggestionIndex.map(entry => ({
      ...entry,
      rank: query.length === 1 && entry.group === "buildings"
        ? (entry.query.toLowerCase() === query ? 0 : 3)
        : Math.min(...entry.terms.map(term => term === query ? 0 : term.startsWith(query) ? 1 : term.includes(query) ? 2 : 3)),
    })).filter(entry => entry.rank < 3).sort((a, b) => a.rank - b.rank);
    return ["buildings", "places", "rooms"].flatMap(group => matches.filter(entry => entry.group === group).slice(0, 3));
  }, [findValue, suggestionIndex]);
  const showSuggestions = suggestionsOpen && findValue.trim().length > 0;

  useEffect(() => { setActiveIndex(-1); }, [locale]);
  useEffect(() => {
    if (showSuggestions && activeIndex >= 0) {
      listRef.current?.querySelectorAll('[role="option"]')[activeIndex]?.scrollIntoView?.({ block: "nearest" });
    }
  }, [activeIndex, showSuggestions]);

  const chooseSuggestion = suggestion => {
    setFindValue(suggestion.query);
    onFindClickButton(suggestion.query);
  };

  // Keep validation feedback temporary so it does not remain over the map.
  useEffect(() => {
    if (!error) return undefined;
    const timeoutId = window.setTimeout(() => setError(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [error]);

  const onFindClickButton = (value = findValue) => {
    const userInput = value.trim().toLowerCase();
    setSuggestionsOpen(false);
    setActiveIndex(-1);

    // Validate input
    if (!validateSearchInput(userInput)) {
      setError("You must enter a search term.");
      return;
    }

    // Clear previous errors
    setError("");

    // Determine which aliases to use based on current language
    const currentAliases = locale === 'es' ? { ...ALIASES, ...ALIASES_ES } : ALIASES;

    // 1. Check for room alias (quick navigation)
    if (currentAliases[userInput]) {
      const { building, level, room } = currentAliases[userInput];
      router.push(`/building/${building}/${level}?room=${encodeURIComponent(room)}`);
      return;
    }

    // 2. Check for a building code (e.g., "b" or "cc")
    if (validBuildings.includes(userInput)) {
      const building = userInput.toUpperCase();
      const level = building === "W" ? "GL" : "L1";
      router.push(`/building/${building}/${level}`);
      return;
    }

    // 3. Check for building + floor (e.g., "b2")
    if (validBuildingFloors.includes(userInput)) {
      const floorData = parseFloorInput(userInput);
      if (floorData) {
        router.push(`/building/${floorData.building}/L${floorData.floor}`);
        return;
      }
    }

    // 4. Check for help request
    if (userInput === "help") {
      setShowHelp(true);
      return;
    }

    // 5. Search for room by query
    const match = searchForRoom(userInput, rooms);
    if (!match) {
      // Exact building, floor, and alias searches above retain their meaning.
      // A partial name can use its best suggestion when submitted directly.
      if (value === findValue && suggestions.length) {
        chooseSuggestion([...suggestions].sort((a, b) => a.rank - b.rank)[0]);
        return;
      }
      setError(formatNotFoundError(value));
      return;
    }

    // Extract navigation info from matched room
    const navInfo = extractRoomNavInfo(match);
    if (!navInfo) {
      setError("Invalid room format in database.");
      return;
    }

    // Navigate to the room and highlight it
    const { building, floor, roomNumber } = navInfo;
    const level = resolveRoomLevelId({ building, floor, roomNumber });

    if (!level) {
      setError("Invalid room floor in database.");
      return;
    }

    router.push(`/building/${building}/${level}?room=${encodeURIComponent(roomNumber)}`);
  };

  const onHelpClick = () => {
    setSuggestionsOpen(false);
    setShowHelp(true);
  };

  const onKeyDown = (e) => {
    if (e.nativeEvent.isComposing) return;
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && suggestions.length) {
      e.preventDefault();
      setSuggestionsOpen(true);
      setActiveIndex(index => {
        if (!showSuggestions || index < 0) return e.key === "ArrowDown" ? 0 : suggestions.length - 1;
        return (index + (e.key === "ArrowDown" ? 1 : -1) + suggestions.length) % suggestions.length;
      });
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && suggestions[activeIndex]) chooseSuggestion(suggestions[activeIndex]);
      else onFindClickButton();
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
        <div className="d-flex align-items-center find-search-row" style={{ gap: "var(--justin-globe-gap)" }}>
          

          <div className="find-input-wrap">
          <input
            ref={inputRef}
            id="findInput"
            type="text"
            size={"50"}
            className="form-control w-100"
            placeholder={ui.find.searchPlaceholder}
            maxLength={maxCharsAllowed}
            style={{ width: "var(--justin-globe-inputBarSize)" }}
            value={findValue}
            onChange={(e) => {
              setFindValue(e.target.value);
              setSuggestionsOpen(true);
              setActiveIndex(-1);
              if (error) setError("");
            }}
            onClick={() => { setSuggestionsOpen(false); setActiveIndex(-1); }}
            onBlur={event => {
              if (listRef.current?.contains(event.relatedTarget)) return;
              setSuggestionsOpen(false);
              setActiveIndex(-1);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls={showSuggestions ? listId : undefined}
            aria-activedescendant={showSuggestions && suggestions[activeIndex] ? `${listId}-${activeIndex}` : undefined}
            aria-label={ui.find.searchAria}
          />
          {findValue && (
            <button type="button" className="find-clear" aria-label={ui.find.clearSearch}
              onClick={() => {
                setFindValue("");
                setError("");
                setSuggestionsOpen(false);
                setActiveIndex(-1);
                inputRef.current?.focus();
              }}>
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          )}
          </div>
          <button 
            id="findInputButton" 
            className="btn btn-primary find-btn" 
            onClick={() => onFindClickButton()}
            title={ui.find.searchButtonLabel}
            aria-label="Find"
          >
            <i className="bi bi-search"></i>
            <span className="find-btn-text">{ui.find.searchButtonLabel}</span>
          </button>

          <button 
            id="helpButton" 
            className="btn btn-secondary help-btn" 
            onClick={onHelpClick}
            title={ui.find.helpButtonLabel}
            aria-label="Help"
          >
            <i className="bi bi-question-circle"></i>
            <span className="help-btn-text">{ui.find.helpButtonLabel}</span>
          </button>
          {showSuggestions && (
            <div className="find-suggestions">
              <div id={listId} ref={listRef} role="listbox" aria-label={ui.find.suggestionsLabel} className="find-suggestions-list">
                {["buildings", "places", "rooms"].map(group => {
                  const entries = suggestions.filter(item => item.group === group);
                  if (!entries.length) return null;
                  return (
                    <div key={group} role="group" aria-label={ui.find[group]}>
                      <div className="find-suggestions-heading" aria-hidden="true">{ui.find[group]}</div>
                      {entries.map(suggestion => {
                        const index = suggestions.indexOf(suggestion);
                        return (
                          <button type="button" tabIndex={-1} key={suggestion.query} id={`${listId}-${index}`} role="option"
                            aria-selected={activeIndex === index} className="find-suggestion"
                            onPointerDown={event => event.preventDefault()}
                            onClick={() => chooseSuggestion(suggestion)}>
                            <i aria-hidden="true" className={`bi bi-${group === "buildings" ? "buildings" : group === "places" ? "geo-alt" : "door-open"}`} />
                            <span><span className="find-suggestion-label">{suggestion.label}</span><small>{suggestion.detail}</small></span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              {!suggestions.length && <div className="find-suggestions-empty" role="status">{ui.find.noSuggestions}</div>}
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              color: "red",
              marginLeft: "10px",
              textAlign: "center",
              marginTop: "0.5rem",
              fontWeight: "bold",
              fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
              wordWrap: "break-word",
              overflow: "hidden"
            }}
          >
            {error}
          </div>
        )}

        {showHelp && (
          <div className="find-help-panel-overlay">
            <div className="find-help-panel">
              <div className="find-help-panel-header">
                <h5 className="find-help-panel-title">{ui.find.helpPanelTitle}</h5>
                <button 
                  className="find-help-panel-close" 
                  onClick={() => setShowHelp(false)}
                  aria-label="Close help panel"
                  title="Close"
                >
                  <i className="bi bi-x" aria-hidden="true"></i>
                </button>
              </div>
              
              <div className="find-help-panel-content">
                <div className="find-help-section">
                  <h6 className="find-help-section-title">{ui.find.searchFormatsTitle}</h6>
                  <div className="find-help-compact-table">
                    <div className="find-help-row">
                      <span className="find-help-key">{ui.find.buildingLetterKey}</span>
                      <span className="find-help-value">{ui.find.buildingLetterValue}</span>
                    </div>
                    <div className="find-help-row">
                      <span className="find-help-key">{ui.find.letterFloorKey}</span>
                      <span className="find-help-value">{ui.find.letterFloorValue}</span>
                    </div>
                    <div className="find-help-row">
                      <span className="find-help-key">{ui.find.letterRoomKey}</span>
                      <span className="find-help-value">{ui.find.letterRoomValue}</span>
                    </div>
                    <div className="find-help-row">
                      <span className="find-help-key">{ui.find.quickAliasesKey}</span>
                      <span className="find-help-value"><strong>{ui.find.quickAliasesValue}</strong></span>
                    </div>
                    <div className="find-help-row">
                      <span className="find-help-key">{ui.find.anyTextKey}</span>
                      <span className="find-help-value">{ui.find.anyTextValue}</span>
                    </div>
                  </div>
                </div>

                <div className="find-help-section">
                  <h6 className="find-help-section-title">{ui.find.quickExamplesTitle}</h6>
                  <ul className="find-help-examples">
                    <li><strong>a</strong> → Building A</li>
                    <li><strong>c3</strong> → Building C, Floor 3</li>
                    <li><strong>a1510</strong> → Room 1510 in Building A</li>
                    <li><strong>aec</strong> → AEC (quick link)</li>
                  </ul>
                </div>
              </div>

              <div className="find-help-panel-footer"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


