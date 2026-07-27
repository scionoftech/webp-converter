// Swap in the npm-flavored README (absolute GitHub URLs) for the published
// tarball, then restore the GitHub README (relative links) afterwards.
//
// Wired to package.json `prepack` (apply) and `postpack` (restore), so `npm
// pack` / `npm publish` ship npm-README.md's content as README.md, while the
// repo working tree keeps its own README.md with repo-relative links.
//
// The source is named `npm-README.md` (not `README.npm.md`) so npm's automatic
// "always include root README*" rule doesn't also ship the source file.
import { copyFileSync, existsSync, rmSync } from 'node:fs';

const MODE = process.argv[2];
const MAIN = 'README.md';
const NPM = 'npm-README.md';
const BACKUP = '.README.github.bak';

if (MODE === 'apply') {
  if (!existsSync(NPM)) process.exit(0);
  copyFileSync(MAIN, BACKUP); // stash the GitHub README
  copyFileSync(NPM, MAIN); // publish the npm README
  console.log('swap-readme: applied npm README');
} else if (MODE === 'restore') {
  if (existsSync(BACKUP)) {
    copyFileSync(BACKUP, MAIN);
    rmSync(BACKUP);
    console.log('swap-readme: restored GitHub README');
  }
} else {
  console.error('usage: node scripts/swap-readme.mjs <apply|restore>');
  process.exit(1);
}
