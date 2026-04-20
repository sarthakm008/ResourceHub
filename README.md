# 📚 StudyVault

A modern **student resource sharing platform** built with React and Firebase, where students can upload, discover, upvote, bookmark, and discuss academic resources like notes, PDFs, videos, and links.

---

## 🚀 Live Demo
https://resource-hub-chi-woad.vercel.app/

---

## 🧠 Problem Statement

Students often struggle to find **organized, high-quality study resources** across different platforms. StudyVault solves this by creating a **centralized, community-driven hub** where students can share and access learning materials easily.

---

## ✨ Features

### 🔐 Authentication
- Email/password signup & login
- Google OAuth login
- Protected routes

---

### 📤 Resource Management
- Upload study resources (links, PDFs, videos, notes)
- Add subject, semester, tags, and descriptions
- Edit and delete own resources

---

### 🔍 Smart Feed
- Filter by subject, type, and semester
- Search by title, description, or tags
- Sort by most recent or most upvoted

---

### 👍 Engagement
- Upvote / un-upvote resources
- Bookmark / unbookmark resources (persistent)

---

### 💬 Comments
- Add and delete comments on resources
- Real-time updates using Firestore

---

### 📊 Dashboard
- View your uploaded resources
- View bookmarked resources

---

### 👤 Profile
- Edit profile (name, college, avatar)
- Upload profile image

---

## 🛠 Tech Stack

- ⚛️ React 18 (Vite)
- 🔥 Firebase v9 (Auth, Firestore, Storage)
- 🎨 Tailwind CSS
- 🌐 React Router v6
- 🧠 Context API

---

## 📁 Project Structure

```
src/
├── components/
├── context/
├── hooks/
├── pages/
├── services/
└── App.jsx
```

---

## ⚙️ Setup Instructions

```bash
# Clone repo
git clone https://github.com/your-username/studyvault.git

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🚀 Build for Production

```bash
npm run build
```

---

## 🌐 Deployment

Deployed using Vercel.  
Make sure to add environment variables in the Vercel dashboard.

---

## 🧠 Key React Concepts Used

- useState → form handling
- useEffect → Firestore listeners
- useMemo → filtering & sorting optimization
- useCallback → event handlers optimization
- useRef → debounce search + file input handling
- Context API → global auth state
- React.lazy + Suspense → code splitting

---

## 🔥 Highlights

- Real-time Firestore updates
- Optimized filtering and sorting
- Batch writes for atomic bookmark updates
- Responsive UI (mobile-first design)
- Clean modular architecture

---

## 👨‍💻 Author

Built by: Sarthak Madaan
