/**
 * Floor Navigation Utilities - Centralized floor navigation logic
 * Handles floor index calculations, boundary checking, and floor traversal
 */

/**
 * Get the current floor index from a list of floors and a floor ID
 * @param {Array} floors - Array of floor objects
 * @param {string} floorId - The ID of the current floor
 * @returns {number} The index of the floor, or -1 if not found
 */
export const getFloorIndex = (floors = [], floorId) =>
  floors.findIndex(floor => floor.id === floorId);

/**
 * Check if it's possible to navigate to an upper floor
 * @param {Array} floors - Array of floor objects
 * @param {string} currentFloorId - The ID of the current floor
 * @returns {boolean} True if an upper floor exists
 */
export const canGoUp = (floors = [], currentFloorId) => {
  const index = getFloorIndex(floors, currentFloorId);
  return index !== -1 && index < floors.length - 1;
};

/**
 * Check if it's possible to navigate to a lower floor
 * @param {Array} floors - Array of floor objects
 * @param {string} currentFloorId - The ID of the current floor
 * @returns {boolean} True if a lower floor exists
 */
export const canGoDown = (floors = [], currentFloorId) => {
  const index = getFloorIndex(floors, currentFloorId);
  return index > 0;
};

/**
 * Get the next floor (upper floor) from the current floor
 * @param {Array} floors - Array of floor objects
 * @param {string} currentFloorId - The ID of the current floor
 * @returns {Object|null} The next floor object, or null if at top floor
 */
export const getNextFloor = (floors = [], currentFloorId) => {
  const index = getFloorIndex(floors, currentFloorId);
  if (index !== -1 && index < floors.length - 1) {
    return floors[index + 1];
  }
  return null;
};

/**
 * Get the previous floor (lower floor) from the current floor
 * @param {Array} floors - Array of floor objects
 * @param {string} currentFloorId - The ID of the current floor
 * @returns {Object|null} The previous floor object, or null if at bottom floor
 */
export const getPreviousFloor = (floors = [], currentFloorId) => {
  const index = getFloorIndex(floors, currentFloorId);
  if (index > 0) {
    return floors[index - 1];
  }
  return null;
};

/**
 * Get the label for a specific floor
 * @param {Array} floors - Array of floor objects
 * @param {string} floorId - The ID of the floor
 * @returns {string} The floor label, or empty string if not found
 */
export const getFloorLabel = (floors = [], floorId) => {
  const floor = floors.find(f => f.id === floorId);
  return floor?.label || '';
};
