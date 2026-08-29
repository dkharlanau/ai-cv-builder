# AI-Ready CV Builder

> **Status: earlier reference experiment.** This repository is kept public as the original professional-identity prototype. Active development moved to the broader [personal knowledge site](https://dkharlanau.github.io/) and [Agent-Ready Web Profile](https://github.com/dkharlanau/agent-ready-web-profile). Start there for current work.

A small open experiment by **Dzmitryi Kharlanau** for publishing a professional profile as both a human-readable page and portable structured data.

The project explores a simple idea: a CV should not exist only inside a recruiting platform. The same professional identity can also be published under the person's control in formats that are easier for search, retrieval, data processing, and AI-assisted workflows to consume.

## What the project demonstrates

A profile can expose several representations from the same source of truth:

- human-readable HTML
- structured JSON or YAML
- Schema.org / JSON-LD where appropriate
- explicit canonical URLs and identity links
- machine-readable documentation for supported AI/retrieval use cases

This improves portability and inspectability. It does **not** guarantee search ranking, recruiter discovery, AI recommendation, crawler access, or inclusion in any external model or index.

## Reference implementation

The original idea now lives inside a broader public implementation:

- https://dkharlanau.github.io/

That site has evolved beyond the CV prototype into a professional profile and enterprise knowledge base covering SAP transformation, enterprise operations, data governance, open-source transformation tooling, and agentic AI.

For the current open-source product portfolio, see:

- https://dkharlanau.github.io/products/

## Design principles

### One identity, multiple representations

Human-readable and machine-readable versions should describe the same person and use stable identifiers rather than becoming separate, drifting profiles.

### Selective openness

Only information intended to be public should be exposed. Private contacts, compensation information, client-confidential details, internal project data, credentials, and other sensitive information should remain outside the public repository.

### Standards before proprietary formats

Prefer ordinary web standards and portable structured formats over platform-specific representations where possible.

### Evidence before visibility claims

Publishing structured data can make information easier to parse and reuse, but discoverability still depends on the behavior and policies of individual search engines, crawlers, retrieval systems, and AI products.

## Relationship to current work

Two active projects now cover the useful parts of this experiment at a broader level:

1. **[dkharlanau.github.io](https://github.com/dkharlanau/dkharlanau.github.io)** is the maintained professional profile, knowledge system, public dataset surface, and product catalog.
2. **[Agent-Ready Web Profile (ARWP)](https://github.com/dkharlanau/agent-ready-web-profile)** addresses website-level discovery and interface resolution across ordinary web surfaces, structured data, APIs, agent metadata, MCP/A2A-related discovery, and other public interfaces.

This repository is therefore useful as a compact historical/reference implementation, not as a competing active product.

## Author

**Dzmitryi Kharlanau**  
SAP Transformation · Enterprise Operations · Agentic AI

- Website: https://dkharlanau.github.io/
- Products: https://dkharlanau.github.io/products/
- LinkedIn: https://www.linkedin.com/in/dkharlanau/
- GitHub: https://github.com/dkharlanau

## Status

Earlier experimental reference project. The repository documents an approach to portable professional identity; it should not be interpreted as a claim that a specific search engine or AI system will index, rank, recommend, or verify a published profile.
