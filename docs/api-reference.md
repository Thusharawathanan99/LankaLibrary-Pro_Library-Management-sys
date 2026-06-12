# LankaLibrary Pro — API Reference

All responses follow this format:

```json
{
  "success": true,
  "message": "Description",
  "data": { ... }
}
```

Paginated responses include:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Authentication

### POST /api/auth/register

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "John@123",
  "phone": "+94771234567"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx1abc...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "phone": "+94771234567",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST /api/auth/login

**Request:**
```json
{
  "email": "admin@lankalibrary.com",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx1abc...",
      "name": "System Administrator",
      "email": "admin@lankalibrary.com",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## Books

### GET /api/books

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search title, author, ISBN, publisher |
| category | string | Filter by category |
| author | string | Filter by author |
| available | boolean | Filter by availability |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Example:** `GET /api/books?search=gatsby&category=Fiction&page=1&limit=10`

### POST /api/books *(Auth: ADMIN, STAFF)*

**Request:**
```json
{
  "title": "New Book Title",
  "author": "Author Name",
  "isbn": "978-1234567890",
  "category": "Technology",
  "publisher": "Publisher Name",
  "quantity": 5
}
```

### PUT /api/books/:id *(Auth: ADMIN, STAFF)*

```json
{
  "title": "Updated Title",
  "quantity": 10
}
```

### DELETE /api/books/:id *(Auth: ADMIN)*

No body required.

---

## Users

### GET /api/users *(Auth: ADMIN, STAFF)*

**Query:** `?search=saman&role=USER&page=1&limit=10`

### POST /api/users *(Auth: ADMIN, STAFF)*

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "Secure@123",
  "role": "USER",
  "phone": "+94771234567"
}
```

### PUT /api/users/:id *(Auth: ADMIN)*

```json
{
  "name": "Updated Name",
  "phone": "+94779876543"
}
```

### DELETE /api/users/:id *(Auth: ADMIN)*

No body required.

---

## Staff

### GET /api/staff *(Auth: ADMIN)*
### POST /api/staff *(Auth: ADMIN)*
### PUT /api/staff/:id *(Auth: ADMIN)*
### DELETE /api/staff/:id *(Auth: ADMIN)*

Same format as Users. Staff are automatically assigned role `STAFF`.

---

## Book Issues

### POST /api/issues/issue *(Auth: ADMIN, STAFF)*

**Request:**
```json
{
  "userId": "clx1user123...",
  "bookId": "clx1book456..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Book issued successfully",
  "data": {
    "id": "clx1issue789...",
    "userId": "clx1user123...",
    "bookId": "clx1book456...",
    "issueDate": "2024-01-01T00:00:00.000Z",
    "dueDate": "2024-01-15T00:00:00.000Z",
    "status": "ISSUED",
    "user": { "name": "Saman Silva" },
    "book": { "title": "Clean Code" }
  }
}
```

### POST /api/issues/return *(Auth: ADMIN, STAFF)*

**Request:**
```json
{
  "issueId": "clx1issue789..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Book returned successfully. Fine of 30 generated (overdue).",
  "data": {
    "issue": {
      "id": "clx1issue789...",
      "returnDate": "2024-01-20T00:00:00.000Z",
      "status": "RETURNED"
    },
    "fine": {
      "id": "clx1fine...",
      "amount": 30,
      "status": "UNPAID"
    }
  }
}
```

### GET /api/issues *(Auth: ALL)*

**Query:** `?userId=...&status=ISSUED&page=1&limit=10`

> Regular users only see their own issues.

---

## Fines

### GET /api/fines *(Auth: ALL)*

**Query:** `?status=UNPAID&page=1`

### PUT /api/fines/:id *(Auth: ADMIN, STAFF)*

```json
{
  "status": "PAID"
}
```

---

## Notifications

### GET /api/notifications *(Auth: ALL)*

**Query:** `?isRead=false&type=SYSTEM&page=1`

Response includes `unreadCount`.

### POST /api/notifications *(Auth: ADMIN)*

**Single notification:**
```json
{
  "userId": "clx1user...",
  "title": "Important Notice",
  "message": "Library will be closed on Monday.",
  "type": "SYSTEM"
}
```

**Broadcast to all users:**
```json
{
  "broadcast": true,
  "title": "Holiday Notice",
  "message": "Library closed Dec 25-26."
}
```

### PUT /api/notifications/:id *(Auth: ALL)*

No body required. Marks notification as read.

Use `PUT /api/notifications/read-all` to mark all as read.

---

## Reports

### GET /api/reports/daily *(Auth: ADMIN, STAFF)*
**Query:** `?date=2024-01-01`

### GET /api/reports/monthly *(Auth: ADMIN, STAFF)*
**Query:** `?year=2024&month=1`

### GET /api/reports/overdue *(Auth: ADMIN, STAFF)*

### GET /api/reports/fines *(Auth: ADMIN)*
**Query:** `?startDate=2024-01-01&endDate=2024-01-31`

### GET /api/reports/active-users *(Auth: ADMIN)*
**Query:** `?limit=20`

### GET /api/reports/most-borrowed *(Auth: ADMIN, STAFF)*
**Query:** `?limit=20`

---

## Dashboard

### GET /api/dashboard *(Auth: ADMIN, STAFF)*

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBooks": 20,
    "totalUsers": 5,
    "totalStaff": 2,
    "totalIssued": 5,
    "totalOverdue": 2,
    "totalFinesCollected": 30
  }
}
```

---

## Activity Logs

### GET /api/activity-logs *(Auth: ADMIN)*

**Query:** `?action=BOOK_ISSUED&userId=...&startDate=...&endDate=...&page=1`

---

## Settings

### GET /api/settings *(Auth: ADMIN)*

### PUT /api/settings *(Auth: ADMIN)*

**Single:**
```json
{
  "key": "fine_per_day",
  "value": "10",
  "description": "Fine per overdue day"
}
```

**Bulk:**
```json
{
  "settings": [
    { "key": "fine_per_day", "value": "10" },
    { "key": "loan_days", "value": "21" }
  ]
}
```

---

## Backup

### POST /api/backup *(Auth: ADMIN)*

No body required. Returns full database export as JSON.

---

## Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Missing or invalid authorization token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Required role(s): ADMIN"
}
```

**400 Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Book not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "A book with this ISBN already exists"
}
```
