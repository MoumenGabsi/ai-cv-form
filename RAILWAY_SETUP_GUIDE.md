# 🚂 Railway Setup - Complete Guide

## Your Current Status

Your backend is **Online and Running** on Railway! ✅

Now you need to:
1. Generate a public domain (so it has a URL)
2. Set the start command
3. Get the public URL
4. Update your frontend code

---

## 📋 Step 1: Generate Public Domain

**Location:** Networking tab (what you're looking at)

**Do this:**
1. See the input field with "1" in it
2. **Clear it** - delete the "1"
3. Type: `5000` (your Node.js port)
4. Click the purple **"Generate Domain"** button
5. Wait a few seconds
6. You'll see a URL appear like: `https://ai-cv-form-prod.up.railway.app`

**Copy this URL!** You'll need it soon.

---

## 📋 Step 2: Set Start Command

**Location:** Deploy tab (third screenshot)

**Do this:**
1. Click **"+ Start Command"**
2. Paste: `node server-groq.js`
3. Press Enter or click Save

This tells Railway how to run your backend.

---

## 📋 Step 3: Verify Environment Variables

**Check that this variable is set:**
- Key: `REACT_APP_GROQ_KEY`
- Value: Your Groq API key (should already be there from setup)

If it's missing, add it!

---

## ✅ After Setup

Once you've done these steps, you should see:

- ✅ Service is "Online"
- ✅ Public domain is generated
- ✅ Start command is set
- ✅ No error logs

---

## 🔗 Your Backend URL

After generating the domain, it will look like:
```
https://ai-cv-form-prod.up.railway.app
```

**Keep this URL handy!** You'll paste it into your frontend code.

---

## 🧪 Test Your Backend

Once the domain is generated, test it by visiting:
```
https://YOUR-RAILWAY-URL/api/health
```

You should see:
```json
{
  "status": "ok",
  "type": "groq-powered + nexus-contact",
  "hasApiKey": true
}
```

If you see this, your backend is working! ✅

---

## 📝 Next Steps After Railway Setup

1. ✅ Generate domain → Get public URL
2. ✅ Set start command → `node server-groq.js`
3. ✅ Test health endpoint
4. 📝 Update frontend code (I'll help with this!)
5. 📝 Push to GitHub
6. 📝 Test everything works

---

## 💡 If Something Goes Wrong

### Domain Won't Generate
- Make sure the port is: `5000`
- Click "Generate Domain" button (purple button)
- Wait 10-15 seconds

### App Won't Start
- Check "Deploy Logs" tab
- Look for error messages
- Make sure `node server-groq.js` is the correct start command

### Health Check Fails
- Visit: `https://YOUR-URL/api/health`
- If 404: App isn't running properly
- Check Logs tab for errors

---

## ✅ Checklist

- [ ] Port set to `5000`
- [ ] "Generate Domain" button clicked
- [ ] Public URL generated (copy it!)
- [ ] Start command set to `node server-groq.js`
- [ ] Saved/applied changes
- [ ] Test `/api/health` endpoint
- [ ] See success response

---

## 🎯 What's Your URL?

Once generated, tell me your public URL and I'll update your frontend code for you!

It will look like:
```
https://ai-cv-form-prod.up.railway.app
https://clever-respect-production.up.railway.app
https://[something].up.railway.app
```

---

**Tell me when you've:**
1. Generated the domain
2. Set the start command
3. Got your public URL

Then I'll update your frontend! 🚀
