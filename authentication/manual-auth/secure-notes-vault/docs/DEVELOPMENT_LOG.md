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


<br><br>


# **Day 2 - Authentication System Implementation**

---

# Database Models Setup

Created models:

```text
models/
├── user.model.js
├── note.model.js
└── session.model.js
```

Used:
- mongoose schemas
- model exports

Purpose:
Separate database entities for users, notes, and sessions.

---

# Authentication Controller Setup

Created:
```text
controllers/auth.controller.js
```

Purpose:
Handle authentication-related business logic.

---

# **Register API Implementation**

Created:
- register function

---

## Request Data

Took from `req.body`:

```js
username
email
password
role
```

---

## Validation

Checked:
- all fields exist

If missing:
```js
return res.status(400).json({
   message: "All fields are required"
})
```

Purpose:
Prevent incomplete user registration.

---

## Duplicate User Check

Checked existing user using:
- username
- email

Using:
```js
UserModel.findOne()
```

If found:
```js
"Username or email already exists"
```

Purpose:
Prevent duplicate accounts.

---

# Password Hashing

Installed:

```bash
npm install bcrypt
```

Imported:
```js
bcrypt
```

Used:
```js
bcrypt.hash()
```

Purpose:
Securely store passwords in database.

---

# JWT Setup

Installed:

```bash
npm install jsonwebtoken
```

Imported:
```js
jsonwebtoken
```

Generated JWT secret using:
- jwtsecrets website

Added to:
```env
JWT_SECRET=
```

Configured in:
```text
config/config.js
```

Added:
- env validation
- config export

Purpose:
Centralize secure JWT configuration.

---

# Refresh Token Generation

Generated refresh token using:

```js
jwt.sign()
```

Payload:
```js
user._id
```

Secret:
```js
config.JWT_SECRET
```

Expiry:
```js
7d
```

---

# Refresh Token Hashing

Hashed refresh token before storing.

Purpose:
Prevent raw refresh tokens from being exposed in database.

---

# Session Creation

Created session using:

```js
user._id
refreshTokenHash
ip
userAgent
```

Purpose:
Track user sessions and support multi-device login.

---

# Access Token Generation

Generated access token using:
- user._id
- session._id

Expiry:
```js
15m
```

Purpose:
Short-lived authentication token for protected routes.

---

# Cookie Configuration

Stored refresh token in cookie with:

```js
httpOnly: true
secure: true
sameSite: "strict"
maxAge: 7 * 24 * 60 * 60 * 1000
```

Purpose:
Improve refresh token security.

---

# Register Flow Completed

```text
User Registers
↓
Password hashed
↓
User saved in DB
↓
Refresh token generated
↓
Session created
↓
Access token generated
↓
Refresh token stored in cookie
↓
Access token returned to frontend
```

---
<br>

# **Login API Implementation**

Created:
- login function

---

## Validation

Checked:
- email exists
- password exists

If missing:
```js
"All fields required"
```

---

## User Verification

Used:
```js
UserModel.findOne()
```

If user not found:
```js
"User not found"
```

---

## Password Verification

Used:
```js
bcrypt.compare()
```

If invalid:
```js
"Invalid password"
```

Purpose:
Verify user credentials securely.

---

## Login Token Flow

Performed:
- refresh token generation
- refresh token hashing
- session creation
- access token generation
- cookie setup

Returned:
- success message
- user object
- access token

Purpose:
Complete secure login flow.

---

<br><br>

# **Refresh Token API Implementation**

Implemented:
- refresh token flow
- token rotation

---

## Refresh Token Validation

Took refresh token from:
```js
req.cookies
```

If not found:
```js
"Refresh token not found"
```

---

# Important Design Problem Faced

Problem:
Refresh tokens were hashed using bcrypt.

Because bcrypt uses salting:
- hashing same value again produces different hashes

Meaning:
Could not directly hash incoming token and find session.

---

# Solution Chosen

Introduced:
```js
deviceId
```

Generated using:

```js
randomUUID()
```

Imported from:
```js
crypto
```

Used:
```js
import { randomUUID } from "crypto"
```

Purpose:
Uniquely identify sessions/devices.

---

# Device ID Integration

Added:
```js
deviceId
```

to:
- refresh token payload
- session schema
- register flow
- login flow

Purpose:
Link refresh token to exact session.

---

# Session Lookup During Refresh

Used:
```js
deviceId
revoked: false
```

to find session.

Purpose:
Find exact active session securely.

---

# Refresh Token Verification

Used:
```js
bcrypt.compare()
```

Purpose:
Verify refresh token integrity.

If invalid:
- revoke session
- save session
- return invalid token response

Purpose:
Protect against tampered or stolen refresh tokens.

---

# Token Rotation

Generated:
- new access token
- new refresh token

Updated:
- session refresh token hash

Saved:
- updated session

Sent:
- new refresh token cookie

Returned:
```js
"Access token refreshed successfully"
```

Purpose:
Improve session security.

---

# Refresh Token Error Handling

Handled:
- JsonWebTokenError
- TokenExpiredError

Returned:
```js
"Invalid or expired refresh token"
```

Purpose:
Handle JWT verification failures properly.

---

<br>

# **Logout API Implementation**

Implemented:
- logout function

---

## Logout Flow

Steps:
1. Read refresh token from cookies
2. Verify token
3. Find session using:
   - deviceId
   - revoked false
4. Set:
```js
revoked = true
```
5. Save session
6. Clear cookie
7. Return success response

Purpose:
Invalidate current session securely.

---

# Logout Error Handling

Handled:
- invalid JWT
- expired JWT

Returned:
```js
"Invalid or expired refresh token"
```

---

<br>

# **Logout All Devices API**

Implemented:
- logout all sessions

---

## Logout All Flow

Steps:
1. Verify refresh token
2. Extract user._id
3. Update all active sessions:
```js
revoked = true
```
4. Clear cookie
5. Return success response

Purpose:
Support multi-device logout.

---

# Major Session Design Observation

Observed behavior:

- Every login creates new session record
- Logging out and logging in again creates another session record
- Multiple login requests create multiple active sessions

Example:
3 login requests
→ 3 session documents

Logout:
→ only latest session revoked

---

# Design Decision Discussion

Considered:
- updating same session
vs
- storing every login separately

Realized:
Current structure behaves more like:
```text
session history / audit logs
```

Possible future decision:
Continue with session-based approach for multi-device support and login tracking.

---

# Current Progress

Completed:
- register API
- login API
- refresh token API
- logout API
- logout all API
- JWT integration
- bcrypt integration
- session tracking
- token rotation
- secure cookie setup

---

# Learnings Today

- Learned complete JWT authentication flow
- Understood refresh token rotation
- Learned why bcrypt hashes cannot be searched directly
- Understood session tracking concepts
- Learned secure cookie handling
- Understood device-based session identification
- Learned practical token security design

---

# Tomorrow's Plan

- Implement user APIs
- Implement admin APIs
- Start frontend integration
- Implement protected routes
- Implement authorization middleware