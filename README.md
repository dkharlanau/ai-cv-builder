# AI-Ready CV Builder

A small, dependency-free reference implementation for publishing one professional profile as human-readable HTML, portable JSON and Schema.org JSON-LD.

The project is intentionally narrow. It demonstrates a reproducible publishing pattern; it does not promise search ranking, recruiter discovery, crawler access, AI recommendation or identity verification.

## What it provides

- a versioned JSON Schema for the source profile;
- a non-personal example profile;
- a validator with explicit, actionable errors;
- a static-site builder that emits HTML, source JSON and JSON-LD from the same input;
- deterministic tests for validation, escaping and structured-data output;
- a GitHub Pages workflow for the generated demonstration site.

## Quick start

Node.js 20 or later is required. The project has no runtime or development dependencies.

```bash
npm ci
npm run verify
```

The generated site is written to `dist/`. `verify` validates and tests the source, rebuilds the site, and confirms that the generated representations agree. Open `dist/index.html` locally or serve the directory with any static file server.

Build a different profile:

```bash
node scripts/build-site.mjs \
  --input path/to/profile.json \
  --output-dir dist
```

Validate without building:

```bash
node scripts/validate-profile.mjs path/to/profile.json
```

## Source profile

Start from [`examples/profile.example.json`](examples/profile.example.json). The contract is defined in [`schema/profile.schema.json`](schema/profile.schema.json).

The required fields are deliberately modest:

- a stable person identifier and canonical HTTPS URL;
- name, headline and a short factual summary;
- at least one skill with a public evidence URL;
- review metadata confirming that the document contains public data only and explicitly choosing whether it should be indexable.

Experience entries are optional. This lets a person publish a useful profile without disclosing employment history that is private, contractually restricted or difficult to verify.

## Publication model

```text
profile.json
    |
    +-- validate required fields and public URL boundaries
    |
    +-- render index.html
    |
    +-- copy profile.json
    |
    +-- derive profile.jsonld
```

The HTML embeds the same JSON-LD that is also available as a standalone file. The builder escapes user-controlled text and permits only public HTTPS URLs.

## Privacy and evidence boundaries

- Keep private contacts, client names, internal project details, credentials and compensation data out of the source file.
- Use evidence URLs that a reader can inspect without privileged access.
- Review dates communicate maintenance state; they do not certify the person or the claims.
- Structured data improves portability and inspectability. External systems decide whether and how to crawl, index or use it.

See [`docs/PROFILE-CONTRACT.md`](docs/PROFILE-CONTRACT.md) for field semantics and publication guidance.

## Deploy your own profile

The included GitHub Pages workflow is reusable in a fork, but the example identity and canonical URL must be replaced first. Follow the [deployment and indexing checklist](docs/DEPLOYMENT.md) to set the project-site URL correctly, keep previews noindex, run the post-build verification gate, and inspect the live output before enabling indexing.

## Repository status

This repository began as an early professional-identity experiment. It is now maintained as a compact reference starter rather than a hosted CV service or recruiting platform.

## License

MIT. See [`LICENSE`](LICENSE).

## Related projects

- [Agent-Ready Web Profile](https://github.com/dkharlanau/agent-ready-web-profile) can inspect or describe the public surfaces of a deployed profile site. AI CV Builder does not currently emit an ARWP publisher profile, so no ARWP conformance is implied.
- [Enterprise Architecture Composer](https://github.com/dkharlanau/enterprise-architecture-composer) produces architecture decisions and evidence that may be linked from a skill entry when the artifact is already public and relevant. There is no automated import between the projects.
- [Visual Workbench](https://github.com/dkharlanau/visual-workbench) can render a public explanatory visual that a profile links to as evidence. AI CV Builder treats the URL as provenance and does not verify the visual's meaning.

## About the author

Created and maintained by **Dzmitryi Kharlanau**, an SAP consultant and system analyst working across enterprise architecture, data, integration, operations, and practical AI.

- [Website and knowledge base](https://dkharlanau.github.io/)
- [LinkedIn](https://www.linkedin.com/in/dkharlanau/)
