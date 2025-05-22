# 🥗 Nutri AI Frontend

A responsive, multilingual nutrition assistant web app powered by AI.  
This is the **frontend** of the Nutri AI system, built with **React**, supporting **voice input**, **AI chatbot**, and **personalized health tracking**.

> 🎥 Demo video included below.  
> 🔒 Supports both real user login and **Demo Mode** (no backend required).

---

## 🎬 Demo Preview

🟠 Click “Demo Login” on the homepage to explore the interface without backend.

## 🎥 Demo Video

[![Watch the demo](https://img.youtube.com/vi/zjjJ3gMtE5g/hqdefault.jpg)](https://youtu.be/zjjJ3gMtE5g)

👉 Click the image above to watch the full demo on YouTube.

---

## 🧩 Features

```
- 🌐 Multilingual UI (Chinese, English, Japanese)
- 🔐 User login, registration, and profile form
- 📝 Daily meal tracking & history view
- 📊 Personalized AI summary reports based on user data
- 💬 AI-powered dietary assistance (OpenAI)
- 🎙️ Voice input to record meals, with AI classification
- 📱 Responsive layout (mobile-first)
- 📦 Docker/Nginx deployment ready
```

---

## 🧠 Tech Stack

```
| Layer       | Tech Used                       |
|-------------|---------------------------------|
| Framework   | React 18                        |
| Routing     | React Router DOM v7             |
| Styling     | Tailwind CSS, MUI, Emotion      |
| i18n        | react-i18next                   |
| API         | Axios + OpenAI API integration  |
| Deployment  | Docker + Nginx                  |
```

---

## 🧪 Demo Login

```
Click the “Demo Login” button on the homepage to:
- Skip authentication
- Explore the full UI without needing a backend
- Safely view all page layouts
```

---

## 🛠️ Local Development Setup

```
# Clone the repository
git clone https://github.com/wanlinyang1111/nutri-ai-frontend.git

# Navigate into the project
cd nutri-ai-frontend

# Copy the environment template and fill in your API values
cp .env.example .env

# Install dependencies
npm install

# Run the development server
npm start
```

---

## 📦 Docker Build & Run

```
# Build production image
docker build -t nutri-ai-frontend .

# Run it locally on port 3000
docker run -p 3000:80 nutri-ai-frontend
```

```
This uses a lightweight Nginx config to serve the frontend and support client-side routing via:
  try_files $uri /index.html;
Make sure nginx.conf is correctly copied inside the image (see Dockerfile).
```

---

## ⚙️ Environment Variables

```
# Create a .env file based on this template
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_API_KEY=your_openai_api_key
```

```
📁 You can find `.env.example` in the root directory.  
🚫 Do not commit real `.env` files to version control.
```

---

## 📁 Project Structure

```
nutri-ai-frontend/
├── public/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # App pages (Home, Login, etc.)
│   ├── styles/            # CSS files
│   ├── utils/             # API calls, helpers
│   └── App.js             # Root config
├── .env.example
├── .gitignore
├── Dockerfile
├── nginx.conf
└── README.md
```

---

## 📝 Notes

```
- This repo contains frontend only. Backend & admin panel are in separate repositories.
- AI chat and voice input require backend + OpenAI API integration to function fully.
- For mock exploration, use Demo Login to view all pages without backend.
```

---

## 🧩 Nutri AI (User Side) - Architecture

```
🌐 User Browser
   |
   |── React Frontend (nutri-ai-frontend)
   |    - User Interface: meal logging, AI chatbot, profile form
   |    - Voice-to-text meal input
   |    - Calls backend API
   |
   ▼
🧠 OpenAI GPT API
   |    - Generates personalized nutrition summaries
   |
   ▼
🔗 Flask Backend API (nutri-ai-backend)
   |    - Handles requests from frontend
   |    - Stores/retrieves data from database
   |
   ▼
🗂 PostgreSQL Database (nut_basedb)
   |    - User profiles
   |    - Meal records and photos
   |    - Chat logs and AI analysis reports
```

### ✅ Highlights:
- Frontend is standalone and mobile responsive
- Voice meal input analyzed and categorized by GPT
- Daily records are stored and retrievable via user ID
- Personalized AI reports are generated from combined user data

---

## 📫 Contact

```
Project by Wanlin Yang  
GitHub: https://github.com/wanlinyang1111
```

---
