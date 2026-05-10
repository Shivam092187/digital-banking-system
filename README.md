💳 Digital Banking System

A secure full-stack banking system built using the MERN stack that simulates real-world banking operations like account management, fund transfer, deposits, and transaction tracking using a ledger-based architecture.

🌐 Live Demo
👉 https://digital-banking-system-2.onrender.com

🚀 Features
User Authentication (JWT)
Create & Manage Bank Accounts
Add Funds (Deposit)
Money Transfer Between Accounts
Ledger-Based Transaction System
Transaction History Tracking
Secure Backend with Middleware Protection

🛠 Tech Stack
Frontend: React.js, Tailwind CSS, Axios
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Security: JWT, bcrypt

📂 Project Structure (FULL COPY READY)
🔵 Backend Structure
Backend/
│
├── src/
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   ├── transaction.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── account.model.js
│   │   ├── ledger.model.js
│   │   ├── transaction.model.js
│   │   ├── blacklist.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   ├── transaction.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │
│   ├── services/
│   │   ├── email.service.js
│   │
│   ├── config/
│   │   ├── db.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json

🟢 Frontend Structure
Frontend/
│
├── src/
│
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── AddFund.jsx
│   │   ├── Transfer.jsx
│   │   ├── TransactionList.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateAccount.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│
├── package.json

⚙️ Setup Instructions
Backend
npm install
npm start

Frontend
npm install
npm run dev

🧠 Key Concepts
REST API Architecture
MVC Pattern
Ledger-Based Banking System
MongoDB Aggregation Pipeline
JWT Authentication
Secure Transaction Flow (DEBIT / CREDIT)

👨‍💻 Author
Shivam Kumar
Full Stack Developer (MERN)
📍 India
