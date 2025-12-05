#!/bin/bash
# GitHub Pages Deployment Script

echo "🚀 Starting GitHub Pages Deployment..."

# Install gh-pages if not already installed
if ! npm list gh-pages > /dev/null 2>&1; then
  echo "📦 Installing gh-pages..."
  npm install --save-dev gh-pages
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
  # Deploy to GitHub Pages
  echo "📤 Deploying to GitHub Pages..."
  npm run deploy
  
  if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live at: https://moumengabsi.github.io/ai-cv-form"
  else
    echo "❌ Deployment failed. Check your GitHub credentials."
    exit 1
  fi
else
  echo "❌ Build failed. Please check for errors above."
  exit 1
fi
