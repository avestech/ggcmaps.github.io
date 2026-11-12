/**
 * Search Utilities - Centralized search and validation logic
 * Handles room searching, input validation, and floor/building parsing
 */

/**
 * Search for a room by query string in the rooms database
 * Tries exact match first, then building+room number combination
 * @param {string} query - The search query (trimmed and lowercased)
 * @param {Array} rooms - Array of room objects with uniqueId property
 * @returns {Object|null} The matched room object, or null if not found
 */
export const searchForRoom = (query, rooms) => {
  const lower = query.toLowerCase().trim();

  // Normalize each room to always have a string ID
  const getId = room => 
    typeof room === "string" ? room : room.uniqueId || "";

  // Try exact match
  let match = rooms.find(room => getId(room).toLowerCase() === lower);

  if (!match) {
    // Try building + room number (e.g., "b2210" -> "B-2210")
    match = rooms.find(room => {
      const id = getId(room);
      const [building, roomNumber] = id.split("-");
      if (!building || !roomNumber) return false;
      return (building.toLowerCase() + roomNumber.toLowerCase()) === lower;
    });
  }

  return match || null;
};


/**
 * Validate that a search input is not empty
 * @param {string} input - The user input to validate
 * @returns {boolean} True if input is valid (non-empty string)
 */
export const validateSearchInput = (input) => {
  if (!input || typeof input !== 'string') return false;
  return input.trim().length > 0;
};

/**
 * Parse floor input (e.g., "b2" -> {building: "B", floor: "2"})
 * @param {string} input - The user input (should be letter + digit)
 * @returns {Object|null} Object with building and floor, or null if invalid
 */
export const parseFloorInput = (input) => {
  const match = String(input).toLowerCase().match(/^([a-z]+)(\d)$/);
  if (!match) return null;
  return { building: match[1].toUpperCase(), floor: match[2] };
};

/**
 * Format error message for room not found
 * @param {string} query - The original search query
 * @returns {string} Formatted error message
 */
export const formatNotFoundError = (query) => {
  const normalized = typeof query === 'string' ? query.trim() : query;
  return `${normalized} is not valid`;
};

/**
 * Format error message for invalid format
 * @returns {string} Formatted error message
 */
export const formatInvalidFormatError = () => 'Invalid room format.';

const ROOM_FLOOR_ID_OVERRIDES = {
  CC: {
    1: "L1",
    2: "L2",
    3: "L3",
  },
  W: {
    1: "GL",
    2: "L1",
    3: "L2",
  },
};

export const resolveRoomLevelId = ({ building, floor, roomNumber }) => {
  const buildingKey = String(building || "").toUpperCase();
  // CC uses the second digit: 11xx, 12xx, and 13xx for Levels 1–3.
  const roomFloorDigit = String(roomNumber || "")[buildingKey === "CC" ? 1 : 0];
  const override = ROOM_FLOOR_ID_OVERRIDES[buildingKey]?.[roomFloorDigit];

  if (override) return override;
  if (!Number.isFinite(floor)) return null;

  return `L${floor}`;
};

/**
 * Get query type and format for navigation
 * Returns the navigation path info for a given search result
 * @param {Object} room - The room object found
 * @returns {Object|null} Object with building, floor, and room info, or null
 */
export const extractRoomNavInfo = (room) => {
  const getId = (r) => (typeof r === "string" ? r : (r?.uniqueId || r?.id || "")).trim();
  const id = getId(room);
  if (!id) return null;

  // Try formats like: "A-1001" or "A1001"
  let m = id.match(/^([A-Za-z]+)[-\s]?(\d{3,5}[A-Za-z]?)$/);
  if (m) {
    const building = m[1].toUpperCase();
    const roomNumber = m[2];                // "1001"
    const floor = parseInt(roomNumber[0], 10); // 1 from "1001"
    return { building, floor, roomNumber };
  }

  // Try formats like: "A-1-001" or "A-01-001"
  m = id.match(/^([A-Za-z]+)[-\s]+(\d+)[-\s]+(\d{2,4})$/);
  if (m) {
    const building = m[1].toUpperCase();
    const floor = parseInt(m[2], 10);
    const roomNumber = `${m[2]}${m[3]}`;    // "1" + "001" -> "1001"
    return { building, floor, roomNumber };
  }

  return null; // Unknown format
};

