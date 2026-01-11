#!/bin/bash

# Post-push purge script for jsDelivr CDN
echo "🧹 Purging jsDelivr cache after push..."
echo ""

# Get latest commit hash
COMMIT=$(git rev-parse --short HEAD)
echo "Latest commit: $COMMIT"
echo ""

# Purge the entire repository using wildcard for @main
echo "Purging @main branch cache..."
curl -s "https://purge.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/*"
echo ""

# Also purge specific commit for immediate availability
echo "Purging @$COMMIT cache..."
curl -s "https://purge.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@$COMMIT/*"
echo ""

echo "✅ Cache purged from jsDelivr!"
echo ""
echo "💡 If @main still shows old content, use the commit hash URL:"
echo "   https://cdn.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@$COMMIT/"
echo ""
echo "📦 To update Webflow, replace @main with @$COMMIT in your embed code."

