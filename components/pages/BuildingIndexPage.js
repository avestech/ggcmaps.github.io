'use client';
import Link from 'next/link';
import buildings from '../../data/buildings.json';

export default function BuildingIndexPage({ buildingId }) {
  // Find the building data based on the provided buildingId
  const b = buildings.find(x => x.id === buildingId);

  // If the building is not found, display a warning message and a back button
  if (!b) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          Not found: <code>{buildingId}</code>
        </div>
        <Link className="btn btn-secondary" href="/">Back to Campus</Link>
      </div>
    );
  }

  // Render the building details and a list of its floors
  return (
    <div className="container py-4">
      {/* Display the building ID as the title */}
      <h1 className="h5 mb-3">Building {b.id}</h1>

      {/* List of floors in the building */}
      <ul className="list-group">
        {b.floors.map(f => (
          <li
            key={f.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {/* Floor label and ID */}
            {f.label} <span className="text-muted">({f.id})</span>

            {/* Link to open the floor */}
            <Link
              className="btn btn-sm btn-primary"
              href={`/building/${b.id}/${f.id}`}
            >
              Open
            </Link>
          </li>
        ))}
      </ul>

      {/* Back to Campus button */}
      <div className="mt-3">
        <Link href="/" className="btn btn-outline-secondary btn-sm">Back to Campus</Link>
      </div>
    </div>
  );
}


