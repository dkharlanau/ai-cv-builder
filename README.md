# AI-Ready CV Builder

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

A public implementation is available at:

- https://dkharlanau.github.io/

That site has evolved beyond the original CV prototype into a professional profile and enterprise knowledge base covering SAP transformation, enterprise operations, data governance, and agentic AI.

## Design principles

### One identity, multiple representations

Human-readable and machine-readable versions should describe the same person and use stable identifiers rather than becoming separate, drifting profiles.

### Selective openness

Only information intended to be public should be exposed. Private contacts, compensation information, client-confidential details, internal project data, credentials, and other sensitive information should remain outside the public repository.

### Standards before proprietary formats

Prefer ordinary web standards and portable structured formats over platform-specific representations where possible.

### Evidence before visibility claims

Publishing structured data can make information easier to parse and reuse, but discoverability still depends on the behavior and policies of individual search engines, crawlers, retrieval systems, and AI products.

## Relationship to newer work

The broader interoperability problem explored here led to the separate **Agent-Ready Web Profile (ARWP)** project:

https://github.com/dkharlanau/agent-ready-web-profile

ARWP focuses on websites and knowledge systems rather than CVs specifically, mapping web, data, retrieval, Agent Skills, WebMCP, MCP, A2A, schemas, provenance, and trust surfaces through an explicit discovery profile.

## Author

**Dzmitryi Kharlanau**  
SAP Transformation · Enterprise Operations · Agentic AI

- Website: https://dkharlanau.github.io/
- LinkedIn: https://www.linkedin.com/in/dkharlanau/
- GitHub: https://github.com/dkharlanau

## Status

Experimental reference project. The repository documents an approach to portable professional identity; it should not be interpreted as a claim that a specific search engine or AI system will index, rank, recommend, or verify a published profile.
