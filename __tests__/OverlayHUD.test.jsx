import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OverlayHUD from '../components/OverlayHUD';
import { LanguageProvider } from '../components/LanguageContext';

function renderOverlay() {
  return render(
    <LanguageProvider>
      <OverlayHUD />
    </LanguageProvider>
  );
}

test('legend toggle opens and closes the legend panel from the original button', async () => {
  const { container } = renderOverlay();

  const legendPanel = container.querySelector(
    '[role="dialog"][aria-label="Legend panel"]'
  );
  expect(legendPanel).toHaveAttribute('aria-hidden', 'true');

  await userEvent.click(screen.getByRole('button', { name: /show legend/i }));
  expect(legendPanel).toHaveAttribute('aria-hidden', 'false');

  await userEvent.click(screen.getByRole('button', { name: /hide legend/i }));
  expect(legendPanel).toHaveAttribute('aria-hidden', 'true');
});

test('info toggle opens and closes the helpful links panel from the original button', async () => {
  const { container } = renderOverlay();

  const linksPanel = container.querySelector(
    '[role="dialog"][aria-label="Helpful links panel"]'
  );
  expect(linksPanel).toHaveAttribute('aria-hidden', 'true');

  await userEvent.click(
    screen.getByRole('button', { name: /show helpful links/i })
  );
  expect(linksPanel).toHaveAttribute('aria-hidden', 'false');

  await userEvent.click(
    screen.getByRole('button', { name: /hide helpful links/i })
  );
  expect(linksPanel).toHaveAttribute('aria-hidden', 'true');
});
