#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { toJsonLd, validateProfile } from '../lib/profile.mjs';

function option(name, fallback) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((argument) => argument.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const input = option('input', 'examples/profile.example.json');
const outputDirectory = option('output-dir', 'dist');

try {
  const [sourceText, html, profileText, jsonLdText] = await Promise.all([
    fs.readFile(input, 'utf8'),
    fs.readFile(path.join(outputDirectory, 'index.html'), 'utf8'),
    fs.readFile(path.join(outputDirectory, 'profile.json'), 'utf8'),
    fs.readFile(path.join(outputDirectory, 'profile.jsonld'), 'utf8'),
    fs.access(path.join(outputDirectory, '.nojekyll')),
  ]);

  const source = JSON.parse(sourceText);
  const publishedProfile = JSON.parse(profileText);
  const publishedJsonLd = JSON.parse(jsonLdText);
  assert.deepEqual(validateProfile(source), [], 'source profile must remain valid');
  assert.deepEqual(publishedProfile, source, 'published profile.json must match the source exactly');
  assert.deepEqual(publishedJsonLd, toJsonLd(source), 'published profile.jsonld must match the conservative projection');
  assert.match(html, new RegExp(`<link rel="canonical" href="${source.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
  assert.match(html, new RegExp(`<meta name="robots" content="${source.review.indexable ? 'index,follow' : 'noindex,follow'}">`));
  assert.match(html, /href="\.\/profile\.json"/);
  assert.match(html, /href="\.\/profile\.jsonld"/);
  assert.match(html, /<script type="application\/ld\+json">/);

  console.log(`Verified generated profile site in ${outputDirectory}`);
} catch (error) {
  console.error(`Generated site verification failed: ${error.message}`);
  process.exitCode = 1;
}
