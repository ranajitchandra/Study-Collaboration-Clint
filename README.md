# 🎓 Student Collaboration Platform - Client

Live Site: [https://student-collab-react.web.app/](https://student-collab-react.web.app/)

A modern web platform for collaborative learning where students and tutors can connect through interactive study sessions. Built with React 19, TailwindCSS 4, and a full suite of modern frontend libraries.

---

## 🚀 Features

### 👤 User Authentication
- Email/password and Google login via Firebase
- JWT-based secure routes and role-based access control
- Auto login persistence with protected routes

### 📚 Study Sessions
- Students can view and book available sessions
- Admin can approve/reject tutor-created sessions
- Tutors can manage their created sessions

### 💸 Payment Integration
- Secure Stripe payment for paid sessions
- Free sessions skip payment

### 💬 Ratings & Reviews
- Students can rate and review completed sessions
- Reviews visible on session detail pages

### 📁 Study Materials
- Tutors upload resources (images and Google Drive links)
- Only accessible by students who booked the session

### 🗂 Dashboard
- Role-specific dashboards (Student, Tutor, Admin)
- Students: view bookings, submit reviews, access materials
- Tutors: manage sessions and uploads
- Admins: approve/reject sessions, moderate content

### 📊 Pagination & Performance
- Pagination implemented on session listings (6 cards per page)
- Data fetching optimized with TanStack Query

### 🌐 Responsive & Animated UI
- Fully responsive design using TailwindCSS and DaisyUI
- Smooth animations with AOS and Framer Motion

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- React Router 7
- TailwindCSS 4 + DaisyUI
- TanStack React Query v5
- React Hook Form
- Axios & Secure Axios Instance
- Firebase Auth
- Stripe Payments (`@stripe/react-stripe-js`)
- SweetAlert2 for interactive alerts
- Toast notifications (`react-hot-toast`, `react-toastify`)
- Swiper JS for sliders
- Framer Motion & AOS for animations
- Lottie React for animated illustrations

---

## 📦 Installation

```bash

# Navigate to the project folder
cd student_colabroration_clint

# Install dependencies
npm install

# Start the dev server
npm run dev
