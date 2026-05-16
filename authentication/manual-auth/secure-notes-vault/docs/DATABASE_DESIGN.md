# Database Design

## MongoDB Setup

### Steps Performed

1. Created MongoDB Atlas project
2. Created cluster
3. Configured IP whitelist
4. Created DB admin user
5. Added URI to .env

---

## Connection Flow

server.js
→ connectDB()
→ mongoose.connect()

---

## User Model

File:
models/user.model.js

Purpose:
Store authentication and authorization related user data.

Model:

```json
{
    username,
    email,
    password,
    role,
    timestamps
}
```

## Note Model

File:
models/note.model.js

Purpose:
Store note-related data.

Model:

```json
{
    title,
    content,
    owner,
    timestamps
}
```


## Session Model

File:
models/session.model.js

Purpose:
Store session-related data.

Model:

```json
{
    user,
    refreshToken,
    ip,
    userAgent,
    revoked,
    timestamps
}
```