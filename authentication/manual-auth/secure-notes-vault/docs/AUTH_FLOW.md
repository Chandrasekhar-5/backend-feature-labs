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