# ✅ GitHub Pages Deployment Checklist

## Pre-Deployment ✅

- [x] Router configured with basename="/ai-cv-form"
- [x] package.json has homepage URL
- [x] Deploy scripts added to package.json
- [x] GitHub Actions workflow created (.github/workflows/deploy.yml)
- [x] Documentation created
- [x] .gitignore properly configured

## Before First Push

- [ ] Verify your repository is PUBLIC
  - https://github.com/moumengabsi/ai-cv-form/settings
  - Scroll to "Danger Zone" → "Repository visibility"

- [ ] Verify you have git configured locally
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

- [ ] Commit all changes
  ```bash
  git add .
  git commit -m "Setup GitHub Pages deployment"
  ```

- [ ] Verify git is connected to correct repository
  ```bash
  git remote -v
  # Should show:
  # origin	https://github.com/moumengabsi/ai-cv-form.git (fetch)
  # origin	https://github.com/moumengabsi/ai-cv-form.git (push)
  ```

## Deployment Steps (Choose One)

### Method 1: GitHub Actions (Automatic) ⭐ RECOMMENDED

- [ ] All changes committed locally
- [ ] Push to GitHub:
  ```bash
  git push origin master
  ```
- [ ] Wait 2-5 minutes
- [ ] Check status: https://github.com/moumengabsi/ai-cv-form/actions
- [ ] Look for green ✅ checkmark on workflow
- [ ] Visit: https://moumengabsi.github.io/ai-cv-form

### Method 2: Manual Deployment (Windows)

- [ ] Install gh-pages:
  ```powershell
  powershell -ExecutionPolicy Bypass -Command "npm install --save-dev gh-pages"
  ```

- [ ] Run deployment:
  ```powershell
  .\deploy.bat
  ```

- [ ] Or manually:
  ```powershell
  npm run build
  npm run deploy
  ```

- [ ] Visit: https://moumengabsi.github.io/ai-cv-form

### Method 3: Manual Deployment (Mac/Linux)

- [ ] Install gh-pages:
  ```bash
  npm install --save-dev gh-pages
  ```

- [ ] Run deployment:
  ```bash
  bash deploy.sh
  ```

- [ ] Or manually:
  ```bash
  npm run build
  npm run deploy
  ```

- [ ] Visit: https://moumengabsi.github.io/ai-cv-form

## Post-Deployment Verification

- [ ] App loads without errors: https://moumengabsi.github.io/ai-cv-form
- [ ] Navigation works (click through pages)
- [ ] Dark theme displays correctly
- [ ] Animations work (carousel, DotGrid, ASCII)
- [ ] Forms render properly
- [ ] localStorage persistence works
- [ ] Check browser console (F12) - no critical errors

## GitHub Pages Settings

- [ ] Visit: https://github.com/moumengabsi/ai-cv-form/settings/pages
- [ ] Verify:
  - Source: "Deploy from a branch"
  - Branch: "gh-pages"
  - Folder: "/ (root)"
- [ ] Should show: "Your site is live at https://moumengabsi.github.io/ai-cv-form"

## Optional: Enable Full Backend Features

If you want CV extraction, contact submissions, etc. to work:

- [ ] Deploy Express backend:
  - Choose: Render.com / Railway.app / Vercel / Heroku
  - Push your `server-groq.js` to chosen platform
  - Get backend URL (e.g., https://my-backend.railway.app)

- [ ] Update API endpoints:
  - [ ] `src/Contact.js` - Change `http://localhost:5000` to backend URL
  - [ ] `src/App.js` - Change `http://localhost:5000` to backend URL

- [ ] Add environment variables:
  - [ ] Backend database connection string
  - [ ] CORS allowed origins
  - [ ] API keys for Groq, etc.

- [ ] Commit changes:
  ```bash
  git add .
  git commit -m "Update API endpoints for production"
  git push origin master
  ```

- [ ] Verify GitHub Actions deploys changes
- [ ] Test backend features on live app

## Optional: Set Up GitHub Secrets (for CI/CD)

If using GitHub Actions (automatic deployment):

- [ ] Go to: https://github.com/moumengabsi/ai-cv-form/settings/secrets/actions
- [ ] Add secret:
  - Name: `REACT_APP_GROQ_KEY`
  - Value: Your Groq API key from https://console.groq.com
- [ ] Save
- [ ] GitHub Actions will use this during builds

## Continuous Deployment Setup

- [ ] Future pushes to `master` branch auto-deploy
- [ ] Visit Actions tab to monitor
- [ ] Updates go live automatically (2-5 min)

## Troubleshooting Checklist

If deployment fails:

- [ ] Check Actions logs: https://github.com/moumengabsi/ai-cv-form/actions
- [ ] Verify repository is PUBLIC
- [ ] Ensure master branch exists
- [ ] Check node modules installed: `npm install`
- [ ] Verify no build errors: `npm run build`

If app shows blank page:

- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh (Ctrl+F5)
- [ ] Check browser console (F12)
- [ ] Verify basename="/ai-cv-form" in App.js

If routes don't work:

- [ ] Confirm basename is set
- [ ] Check console for routing errors
- [ ] Try visiting full URL directly

If API calls fail:

- [ ] Expected on GitHub Pages (static hosting)
- [ ] Deploy backend separately to fix
- [ ] Update endpoints to backend URL

## Success Indicators ✅

When deployment succeeds, you'll see:

- [ ] GitHub Actions shows green ✅ checkmark
- [ ] Pages settings shows "Your site is live at..."
- [ ] App loads at https://moumengabsi.github.io/ai-cv-form
- [ ] All routes navigate correctly
- [ ] No 404 errors in browser console
- [ ] Dark UI renders properly
- [ ] Forms and inputs work

## Keep Deployed

Your app stays deployed as long as:

- [ ] Repository remains public
- [ ] GitHub doesn't delete the repository
- [ ] You don't delete the gh-pages branch
- [ ] GitHub Pages service remains free (it will!)

## Update Your App

To deploy new changes:

- [ ] Make code changes
- [ ] Commit: `git commit -am "Your message"`
- [ ] Push: `git push origin master`
- [ ] GitHub Actions auto-deploys (2-5 min)

That's it! Your app updates automatically! 🎉

---

## Ready? Let's Deploy! 🚀

**Run this command:**
```bash
git push origin master
```

**Then watch:**
https://github.com/moumengabsi/ai-cv-form/actions

**Your app will be live at:**
https://moumengabsi.github.io/ai-cv-form

---

Need help? Check the detailed guides:
- `DEPLOYMENT_SUMMARY.md` - Overview
- `DEPLOY_GUIDE.md` - Quick start
- `GITHUB_SETUP.md` - Secrets and workflows
