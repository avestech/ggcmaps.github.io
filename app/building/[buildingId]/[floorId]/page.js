import FloorViewerPage from '../../../../components/pages/FloorViewerPage';
import { generateBuildingFloorStaticParams } from '../../../../lib/campus';

// Generate static parameters for building and floor pages during build time
export function generateStaticParams() {
  return generateBuildingFloorStaticParams();
}

export default function Page({ params }) {
  // Render the FloorViewerPage component with the buildingId and floorId from the dynamic route parameters
  return <FloorViewerPage buildingId={params.buildingId} floorId={params.floorId} />;
}
