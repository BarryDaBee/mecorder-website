#!/bin/sh
# Build the site and publish dist/ to the gh-pages branch (GitHub Pages).
set -e
cd "$(dirname "$0")/.."
npm run build
rev=$(git rev-parse --short HEAD)
tmp=$(mktemp -d)
cp -R dist/. "$tmp"
touch "$tmp/.nojekyll"
cd "$tmp"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $rev"
git push -q -f "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
rm -rf "$tmp"
echo "Published $rev to https://barrydabee.github.io/mecorder-website/"
