# 🥗 Nutri AI Frontend

A responsive, multilingual nutrition assistant web app powered by AI.  
This is the **frontend** of the Nutri AI system, built with **React**, supporting **voice input**, **AI chatbot**, and **personalized health tracking**.

> 🎥 Demo video and screenshots included below.  
> 🔒 Supports both real user login and **Demo Mode** (no backend required).

---

## 🚀 Live Demo (Optional)

```

[![Watch the demo](https://img.youtube.com/vi/zjjJ3gMtE5g/hqdefault.jpg)](https://youtu.be/zjjJ3gMtE5g)

👉 Click the image above to watch the full demo on YouTube.

```

---

## 🎬 Demo Preview

```
🟠 Click “Demo Login” on the homepage to explore the interface without backend.
```

```
📷 Screenshots:

- Homepage  
  ![Homepage Screenshot](demo-photo/homepage.png)

- AI Chat  
  ![AI Chat Screenshot](demo-photo/chat.png)
```

---

## 🧩 Features

```
- 🌐 Multilingual UI (Chinese, English, Japanese)
- 🔐 User login, registration, and profile form
- 💬 AI-powered dietary chatbot (OpenAI)
- 🎙️ Voice input to record meals, with AI classification
- 🧪 Demo Mode with mock user experience
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

## 📫 Contact

```
Project by Wanlin Yang  
GitHub: https://github.com/wanlinyang1111
```

---
