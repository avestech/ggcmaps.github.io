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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Find from '../components/Find';

beforeEach(() => {
  mockPush.mockClear();
});

async function typeAndFind(value) {
  const input = screen.getByPlaceholderText(/aec, gameroom, library/i);
  const btn = screen.getByRole('button', { name: /find/i });
  await userEvent.clear(input);
  await userEvent.type(input, value);
  await userEvent.click(btn);
}

test('empty search shows validation', async () => {
  render(<Find />);
  await userEvent.click(screen.getByRole('button', { name: /find/i }));
  expect(screen.getByText(/you must enter a search term/i)).toBeInTheDocument();
});

test('building search "b" routes to building B L1', async () => {
  render(<Find />);
  await typeAndFind('b');
  expect(mockPush).toHaveBeenCalledWith('/building/B/L1');
});

test('floor search "b2" routes to /building/B/L2', async () => {
  render(<Find />);
  await typeAndFind('b2');
  expect(mockPush).toHaveBeenCalledWith('/building/B/L2');
});

test('alias "aec" routes to W/GL with room=1160', async () => {
  render(<Find />);
  await typeAndFind('aec');
  expect(mockPush).toHaveBeenCalledWith('/building/W/GL?room=1160');
});

test('W room searches route to the floor file that contains the room', async () => {
  render(<Find />);

  await typeAndFind('w1160');
  expect(mockPush).toHaveBeenLastCalledWith('/building/W/GL?room=1160');

  await typeAndFind('w2110');
  expect(mockPush).toHaveBeenLastCalledWith('/building/W/L1?room=2110');

  await typeAndFind('w3110');
  expect(mockPush).toHaveBeenLastCalledWith('/building/W/L2?room=3110');
});

test('invalid search shows "<term> is not valid"', async () => {
  render(<Find />);
  await typeAndFind('zz999');
  expect(screen.getByText(/zz999 is not valid/i)).toBeInTheDocument();
});
