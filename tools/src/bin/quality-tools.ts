#!/usr/bin/env node

import { runCLI } from '../lib/cli';

runCLI().catch((error) => {
  console.error('CLI execution failed:', error);
  process.exit(1);
});