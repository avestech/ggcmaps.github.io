import React from 'react';
import fs from 'fs';
import path from 'path';
import { fireEvent, render, waitFor } from '@testing-library/react';
import FloorViewerPage from '../components/pages/FloorViewerPage';
import { getBuildingById, generateBuildingFloorStaticParams } from '../lib/campus';

let mockRoom;
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/building/CC/L1',
  useSearchParams: () => new URLSearchParams({ room: mockRoom }),
}));

test.each([
  ['L1', '1138', 'Basketball_Court', 'layer6'],
  ['L2', '1252', 'Event_Space', 'layer2'],
  ['L3', '1301A', '1322', 'layer2'],
])('%s loads the real CC map, highlights rooms, and ignores the background', async (floorId, roomId, areaId, outlineId) => {
  mockRoom = roomId;
  const floor = getBuildingById('CC').floors.find(f => f.id === floorId);
  const svg = fs.readFileSync(path.join(process.cwd(), 'public', floor.file), 'utf8');
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => svg });
  expect(generateBuildingFloorStaticParams()).toContainEqual({ buildingId: 'CC', floorId });
  render(<FloorViewerPage buildingId="CC" floorId={floorId} />);
  await waitFor(() => expect(document.querySelector(`g[id="${roomId}"] .room`)).toHaveClass('active-room'));
  const room = document.querySelector(`g[id="${roomId}"] .room`);
  const area = document.querySelector(`g[id="${areaId}"]`);
  expect(room.style.fill).toBe('');
  for (const target of [area.querySelector('.room'), area.querySelector('tspan')]) {
    fireEvent.click(target);
    expect(area.querySelector('.room')).toHaveClass('active-room');
    expect(area.querySelector('.label')).toHaveClass('label--active');
    expect(room).not.toHaveClass('active-room');
    fireEvent.click(room);
    expect(room).toHaveClass('active-room');
  }
  fireEvent.click(document.getElementById(outlineId).querySelector('path'));
  expect(room).toHaveClass('active-room');
  expect(document.getElementById(outlineId)).not.toHaveClass('active-room');
  expect(global.fetch).toHaveBeenCalledWith(floor.file, expect.anything());
  const labels = document.querySelector('g[inkscape\\:label="Labels"]');
  expect(labels.querySelectorAll('g[aria-label="Service elevator"]')).toHaveLength(1);
  expect(labels.textContent).not.toContain('Restricted');
});
