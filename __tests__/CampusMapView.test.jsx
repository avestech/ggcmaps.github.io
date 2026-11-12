/**
 * Tests:
 * - Campus SVG loads
 * - Click on academic building navigates to /building/[id]
 * - Click on student housing shows “not available” error popup
 */

import React from 'react';

// ---- Stable Next.js router mock ----
var mockPush; // use var to avoid temporal dead zone
jest.mock('next/navigation', () => {
  const actual = jest.requireActual('next/navigation');
  mockPush = jest.fn();
  return {
    ...actual,
    useRouter: () => ({ push: mockPush }),
  };
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampusMapView from '../components/CampusMapView';
import { LanguageProvider } from '../components/LanguageContext';

beforeEach(() => {
  mockPush.mockClear();

  const svg = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" data-map-anchor>
      <g id="B" class="building-group">
        <rect class="building" x="10" y="10" width="30" height="30" />
        <text x="25" y="25">B</text>
      </g>
      <g id="1000" class="building-group student-housing">
        <rect class="building" x="60" y="10" width="30" height="30" />
        <text x="75" y="25">Housing</text>
      </g>
    </svg>
  `;

  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, text: () => Promise.resolve(svg) })
  );
});

afterEach(() => {
  delete global.fetch;
});

const renderWithProvider = (ui) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

test('loads campus SVG and clicking academic building navigates', async () => {
  renderWithProvider(<CampusMapView />);
  await waitFor(() => expect(document.querySelector('svg')).toBeInTheDocument());

  const buildingBGroup = document.querySelector('g#B.building-group');
  expect(buildingBGroup).toBeTruthy();
  await userEvent.click(buildingBGroup);

  expect(mockPush).toHaveBeenCalledWith('/building/B');
});

test('clicking student housing shows error popup (blocked)', async () => {
  renderWithProvider(<CampusMapView />);
  await waitFor(() => expect(document.querySelector('svg')).toBeInTheDocument());

  const housingRect = document.querySelector('g.student-housing .building');
  expect(housingRect).toBeTruthy();

  await userEvent.click(housingRect);
  expect(mockPush).not.toHaveBeenCalled();

  expect(screen.getByText(/student housing layouts/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /ok/i }));
  expect(screen.queryByText(/student housing layouts/i)).not.toBeInTheDocument();
});

test('clicking building shape (not group) navigates correctly', async () => {
  renderWithProvider(<CampusMapView />);
  await waitFor(() => expect(document.querySelector('svg')).toBeInTheDocument());

  // Click directly on the .building element (the rect), not the group
  const buildingRect = document.querySelector('g#B .building');
  expect(buildingRect).toBeTruthy();
  
  await userEvent.click(buildingRect);
  expect(mockPush).toHaveBeenCalledWith('/building/B');
});
