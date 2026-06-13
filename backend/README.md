# CyberRakshak Backend API Documentation

## Base URL

Development:

```text
http://localhost:8000/api/
```

---

# Authentication Flow

1. Register user
2. Login user
3. Store access and refresh tokens
4. Send access token in Authorization header
5. Refresh token when access token expires

Authorization Header:

```http
Authorization: Bearer <access_token>
```

---

# 1. Register User

### Endpoint

```http
POST /api/register/
```

### Request Body

```json
{
  "username": "ayush",
  "email": "ayush@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "User created successfully"
}
```

### Error Response

```json
{
  "error": "Username already exists"
}
```

Status Code:

```text
201 / 200
```

---

# 2. Login User

### Endpoint

```http
POST /api/login/
```

### Request Body

```json
{
  "username": "ayush",
  "password": "password123"
}
```

### Success Response

```json
{
  "refresh": "jwt_refresh_token",
  "access": "jwt_access_token"
}
```

### Frontend Action

Store:

```javascript
localStorage.setItem("access", data.access);
localStorage.setItem("refresh", data.refresh);
```

---

# 3. Refresh Access Token

### Endpoint

```http
POST /api/refresh/
```

### Request Body

```json
{
  "refresh": "jwt_refresh_token"
}
```

### Response

```json
{
  "access": "new_access_token"
}
```

Use when access token expires.

---

# 4. Scam Detection

### Endpoint

```http
POST /api/detect-scam/
```

### Authentication

Optional

Works for:

* Logged-in users
* Guests

### Request Body

```json
{
  "text": "Congratulations! You have won ₹50,000. Click here now."
}
```

or

```json
{
  "message": "Congratulations! You have won ₹50,000. Click here now."
}
```

### Success Response

```json
{
  "status": "success",
  "input_text": "Congratulations! You have won ₹50,000. Click here now.",
  "prediction": "scam"
}
```

Possible predictions:

```text
scam
legitimate
```

### Error Response

```json
{
  "error": "Field 'text' is required."
}
```

### Gamification Logic

Authenticated users automatically receive:

* Points
* Streak updates
* Level updates

after each detection request.

---

# 5. User Profile

### Endpoint

```http
GET /api/profile/
```

### Authentication

Required

### Headers

```http
Authorization: Bearer <access_token>
```

### Success Response

```json
{
  "username": "ayush",
  "points": 250,
  "streak": 5,
  "level": 3
}
```

### Frontend Usage

Use on:

* Dashboard
* Profile page
* User stats widget

---

# 6. Leaderboard

### Endpoint

```http
GET /api/leaderboard/
```

### Authentication

Not required

### Success Response

```json
[
  {
    "username": "user1",
    "points": 400,
    "streak": 8,
    "level": 5
  },
  {
    "username": "user2",
    "points": 350,
    "streak": 6,
    "level": 4
  }
]
```

### Frontend Usage

Use for:

* Global leaderboard page
* Top users sidebar
* Rankings section

Returns top 10 users sorted by points.

---

# Frontend API Service Examples

## Login

```javascript
const response = await fetch(
  "http://localhost:8000/api/login/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  }
);

const data = await response.json();
```

---

## Authenticated Request

```javascript
const response = await fetch(
  "http://localhost:8000/api/profile/",
  {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }
);
```

---

## Scam Detection

```javascript
const response = await fetch(
  "http://localhost:8000/api/detect-scam/",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      text: userInput
    })
  }
);

const data = await response.json();
```

---

# Integration Checklist

## Authentication

* [ ] Register page
* [ ] Login page
* [ ] Logout
* [ ] Token storage
* [ ] Auto refresh token

## Scam Detection

* [ ] Input box
* [ ] Submit button
* [ ] Result card
* [ ] Prediction badge

## User Dashboard

* [ ] Username
* [ ] Points
* [ ] Level
* [ ] Streak

## Leaderboard

* [ ] Top 10 users
* [ ] Rank display
* [ ] Points display

---

# Current API Summary

| Method | Endpoint          | Auth Required |
| ------ | ----------------- | ------------- |
| POST   | /api/register/    | No            |
| POST   | /api/login/       | No            |
| POST   | /api/refresh/     | No            |
| POST   | /api/detect-scam/ | Optional      |
| GET    | /api/profile/     | Yes           |
| GET    | /api/leaderboard/ | No            |

```
```
