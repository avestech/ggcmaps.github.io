import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ZoomPan from '../components/ZoomPan';

function setup(props = {}) {
  const onSelect = jest.fn();
  const { container } = render(
    <ZoomPan {...props}>
      <div data-testid="room" onClick={onSelect}>Room</div>
    </ZoomPan>
  );
  const viewport = container.firstChild;
  viewport.getBoundingClientRect = () => ({ left: 20, top: 30, width: 400, height: 400 });
  viewport.setPointerCapture = jest.fn();
  viewport.releasePointerCapture = jest.fn();
  const pointer = (type, id, x, y, target = viewport, pointerType = 'touch') => {
    // jsdom has no PointerEvent constructor; supply the native pointer fields.
    const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 });
    Object.defineProperties(event, {
      pointerId: { value: id }, pointerType: { value: pointerType }
    });
    fireEvent(target, event);
  };
  const view = () => {
    const values = container.querySelector('.zoompan-stage').style.transform.match(/-?\d+(?:\.\d+)?/g).map(Number);
    return { scale: values[0], x: values[1], y: values[2] };
  };
  const start = () => {
    pointer('pointerdown', 1, 120, 130);
    pointer('pointerdown', 2, 220, 130);
  };
  return { pointer, view, start, viewport, onSelect };
}

test('pinch zoom anchors the map under the finger midpoint and supports two-finger panning', () => {
  const { pointer, view, start, viewport } = setup();
  start();
  pointer('pointermove', 2, 320, 130);
  expect(view()).toEqual({ scale: 2, x: -50, y: -50 });
  expect(viewport.setPointerCapture).toHaveBeenCalledWith(1);
  expect(viewport.setPointerCapture).toHaveBeenCalledWith(2);
  // Translate both fingers without changing their final separation.
  pointer('pointermove', 1, 160, 150);
  pointer('pointermove', 2, 360, 150);
  expect(view()).toEqual({ scale: 2, x: -30, y: -40 });
  pointer('pointermove', 2, 210, 150);
  expect(view().scale).toBe(0.5);
});

test('pinch respects scale limits and handles initially coincident fingers', () => {
  const { pointer, view, start } = setup({ minScale: 0.5, maxScale: 2 });
  start();
  pointer('pointermove', 2, 1120, 130);
  expect(view().scale).toBe(2);
  pointer('pointermove', 2, 121, 130);
  expect(view().scale).toBe(0.5);
  pointer('pointerup', 2, 121, 130);
  pointer('pointerup', 1, 120, 130);
  pointer('pointerdown', 3, 120, 130);
  pointer('pointerdown', 4, 120, 130);
  pointer('pointermove', 4, 220, 130);
  pointer('pointermove', 4, 320, 130);
  expect(view().scale).toBe(1);
  expect(Object.values(view()).every(Number.isFinite)).toBe(true);
});

test('lifting one finger continues panning smoothly and suppresses accidental room clicks', () => {
  const { pointer, view, start, onSelect } = setup();
  start();
  pointer('pointermove', 2, 320, 130);
  pointer('pointerup', 2, 320, 130);
  pointer('pointermove', 1, 160, 150);
  expect(view()).toEqual({ scale: 2, x: -30, y: -40 });
  pointer('pointerup', 1, 160, 150);
  fireEvent.click(screen.getByTestId('room'));
  expect(onSelect).not.toHaveBeenCalled();
  // A fresh, intentional tap must still select a room.
  pointer('pointerdown', 3, 160, 150);
  pointer('pointerup', 3, 160, 150);
  fireEvent.click(screen.getByTestId('room'));
  expect(onSelect).toHaveBeenCalledTimes(1);
});

test.each(['pointercancel', 'lostpointercapture'])('%s clears gesture state for the next interaction', type => {
  const { pointer, view, start } = setup();
  start();
  pointer('pointermove', 2, 320, 130);
  pointer(type, 2, 320, 130);
  pointer(type, 1, 120, 130);
  const stopped = view();
  pointer('pointermove', 2, 500, 130);
  expect(view()).toEqual(stopped);
  pointer('pointerdown', 3, 100, 100);
  pointer('pointermove', 3, 120, 100);
  expect(view().x).toBe(stopped.x + 10);
});

test('zoom controls work immediately after a pinch even if no synthetic click was fired', () => {
  const { pointer, view, start } = setup();
  start();
  pointer('pointermove', 2, 320, 130);
  pointer('pointerup', 2, 320, 130);
  pointer('pointerup', 1, 120, 130);
  fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
  expect(view().scale).toBeCloseTo(2 / 1.15);
});

test('an extra finger and capture transfer from a room do not break the pinch', () => {
  const { pointer, view, start } = setup();
  start();
  pointer('lostpointercapture', 1, 120, 130, screen.getByTestId('room'));
  pointer('pointerdown', 3, 420, 130);
  pointer('pointermove', 2, 320, 130);
  expect(view().scale).toBe(2);
  pointer('pointerup', 1, 120, 130);
  pointer('pointermove', 3, 470, 130);
  expect(view().scale).toBe(3);
});

test('single-pointer drag, wheel, zoom buttons, and reset remain usable', () => {
  const { pointer, view, viewport, onSelect } = setup();
  pointer('pointerdown', 1, 100, 100, viewport, 'mouse');
  pointer('pointermove', 1, 130, 120, viewport, 'mouse');
  pointer('pointerup', 1, 130, 120, viewport, 'mouse');
  expect(view()).toEqual({ scale: 1, x: 30, y: 20 });
  fireEvent.click(screen.getByTestId('room'));
  expect(onSelect).not.toHaveBeenCalled();
  fireEvent.wheel(viewport, { deltaY: -100, clientX: 200, clientY: 200 });
  expect(view().scale).toBeGreaterThan(1);
  const zoomButton = screen.getByRole('button', { name: 'Zoom in' });
  pointer('pointerdown', 2, 300, 300, zoomButton);
  pointer('pointermove', 2, 330, 300, zoomButton);
  pointer('pointerup', 2, 330, 300, zoomButton);
  const beforeButton = view().scale;
  fireEvent.click(zoomButton);
  expect(view().scale).toBeCloseTo(beforeButton * 1.15);
  fireEvent.click(screen.getByRole('button', { name: 'Reset view' }));
  expect(view()).toEqual({ scale: 1, x: 0, y: 0 });
});
