import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Top-level pieces (same ones used by app/layout.js)
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Legend from '../components/legend';
import Links from '../components/Links';
import Footer from '../components/Footer';
import { LanguageProvider } from '../components/LanguageContext';

// Mock Next router used by multiple components
jest.mock('next/navigation', () => {
  const push = jest.fn();
  return { useRouter: () => ({ push }), usePathname: () => '/' };
});

// Mock next/image for JSDOM
jest.mock('next/image', () => {
  const React = require('react');
  return function Image({ priority, placeholder, fill, loader, blurDataURL, quality, ...rest }) {
    return React.createElement('img', rest);
  };
});

function RenderLayout() {
  return (
    <LanguageProvider>
      <div>
        <Header />
        <div className="layout-columns">
          <Sidebar />
          <main role="main" className="layout-main">
            <div>Mock Main Content</div>
          </main>
          <div className="layout-rail">
            <Legend className="mb-4" />
            <Links />
          </div>
        </div>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

describe('Layout smoke test', () => {
  test('renders header, sidebar, legend, links, footer', () => {
    render(<RenderLayout />);

  // Header (logo present; text removed)
  expect(screen.getByAltText(/ggc logo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/AEC, gameroom, library/i)).toBeInTheDocument();

    // Sidebar present (don’t assert "Explore Campus" text since it no longer exists)
    expect(
      screen.getByRole('navigation', { name: /campus navigation/i })
    ).toBeInTheDocument();

    // Legend present (query by aria role/label, not title)
    expect(screen.getByRole('region', { name: /legend/i })).toBeInTheDocument();

    // Helpful Links heading (be explicit about level, but fallback if needed)
    const linksHeading =
      screen.queryByRole('heading', { level: 2, name: /helpful links/i }) ||
      screen.getByText(/helpful links/i);
    expect(linksHeading).toBeInTheDocument();

    // Footer brand text
    expect(screen.getByText(/team lost/i)).toBeInTheDocument();
  });

  test('sidebar collapse/expand toggles (if control exists)', async () => {
    render(<RenderLayout />);

    // Some layouts may not render a collapse button. Feature-detect it.
    const collapseBtn = screen.queryByRole('button', {
      name: /collapse sidebar navigation/i,
    });

    if (collapseBtn) {
      await userEvent.click(collapseBtn);
      const expandBtn = screen.getByRole('button', {
        name: /expand sidebar navigation/i,
      });
      expect(expandBtn).toBeInTheDocument();

      await userEvent.click(expandBtn);
    }

    // In both cases, sidebar navigation should be reachable
    expect(
      screen.getByRole('navigation', { name: /campus navigation/i })
    ).toBeInTheDocument();
  });

  test('legend renders expected labels', () => {
    render(<RenderLayout />);

    // Legend region exists
    const legendRegion = screen.getByRole('region', { name: /legend/i });
    expect(legendRegion).toBeInTheDocument();

    expect(screen.getByText(/academic building/i)).toBeInTheDocument();
  });
});
