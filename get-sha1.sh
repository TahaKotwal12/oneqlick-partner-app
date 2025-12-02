#!/bin/bash
# Bash script to get SHA-1 fingerprint for OneQlick app
# Run this script: chmod +x get-sha1.sh && ./get-sha1.sh

echo "🔐 Getting SHA-1 Fingerprint for OneQlick App"
echo "=============================================="
echo ""

# Check if keytool exists
if ! command -v keytool &> /dev/null; then
    echo "❌ keytool not found. Please install Java JDK first."
    echo "Download from: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

# Get SHA-1 fingerprint
echo "📱 Getting SHA-1 fingerprint from debug keystore..."
echo ""

debug_keystore="$HOME/.android/debug.keystore"

if [ ! -f "$debug_keystore" ]; then
    echo "❌ Debug keystore not found at: $debug_keystore"
    echo "Please run 'expo run:android' first to generate the keystore."
    exit 1
fi

keytool -list -v -keystore "$debug_keystore" -alias androiddebugkey -storepass android -keypass android

echo ""
echo "✅ Copy the SHA1 fingerprint above and use it in Google Cloud Console"
echo "📦 Package name: com.oneqlick.fooddelivery"
echo "🔗 Google Cloud Console: https://console.cloud.google.com/"
