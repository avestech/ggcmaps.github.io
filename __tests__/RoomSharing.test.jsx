import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import FloorViewerPage from '../components/pages/FloorViewerPage';
import { LanguageProvider } from '../components/LanguageContext';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => globalThis.window.location.pathname,
  useSearchParams: () => new URLSearchParams(globalThis.window.location.search),
}));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <g id="1301A" class="room-group"><rect class="room"/><text class="label">1301A</text></g>
  <g id="Room &amp; Annex" class="room-group"><rect class="room"/><text class="label">Annex</text></g>
  <path id="background"/>
</svg>`;
const page = <FloorViewerPage buildingId="CC" floorId="L3" />;
const room = id => document.getElementById(id);

beforeEach(() => {
  window.history.replaceState(null, '', '/building/CC/L3?view=map#floor');
  global.fetch = jest.fn().mockResolvedValue({ ok: true, text: async () => svg });
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true, value: { writeText: jest.fn().mockResolvedValue(undefined) }
  });
});

test('room clicks produce copyable URLs, preserve the map view, and avoid duplicate history entries', async () => {
  const { rerender } = render(page);
  await waitFor(() => expect(room('1301A')).toBeInTheDocument());
  fireEvent.click(document.querySelector('[aria-label="Zoom in"]'));
  const transform = document.querySelector('.zoompan-stage').style.transform;
  const historyLength = window.history.length;

  fireEvent.click(room('1301A').querySelector('.label'));
  const originalRoom = room('1301A');
  rerender(<FloorViewerPage buildingId="CC" floorId="L3" />);
  expect(room('1301A')).toBe(originalRoom);
  expect(window.location.pathname).toBe('/building/CC/L3');
  expect(new URLSearchParams(window.location.search).get('view')).toBe('map');
  expect(new URLSearchParams(window.location.search).get('room')).toBe('1301A');
  expect(window.location.hash).toBe('#floor');
  expect(room('1301A').querySelector('.room')).toHaveClass('active-room');
  expect(document.querySelector('.zoompan-stage').style.transform).toBe(transform);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(window.history.length).toBe(historyLength + 1);
  fireEvent.click(room('1301A'));
  expect(window.history.length).toBe(historyLength + 1);

  fireEvent.click(room('Room & Annex').querySelector('.room'));
  expect(new URLSearchParams(window.location.search).get('room')).toBe('Room & Annex');
  expect(room('1301A').querySelector('.label')).not.toHaveClass('label--active');
  expect(room('Room & Annex')).toHaveAttribute('aria-selected', 'true');
  fireEvent.click(room('background'));
  expect(new URLSearchParams(window.location.search).get('room')).toBe('Room & Annex');
});

test('room popup copies the full URL, updates for another room, and can reopen for the same room', async () => {
  render(page);
  await waitFor(() => expect(room('1301A')).toBeInTheDocument());
  fireEvent.click(room('1301A'));
  expect(screen.getByRole('dialog', { name: 'Share this room' })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Room link' })).toHaveValue(window.location.href);
  fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
  await screen.findByText('Link copied!');
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
  fireEvent.click(room('Room & Annex'));
  expect(screen.queryByText('Link copied!')).not.toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'Room link' })).toHaveValue(window.location.href);
  fireEvent.click(screen.getByRole('button', { name: 'Close share popup' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(room('Room & Annex')).toHaveClass('active-room');
  const historyLength = window.history.length;
  fireEvent.click(room('Room & Annex'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(window.history.length).toBe(historyLength);
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test.each(['missing', 'rejected'])('offers manual copying when clipboard access is %s', async failure => {
  if (failure === 'missing') Object.defineProperty(navigator, 'clipboard', { value: undefined });
  else navigator.clipboard.writeText.mockRejectedValue(new Error('Permission denied'));
  render(page);
  await waitFor(() => expect(room('1301A')).toBeInTheDocument());
  fireEvent.click(room('1301A'));
  fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
  await screen.findByText('Select and copy the link above to share it.');
  const input = screen.getByRole('textbox', { name: 'Room link' });
  expect(input).toHaveFocus();
  expect(input.selectionStart).toBe(0);
  expect(input.selectionEnd).toBe(input.value.length);
  expect(screen.queryByText('Link copied!')).not.toBeInTheDocument();
});

test('dismisses stale sharing popups on history or floor navigation', async () => {
  const { rerender } = render(page);
  await waitFor(() => expect(room('1301A')).toBeInTheDocument());
  fireEvent.click(room('1301A'));
  fireEvent.popState(window);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  fireEvent.click(room('1301A'));
  rerender(<FloorViewerPage buildingId="CC" floorId="L2" />);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('sharing popup follows the selected language', async () => {
  render(<LanguageProvider defaultLocale="es">{page}</LanguageProvider>);
  await waitFor(() => expect(room('1301A')).toBeInTheDocument());
  fireEvent.click(room('1301A'));
  expect(screen.getByRole('dialog', { name: 'Compartir esta sala' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Copiar enlace' })).toBeInTheDocument();
});

test('opening a shared URL highlights the room even when the SVG arrives later', async () => {
  window.history.replaceState(null, '', '/building/CC/L3?room=1301A');
  let finishLoading;
  global.fetch = jest.fn().mockReturnValue(new Promise(resolve => { finishLoading = resolve; }));
  render(page);
  expect(room('1301A')).not.toBeInTheDocument();
  await act(async () => { finishLoading({ ok: true, text: async () => svg }); });
  expect(room('1301A')).toHaveAttribute('aria-selected', 'true');
  expect(room('1301A').querySelector('.label')).toHaveClass('label--active');
});

test('URL changes restore or clear highlights and tolerate invalid room values', async () => {
  window.history.replaceState(null, '', '/building/CC/L3?room=1301A');
  const { rerender } = render(page);
  await waitFor(() => expect(room('1301A')).toHaveClass('active-room'));
  // Rerender models the search-parameter update supplied by the Next.js router.
  for (const id of ['Room & Annex', null, '\"]invalid[']) {
    const url = new URL(window.location.href);
    if (id === null) url.searchParams.delete('room');
    else url.searchParams.set('room', id);
    window.history.replaceState(null, '', url);
    rerender(<FloorViewerPage buildingId="CC" floorId="L3" />);
    expect(room('1301A')).not.toHaveClass('active-room');
    expect(room('1301A').querySelector('.label')).not.toHaveClass('label--active');
    if (id === 'Room & Annex') expect(room(id)).toHaveClass('active-room');
    else expect(document.querySelector('.active-room, .label--active')).toBeNull();
  }
});
