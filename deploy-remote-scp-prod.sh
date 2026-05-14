#!/bin/bash

# ============================================
# CONFIGURATION
# ============================================
SSH_USER="slqmwjn"
SSH_HOST="141.95.37.183"
REMOTE_PLUGIN_PATH="/home/slqmwjn/public_html/wp-content/plugins/amazon-keyword-tool"
REMOTE_CACHE_PATH="/home/slqmwjn/public_html/wp-content/cache/flying-press"

# ============================================
# Amazon Keyword Tool Deployment Script
# ============================================

if [ "$SKIP_BUILD" = "1" ]; then
    echo "⏭️  Skipping build (SKIP_BUILD=1)"
else
    echo "🔨 Building React app..."
    npm run build

    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

echo ""
echo "📦 Deploying Amazon Keyword Tool to remote server..."
echo "Server: $SSH_USER@$SSH_HOST"
echo ""

# Ensure remote directories exist
echo "📁 Ensuring remote directories exist..."
ssh $SSH_USER@$SSH_HOST "mkdir -p $REMOTE_PLUGIN_PATH/assets/css $REMOTE_PLUGIN_PATH/assets/js"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create remote directories!"
    exit 1
fi

# Deploy CSS (rename index.css → app.css to match the path in the PHP shell)
echo "📄 Uploading CSS..."
scp dist/assets/index.css $SSH_USER@$SSH_HOST:$REMOTE_PLUGIN_PATH/assets/css/app.css

if [ $? -ne 0 ]; then
    echo "❌ CSS upload failed!"
    exit 1
fi

# Deploy JS
echo "📄 Uploading JS..."
scp dist/assets/app.js $SSH_USER@$SSH_HOST:$REMOTE_PLUGIN_PATH/assets/js/

if [ $? -ne 0 ]; then
    echo "❌ JS upload failed!"
    exit 1
fi

# Deploy bundled assets (logos/images Vite emitted alongside app.js).
# We glob everything except app.js and index.css so any future asset gets shipped.
echo "🖼️  Uploading bundled assets..."
shopt -s extglob 2>/dev/null
ASSET_FILES=$(ls dist/assets/!(app.js|index.css) 2>/dev/null)
if [ -n "$ASSET_FILES" ]; then
    scp $ASSET_FILES $SSH_USER@$SSH_HOST:$REMOTE_PLUGIN_PATH/assets/js/

    if [ $? -ne 0 ]; then
        echo "❌ Asset upload failed!"
        exit 1
    fi
else
    echo "  (no bundled assets to upload)"
fi

# Deploy PHP plugin file
echo "📄 Uploading plugin file..."
scp amazon-keyword-tool.php $SSH_USER@$SSH_HOST:$REMOTE_PLUGIN_PATH/

if [ $? -ne 0 ]; then
    echo "❌ Plugin file upload failed!"
    exit 1
fi

# Update version number for cache busting
echo "🔄 Updating version number..."
VERSION="1.$(date +%Y%m%d).$(date +%H%M%S)"
ssh $SSH_USER@$SSH_HOST "sed -i \"s/private \\\$version = '[^']*'/private \\\$version = '$VERSION'/\" $REMOTE_PLUGIN_PATH/amazon-keyword-tool.php"

if [ $? -ne 0 ]; then
    echo "⚠️  Version update failed (non-critical)"
fi

# Clear Flying Press cache
echo "🧹 Clearing Flying Press cache..."
ssh $SSH_USER@$SSH_HOST "rm -rf $REMOTE_CACHE_PATH/* 2>/dev/null"

echo ""
echo "✅ Deployment successful!"
echo "📌 Version: $VERSION"
echo ""
echo "🌐 Visit: https://www.smart-minded.com/en/amazon-keyword-tool/"
echo ""
echo "⚠️  IMPORTANT: Purge Cloudflare cache to see changes immediately:"
echo "   Cloudflare Dashboard → Caching → Configuration → Purge Everything"
echo ""
