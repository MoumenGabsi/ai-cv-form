@echo off
REM GitHub Pages Deployment Script for Windows

echo 🚀 Starting GitHub Pages Deployment...

REM Check if gh-pages is installed
npm list gh-pages >nul 2>&1
if errorlevel 1 (
  echo 📦 Installing gh-pages...
  npm install --save-dev gh-pages
)

REM Build the project
echo 🔨 Building the project...
call npm run build

if errorlevel 1 (
  echo ❌ Build failed. Please check for errors above.
  exit /b 1
)

REM Deploy to GitHub Pages
echo 📤 Deploying to GitHub Pages...
call npm run deploy

if errorlevel 1 (
  echo ❌ Deployment failed. Check your GitHub credentials.
  exit /b 1
)

echo ✅ Deployment successful!
echo 🌐 Your app is now live at: https://moumengabsi.github.io/ai-cv-form
pause
