/**
 * Application Constants - Centralized configuration values
 */

/**
 * Restricted building IDs that are not publicly accessible
 * Includes student housing and other restricted areas
 */
export const RESTRICTED_BUILDING_IDS = [
  '1000', '2000', '3000', 'B1000', '2', '3',
  'BUILDING_1000', 'BUILDING_2000', 'BUILDING_3000'
];

/**
 * Hover selectors for restricted buildings
 * Maps building IDs to CSS selectors for hover highlighting
 */
export const RESTRICTED_HOVER_SELECTORS = {
  '1000': '#BUILDING_1000, [id="1000"], [id="b1000"]',
  '2000': '#BUILDING_2000, [id="2000"], [id="2"]',
  '3000': '#BUILDING_3000, [id="3000"], [id="3"]',
};

/**
 * Check if a building ID is restricted
 * @param {string|number} id - The building ID to check
 * @returns {boolean} True if the building is restricted
 */
export const isRestrictedBuilding = (id) =>
  RESTRICTED_BUILDING_IDS.includes(String(id).toUpperCase());

/**
 * Error message for restricted building access
 */
export const RESTRICTION_ERROR_MESSAGE = 
  'Student housing layouts are not available to the public.';
