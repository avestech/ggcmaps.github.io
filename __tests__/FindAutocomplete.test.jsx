import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Find from '../components/Find';

let mockLocale = 'en';
jest.mock('../components/LanguageContext', () => ({ useLanguage: () => ({ locale: mockLocale }) }));

beforeEach(() => {
  mockLocale = 'en';
  useRouter().push.mockClear();
});

test('groups real destinations and selects a building with the mouse', async () => {
  render(<Find />);
  const input = screen.getByRole('combobox');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  await userEvent.type(input, 'b');
  const list = screen.getByRole('listbox');
  for (const name of ['Buildings', 'Places', 'Rooms']) {
    expect(within(list).getByRole('group', { name })).toBeInTheDocument();
  }
  expect(within(list).getAllByRole('option').length).toBeLessThanOrEqual(9);
  await userEvent.click(within(list).getByRole('option', { name: /^Building B / }));
  expect(useRouter().push).toHaveBeenCalledWith('/building/B/L1');
  expect(input).toHaveValue('B');
  expect(input).toHaveAttribute('aria-expanded', 'false');
});

test('partial names submit the best match and duplicate place aliases collapse', async () => {
  render(<Find />);
  const input = screen.getByRole('combobox');
  await userEvent.type(input, 'lib{Enter}');
  expect(useRouter().push).toHaveBeenLastCalledWith('/building/L/L1?room=1000');
  await userEvent.clear(input);
  await userEvent.type(input, 'cc b');
  expect(screen.getAllByRole('option')).toHaveLength(1);
  await userEvent.click(screen.getByRole('option'));
  expect(useRouter().push).toHaveBeenLastCalledWith('/building/CC/L1?room=Basketball_Court');
});

test.each([
  ['belong', 'Belonging Center', '/building/B/L1?room=1000'],
  ['lv', 'LVIS', '/building/E/L2?room=lvis'],
  ['stephens', 'Stephens Family Executive Forum', '/building/W/GL?room=1210'],
])('%s offers the named place and accepts its full name', async (query, label, route) => {
  render(<Find />);
  const input = screen.getByRole('combobox');
  await userEvent.type(input, query);
  const places = screen.getByRole('group', { name: 'Places' });
  await userEvent.click(within(places).getByRole('option', { name: new RegExp(`^${label} `) }));
  expect(useRouter().push).toHaveBeenLastCalledWith(route);

  useRouter().push.mockClear();
  await userEvent.clear(input);
  await userEvent.type(input, label);
  expect(input).toHaveValue(label);
  await userEvent.keyboard('{Enter}');
  expect(useRouter().push).toHaveBeenCalledWith(route);
});

test.each([
  ['w116', '/building/W/GL?room=1160', /Ground Level/],
  ['cc1301a', '/building/CC/L3?room=1301A', /Level 3/],
  [' B 2200 ', '/building/B/L2?room=2200', /Level 2/],
])('keyboard selection of %s uses the displayed floor', async (query, route, floor) => {
  render(<Find />);
  const input = screen.getByRole('combobox');
  await userEvent.type(input, query);
  await userEvent.keyboard('{ArrowDown}');
  const selected = screen.getByRole('option', { selected: true });
  expect(selected).toHaveTextContent(floor);
  expect(input).toHaveAttribute('aria-activedescendant', selected.id);
  await userEvent.keyboard('{Enter}');
  expect(useRouter().push).toHaveBeenLastCalledWith(route);
});

test('clicking the search bar, Tab, clearing, and outside clicks dismiss without navigation', async () => {
  render(<Find />);
  const input = screen.getByRole('combobox');
  await userEvent.type(input, 'b{ArrowDown}');
  await userEvent.click(input);
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(input).not.toHaveAttribute('aria-activedescendant');
  await userEvent.keyboard('{ArrowUp}');
  const options = screen.getAllByRole('option');
  expect(options[options.length - 1]).toHaveAttribute('aria-selected', 'true');
  await userEvent.tab();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  await userEvent.click(input);
  await userEvent.keyboard('a');
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  await userEvent.click(document.body);
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  await userEvent.clear(input);
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  await userEvent.type(input, 'lib');
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  await userEvent.clear(input);
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(useRouter().push).not.toHaveBeenCalled();
});

test('unmatched text gives feedback and composing Enter does not navigate', async () => {
  render(<Find />);
  const input = screen.getByRole('combobox');
  await userEvent.type(input, 'zz999');
  expect(screen.getByRole('status')).toHaveTextContent('No matching suggestions');
  await userEvent.clear(input);
  await userEvent.type(input, 'lib');
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  expect(useRouter().push).not.toHaveBeenCalled();
});

test('touch selects a suggestion and the clear button closes the dropdown', async () => {
  render(<Find />);
  const input = screen.getByRole('combobox');
  await userEvent.type(input, 'lib');
  const library = within(screen.getByRole('group', { name: 'Places' })).getByRole('option');
  await userEvent.pointer([{ keys: '[TouchA>]', target: library }, { keys: '[/TouchA]', target: library }]);
  expect(useRouter().push).toHaveBeenLastCalledWith('/building/L/L1?room=1000');
  await userEvent.clear(input);
  await userEvent.type(input, 'b');
  await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(input).toHaveValue('');
  expect(input).toHaveFocus();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  expect(screen.queryByText(/Esc to close|Enter to choose/)).not.toBeInTheDocument();
});

test('Spanish suggestions use translated groups, aliases, and floor details', async () => {
  mockLocale = 'es';
  render(<Find />);
  await userEvent.type(screen.getByRole('combobox'), 'bibli');
  const places = screen.getByRole('group', { name: 'Lugares' });
  const library = within(places).getByRole('option', { name: /Biblioteca Edificio L · Nivel 1/ });
  await userEvent.click(library);
  expect(useRouter().push).toHaveBeenLastCalledWith('/building/L/L1?room=1000');
});
