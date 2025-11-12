# Database Setup Guide - SupportFlowCRM

## Quick Setup (Recommended)

### Step 1: Create Database

Open **pgAdmin** and create a new database:
1. Open pgAdmin
2. Connect to your PostgreSQL server (localhost:5433)
3. Right-click on "Databases"
4. Select "Create" → "Database"
5. Name: `supportflowcrm`
6. Owner: `postgres`
7. Click "Save"

**OR** use the command line:
```bash
# Open Command Prompt as Administrator
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost -p 5433 supportflowcrm
# Enter password when prompted: postgres
```

### Step 2: Push Prisma Schema

```bash
cd D:\abdul-ai\supportflowcrm
npx prisma db push
```

This will create all the tables in your database.

### Step 3: Seed the Database

```bash
npm run db:seed
```

This will create 5 demo users:
- **Admin**: admin@supportflowcrm.com / admin123
- **Supervisor**: supervisor@supportflowcrm.com / admin123
- **Agent 1**: john@supportflowcrm.com / admin123
- **Agent 2**: emma@supportflowcrm.com / admin123
- **Agent 3**: mike@supportflowcrm.com / admin123

### Step 4: Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and you'll be redirected to the login page.

---

## Verify Setup

### Check if database exists:
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -l
# Look for 'supportflowcrm' in the list
```

### Check if tables were created:
```bash
npx prisma studio
```
This will open Prisma Studio in your browser where you can view all tables and data.

### Check if users were seeded:
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -d supportflowcrm -c "SELECT email, role FROM users;"
```

---

## Troubleshooting

### Error: "Database supportflowcrm does not exist"
**Solution**: You need to create the database first (Step 1 above)

### Error: "P1000: Authentication failed"
**Solution**: Check your `.env` file and make sure the DATABASE_URL is correct:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/supportflowcrm?schema=public"
```

### Error: "relation 'users' does not exist"
**Solution**: Run `npx prisma db push` to create the tables

### Cannot connect to PostgreSQL
**Solution**: Make sure PostgreSQL is running. Check in Windows Services or start it:
- Open "Services" in Windows
- Find "postgresql-x64-18"
- Right-click → Start

---

## Full Reset (If needed)

If you want to start fresh:

### 1. Drop the database:
```bash
"C:\Program Files\PostgreSQL\18\bin\dropdb.exe" -U postgres -h localhost -p 5433 supportflowcrm
```

### 2. Create it again and run all steps above

---

## Database Schema

The database includes the following table:
- **users**: User accounts with authentication and role management
  - id (primary key)
  - name, email, password (hashed with bcrypt)
  - role (ADMIN, SUPERVISOR, AGENT)
  - phone, bio, image
  - isActive, emailNotifications, timezone
  - lastActiveAt, createdAt, updatedAt

More tables will be added in Module 3 (Tickets, Contacts, Companies, etc.)

---

## Next Steps

Once the database is set up and seeded:
1. Start the dev server: `npm run dev`
2. Visit http://localhost:3000
3. Login with one of the demo accounts
4. You should see the dashboard!

---

**Need Help?** Check the [MODULE_2_SETUP_GUIDE.md](MODULE_2_SETUP_GUIDE.md) for more details.
