// Script to extract room data from SVG files and compile unique building-room IDs
const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

// Define the source and destination paths
const SVG_DIRECTORY = path.join(process.cwd(), 'public', 'BuildingMaps');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'rooms.json');

// Recursively finds all SVG files in a given directory
async function getSvgFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getSvgFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files).filter((file) => file.endsWith('.svg'));
}

// Helper function to extract building from relative path
function getBuildingSegment(relativePath) {
  const parts = relativePath.split(/[\\/]/).filter(Boolean);
  const building = parts[0] || 'UNKNOWN';
  return building.replace(/\s+/g, '').replace(/[^A-Za-z0-9()_-]/g, '');
}

// Scan SVGs and extract a Set of unique IDs (BUILDING-originalRoomId)
async function scanUniqueRoomIds() {
  const svgFiles = await getSvgFiles(SVG_DIRECTORY);
  const uniqueIds = new Set();

  for (const file of svgFiles) {
    const svgContent = await fs.readFile(file, 'utf8');
    const $ = cheerio.load(svgContent, { xmlMode: true });

    const relativePath = path.relative(SVG_DIRECTORY, file);
    const buildingSegment = getBuildingSegment(relativePath);

    $('.room-group').each((_, element) => {
      const group = $(element);
      const originalRoomId = group.attr('id');
      const shapeElement = group.find('.room');
      if (!originalRoomId || shapeElement.length === 0) return;

      // Unique ID generated from building and room ID
      const uniqueId = `${buildingSegment}-${originalRoomId}`.toUpperCase();
      uniqueIds.add(uniqueId);
    });
  }
  return uniqueIds;
}

// Load existing rooms.json to ensure no duplicates and to remove deleted rooms
async function loadExistingIds() {
  try {
    const raw = await fs.readFile(OUTPUT_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    
    if (Array.isArray(parsed)) {
      return parsed.filter(v => typeof v === 'string');
    }
    
    return [];
  } catch {
    return [];
  }
}

// Writes unique IDs to rooms.json if they are new and removes deleted ones
async function writeUniqueIds(idsSet) {
  const sorted = Array.from(idsSet).sort();
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(sorted, null, 2));
  return sorted;
}

// Updates old rooms.json with new unique IDs and removes deleted ones
async function updateRoomsJson() {
  console.log('Scanning SVG files for room IDs (building-room only)...');
  const scannedSet = await scanUniqueRoomIds();
  const before = await loadExistingIds();
  const beforeSet = new Set(before);

  // Determine number of added and removed IDs
  const newIds = Array.from(scannedSet).filter(id => !beforeSet.has(id));
  const removedIds = before.filter(id => !scannedSet.has(id));

  const finalList = await writeUniqueIds(scannedSet);

  console.log(`Rooms total: ${finalList.length}`);
  console.log(`Added: ${newIds.length} | Removed: ${removedIds.length}`);
  return {
    total: finalList.length,
    added: newIds,
    removed: removedIds
  };
}

async function extractAllRoomData() {
  return updateRoomsJson();
}

// Export functions for usage in other components of project
module.exports = {
  getSvgFiles,
  scanUniqueRoomIds,
  updateRoomsJson,
  extractAllRoomData
};

// Used when running this script directly
if (require.main === module) {
  updateRoomsJson()
    .then(res => {
      console.log('Update summary:', res);
    })
    .catch(err => {
      console.error('Error updating rooms.json:', err);
      process.exit(1);
    });
}