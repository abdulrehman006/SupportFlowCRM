# ⚡ Quick Start - Module 2 Setup

## 🎯 What's Been Done

Module 2 (Authentication & User Management) is **90% complete**!

All code is written and ready. You just need to:
1. Create the database
2. Push the schema
3. Seed demo users
4. Start the server

---

## 🚀 3-Minute Setup

### Step 1: Create Database (Choose one method)

**Method A: pgAdmin (Recommended)**
1. Open pgAdmin
2. Right-click "Databases"
3. Create → Database
4. Name: `supportflowcrm`
5. Save

**Method B: Command Line**
```bash
# You'll be asked for your PostgreSQL password
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost -p 5433 supportflowcrm
```

### Step 2: Push Schema to Database
```bash
cd D:\abdul-ai\supportflowcrm
npx prisma db push
```

### Step 3: Seed Demo Users
```bash
npm run db:seed
```

### Step 4: Start the Server
```bash
npm run dev
```

### Step 5: Login
Visit http://localhost:3000

Login with:
- Email: `admin@supportflowcrm.com`
- Password: `admin123`

---

## ✅ That's It!

You should now see:
1. Login page at http://localhost:3000
2. After login → Dashboard
3. User menu in top-right corner
4. Logout functionality working

---

## 🎫 Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@supportflowcrm.com | admin123 | ADMIN |
| supervisor@supportflowcrm.com | admin123 | SUPERVISOR |
| john@supportflowcrm.com | admin123 | AGENT |
| emma@supportflowcrm.com | admin123 | AGENT |
| mike@supportflowcrm.com | admin123 | AGENT |

---

## 🔍 Verify Setup

### Check if everything worked:

```bash
# View users in Prisma Studio
npx prisma studio
```

This opens a GUI where you can see all 5 users.

---

## ❌ Troubleshooting

### "Database does not exist"
→ You skipped Step 1. Create the database first.

### "Authentication failed"
→ Check your PostgreSQL password in `.env` file

### "Cannot connect to server"
→ Make sure PostgreSQL is running (Windows Services)

---

## 📚 More Info

- Full details: [MODULE_2_COMPLETE.md](MODULE_2_COMPLETE.md)
- Database help: [SETUP_DATABASE.md](SETUP_DATABASE.md)
- Original guide: [MODULE_2_SETUP_GUIDE.md](MODULE_2_SETUP_GUIDE.md)

---

## 🎉 Module 2 Features

What you're getting:
- ✅ Secure login with NextAuth.js
- ✅ Password hashing (bcryptjs)
- ✅ JWT sessions
- ✅ Protected routes
- ✅ Role-based access control
- ✅ User management
- ✅ Logout functionality
- ✅ 5 demo users ready to use

---

**Ready to proceed?** Complete these 4 steps and you're good to go! 🚀
