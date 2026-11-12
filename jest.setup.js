// jest.setup.js
// CommonJS syntax so Jest can parse it without extra ESM config

// Extend Jest with DOM matchers like .toBeInTheDocument()
require('@testing-library/jest-dom');

// -----------------------------------------------------------------------------
// ✅ Mock next/image (avoid real Next.js image optimization + priority warning)
// -----------------------------------------------------------------------------
jest.mock('next/image', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props) => {
      // Strip Next.js-only props like "priority" to avoid React warnings
      const { priority, ...rest } = props;
      return React.createElement('img', {
        ...rest,
        alt: rest.alt ?? '',
      });
    },
  };
});

// -----------------------------------------------------------------------------
// ✅ Mock next/navigation globally so useRouter() and usePathname() are safe
// -----------------------------------------------------------------------------
jest.mock('next/navigation', () => {
  const push = jest.fn();
  const replace = jest.fn();
  const prefetch = jest.fn();
  return {
    useRouter: () => ({ push, replace, prefetch }),
    usePathname: () => '/', // ensures Sidebar and similar components don’t crash
  };
});

// -----------------------------------------------------------------------------
// ✅ Suppress common console warnings during tests
// -----------------------------------------------------------------------------
const originalError = console.error;
const originalDebug = console.debug;

beforeAll(() => {
  console.error = (...args) => {
    const msg = String(args[0] ?? '');
    if (
      /Warning.*not wrapped in act/i.test(msg) ||
      /Received `true` for a non-boolean attribute `priority`/i.test(msg)
    ) {
      // ignore React noise + Next.js <Image> priority warnings
      return;
    }
    originalError.call(console, ...args);
  };

  // Silence debug noise
  console.debug = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.debug = originalDebug;
});
