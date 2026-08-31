#!/usr/bin/env node
import fs from 'node:fs/promises';
import { validateProfile } from '../lib/profile.mjs';

const input = process.argv[2] || 'examples/profile.example.json';

try {
  const profile = JSON.parse(await fs.readFile(input, 'utf8'));
  const errors = validateProfile(profile);
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Valid profile: ${input}`);
  }
} catch (error) {
  console.error(`Unable to validate ${input}: ${error.message}`);
  process.exitCode = 1;
}
