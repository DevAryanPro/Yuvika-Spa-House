# Yuvika Spa House

## Description

Yuvika Spa House is a web application designed to provide a seamless and interactive experience for managing spa appointments. The core feature is an AI-powered virtual assistant named Rhea, who helps users check for available time slots and book appointments for various spa services. Rhea operates with a professional yet engaging demeanor, guiding users through the booking process for services like massages, facials, manicures, pedicures, or full packages. The system aims to simplify appointment scheduling and enhance user engagement through an intelligent conversational interface.

## Features

- User Authentication (Login/Register)
- Dashboard for users
- View Scheduled Appointments
- Appointment Scheduling via AI Agent
- Real-time Broadcast Messaging
- Admin Panel for sending broadcasts
- Dark Mode (persisted per-user)
- Feedback Submission (sends email to owner with feedback details)
- AI Booking Agents (Text and Speech modes)
- Comprehensive Admin Dashboard (Messages, Schedule, AI Agent config, Settings)
- Secure Authentication with Supabase Auth & JWT
- Role-Based Access Control

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend/Database:** Supabase
- **Realtime:** Supabase Realtime
- **AI:** OpenAI GPT-4-Turbo (configurable), Web Speech API, OpenAI Audio
- **Email:** SMTP for confirmations and reminders

## Project Structure

- `vite-project/src/pages/`: Contains the main page components (Dashboard, Login, Register, AdminBroadcast).
- `vite-project/src/components/`: Contains reusable UI components.
- `vite-project/src/config/`: Supabase client configuration.
- `public/`: Static assets and service worker.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn)
- Supabase account and project setup
- Gemini API Key (for AI features)

### Installation

1. **Clone the repository (if applicable):**
   ```bash
   git clone https://github.com/DevAryanPro/Yuvika-Spa-House
   cd Yuvika-Spa-House

2. Navigate to the frontend project directory:
   ```bash
   cd vite-project

3. Install dependencies:
   ```bash
   npm install

4. Create a .env file in the root directory and add your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

## Set up environment variables: 
 Create a .env file in the vite-project directory and add your Supabase credentials:
 EMAIL_USER=user@gmail.com
 EMAIL_PASS=xyzpass
 OWNER_EMAIL=owner@gmail.com
 VITE_SUPABASE_URL=
 VITE_SUPABASE_ANON_KEY=ey

 5. Start the development server:
   ```bash
   npm run dev

## Usage
- Access the application through your browser at the local development URL.
- Register a new user account or log in with existing credentials.
- Navigate through the dashboard sections: Dashboard overview, Messages, Schedule, AI Agent.
- Admins can access /admin-broadcast to send messages to all users.

## Broadcast Messaging
- Users on the dashboard will receive real-time broadcast messages sent by an admin.
- Users can enable browser notifications to be alerted of new broadcast messages.

## 🔐 Authentication & Security
- Supabase Auth for secure email/password login
- JWT tokens for API protection
- Role-Based Access: user vs admin
- HTTPS enforced in production

## 🤝 Contributing
We welcome contributions! Please:

1. Fork the repo
2. Create a feature branch ( git checkout -b feature/awesome )
3. Commit your changes ( git commit -m 'feat: add awesome feature' )
4. Push to your branch ( git push origin feature/awesome )
5. Open a Pull Request


## 📄 License
Distributed under the MIT License. See LICENSE for more information. (Assuming you have a LICENSE file or will add one)

❤️ Thank you for choosing Yuvika Spa House — where AI meets relaxation!
