# 🚀 Quick Start Guide - GitHub Pages Deployment

## What's Been Setup ✅

- ✅ `package.json` updated with `homepage` and deploy scripts
- ✅ `src/App.js` updated with router `basename="/ai-cv-form"`
- ✅ GitHub Actions workflow for automatic deployment
- ✅ Environment configuration for production

## How to Deploy

### Method 1: Manual Deployment (Windows)

**Step 1:** Open PowerShell as Administrator and install gh-pages:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install --save-dev gh-pages"
```

**Step 2:** Run the deployment script:
```powershell
.\deploy.bat
```

Or manually:
```powershell
npm run build
npm run deploy
```

### Method 2: Automatic Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin master
   ```

2. **GitHub Actions will automatically:**
   - Install dependencies
   - Build your app
   - Deploy to GitHub Pages
   - The workflow runs on every push to `master` branch

3. **Check deployment status:**
   - Go to: https://github.com/moumengabsi/ai-cv-form/actions
   - Watch for the green checkmark ✅

### Method 3: Git Bash

```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

## After Deployment

Your app will be live at: **https://moumengabsi.github.io/ai-cv-form**

⏱️ It may take 1-5 minutes to appear after deployment.

## Repository Settings

**Configure in GitHub (One-time setup):**

1. Go to: https://github.com/moumengabsi/ai-cv-form/settings
2. Scroll to **"Pages"** section
3. Verify:
   - Source: "Deploy from a branch"
   - Branch: "gh-pages"
   - Folder: "/ (root)"
4. Click **Save**

## ⚠️ Important: Backend API Won't Work

Your app uses a backend for:
- CV extraction (Groq AI)
- Contact form submissions
- Volunteer applications

**These features require a backend server** which GitHub Pages cannot provide.

### Solution: Deploy Backend Separately

**Recommended platforms:**
1. **Render.com** - FREE with limitations
2. **Railway.app** - Affordable ($5/month minimum)
3. **Vercel** - FREE for Node.js backends
4. **Heroku** - Now paid ($7/month)

**Steps to enable backend:**
1. Deploy Express backend to one of the above services
2. Get your backend URL (e.g., `https://my-backend.railway.app`)
3. Update API endpoints in your frontend:
   - `src/Contact.js` - change `http://localhost:5000` to your backend URL
   - `src/App.js` - change `http://localhost:5000` to your backend URL
4. Redeploy frontend: `npm run deploy`

## Troubleshooting

### Issue: Blank page or 404 errors
**Solution:** 
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for errors (F12 → Console)
- Verify `basename="/ai-cv-form"` in App.js

### Issue: Routes not working
**Solution:**
- Check that basename is set correctly
- Restart the page
- Clear service worker cache

### Issue: API endpoints failing
**Solution:** This is expected on GitHub Pages
- Deploy your backend first
- Update endpoints to use backend URL
- Re-deploy frontend

## Files Created/Modified

**Created:**
- `deploy.bat` - Windows deployment script
- `deploy.sh` - Linux/Mac deployment script
- `GITHUB_PAGES_SETUP.md` - Detailed setup guide
- `.github/workflows/deploy.yml` - GitHub Actions automation
- `.env.production` - Production environment variables

**Modified:**
- `package.json` - Added homepage and deploy scripts
- `src/App.js` - Added router basename

## Need Help?

For issues, check:
1. GitHub Actions logs: https://github.com/moumengabsi/ai-cv-form/actions
2. GitHub Pages settings: https://github.com/moumengabsi/ai-cv-form/settings/pages
3. Browser console (F12 → Console tab)

## Next Steps

1. **Deploy now:** Run `npm run deploy` or `.\deploy.bat`
2. **Check status:** Visit https://github.com/moumengabsi/ai-cv-form/actions
3. **View live:** https://moumengabsi.github.io/ai-cv-form (wait 1-5 min)
4. **Deploy backend:** (Optional but recommended for full functionality)

---

Good luck! 🎉
