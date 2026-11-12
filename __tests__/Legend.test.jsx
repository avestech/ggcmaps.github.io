import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Legend from '../components/legend';
import { LanguageProvider } from '../components/LanguageContext';

beforeEach(() => {
  window.localStorage.clear();
});

test('legend renders English labels by default', () => {
  render(
    <LanguageProvider>
      <Legend />
    </LanguageProvider>
  );
  expect(screen.getByText(/^legend$/i)).toBeInTheDocument();
  expect(screen.getByText(/academic building/i)).toBeInTheDocument();
});

test('legend respects Spanish locale from provider', () => {
  render(
    <LanguageProvider defaultLocale="es">
      <Legend />
    </LanguageProvider>
  );
  expect(screen.getByText(/leyenda/i)).toBeInTheDocument();
  expect(screen.getByText(/edificio acad/i)).toBeInTheDocument();
});

test('hover dispatches custom events', async () => {
  const spy = jest.spyOn(window, 'dispatchEvent');
  render(
    <LanguageProvider>
      <Legend />
    </LanguageProvider>
  );
  const academicRow = screen.getByText(/academic building|edificio acad/i).closest('li');
  await userEvent.hover(academicRow);
  expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: 'ggcmap-hover' }));
  await userEvent.unhover(academicRow);
  expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: 'ggcmap-hover-clear' }));
});
