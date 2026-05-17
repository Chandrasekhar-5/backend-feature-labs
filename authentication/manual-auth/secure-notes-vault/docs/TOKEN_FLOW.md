# **Token Flow**

---

# Access Token

Purpose:
Authenticate protected API requests.

Contains:
- user._id
- session._id

Expiry:
```js
15 minutes
```

Returned to:
- frontend response body

Purpose:
Short-lived secure authentication.

---

# Refresh Token

Purpose:
Generate new access tokens without forcing login again.

Contains:
- user._id
- deviceId

Expiry:
```js
7 days
```

Stored:
- HTTP-only cookie
- hashed in database

Purpose:
Maintain user sessions securely.

---

# Register Token Flow

```text
Register
↓
Generate refresh token
↓
Hash refresh token
↓
Create session
↓
Generate access token
↓
Store refresh token in cookie
↓
Return access token
```

---

# Login Token Flow

```text
Login
↓
Verify credentials
↓
Generate refresh token
↓
Hash refresh token
↓
Create session
↓
Generate access token
↓
Store refresh token in cookie
↓
Return access token
```

---

# Refresh Token Flow

```text
Access token expires
↓
Frontend sends refresh token
↓
Backend verifies JWT
↓
Find session using deviceId
↓
Compare refresh token hash
↓
Generate new access token
↓
Generate new refresh token
↓
Update session hash
↓
Send new refresh token cookie
↓
Return new access token
```

Purpose:
Implement secure token rotation.

---

# Device ID Design

Problem:
bcrypt hashes are salted and cannot be searched directly.

Solution:
Use:
```js
deviceId
```

Generated using:
```js
randomUUID()
```

Purpose:
Uniquely identify sessions.

---

# Logout Flow

```text
Read refresh token
↓
Verify JWT
↓
Find session using deviceId
↓
Set revoked = true
↓
Clear cookie
↓
Logout successful
```

---

# Logout All Flow

```text
Read refresh token
↓
Verify JWT
↓
Extract user._id
↓
Update all sessions:
revoked = true
↓
Clear cookie
↓
Logout all successful
```