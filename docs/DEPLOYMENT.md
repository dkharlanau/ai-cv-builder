# Deploying a profile safely

This repository publishes a non-personal, noindex demonstration. A fork becomes a real professional profile only after its owner replaces the example data and reviews every public claim.

## 1. Prepare the source

Copy `examples/profile.example.json` and edit it conservatively:

- set `id` to a stable public identifier, commonly the canonical profile URL plus `#person`;
- set `url` to the exact HTTPS URL where `index.html` will be published;
- keep only public, inspectable identity and evidence links;
- remove confidential clients, internal project details and private contact data;
- leave `review.indexable` as `false` until the canonical deployment is live and reviewed.

For a GitHub project site, the canonical URL normally includes the repository path:

```text
https://ACCOUNT.github.io/REPOSITORY/
```

## 2. Build and verify

```bash
npm ci
npm run verify
```

`verify` validates the source, runs the test suite, rebuilds `dist/`, and confirms that the generated HTML, source JSON and JSON-LD agree. A successful build does not verify identity, employment or the relevance of an evidence link.

To use another source or output directory:

```bash
node scripts/build-site.mjs --input path/to/profile.json --output-dir public
node scripts/check-dist.mjs --input path/to/profile.json --output-dir public
```

## 3. Publish

The included Pages workflow deploys `dist/` from `main`. In a fork, enable GitHub Pages with **GitHub Actions** as the source. The workflow runs the same `npm run verify` gate before uploading the site.

After deployment, check all four public resources directly:

```text
/
/profile.json
/profile.jsonld
```

The HTML contains the fourth representation: an embedded copy of the same JSON-LD.

## 4. Review before indexing

Confirm that canonical and evidence URLs return the intended public resources, then update `review.lastReviewed`. Set `review.indexable` to `true` only for the canonical deployment and only when search indexing is wanted. Preview, fork and example deployments should normally remain `noindex,follow`.

## Optional discovery metadata

[Agent-Ready Web Profile](https://github.com/dkharlanau/agent-ready-web-profile) can inspect a deployed site or describe its public data surfaces. AI CV Builder does not currently generate an ARWP publisher profile, and ARWP adoption is not required to publish valid HTML or Schema.org JSON-LD. If you add discovery metadata, validate the deployed URLs instead of copying unverified capability claims.
