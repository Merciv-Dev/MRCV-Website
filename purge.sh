#!/bin/bash

# Post-push purge script for jsDelivr CDN
echo "🧹 Purging jsDelivr cache after push..."

# Purge all chat-bar files from jsDelivr
echo "Purging chat-bar-loader.js..."
curl -s "https://purge.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/chat-bar-loader.js"
echo " ✓"

echo "Purging chat-bar.js..."
curl -s "https://purge.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/chat-bar.js"
echo " ✓"

echo "Purging chat-bar.css..."
curl -s "https://purge.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/chat-bar.css"
echo " ✓"

echo "Purging chat-bar.html..."
curl -s "https://purge.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/chat-bar.html"
echo " ✓"

echo ""
echo "✅ All files purged from jsDelivr cache!"
echo "💡 New versions will be available shortly at:"
echo "   https://cdn.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/"

