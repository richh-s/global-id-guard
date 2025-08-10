VerifyMe – Global Identity & Trust Verification Framework
Overview
VerifyMe is a microservice-based verification platform enabling businesses and individuals to validate identities, employment records, legal cases, and business credentials manually, via AI, or through government databases (where permitted).

Key Features
✅ Multi-Country Support (India, Australia, UK)
✅ Hybrid Verification (AI + Manual + Govt. Checks)
✅ Fraud Detection (Document tampering, deepfake detection)
✅ Role-Based Access (User, Inspector, Admin)
✅ Real-time AI Confidence Scoring
✅ Manual Review Dashboard for Inspectors
✅ Secure JWT Authentication

Tech Stack
Frontend: React (Vite) + TypeScript + TailwindCSS + shadcn-ui

Backend: Node.js (Express) + TypeScript

Database: PostgreSQL

Auth: JWT-based authentication

AI Service: Mock AI for document fraud detection (valid/invalid + confidence score)

Project Structure
bash
Copy
Edit
verifyme/
│── backend/        # Node.js + Express + PostgreSQL API
│── frontend/       # React + Vite + Tailwind UI
Installation & Setup
1. Clone the Repository
bash
Copy
Edit
git clone <YOUR_GIT_URL>
cd verifyme
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
Create .env in backend/
env
Copy
Edit
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://aman:test2341@localhost:5432/verifyme
JWT_SECRET=your-very-long-jwt-secret-string-here
Start Backend
bash
Copy
Edit
npm run dev
Backend will be running at: http://localhost:4000

3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
Environment Files
.env

env
Copy
Edit
REACT_APP_API_BASE=http://localhost:4000
.env.local

env
Copy
Edit
VITE_API_BASE=http://localhost:4000
.env.local takes precedence when running locally with Vite.

Start Frontend
bash
Copy
Edit
npm run dev
Frontend will be running at: http://localhost:8080

Database Setup
Make sure PostgreSQL is installed and running.

Create the database:

sql
Copy
Edit
CREATE DATABASE verifyme;
Run migrations or manually create required tables (users, verification_requests, etc.).

API Endpoints
Auth
POST /api/auth/signup – Register a new user (User, Inspector, Admin)

POST /api/auth/login – Login and receive JWT token

Verification
POST /api/verify – Upload document for verification

GET /api/status/:id – Check verification status

PUT /api/verification-requests/:id/approve – Approve verification (Inspector/Admin)

PUT /api/verification-requests/:id/reject – Reject verification (Inspector/Admin)

Fraud Detection
GET /api/fraud-detection/:id – AI check for tampered or fake documents (returns valid/invalid + confidence)

Running Without Docker
This project is not dockerized. Run backend and frontend separately with:

bash
Copy
Edit
# Terminal 1 - backend
cd backend
npm run dev

# Terminal 2 - frontend
cd frontend
npm run dev
Security & Roles
User: Upload documents, track status

Inspector: Review and approve/reject

Admin: View audit logs, manage users

Bonus Features (if implemented)
Address Verification (Geotagged photo)

Multi-Country Verification Rules

Fraud Detection UI with tampered region highlighting

