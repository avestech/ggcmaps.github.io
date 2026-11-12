'use client';
import CampusMapView from '../../components/CampusMapView';

export default function CampusLandingPage() {
  return (
    <main role="main" className="campus-viewer">
      <CampusMapView src="/BuildingMaps/(Campus)/Campus.svg" />
    </main>
  );
}
