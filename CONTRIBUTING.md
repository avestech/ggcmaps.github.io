# Contributing

The application is built with Next.js. Edit React components in `components/`, routes in `app/`, and source data in `data/`. Do not edit generated `out/` files.

## Local workflow

1. Install Node.js and npm.
2. Run `npm ci`.
3. Run `npm run dev` to start the development server.
4. Run `npm run lint`, `npm test`, and `npm run build` before submitting changes.

When editing a floor-map SVG, keep room group IDs aligned with the room lookup conventions. Run `npm run extract-rooms` to refresh `data/rooms.json`. The three Convocation Center SVGs are managed by a separate map PR; do not duplicate them in application-only changes.

## Pull requests

- Keep generated build output, coverage reports, and local archives out of the PR.
- Describe user-visible changes and note any legacy behavior that is intentionally retired.
- Include tests for changed search, navigation, or SVG interactions.
- For deployment changes, preserve the AvesTech custom domain and verify the static export at the domain root.
- Confirm map and code licensing/attribution with the maintainers when reusing or adapting existing work.
