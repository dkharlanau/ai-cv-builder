# Profile contract

The source document is designed for a small public professional profile. It is not a full resume interchange standard and does not attempt to model private recruiting data.

## Identity fields

- `schemaVersion` identifies this repository's contract version.
- `id` is a stable HTTPS identifier for the person. A canonical page URL with a fragment is a practical default.
- `name`, `headline` and `summary` are rendered directly into the human-readable page.
- `url` is the canonical public profile page.
- `sameAs` contains optional public identity links. It should not be used for accounts that are private, ambiguous or not controlled by the person.

## Evidence fields

Every skill requires an `evidenceUrl`. The URL may point to a public article, project, talk, certification record or another inspectable artifact. A link is provenance, not automatic proof; readers still need to evaluate its relevance and ownership.

Experience is optional. When present, each entry requires a role, organization, start month and at least one factual highlight. Omit confidential clients and work that cannot be described publicly.

## Review boundary

`review.lastReviewed` records when a human last checked the public profile. `review.publicDataOnly` must be `true` before the builder accepts the input. `review.indexable` controls the generated robots directive; keep it `false` for examples, drafts and non-canonical deployments.

These fields are publication controls, not third-party verification. They do not establish identity, employment or professional competence.

## Generated representations

The builder emits:

- `index.html` for people and ordinary web clients;
- `profile.json` as a faithful copy of the source;
- `profile.jsonld` as a conservative Schema.org `Person` projection.

The JSON-LD intentionally maps identity, summary, public links and evidence-backed topics. It does not infer employment, credentials, ratings or endorsements.
