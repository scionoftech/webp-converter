// Build an animated WebP from individual WebP frames, then pull one frame back.
import webp from '../dist/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const out = path.join(here, 'output');

webp.grant_permission();

try {
  // Each frame: { path, offset }. offset uses webpmux FRAME_OPTIONS syntax
  // (+duration[+x+y[+dispose[+blend]]]); '+100' = 100ms pause.
  const frames = [0, 1, 2, 3].map((i) => ({
    path: path.join(root, 'frames', `tmp-${i}.webp`),
    offset: '+100',
  }));

  // webpmux_animate(frames, output, loop, bgcolor)
  // loop '0' = forever; bgcolor is 'A,R,G,B'.
  const anim = path.join(out, 'animation.webp');
  await webp.webpmux_animate(frames, anim, '0', '255,255,255,255');
  console.log('✓ built animation →', anim);

  // webpmux_getframe(input, output, frameNumber) — frames are 1-indexed.
  const frame2 = path.join(out, 'frame-2.webp');
  await webp.webpmux_getframe(anim, frame2, '2');
  console.log('✓ extracted frame 2 →', frame2);
} catch (err) {
  console.error('✗ animation failed:', err.message);
  process.exitCode = 1;
}
