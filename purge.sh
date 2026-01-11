#!/bin/bash

# Post-push purge script for jsDelivr CDN
echo "🧹 Purging entire jsDelivr cache after push..."
echo ""

# Purge the entire repository using wildcard
echo "Purging all files in Merciv-Dev/MRCV-Website@main..."
curl -s "https://purge.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/*"

echo ""
echo "✅ Entire repository cache purged from jsDelivr!"
echo "💡 New versions will be available shortly at:"
echo "   https://cdn.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/"
echo ""
echo "📦 No need to update this script when adding new components!"

