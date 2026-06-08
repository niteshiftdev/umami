#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcDir = path.join(__dirname, '..', 'packages', 'tracker-wasm');
const outDir = path.join(srcDir, 'dist');
const publicDir = path.join(__dirname, '..', 'public');

console.log('[Tracker WASM] Building WASM module...');

try {
  // Build WASM
  execSync('wasm-pack build --target web --out-dir dist --release', {
    cwd: srcDir,
    stdio: 'inherit',
  });

  console.log('[Tracker WASM] WASM build completed');

  // Copy WASM artifacts to public directory
  console.log('[Tracker WASM] Copying artifacts to public directory...');

  const wasmFile = path.join(outDir, 'umami_tracker_bg.wasm');
  const jsFile = path.join(outDir, 'umami_tracker.js');
  const dtsFile = path.join(outDir, 'umami_tracker.d.ts');

  if (fs.existsSync(wasmFile)) {
    fs.copyFileSync(wasmFile, path.join(publicDir, 'tracker.wasm'));
  }

  if (fs.existsSync(jsFile)) {
    fs.copyFileSync(jsFile, path.join(publicDir, 'tracker.wasm.js'));
  }

  if (fs.existsSync(dtsFile)) {
    fs.copyFileSync(dtsFile, path.join(publicDir, 'tracker.wasm.d.ts'));
  }

  console.log('[Tracker WASM] Build complete!');
} catch (error) {
  console.error('[Tracker WASM] Build failed:', error.message);
  process.exit(1);
}
