# GitHub Pages Deployment Guide

## Prerequisites
- Your project is already on GitHub: `https://github.com/moumengabsi/ai-cv-form`
- You have Node.js and npm installed

## Step 1: Install gh-pages Package

**Option A - Using PowerShell (bypass execution policy):**
```powershell
powershell -ExecutionPolicy Bypass -Command "npm install --save-dev gh-pages"
```

**Option B - Using Command Prompt (cmd):**
```cmd
npm install --save-dev gh-pages
```

**Option C - Using Git Bash:**
```bash
npm install --save-dev gh-pages
```

## Step 2: Update package.json (ALREADY DONE ✅)

Your `package.json` has been updated with:
- `"homepage": "https://moumengabsi.github.io/ai-cv-form"` (add your username if different)
- `"predeploy": "npm run build"` script
- `"deploy": "gh-pages -d build"` script

Verify these changes are in your package.json file.

## Step 3: Update React Router Basename

Since your app will be served from a subdirectory (`/ai-cv-form`), update your router:

**File: `src/index.js`**

Find the BrowserRouter component and update it to:
```javascript
<BrowserRouter basename="/ai-cv-form">
  <App />
</BrowserRouter>
```

**File: `src/App.js`** (if you have a separate router setup)

Make sure any routes include the basename handling.

## Step 4: Build and Deploy

Run these commands in PowerShell as Administrator or use Git Bash:

**Option A - PowerShell (As Administrator):**
```powershell
npm run build
npm run deploy
```

**Option B - Git Bash:**
```bash
npm run build
npm run deploy
```

## Step 5: Configure GitHub Repository Settings

1. Go to: **https://github.com/moumengabsi/ai-cv-form/settings**
2. Scroll down to **"Pages"** section
3. Ensure:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** (should auto-select after first deploy)
   - Folder: **/root**
4. Click **Save**

## Step 6: Access Your Deployed App

After deployment completes, your app will be available at:
```
https://moumengabsi.github.io/ai-cv-form
```

## ⚠️ Important Notes

### Backend API Issue
Your app uses a backend at `http://localhost:5000` for:
- `/api/extract-cv` (CV extraction via Groq AI)
- `/api/contact` (Contact form submissions)
- `/api/volunteer-application` (Volunteer submissions)

**These will NOT work on GitHub Pages** because:
- GitHub Pages is static hosting only (frontend only)
- Your backend runs locally on port 5000
- Cross-origin requests will fail

### Solutions:

**Option 1: Use a Backend Service** (Recommended)
- Deploy your Express backend to a service like:
  - **Vercel** (free tier available)
  - **Heroku** (paid after free tier ends)
  - **Railway** (cheap, developer-friendly)
  - **Render** (free tier with limitations)

**Option 2: Disable Backend Features for GitHub Pages**
- Create a `.env.production` file
- Set a different API URL for production
- Add conditional logic to skip backend calls

**Option 3: Use a CORS proxy** (Not recommended for production)

## Quick Deployment Steps Summary

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Verify package.json has homepage and deploy scripts
# (Should already be updated)

# 3. Update src/index.js with basename="/ai-cv-form"

# 4. Build the app
npm run build

# 5. Deploy to GitHub Pages
npm run deploy

# 6. Visit: https://moumengabsi.github.io/ai-cv-form
```

## Troubleshooting

### Blank page after deployment
- Check the console for 404 errors
- Verify `basename` is set correctly in BrowserRouter
- Check GitHub Pages settings in repository

### Routes not working
- Make sure basename="/ai-cv-form" is in BrowserRouter
- Routes should be relative, not absolute

### API calls failing
- This is expected on GitHub Pages (static hosting only)
- Deploy backend separately (see solutions above)

## Next Steps for Full Deployment

To have a fully functional production app:

1. **Deploy backend** to a service like Render or Railway
2. **Update API endpoints** to point to deployed backend
3. **Update environment variables** for production
4. **Re-deploy** frontend with production API URLs

Would you like help deploying your backend too?
