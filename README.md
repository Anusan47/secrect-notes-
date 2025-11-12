# 🧠 Secure Notes – Encrypted Cloud Note-Taking App

A modern, secure, and beautifully designed note-taking app built with **React**, **Node.js**, and **MongoDB**.  
Create, organize, archive, and manage your notes securely — with animations, encryption, and trash recovery.

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features

- 📝 Create, edit, and delete notes with color customization  
- 🏷️ Organize notes with labels and tags  
- 🔒 JWT authentication and password hashing  
- 📦 Archive notes for later access  
- 🗑️ Trash bin with **30-day auto delete timer**  
- ⏳ Days-left indicator for trashed notes  
- 🔍 Search, filter, and sort notes (newest ↔ oldest)  
- 💫 Glassmorphic UI with smooth Framer Motion animations  
- 📱 Fully responsive design for mobile & desktop  
- ⚙️ Real-time CRUD operations with Axios + Express API  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, TailwindCSS, Framer Motion, GSAP |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Auth** | JWT (Access + Refresh Tokens) |
| **API Calls** | Axios |
| **Version Control** | Git + GitHub |

---

## 🚀 Getting Started

### 🧩 Prerequisites

Make sure you have installed:
- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/atlas/database) (local or Atlas)
- [Git](https://git-scm.com/)

---

💡 Future Enhancements

 Add Dark/Light mode toggle

 Add Markdown/Rich Text Editor

 Add Cloud Sync / Share Notes

 Add Export to PDF

 Add Voice-to-Text Notes


🧑‍💻 Author

👤 Anusan A
💼 Computer Science Student | Full Stack Developer | Cybersecurity Enthusiast
📧 Email Me

🪪 License

This project is licensed under the MIT License.
See the LICENSE
 file for details.

### 🪄 Step 1 — Clone the Repository

```bash
git clone https://github.com/<your-username>/secure-notes.git
cd secure-notes

cd backend
npm install

Create a .env file inside the backend folder:
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/secure-notes
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret

npm start


Frontend Setup (React + Tailwind)

cd frontend
npm install
npm start


