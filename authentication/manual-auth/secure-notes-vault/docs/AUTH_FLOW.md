# Authentication Flow

## Environment Validation

config.js validates required env variables during startup.

Purpose:
- Prevent server from running with missing secrets/configuration.
- Throws new error if any env variable is missing.

---

## Express Middleware Flow

app.js:
1. express.json()
2. morgan("dev")

Purpose:
- Parse JSON request bodies
- Log incoming requests

<br><br>

# Authentication Flow

---

# Protected Route Flow

```text
Frontend sends access token
↓
Protect middleware extracts token
↓
JWT verification
↓
Find session
↓
Check revoked status
↓
Find user
↓
Attach req.user
↓
Attach req.session
↓
next()
```

Purpose:
Ensure only authenticated users access protected routes.

---

# Access Token Validation

Steps:
1. Extract token from headers
2. Verify JWT
3. Decode payload
4. Validate session
5. Validate user

Purpose:
Authenticate API requests securely.

---

# Session Validation

Used:
```js
decoded.session
```

Checks:
- session exists
- session not revoked

Purpose:
Prevent usage of invalid sessions.

---

# User Validation

Used:
```js
decoded.id
```

Excluded:
```js
-password
```

Purpose:
Prevent sensitive data exposure.

---

# Middleware Request Attachments

Attached:
```js
req.user
req.session
```

Purpose:
Share authenticated user/session across controllers.

---

# Admin Authorization Flow

```text
Authenticated user
↓
Check req.user.role
↓
If admin → next()
↓
Else → Access denied
```

Purpose:
Restrict sensitive APIs to admins only.

---

# Session Reuse Design

Previous behavior:
- every login created new session

New behavior:
- same deviceId reuses session

Purpose:
Reduce duplicate session records.