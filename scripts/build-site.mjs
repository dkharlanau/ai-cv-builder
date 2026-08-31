#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderHtml, toJsonLd, validateProfile } from '../lib/profile.mjs';

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
  const profile = JSON.parse(await fs.readFile(input, 'utf8'));
  const errors = validateProfile(profile);
  if (errors.length > 0) throw new Error(`Profile validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);

  await fs.mkdir(outputDirectory, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(outputDirectory, 'index.html'), renderHtml(profile)),
    fs.writeFile(path.join(outputDirectory, 'profile.json'), `${JSON.stringify(profile, null, 2)}\n`),
    fs.writeFile(path.join(outputDirectory, 'profile.jsonld'), `${JSON.stringify(toJsonLd(profile), null, 2)}\n`),
    fs.writeFile(path.join(outputDirectory, '.nojekyll'), '')
  ]);
  console.log(`Built profile site in ${outputDirectory}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
