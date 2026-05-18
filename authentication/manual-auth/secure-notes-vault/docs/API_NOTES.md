# API Notes

---

# GET /api/users/me

## Purpose

Return authenticated user profile.

---

## Middleware

```js
protect
```

---

## Response

```json
{
  "user": {}
}
```

---

# POST /api/notes/create-note

## Purpose

Create note for authenticated user.

---

## Middleware

```js
protect
```

---

## Request Body

```json
{
  "title": "My Note",
  "content": "Hello"
}
```

---

# GET /api/notes/my-notes

## Purpose

Return notes belonging to authenticated user.

---

## Middleware

```js
protect
```

---

# PUT /api/notes/update-note/:noteId

## Purpose

Update user note.

---

## Middleware

```js
protect
```

---

## Allowed Fields

```js
title
content
```

---

# DELETE /api/notes/delete-note/:noteId

## Purpose

Delete authenticated user's note.

---

## Middleware

```js
protect
```

---

# GET /api/admin/all-users

## Purpose

Return all normal users.

---

## Middlewares

```js
protect
adminOnly
```

---

# DELETE /api/admin/delete-note/:noteId

## Purpose

Allow admin to delete any note.

---

## Middlewares

```js
protect
adminOnly
```