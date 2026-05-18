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

<br><br>

# **Day 3 - Protected Routes, Middleware, User APIs, Notes APIs, and Admin APIs**

---

# Documentation Updates

Updated:
- docs files
- README.md

Purpose:
Keep project documentation synchronized with implementation progress.

---

# Session Handling Improvement

Solved previous issue:
- new session record created for every login

---

# Previous Behavior

```text
Every login
↓
New session document created
```

Problem:
Even same device generated multiple session records.

---

# Solution Implemented

Before creating a session:
- check whether same device already exists for user

Logic:
```text
same user + same deviceId
```

If exists:
- update session fields

If not:
- create new session

Purpose:
Reuse sessions for same device and avoid unnecessary session records.

---

# Git Workflow

Actions performed:
- merged branch into main
- deleted completed branch
- created new branch for:
  - user APIs
  - notes APIs
  - admin APIs

Purpose:
Maintain cleaner feature-based development workflow.

---

# Authentication Middleware Setup

Created:
```text
middlewares/auth.middleware.js
```

Purpose:
Protect private routes and implement authorization.

---

# Protect Middleware Flow

Flow implemented:

```text
1. Extract access token
2. Verify JWT
3. Find session
4. Check revoked status
5. Find user
6. Attach req.user
7. Attach req.session
8. next()
```

---

# Protect Middleware Implementation

## Token Extraction

Took token from:
```js
req.headers.authorization
```

If missing:
```js
"Token not found"
```

Purpose:
Prevent unauthorized access.

---

# JWT Verification

Used:
```js
jwt.verify()
```

with:
```js
config.JWT_SECRET
```

Purpose:
Validate access token authenticity.

---

# Session Validation

Found session using:
```js
decoded.session
```

Checks performed:
- session exists
- session not revoked

If invalid:
```js
"Session not found"
"Session revoked"
```

Purpose:
Prevent access using revoked sessions.

---

# User Validation

Found user using:
```js
decoded.id
```

Excluded:
```js
-password
```

If user not found:
```js
"User not found"
```

Purpose:
Ensure valid authenticated user exists.

---

# Request Attachments

Attached:
```js
req.user
req.session
```

Called:
```js
next()
```

Purpose:
Pass authenticated user/session to next middleware or controller.

---

# Admin Middleware

Created:
```js
adminOnly
```

Logic:
```js
if (req.user.role !== "admin")
```

Response:
```js
"Access denied"
```

Purpose:
Restrict admin-only routes.

---

# Error Middleware Setup

Created:
```text
middlewares/error.middleware.js
```

Created:
```js
errorHandler
```

Imported and used in:
```js
app.js
```

Purpose:
Centralized error handling.

---

# User APIs Implementation

Created:
```text
controllers/user.controller.js
```

---

# Get Profile API

Created function:
```js
me
```

Returned:
```js
req.user
```

Purpose:
Allow authenticated user to retrieve profile information.

---

# User Routes Setup

Created:
```text
routes/user.routes.js
```

Configured route:
```js
GET /me
```

Middlewares:
```js
protect
```

Controller:
```js
userController.me
```

Mounted in:
```js
/api/users
```

Result:
API tested successfully.

---

# Notes APIs Implementation

Created:
```text
controllers/note.controller.js
```

---

# Create Note API

Created function:
```js
createNote
```

Took:
```js
title
content
```

Validation:
```js
All fields are required
```

Created note with:
```js
title
content
owner: req.user._id
```

Purpose:
Ensure notes belong to authenticated user.

---

# Note Routes Setup

Created:
```text
routes/note.routes.js
```

Configured:
```js
POST /create-note
```

Middleware:
```js
protect
```

Controller:
```js
noteController.createNote
```

Mounted in:
```js
/api/notes
```

---

# Get My Notes API

Created function:
```js
getMyNotes
```

Used:
```js
owner: req.user._id
```

Purpose:
Return only authenticated user’s notes.

Configured route:
```js
GET /my-notes
```

Middleware:
```js
protect
```

Result:
Tested successfully.

---

# Update My Note API

Created function:
```js
updateMyNote
```

Took:
```js
noteId
```

from:
```js
req.params
```

---

# Allowed Fields Design

Created:
```js
allowedFields
```

Current fields:
```js
title
content
```

Observation:
In production:
- only non-sensitive fields should be user-editable.

---

# Dynamic Update Object

Used:
```js
Object.entries(req.body)
```

Logic:
- validate field
- skip undefined values
- build updates object dynamically

Purpose:
Prevent unwanted field modification.

---

# Note Update Logic

Used:
```js
findByIdAndUpdate()
```

Options:
```js
new: true
runValidators: true
```

If note not found:
```js
"Note not found"
```

Result:
API tested successfully.

---

# Delete Note API

Created function:
```js
deleteNote
```

Used:
```js
findByIdAndDelete()
```

Validation:
```js
Note not found
```

Response:
```js
"Note deleted successfully"
```

Result:
All note APIs tested successfully.

---

# Admin APIs Implementation

Created:
```text
controllers/admin.controller.js
```

---

# Get All Users API

Created function:
```js
getAllUsers
```

Used:
```js
role: "user"
```

Purpose:
Return all normal users.

---

# Admin Routes Setup

Created:
```text
routes/admin.routes.js
```

Used middlewares:
```js
protect
adminOnly
```

Configured route:
```js
GET /all-users
```

Mounted in:
```js
/api/admin
```

---

# Important Bug Encountered

Problem:
API returned:
```text
IPC timeout
```

---

# Root Cause

Forgot:
```js
next()
```

inside:
```js
adminOnly
```

middleware.

---

# Fix

Added:
```js
next()
```

Result:
Admin API worked correctly.

---

# Delete Any Note API

Created function:
```js
deleteAnyNote
```

Took:
```js
noteId
```

Used:
```js
findByIdAndDelete()
```

Validation:
```js
Note not found
```

Response:
```js
"Note deleted successfully"
```

Configured route:
```js
DELETE /delete-note/:noteId
```

Middlewares:
```js
protect
adminOnly
```

Result:
Admin note deletion working successfully.

---

# Current Progress

Completed:
- authentication middleware
- admin middleware
- error middleware
- get profile API
- create note API
- get my notes API
- update note API
- delete note API
- get all users API
- delete any note API

---

# Learnings Today

- Learned protected route flow
- Understood middleware chaining
- Learned role-based authorization
- Understood request attachment patterns
- Learned dynamic update object handling
- Understood centralized error middleware
- Learned importance of next() in middleware flow

---

# Tomorrow's Plan

- Start frontend
- Connect frontend with APIs
- Implement authentication frontend flow
- Add protected frontend pages
- Improve validation and production readiness