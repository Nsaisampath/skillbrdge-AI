# SkillBridge AI - Student Evaluation Platform

![SkillBridge AI](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Cost](https://img.shields.io/badge/Cost-%240-green)

SkillBridge AI is a **FREE, AI-powered student evaluation platform** that leverages cutting-edge technology to provide intelligent feedback and assessment capabilities.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Architecture](#-architecture)
- [License](#-license)

---

## ✨ Features

### 🎓 Core Features
- **AI-Powered Evaluations**: Real-time student assessment using Groq AI (llama-3.3-70b-versatile)
- **Student Dashboard**: Submit profiles and receive AI-generated evaluations
- **Admin Dashboard**: Manage students, view evaluations, and track progress
- **Secure Authentication**: Firebase Auth with email/password
- **Cloud Database**: Firebase Firestore for real-time data sync
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

### 🎨 UI/UX Enhancements
- **Unified Color Scheme**: Seamless gradient design across all pages
- **Smart Navigation**: Context-aware dropdown menus
- **Smooth Animations**: Hover effects and transitions
- **Profile Dropdown**: Quick access to account functions
- **Dark Mode**: Modern dark theme optimized for readability

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.0+ | UI library & components |
| Vite | 7.3.1 | Build tool & bundler |
| Tailwind CSS | v4 | Utility-first styling |
| React Router | v6 | Client-side routing |
| Context API | - | State management |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.18+ | Web framework |
| Groq SDK | Latest | AI LLM integration |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 16.3+ | Environment variables |

### Database & Authentication
| Service | Tier | Purpose |
|---------|------|---------|
| Firebase Firestore | Spark (FREE) | Cloud database |
| Firebase Auth | FREE | User authentication |
| Groq AI API | FREE | LLM (14k req/min) |

### Deployment
| Service | Tier | Purpose |
|---------|------|---------|
| Render | Free | Backend hosting |
| Vercel/Netlify | Free | Frontend hosting |

---

## 📁 Project Structure

```
skillbridge-ai/
├── src/
│   ├── pages/
│   │   ├── PublicHomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── StudentDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── AuthContext.jsx
│   ├── evaluationService.js
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.local
├── dist/
├── public/
├── .env
├── package.json
├── vite.config.js
├── tailwind.config.js
├── firebase.json
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ & npm 9+
- Firebase account (free Spark plan)
- Groq API key (free)
- Git

### Setup Steps

**1. Clone & Install**
```bash
git clone https://github.com/yourusername/skillbridge-ai.git
cd skillbridge-ai
npm install
cd backend && npm install && cd ..
```

**2. Configure Environment**

Create `.env`:
```env
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_BACKEND_URL=http://localhost:3000
```

Create `backend/.env.local`:
```env
GROQ_API_KEY=your_groq_key
PORT=3000
```

**3. Start Servers**

Terminal 1:
```bash
cd backend && npm start
```

Terminal 2:
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📖 Usage

**Students**
1. Register with email/password
2. Login → Student Dashboard
3. Submit profile information
4. Get instant AI evaluation

**Admins**
1. Login with admin credentials
2. Access Admin Dashboard
3. View all students & evaluations

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel
```

### Backend (Render)
1. Push to GitHub
2. Create Web Service on render.com
3. Connect GitHub repo
4. Build: `cd backend && npm install`
5. Start: `cd backend && npm start`
6. Add `GROQ_API_KEY` environment variable

### Update Frontend URL
```env
VITE_BACKEND_URL=https://your-render-backend.onrender.com
```

---

## 🔐 Environment Variables

### Frontend (.env)
- `VITE_FIREBASE_API_KEY` - Firebase authentication
- `VITE_BACKEND_URL` - Backend server URL

### Backend (backend/.env.local)
- `GROQ_API_KEY` - Groq AI API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

---

## 🏗 Architecture

```
User Browser (React)
    ↓
Frontend (Vite + Tailwind)
    ↓
Backend API (Express.js)
    ↓
Groq AI (llama-3.3-70b)
    ↓
Firebase Firestore (Database)
```

---

## 💰 Cost: $0 🎉

| Service | Cost |
|---------|------|
| Firebase Firestore | FREE |
| Firebase Auth | FREE |
| Groq AI API | FREE (14k req/min) |
| Render Backend | FREE |
| Vercel Frontend | FREE |
| **TOTAL** | **$0** |

---

## 📊 Performance

- Bundle Size: 663 KB (194 KB gzipped)
- Build Time: ~5 seconds
- Lighthouse Score: 85+
- API Response: <2 seconds

---

## 🐛 Troubleshooting

**Backend Connection Failed**
- Check `VITE_BACKEND_URL` in `.env`
- Ensure backend is running: `http://localhost:3000`

**Firebase Error**
- Verify API key in Firebase Console
- Enable Email/Password auth

**Groq API Error**
- Check `GROQ_API_KEY` is valid
- Check rate limits (14k/min)

**Render Deployment**
- Free tier sleeps after 15 min
- First request takes ~30 seconds (normal)

---

## 📞 Support

- Open GitHub issues
- Check project documentation
- Review deployment guides

---

## 📝 License

MIT License - Free to use & modify

---

**Created with ❤️ for educators & students**

Version: 1.0.0 | Updated: January 26, 2026
