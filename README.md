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
npm test
npm run build
```

The generated site is written to `dist/`. Open `dist/index.html` locally or serve the directory with any static file server.

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

## Repository status

This repository began as an early professional-identity experiment. It is now maintained as a compact reference starter rather than a hosted CV service or recruiting platform.

## License

No license has been granted yet. The repository is public for inspection and learning; add an explicit license before redistributing or incorporating the code elsewhere.
