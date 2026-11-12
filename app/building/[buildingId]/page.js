import BuildingIndexPage from '../../../components/pages/BuildingIndexPage';
import buildings from '../../../data/buildings.json';
import { redirect } from 'next/navigation';
import { getBuildingById } from '../../../lib/campus';

// Generate static parameters for all buildings
export function generateStaticParams() {
  return buildings.map(b => ({ buildingId: b.id })); // Return an array of building IDs
}

// Main page component for displaying building data
export default function Page({ params }) {
  const buildingData = getBuildingById(params.buildingId); // Fetch building data by ID
  
  if (!buildingData || !buildingData.floors.length) {
    redirect('/'); // Redirect to home if building not found
  }
  
  // Get the first floor ID
  const firstFloorId = buildingData.floors[0].id;
  
  // Redirect to the first floor
  redirect(`/building/${params.buildingId}/${firstFloorId}`);
}
