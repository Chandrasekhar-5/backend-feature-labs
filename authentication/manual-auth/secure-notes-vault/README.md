# Secure Notes Vault

## Overview

Secure Notes Vault is a backend-focused project built to learn authentication,
authorization, JWT, refresh tokens, RBAC, and secure API design.

Users can create private notes securely while admins can moderate content.

## Goal

This project is built to deeply understand how modern authentication and authorization systems work in real-world applications.


## Table of Contents
- [Secure Notes Vault](#secure-notes-vault)
  - [Overview](#overview)
  - [Goal](#goal)
  - [Table of Contents](#table-of-contents)
  - [Main Features](#main-features)
    - [1. Authentication System](#1-authentication-system)
    - [2. Authorization System](#2-authorization-system)
    - [3. Roles (Simple RBAC)](#3-roles-simple-rbac)
  - [Database Models](#database-models)
    - [User Model](#user-model)
    - [Note Model](#note-model)
    - [Session Model](#session-model)
      - [A user can:](#a-user-can)
  - [Tech Stack](#tech-stack)
    - [Frontend:](#frontend)
    - [Backend:](#backend)
    - [Database:](#database)
    - [Libraries:](#libraries)
  - [APIs:](#apis)
    - [AUTH APIs](#auth-apis)
    - [1. Register](#1-register)
      - [Request body:](#request-body)
      - [Response body:](#response-body)
    - [2. Login](#2-login)
  - [Request Body](#request-body-1)
  - [Response Body](#response-body-1)
    - [3. Refresh Access Token](#3-refresh-access-token)
  - [Request Body](#request-body-2)
  - [Response body](#response-body-2)
    - [4. Logout](#4-logout)
  - [Request Body](#request-body-3)
  - [Respone Body](#respone-body)
    - [5. Logout All Devices](#5-logout-all-devices)
  - [Request Body](#request-body-4)
  - [Response Body](#response-body-3)
    - [6. Forgot Password](#6-forgot-password)
    - [7. Reset Password](#7-reset-password)
    - [USER APIs](#user-apis)
    - [1.  Get Profile](#1--get-profile)
    - [NOTES APIs](#notes-apis)
    - [1. Create Note](#1-create-note)
    - [2. Get My Notes](#2-get-my-notes)
    - [3. Update My Note](#3-update-my-note)
    - [4. Delete My Note](#4-delete-my-note)
    - [ADMIN APIs](#admin-apis)
    - [1. Get All Users](#1-get-all-users)
    - [2. Delete Any Note](#2-delete-any-note)
  - [Folder Structure](#folder-structure)
  - [Installation](#installation)
  - [Run the Server](#run-the-server)
  - [Environment Variables](#environment-variables)



## Main Features

### 1. Authentication System

**Signup**

User creates account.

* Store:

```
- name
- email
- password (hashed)
```

**Concepts:**

```
- validation
- hashing
- duplicate email check
```


**Login**

User logs in.

* Backend should:

```
- verify password
- create access token
- create refresh token
- send access token
- store refresh token securely
```

**Concepts:**

```
- bcrypt compare
- JWT signing
- cookies
- Refresh Token Flow
```

**When access token expires:**

```
- frontend sends refresh token
- backend verifies refresh token
- backend creates new access token
```

**Concepts:**

```
- token rotation
- session continuation
- Logout
- clear refresh token
- invalidate session
```

**Optional:**

logout from all devices

**Concepts:**

```
- session management
```


### 2. Authorization System


Every note belongs to a specific user.

*Example:*

- Chandu creates Note A

- Sujith should NEVER access it
  

**Before update/delete:**

- backend checks ownership

**Concepts:**
```
- authorization
- resource ownership
- secure backend checks
```


### 3. Roles (Simple RBAC)

Add:
```
- user
- admin
```

Admin can:

- view all users
- delete inappropriate notes


**Concepts:**

```
- role-based access control
```


## Database Models

### User Model
```js
{
  username,
  email,
  password,
  role
}
```

### Note Model
```js
{
  title,
  content,
  owner
}
```

owner → references User ID

### Session Model
```js
{
  user,
  refreshTokenHash,
  ip,
  userAgent,
  revoked,
  createdAt,
  updatedAt
}
```

#### A user can:

1. Register
2. Login
3. Create private notes
4. View only their own notes
5. Edit/Delete only their own notes
6. Stay logged in using refresh tokens
7. Logout from one device or all devices
8. Reset password
9. Access protected routes using JWT auth
    
<br>

**Concepts used:**

- Authentication
- Authorization
- JWT
- Access token vs refresh token
- Cookies
- Password hashing
- Protected routes
- Role-based authorization
- Middleware
- Token rotation
- Secure API design
- Ownership validation
- Session handling



## Tech Stack

### Frontend:

- HTML
- CSS
- JavaScript

### Backend:

- Node.js
- Express.js

### Database:

- MongoDB

### Libraries:

- bcrypt
- jsonwebtoken
- cookie-parser
- dotenv
- mongoose
- morgan
- nodemon



## APIs:

### AUTH APIs

### 1. Register

```
POST /api/auth/register 
```

#### Request body:
```json
{
  "username": String,
  "email": String,
  "password": String,
  "role": String
}
```

#### Response body:
```json
{
  "message": "User registered successfully",
  "user": {
    "username": String,
    "email": String,
    "role": String
  },
  "accessToken": String
}
```


### 2. Login

```
POST /api/auth/login
```

## Request Body
```
{
"email": String,
"password": String
}
```


## Response Body
```
{
  "message": "User logged in successfully",
  "user": {
    "username": String,
    "email": String,
    "role": String
  },
  "accessToken": String
}
```


### 3. Refresh Access Token

```
POST /api/auth/refresh
```

## Request Body
- cookie


## Response body
```json
{
  "message": "Access token refreshed successfully",
  "accessToken": String
}
```

### 4. Logout
```
POST /api/auth/logout
```

## Request Body
- cookie

## Respone Body
```json
{
"message": "User logged out successfully"
}
```

<br>

```json
{
"message": "Refresh token is not found"
}
```


### 5. Logout All Devices
```
POST /api/auth/logout-all
```

## Request Body
- cookie


## Response Body
```json
{
  "message": "All sessions logged out successfully"
}
```

<br>


```json
{
  "message": "Refresh Token is not found"
}
```


### 6. Forgot Password
```
POST /api/auth/forgot-password
```


### 7. Reset Password
```
POST /api/auth/reset-password/:token
```


### USER APIs

### 1.  Get Profile
```
GET /api/users/me
```
Protected route.


### NOTES APIs

### 1. Create Note
```
POST /api/notes
```


### 2. Get My Notes
```
GET /api/notes
```


### 3. Update My Note
```
PUT /api/notes/:id
```
Ownership check required.


### 4. Delete My Note
```
DELETE /api/notes/:id
```
Ownership check required.


### ADMIN APIs

### 1. Get All Users
```
GET /api/admin/users
```
Admin only.


### 2. Delete Any Note
```
DELETE /api/admin/notes/:id
```
Admin only.


## Folder Structure

```text
project/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
└── .env
```

## Installation

```bash
git clone <repo-url>
cd secure-notes-vault
npm install
```

## Run the Server

```bash
npm run dev
```


## Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```