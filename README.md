# 🌿 Yuvika Spa Massage Website

Welcome to **Yuvika Spa Massage**, the next-gen AI-powered booking and management platform for your spa business! Our brand-new website provides a seamless customer experience backed by powerful AI agents, a modern dashboard for admins, and secure Supabase integration.

---

## 🚀 Table of Contents

1. [✨ Features](#-features)  
2. [🛠️ Tech Stack](#️-tech-stack)  
3. [⚙️ Prerequisites](#️-prerequisites)  
4. [🔧 Installation & Setup](#-installation--setup)  
5. [🔑 Environment Variables](#-environment-variables)  
6. [📂 Project Structure](#-project-structure)  
7. [🖥️ Usage](#️-usage)  
8. [🧑‍💻 Admin Dashboard](#-admin-dashboard)  
9. [🤖 AI Booking Agents](#-ai-booking-agents)  
10. [🌗 Dark Mode](#-dark-mode)  
11. [💡 Booking Guidelines](#-booking-guidelines)  
12. [🔐 Authentication & Security](#-authentication--security)  
13. [🤝 Contributing](#-contributing)  
14. [📄 License](#-license)  

---

## ✨ Features

- **AI-Powered Booking**  
  - Two AI agents:  
    - **Text Mode** for chat-based booking 🤖💬  
    - **Speech Mode** for voice-activated booking 🎙️  
- **Modern UI/UX** built with React + TailwindCSS  
- **Secure Supabase Integration** for user data 📦  
  - Stores name, email, unique ID, booking history  
- **Fully-Featured Admin Dashboard**  
  - Messages Center 📥  
  - Schedule & Calendar 🗓️  
  - AI Agent Controls 🤖  
  - App Settings 🔧  
- **Authentication** — registration required to access dashboard  
- **Dark Mode** toggle for eye-friendly experience 🌙  
- **Booking Availability Check** (available/booked/waitlist)  
- **Responsive** — seamless on desktop, tablet & mobile 📱  

---

## 🛠️ Tech Stack

- **Frontend**: React, TailwindCSS, Lucide Icons, Google Sans  
- **Backend**: Node.js, Express  
- **Database**: Supabase
- **AI Agents**: Gemini (text models)  


---

## ⚙️ Prerequisites

- Node.js v16+ & npm  
- Supabase account & project  
- OpenAI API key  

---

## 🔧 Installation & Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-org/yuvika-spa.git
   cd yuvika-spa
2. **Install dependencies**
   
```bash
npm install
Run in development

```bash
npm run dev
Open http://localhost:3000 in your browser.

3. **Build & Deploy**

```bash
npm run build
npm run start

---

## 🔑 Environment Variables
Create a .env.local file in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

---

## 📂 Project Structure
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── UI (Navbar, Footer, DarkModeToggle, etc.)
│   ├── pages/
│   │   ├── index.tsx      # Landing page
│   │   ├── auth/          # Sign in / Sign up
│   │   ├── dashboard/     # Admin dashboard root
│   │   └── api/           # Next.js API routes
│   ├── lib/
│   │   ├── supabase.ts    # Supabase client
│   │   ├── openai.ts      # AI client
│   └── styles/            # Tailwind config, globals.css
├── .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
