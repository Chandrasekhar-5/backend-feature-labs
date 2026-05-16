# Day 1 - Project Setup

## Repository Setup

### Actions Performed

- Created GitHub repository:
  backend-feature-labs

- Created local project folder

- Opened project in VS Code

---

## Project Structure Planning

Created folders:

```text
authentication/
└── manual-auth/
    └── secure-notes-vault/
```

Purpose:
Separate authentication learning projects cleanly.

---

## Documentation Setup

Installed:
- Markdown All in One VS Code extension

Created:
- README.md

Documented:
- project overview
- goals
- APIs
- tech stack
- authentication concepts

---

## Docs Folder Setup

Created:

```text
docs/
├── api_notes.md
├── auth_flow.md
├── database_design.md
├── debugging.md
├── development_log.md
└── token_flow.md
```

Purpose:
Maintain engineering documentation and revision notes.

---

## Git Setup

Commands used:

```bash
git init
git add .
git commit -m "initial setup"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

---

## Backend Initialization

Installed packages:

```bash
npm install express mongoose dotenv morgan nodemon
```

---

## Express App Setup

Created:
- src/app.js
- server.js

Configured:
- express.json()
- morgan middleware

---

## Environment Configuration

Created:
- config/config.js

Features:
- dotenv setup
- env validation
- centralized config object

---

## MongoDB Setup

Actions:
- Created MongoDB Atlas cluster
- Added IP access
- Created DB user
- Added connection URI to .env

Created:
- config/database.js

Purpose:
Centralized database connection logic.

---

## Current Progress

Completed:
- Express server setup
- Environment configuration
- MongoDB connection
- Initial User model creation