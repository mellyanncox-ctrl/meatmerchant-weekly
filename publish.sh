#!/bin/bash
set -e
if [ ! -f "index.html" ] || [ ! -d "weeks" ]; then
  echo "✗ Not in the meatmerchant-weekly repo. Run: cd ~/APPS/meatmerchant-weekly"
  exit 1
fi
echo "Changes ready to push:"
echo ""
git status --short
echo ""
if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to commit. Working tree is clean."
  exit 0
fi
MSG="${1:-Update for week of $(date +'%-d %B %Y')}"
echo "Commit message: $MSG"
echo ""
read -p "Push to GitHub? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled. Nothing pushed."
  exit 0
fi
git add .
git commit -m "$MSG"
git push
echo ""
echo "✓ Pushed. Live in ~30 seconds at:"
echo "https://mellyanncox-ctrl.github.io/meatmerchant-weekly/"
