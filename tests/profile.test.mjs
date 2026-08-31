import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import test from 'node:test';
import { renderHtml, toJsonLd, validateProfile } from '../lib/profile.mjs';

const profile = JSON.parse(await fs.readFile(new URL('../examples/profile.example.json', import.meta.url), 'utf8'));

test('the reference profile is valid', () => {
  assert.deepEqual(validateProfile(profile), []);
});

test('validation rejects non-HTTPS evidence and unpublished data', () => {
  const invalid = structuredClone(profile);
  invalid.skills[0].evidenceUrl = 'http://localhost/private';
  invalid.review.publicDataOnly = false;
  assert.deepEqual(validateProfile(invalid), [
    'skills[0].evidenceUrl must be a public HTTPS URL.',
    'review.publicDataOnly must be true before publication.'
  ]);
});

test('validation rejects unknown fields, impossible dates and reversed experience', () => {
  const invalid = structuredClone(profile);
  invalid.trackingId = 'not part of the public contract';
  invalid.review.lastReviewed = '2026-02-31';
  invalid.experience[0].end = '2022-12';
  assert.deepEqual(validateProfile(invalid), [
    'Profile contains unsupported field "trackingId".',
    'experience[0].end must not be earlier than start.',
    'review.lastReviewed must be a valid YYYY-MM-DD date.'
  ]);
});

test('JSON-LD preserves identity and evidence without employment invention', () => {
  const jsonLd = toJsonLd(profile);
  assert.equal(jsonLd['@type'], 'Person');
  assert.equal(jsonLd['@id'], profile.id);
  assert.deepEqual(jsonLd.knowsAbout.map((item) => item.subjectOf), profile.skills.map((skill) => skill.evidenceUrl));
  assert.equal('worksFor' in jsonLd, false);
});

test('HTML escapes profile text and publishes relative machine-readable links', () => {
  const escaped = structuredClone(profile);
  escaped.name = '<script>alert(1)</script>';
  const html = renderHtml(escaped);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<h1><script>/);
  assert.match(html, /href="\.\/profile\.json"/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(html, /name="robots" content="noindex,follow"/);
});
