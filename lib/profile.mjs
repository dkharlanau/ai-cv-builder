const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-([012]\d|3[01])$/;

function rejectUnknownKeys(value, allowed, path, errors) {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) errors.push(`${path} contains unsupported field "${key}".`);
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isPublicHttpsUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return url.protocol === 'https:'
      && !url.username
      && !url.password
      && Boolean(hostname)
      && hostname !== 'localhost'
      && !hostname.endsWith('.local');
  } catch {
    return false;
  }
}

export function validateProfile(profile) {
  const errors = [];
  if (!isPlainObject(profile)) return ['Profile must be a JSON object.'];

  rejectUnknownKeys(profile, ['$schema', 'schemaVersion', 'id', 'name', 'headline', 'summary', 'url', 'sameAs', 'skills', 'experience', 'review'], 'Profile', errors);

  if (profile.schemaVersion !== '1.0') errors.push('schemaVersion must be "1.0".');
  if (!isPublicHttpsUrl(profile.id)) errors.push('id must be a public HTTPS URL.');
  if (!isNonEmptyString(profile.name, 120)) errors.push('name must be a non-empty string of at most 120 characters.');
  if (!isNonEmptyString(profile.headline, 180)) errors.push('headline must be a non-empty string of at most 180 characters.');
  if (!isNonEmptyString(profile.summary, 800)) errors.push('summary must be a non-empty string of at most 800 characters.');
  if (!isPublicHttpsUrl(profile.url)) errors.push('url must be a public HTTPS URL.');

  if (profile.sameAs !== undefined) {
    if (!Array.isArray(profile.sameAs)) {
      errors.push('sameAs must be an array when present.');
    } else {
      const unique = new Set(profile.sameAs);
      if (unique.size !== profile.sameAs.length) errors.push('sameAs must not contain duplicates.');
      profile.sameAs.forEach((url, index) => {
        if (!isPublicHttpsUrl(url)) errors.push(`sameAs[${index}] must be a public HTTPS URL.`);
      });
    }
  }

  if (!Array.isArray(profile.skills) || profile.skills.length === 0) {
    errors.push('skills must contain at least one evidence-backed skill.');
  } else {
    profile.skills.forEach((skill, index) => {
      if (!isPlainObject(skill)) {
        errors.push(`skills[${index}] must be an object.`);
        return;
      }
      rejectUnknownKeys(skill, ['name', 'evidenceUrl'], `skills[${index}]`, errors);
      if (!isNonEmptyString(skill.name, 100)) errors.push(`skills[${index}].name is required and must be at most 100 characters.`);
      if (!isPublicHttpsUrl(skill.evidenceUrl)) errors.push(`skills[${index}].evidenceUrl must be a public HTTPS URL.`);
    });
  }

  if (profile.experience !== undefined) {
    if (!Array.isArray(profile.experience)) {
      errors.push('experience must be an array when present.');
    } else {
      profile.experience.forEach((entry, index) => {
        if (!isPlainObject(entry)) {
          errors.push(`experience[${index}] must be an object.`);
          return;
        }
        rejectUnknownKeys(entry, ['role', 'organization', 'start', 'end', 'highlights'], `experience[${index}]`, errors);
        if (!isNonEmptyString(entry.role, 120)) errors.push(`experience[${index}].role is required.`);
        if (!isNonEmptyString(entry.organization, 120)) errors.push(`experience[${index}].organization is required.`);
        if (!MONTH_PATTERN.test(entry.start || '')) errors.push(`experience[${index}].start must use YYYY-MM.`);
        if (entry.end !== null && entry.end !== undefined && !MONTH_PATTERN.test(entry.end)) errors.push(`experience[${index}].end must be null or use YYYY-MM.`);
        if (MONTH_PATTERN.test(entry.start || '') && MONTH_PATTERN.test(entry.end || '') && entry.end < entry.start) {
          errors.push(`experience[${index}].end must not be earlier than start.`);
        }
        if (!Array.isArray(entry.highlights) || entry.highlights.length === 0 || entry.highlights.some((item) => !isNonEmptyString(item, 300))) {
          errors.push(`experience[${index}].highlights must contain non-empty strings of at most 300 characters.`);
        }
      });
    }
  }

  if (!isPlainObject(profile.review)) {
    errors.push('review is required.');
  } else {
    rejectUnknownKeys(profile.review, ['lastReviewed', 'publicDataOnly', 'indexable'], 'review', errors);
    const reviewDate = profile.review.lastReviewed || '';
    const parsed = new Date(`${reviewDate}T00:00:00Z`);
    if (!DATE_PATTERN.test(reviewDate) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== reviewDate) {
      errors.push('review.lastReviewed must be a valid YYYY-MM-DD date.');
    }
    if (profile.review.publicDataOnly !== true) errors.push('review.publicDataOnly must be true before publication.');
    if (typeof profile.review.indexable !== 'boolean') errors.push('review.indexable must be true or false.');
  }

  return errors;
}

export function toJsonLd(profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': profile.id,
    name: profile.name,
    url: profile.url,
    description: profile.summary,
    sameAs: profile.sameAs || [],
    knowsAbout: profile.skills.map((skill) => ({
      '@type': 'Thing',
      name: skill.name,
      subjectOf: skill.evidenceUrl
    }))
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderHtml(profile) {
  const jsonLd = JSON.stringify(toJsonLd(profile)).replaceAll('<', '\\u003c');
  const skills = profile.skills.map((skill) => `
          <li><a href="${escapeHtml(skill.evidenceUrl)}">${escapeHtml(skill.name)}</a></li>`).join('');
  const experience = (profile.experience || []).map((entry) => {
    const period = `${entry.start} — ${entry.end || 'present'}`;
    const highlights = entry.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    return `<article><h3>${escapeHtml(entry.role)}</h3><p>${escapeHtml(entry.organization)} · ${escapeHtml(period)}</p><ul>${highlights}</ul></article>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(profile.summary)}">
  <meta name="robots" content="${profile.review.indexable ? 'index,follow' : 'noindex,follow'}">
  <link rel="canonical" href="${escapeHtml(profile.url)}">
  <title>${escapeHtml(profile.name)} — ${escapeHtml(profile.headline)}</title>
  <script type="application/ld+json">${jsonLd}</script>
  <style>
    :root { color-scheme: light dark; font-family: ui-sans-serif, system-ui, sans-serif; }
    body { margin: 0; background: #f4f4ef; color: #17201c; }
    main { max-width: 52rem; margin: 0 auto; padding: clamp(2rem, 7vw, 6rem) 1.25rem; }
    h1 { font-size: clamp(2.4rem, 7vw, 5rem); letter-spacing: -.05em; margin: .2em 0; }
    h2 { margin-top: 2.5rem; }
    a { color: #075b4b; }
    .eyebrow { text-transform: uppercase; letter-spacing: .12em; font-size: .78rem; font-weight: 700; }
    .summary { font-size: 1.2rem; line-height: 1.6; max-width: 46rem; }
    article { border-top: 1px solid #b7beb9; padding: 1rem 0; }
    footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #b7beb9; font-size: .9rem; }
    @media (prefers-color-scheme: dark) { body { background: #111714; color: #e9eee9; } a { color: #7ddcc7; } }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="eyebrow">Portable professional profile</p>
      <h1>${escapeHtml(profile.name)}</h1>
      <p class="summary"><strong>${escapeHtml(profile.headline)}</strong><br>${escapeHtml(profile.summary)}</p>
    </header>
    <section><h2>Evidence-backed skills</h2><ul>${skills}
        </ul></section>
    ${experience ? `<section><h2>Experience</h2>${experience}</section>` : ''}
    <footer>Last reviewed ${escapeHtml(profile.review.lastReviewed)} · <a href="./profile.json">Source JSON</a> · <a href="./profile.jsonld">JSON-LD</a></footer>
  </main>
</body>
</html>
`;
}
