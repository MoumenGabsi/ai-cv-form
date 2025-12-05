# 🚀 AI CV Form - NUIT D'INFO Project

A full-stack application for CV extraction and volunteer management powered by **Groq AI**, built during **NUIT D'INFO 2025**.

---

## 🎯 Live Demo

**[🔗 Try the Live Demo](https://moumengabsi.github.io/ai-cv-form)**

---

## 📋 Project Overview

This project is a modern web application that leverages **Groq AI** to automatically extract and parse CV information, allowing organizations to efficiently manage volunteer applications and contacts.

### Key Features

✨ **AI-Powered CV Extraction**
- Upload PDF or text files
- Automatic parsing using Groq AI (LLaMA 3.3 70B model)
- Extracts: name, email, phone, skills, education, experience

📝 **Smart Form Management**
- Pre-fill volunteer applications with extracted CV data
- Multiple mission types (dev, design, product, marketing, other)
- Real-time form validation

💬 **Contact Management**
- Direct contact form for general inquiries
- Volunteer application tracking
- Timestamp logging for all submissions

🎨 **Beautiful UI/UX**
- Dark theme with purple accents (#5227FF)
- Smooth animations with Framer Motion & GSAP
- Responsive design for all devices
- Canvas-based ASCII art portal

🔐 **Secure & Scalable**
- Environment variable management for API keys
- CORS-enabled backend for cross-origin requests
- Production-ready deployment

---

## 🏗️ Architecture

### Frontend Stack
- **React 19.2.1** - UI framework
- **React Router 6.30.2** - Navigation & routing
- **Framer Motion 12.23.25** - Animations
- **GSAP 3.13.0** - Advanced animations
- **pdfjs-dist 5.4.449** - PDF parsing
- **Mammoth 1.11.0** - Document conversion

**Deployment**: GitHub Pages (`https://moumengabsi.github.io/ai-cv-form`)
**CI/CD**: GitHub Actions (auto-deploy on push)

### Backend Stack
- **Express.js** - REST API server
- **Node.js 22.21.1** - Runtime
- **Groq AI API** - LLaMA 3.3 70B model for CV parsing
- **CORS** - Cross-origin request handling
- **dotenv** - Environment configuration

**Deployment**: Railway (`https://ai-cv-form-production.up.railway.app`)
**Port**: 5000

---

## 📊 Technical Specifications

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/extract-cv` | POST | Parse CV text using Groq AI |
| `/api/contact` | POST | Submit contact form |
| `/api/volunteer-application` | POST | Submit volunteer application |
| `/api/health` | GET | Health check |

### Extracted CV Data Schema
```json
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "skills": ["skill1", "skill2", "skill3"],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree Name",
      "field": "Field of Study",
      "year": "2023"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "duration": "2 years",
      "description": "Job responsibilities"
    }
  ]
}
```

---

## 🎨 Design System

**Color Palette:**
- Primary: `#5227FF` (Purple)
- Secondary: `#82b1ff` (Light Blue)
- Background: `#0a0e27` (Dark Navy)
- Accent: `#00f0ff` (Cyan)

**Animations:**
- Smooth page transitions with Framer Motion
- Parallax effects with GSAP
- Canvas-rendered ASCII portal

---

## 📈 Deployment & DevOps

### Frontend Deployment
```bash
# Automated via GitHub Actions
- Triggers on: push to master branch
- Steps:
  1. Install dependencies (npm ci)
  2. Build app (npm run build)
  3. Deploy to gh-pages branch
```

### Backend Deployment
```bash
# Automated via Railway
- Service: Online & Running
- Region: us-west2
- Start Command: node server-groq.js
- Environment Variables: REACT_APP_GROQ_KEY
```

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Groq API key (free from https://console.groq.com)

### Setup

```bash
# Clone repository
git clone https://github.com/moumengabsi/ai-cv-form.git
cd ai-cv-form

# Install frontend dependencies
npm install

# Create .env file
echo "REACT_APP_GROQ_KEY=your_groq_api_key" > .env

# Start development server
npm start

# In another terminal, start backend
npm install -g nodemon
nodemon server-groq.js
```

### Build for Production
```bash
npm run build
```

---

## 📦 Project Structure

```
ai-cv-form/
├── public/              # Static assets
├── src/                 # React components
│   ├── App.js          # Main component
│   ├── Contact.js      # Contact form
│   ├── Carousel.js     # UI carousel
│   ├── ASCIIPortal.js  # ASCII art component
│   └── App.css         # Styling
├── server-groq.js      # Express backend
├── package.json        # Dependencies
├── .env               # Environment variables
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions CI/CD
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_GROQ_KEY=your_groq_api_key_here
```

**Where to get Groq API Key:**
1. Visit https://console.groq.com
2. Sign up for free
3. Create API key
4. Copy to `.env` file

---

## 🚀 Performance & Optimization

✅ **Frontend Optimizations:**
- Code splitting with React.lazy()
- Lazy loading of components
- CSS minimization
- Image optimization
- Local storage caching

✅ **Backend Optimizations:**
- Request/response compression
- Connection pooling
- Error handling & logging
- Rate limiting ready

---

## 📝 Deployment Checklist

- ✅ Frontend deployed to GitHub Pages
- ✅ Backend deployed to Railway
- ✅ GitHub Actions CI/CD configured
- ✅ Environment variables set
- ✅ Domain mapping configured
- ✅ SSL/HTTPS enabled (automatic via GitHub Pages & Railway)
- ✅ CORS properly configured
- ✅ API rate limiting ready

---

## 🤝 Contributing

This project was created for NUIT D'INFO 2025. Feel free to fork and extend!

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Groq AI** - Free, fast AI API
- **Railway** - Backend hosting
- **GitHub Pages** - Frontend hosting
- **NUIT D'INFO** - Event organizers
- All contributors and supporters

---

## 📞 Support

For issues, questions, or suggestions:
- 🐛 Report bugs via GitHub Issues
- 💬 Discussions available on GitHub
- 📧 Contact through the form in the app

---

**Built with ❤️ during NUIT D'INFO 2025**


### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
