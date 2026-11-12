# GGCMaps

GGCMaps is a campus map for Georgia Gwinnett College. The application uses React and Next.js to render campus and indoor floor maps from SVG assets, support room search, and provide map navigation.

## Development

Requires Node.js and npm.

```sh
npm ci
npm run dev
```

The development server runs at `http://localhost:3000`. Run `npm run extract-rooms` after changing map SVGs; `npm run dev` runs extraction automatically.

## Validation

```sh
npm run lint
npm test
npm run build
```

The production build is a static export in `out/`. GitHub Pages deployment settings are maintained in `.github/workflows/deploy.yml`. AvesTech uses the domain root and the repository's `CNAME`; do not add a project subpath to asset URLs.

## Maps and data

- `public/BuildingMaps/` contains the campus and indoor SVG maps.
- `data/buildings.json` defines route and floor metadata.
- `scripts/extract-room-data.js` reads room IDs from map SVGs into `data/rooms.json`.
- `components/legend.jsx` contains the rendered legend content.

The Convocation Center SVGs are contributed in a separate map PR. Merge that PR before extracting CC room IDs or adding/running CC map tests; those assets are deliberately excluded from this refactor branch.

## Feature parity

Before replacing the legacy site, review whether parking and safety layers, fire escape routes, campus events, help/support pages, service-worker behavior, and analytics need to be retained or migrated. The React application should not be considered a complete legacy replacement until those choices are confirmed.

## Licensing

See `License.md`. Confirm the applicable license and map/code attribution with the project maintainers before publication.
