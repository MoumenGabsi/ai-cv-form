# 🚀 GitHub Pages - Quick Reference Card

## ONE-LINE DEPLOYMENT

```bash
git push origin master
```

**That's it!** GitHub Actions will automatically deploy your app.

---

## Check Deployment Status

**Link:** https://github.com/moumengabsi/ai-cv-form/actions

Look for green ✅ checkmark (2-5 minutes)

---

## View Your Live App

**URL:** https://moumengabsi.github.io/ai-cv-form

---

## What Was Set Up

✅ Router with basename="/ai-cv-form"
✅ GitHub Actions automation
✅ Deployment scripts
✅ Production configuration
✅ Documentation

---

## Manual Deploy (If Needed)

**Windows:**
```powershell
npm install --save-dev gh-pages
npm run build
npm run deploy
```

**Mac/Linux:**
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

---

## First-Time Setup Checklist

- [ ] Code changes committed
- [ ] `git push origin master`
- [ ] GitHub Actions completes (green ✅)
- [ ] Visit live app URL
- [ ] Test navigation and forms

---

## API/Backend Note

❌ Volunteer submissions, CV extraction won't work on GitHub Pages
✅ UI, navigation, forms, animations all work

**To enable:** Deploy backend to Render/Railway/Vercel first

---

## Important Files

| File | Purpose |
|------|---------|
| `package.json` | Homepage & deploy scripts |
| `src/App.js` | Router basename |
| `.github/workflows/deploy.yml` | Auto-deployment |
| `DEPLOYMENT_CHECKLIST.md` | Full checklist |
| `DEPLOYMENT_SUMMARY.md` | Overview |

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Blank page | Clear cache (Ctrl+Shift+Delete) |
| Routes broken | Hard refresh (Ctrl+F5) |
| API fails | Expected - deploy backend separately |
| Deployment fails | Check Actions logs |

---

## GitHub Pages Settings

**Link:** https://github.com/moumengabsi/ai-cv-form/settings/pages

Verify:
- Source: "Deploy from a branch"
- Branch: "gh-pages"
- Folder: "/"

---

## Command Reference

```bash
# View live app
https://moumengabsi.github.io/ai-cv-form

# Check deployment
https://github.com/moumengabsi/ai-cv-form/actions

# GitHub Pages settings
https://github.com/moumengabsi/ai-cv-form/settings/pages

# Repository settings
https://github.com/moumengabsi/ai-cv-form/settings

# Manual deploy
npm install --save-dev gh-pages
npm run build
npm run deploy
```

---

## Files Modified

```
package.json - homepage & scripts added
src/App.js - basename="/ai-cv-form" added
.github/workflows/deploy.yml - created
deploy.bat - created
deploy.sh - created
.env.production - created
```

---

## Deploy Now!

```bash
git push origin master
```

**Watch:** https://github.com/moumengabsi/ai-cv-form/actions

**Live:** https://moumengabsi.github.io/ai-cv-form

---

## Documentation

- `DEPLOYMENT_CHECKLIST.md` - Complete checklist
- `DEPLOYMENT_SUMMARY.md` - Full overview
- `DEPLOY_GUIDE.md` - Step-by-step guide
- `GITHUB_SETUP.md` - GitHub configuration
- `GITHUB_PAGES_SETUP.md` - Detailed setup

---

## Still Need Help?

1. Read `DEPLOYMENT_CHECKLIST.md` for step-by-step
2. Check GitHub Actions logs for errors
3. Verify repository is public
4. Clear browser cache and try again

---

**Ready?** 

```bash
git push origin master
```

Your app deploys automatically! 🎉
