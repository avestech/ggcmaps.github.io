'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
import FloorMapView from '../FloorMapView';
import RoomSharePopup from '../RoomSharePopup';
import { getBuildingById } from '../../lib/campus';
import { useLanguage } from '../LanguageContext';
import { getUIText, translateBuildingName, translateFloorLabel } from '../../lib/i18n';

// Inner component that uses useSearchParams
function FloorViewerContent({ buildingId, floorId, locale }) {
  const router = useRouter(); // Router for navigation
  const searchParams = useSearchParams(); // Get URL search parameters
  const buildingData = getBuildingById(buildingId); // Fetch building data
  const floors = buildingData?.floors || []; // Get floors or default to empty array
  const currentFloorIndex = floors.findIndex(floor => floor.id === floorId); // Find current floor index
  const currentFloor = floors[currentFloorIndex]; // Get current floor data
  const roomToHighlight = searchParams.get('room'); // Get room from query params
  const ui = getUIText(locale);
  const [sharedRoom, setSharedRoom] = useState(null);
  const closeShare = useCallback(() => setSharedRoom(null), []);

  useEffect(() => {
    setSharedRoom(null);
  }, [buildingId, floorId]);

  useEffect(() => {
    setSharedRoom(current => current?.roomId === roomToHighlight ? current : null);
  }, [roomToHighlight]);

  useEffect(() => {
    window.addEventListener('popstate', closeShare);
    return () => window.removeEventListener('popstate', closeShare);
  }, [closeShare]);

  // Preserve the current path (including the deployment base path) and other parameters.
  const handleRoomSelect = useCallback((roomId) => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('room') !== roomId) {
      url.searchParams.set('room', roomId);
      // Next.js syncs native history updates with useSearchParams without reloading the map.
      window.history.pushState(null, '', url);
    }
    setSharedRoom({ roomId, url: url.href });
  }, []);
  if (!buildingData || !currentFloor) {
    return <div>{ui.general.notFound}</div>; // Display message if floor not found
  }

  return (
    <main role="main" className="floor-viewer">
      <FloorMapView 
        src={currentFloor.file}
        buildingData={buildingData}
        currentFloorId={floorId}
        onFloorChange={(newFloorId) => {
          router.push(`/building/${buildingId}/${newFloorId}`);
        }}
        onRoomSelect={handleRoomSelect}
        roomToHighlight={roomToHighlight}
      />
      {sharedRoom && (
        <RoomSharePopup
          key={sharedRoom.url}
          url={sharedRoom.url}
          roomLabel={`${translateBuildingName(buildingData.name, locale)} · ${translateFloorLabel(currentFloor.label, locale)} · ${sharedRoom.roomId.replaceAll('_', ' ')}`}
          copy={ui.roomShare}
          onClose={closeShare}
        />
      )}
    </main>
  );
}

// Outer component that wraps with Suspense
export default function FloorViewerPage({ buildingId, floorId }) {
  const { locale } = useLanguage();
  const ui = getUIText(locale);
  return (
    <Suspense fallback={<div>{ui.general.loading}</div>}>
      <FloorViewerContent buildingId={buildingId} floorId={floorId} locale={locale} />
    </Suspense>
  );
}
