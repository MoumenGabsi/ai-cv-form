# GitHub Pages + GitHub Actions Setup

## Prerequisites ✅

Your project is ready for GitHub Pages. Before deploying, ensure:

- [ ] Your repository is public: https://github.com/moumengabsi/ai-cv-form
- [ ] You have git configured locally
- [ ] You have npm and Node.js installed

## Step 1: Add GitHub Secrets (for CI/CD)

Your `REACT_APP_GROQ_KEY` needs to be added as a GitHub Secret for automatic deployments:

1. Go to: https://github.com/moumengabsi/ai-cv-form/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `REACT_APP_GROQ_KEY`
4. Value: `[Your Groq API Key from https://console.groq.com]`
5. Click **"Add secret"**

This keeps your API key secure and only used during build time.

## Step 2: Configure GitHub Pages Settings

1. Go to: https://github.com/moumengabsi/ai-cv-form/settings/pages
2. Under **"Build and deployment":**
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**
3. Click **Save**

## Step 3: Push to GitHub

```bash
# Stage all changes
git add .

# Commit
git commit -m "Add GitHub Pages deployment configuration"

# Push to master branch
git push origin master
```

## Step 4: Watch the Deployment

1. Go to: https://github.com/moumengabsi/ai-cv-form/actions
2. Watch for a running workflow named "Deploy to GitHub Pages"
3. Wait for green ✅ checkmark (usually 2-5 minutes)

## Step 5: Visit Your Live App

After successful deployment, your app is live at:

👉 **https://moumengabsi.github.io/ai-cv-form**

⏱️ May take 1-5 minutes to appear after first deployment.

## Manual Deployment Alternative

If you prefer manual deployment without GitHub Actions:

### Windows (PowerShell):
```powershell
npm install --save-dev gh-pages
npm run build
npm run deploy
```

### Mac/Linux:
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

You'll be prompted to log in with GitHub credentials on first use.

## GitHub Actions Workflow

Your workflow (`.github/workflows/deploy.yml`) automatically:
- Installs dependencies
- Builds the app
- Deploys to gh-pages branch
- Runs on every push to `master` branch

To disable automatic deployments, delete `.github/workflows/deploy.yml`.

## API Integration Notes

### Frontend-only Features (✅ Work on GitHub Pages)
- UI/Navigation
- Dark theme
- Animations (GSAP, Framer Motion)
- Form rendering
- localStorage data persistence

### Backend-dependent Features (❌ Won't work without backend)
- CV extraction (requires Groq API server)
- Contact form submissions
- Volunteer application submissions
- Any API calls to `http://localhost:5000`

### To Enable All Features:
1. Deploy Express backend to Render/Railway/Vercel
2. Update API endpoints to production backend URL
3. Re-deploy frontend with new URLs

Example update needed in `src/Contact.js`:
```javascript
// Before (development)
const response = await fetch("http://localhost:5000/api/extract-cv", {

// After (production)
const response = await fetch("https://your-backend-url.railway.app/api/extract-cv", {
```

## Troubleshooting

### Issue: Workflow fails with red ❌
- Check workflow logs: https://github.com/moumengabsi/ai-cv-form/actions
- Common issues:
  - Missing REACT_APP_GROQ_KEY secret
  - Build errors (check npm output)

### Issue: App shows blank page
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console (F12)
- Verify routing works with basename

### Issue: API calls fail
- Expected on GitHub Pages
- Deploy backend to production service
- Update frontend API endpoints

## Monitoring Deployments

**Deployment history:**
https://github.com/moumengabsi/ai-cv-form/deployments

**GitHub Pages status:**
https://github.com/moumengabsi/ai-cv-form/settings/pages

**Workflow runs:**
https://github.com/moumengabsi/ai-cv-form/actions

## Quick Reference

| Task | Command |
|------|---------|
| Install gh-pages | `npm install --save-dev gh-pages` |
| Build app | `npm run build` |
| Deploy (manual) | `npm run deploy` |
| View deployments | Go to Actions tab |
| Live app | https://moumengabsi.github.io/ai-cv-form |
| Repo settings | https://github.com/moumengabsi/ai-cv-form/settings |
| Pages settings | https://github.com/moumengabsi/ai-cv-form/settings/pages |
| Secrets | https://github.com/moumengabsi/ai-cv-form/settings/secrets/actions |

---

You're all set! 🎉 Push your changes and watch GitHub Actions deploy automatically.
