# Contributing to Content Management System (CMS)

Thank you for your interest in contributing 🙌  
This repository is open-source and contributions are welcome.

Please read this document carefully before starting.

---

## 📌 Repository Overview

This project is a **monorepo** that contains:

- **Client** → Frontend built with **Next.js**
- **Server** → Backend built with **Node.js / Express**

The project is designed so that **both Client and Server are run together from the root directory**.


## 📁 Project Structure
```bash
CONTENT_MANAGEMENT_SYSTEM/
│
├── Client/ # Frontend (Next.js)
│ ├── app/
│ ├── components/
│ ├── context/
│ ├── hooks/
│ ├── lib/
│ ├── public/
│ ├── styles/
│ ├── docs/
│ ├── middleware.ts
│ ├── next.config.mjs
│ ├── tsconfig.json
│ └── package.json
│
├── Server/ # Backend (Node.js / Express)
│ ├── Api/
│ ├── CheckPoint/
│ ├── config/
│ ├── core/
│ ├── Database/
│ ├── Models/
│ ├── Routes/
│ ├── Services/
│ ├── Utils/
│ ├── Validation/
│ ├── server.js # -----> entry point
│ └── package.json
│
├── CONTRIBUTING.md
├── README.md
├── STATUS.md
├── package.json # ---->Root scripts (runs Client + Server)
└── package-lock.json

```



## ▶️ Running the Project (IMPORTANT)
### 1️⃣ Clone the repository
```bash
git clone https://github.com/Himesh-Bhattarai/Open_Source_CMS
cd Client
2️⃣ Install dependencies
From the root directory:
npm install
This installs dependencies for:
root
Client
Server

3️⃣ Start development mode
From the root directory:
✅ This command: npm run dev

Starts the Next.js Client
Starts the Node.js Server

Handles both processes together

⚙️ Server Details
Server entry file:
Server/server.js

🔐 Environment Variables
Do NOT commit .env files


Each service (Client / Server) manages its own environment

🌱 Contribution Workflow
Fork this repository
Create a new branch:
git checkout -b feature/your-feature-name   || bug/your-bug || improvement-inprovement 
Make your changes

Ensure everything runs correctly:
npm run dev
Commit your changes:

### Commit Message Convention (Required)

All commits **must include an HTTP status code**.
status(<HTTP_CODE>): short, clear description
Examples :
git commit -m "status(201): API working for blog post creation"
git commit -m "status(500): handle server crash on menu API"

Refer to [STATUS.md](./STATUS.md) for the list of supported status codes.

**Format:**

Push your branch and open a Pull Request against main

🧩 What Can You Contribute?
Bug fixes
API improvements
CMS features
Performance optimizations
Documentation improvements
Code cleanup & refactoring
If unsure, open an Issue first.

📏 Contribution Guidelines
Keep PRs small and focused
Follow existing code patterns
Do not introduce breaking changes without discussion
Respect the multi-tenant CMS architecture
No secrets, no credentials, no .env

🛠 Troubleshooting
Server does not start?
Ensure you ran npm run dev from the root

Ensure Server/server.js exists

Ensure Node.js version is compatible

💬 Need Help?
If you have questions:
Comment on an existing Issue
Open a new Issue with details
Discussion and collaboration are encouraged
