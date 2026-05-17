# **Debugging Notes**

---

# Problem: Refresh Token Hash Lookup

## Issue

Refresh tokens were hashed using bcrypt.

Because bcrypt uses salting:
- same input generates different hashes

Meaning:
Could not hash incoming refresh token again and directly search database.

---

# Why This Happened

bcrypt is designed for password security.

Purpose:
Prevent predictable hashes.

Result:
Direct lookup becomes impossible.

---

# Solution Implemented

Introduced:
```js
deviceId
```

Generated using:
```js
randomUUID()
```

Stored in:
- refresh token payload
- session schema

Used:
- deviceId
- revoked status

to identify sessions.

---

# Problem: Multiple Session Records

## Observation

Every login created a new session document.

Examples:
- login multiple times
- logout then login again

Result:
Multiple session records for same device/application.

---

# Current Behavior

Acts more like:
```text
session history / audit log
```

instead of:
```text
single active session
```

---

# Possible Future Approaches

## Option 1

Keep all sessions.

Advantages:
- multi-device support
- login history
- audit tracking

---

## Option 2

Reuse existing session per device.

Advantages:
- fewer session records
- cleaner session table

Disadvantages:
- less historical tracking

---

# Current Decision

Leaning toward:
```text
single active session
```

for cleaner session table.