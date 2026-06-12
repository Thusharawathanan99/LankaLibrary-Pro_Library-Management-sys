# LankaLibrary Pro — Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

| Requirement | Version |
|-------------|---------|
| **Node.js** | ≥ 18.x |
| **npm** | ≥ 9.x |
| **MySQL** | ≥ 8.0 |

---

## Step 1: Clone & Install

```bash
# Navigate to the project directory
cd "c:\Users\USER\Music\LankaLibrary Pro\project"

# Install dependencies (already done if you're reading this)
npm install --legacy-peer-deps
```

---

## Step 2: MySQL Database Setup

### Option A: Using MySQL CLI

```sql
-- Connect to MySQL
mysql -u root -p

-- Create the database
CREATE DATABASE lankalibrary_db;

-- Verify it was created
SHOW DATABASES;
```

### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL instance
3. Run: `CREATE DATABASE lankalibrary_db;`

---

## Step 3: Configure Environment Variables

The `.env` file is already configured with defaults. Update these values if your MySQL setup differs:

```env
# MySQL — update username, password, host, port, and database name as needed
DATABASE_URL="mysql://root:password@localhost:3306/lankalibrary_db"

# JWT — CHANGE THIS IN PRODUCTION
JWT_SECRET="lk-lib-pro-jwt-secret-change-this-in-production-2024"
JWT_EXPIRES_IN="7d"
```

---

## Step 4: Prisma Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migration (creates all tables)
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

---

## Step 5: Verify Setup

```bash
# Open Prisma Studio (visual DB browser)
npx prisma studio

# Run TypeScript type-check
npm run typecheck

# Start development server
npm run dev
```

The API will be available at `http://localhost:3000/api/`

---

## Step 6: Test the API

### Login as Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@lankalibrary.com", "password": "Admin@123"}'
```

### Use the returned token for authenticated requests

```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Seed Data Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@lankalibrary.com | Admin@123 |
| **Staff** | kamal@lankalibrary.com | Staff@123 |
| **Staff** | nimal@lankalibrary.com | Staff@123 |
| **User** | saman@gmail.com | User@123 |
| **User** | kumari@gmail.com | User@123 |
| **User** | ruwan@gmail.com | User@123 |
| **User** | dilani@gmail.com | User@123 |
| **User** | chathura@gmail.com | User@123 |

---

## Prisma Commands Reference

| Command | Description |
|---------|-------------|
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev --name <name>` | Create and apply migration |
| `npx prisma migrate reset` | Reset database (drop all + re-migrate + seed) |
| `npx prisma db seed` | Run seed script |
| `npx prisma studio` | Open visual DB editor |
| `npx prisma validate` | Validate schema |
| `npx prisma format` | Format schema file |

---

## Troubleshooting

### "Can't reach database server"
- Ensure MySQL is running: `net start MySQL80` (Windows)
- Verify the DATABASE_URL in `.env` matches your MySQL credentials

### "ERESOLVE dependency conflict"
- Use `--legacy-peer-deps` flag: `npm install --legacy-peer-deps`

### "JWT_SECRET not set"
- Ensure `.env` file has the `JWT_SECRET` variable
- Restart the dev server after changing `.env`
