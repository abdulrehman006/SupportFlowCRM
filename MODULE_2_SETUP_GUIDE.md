# Module 2 Setup Guide - Authentication & User Management

## ✅ Progress So Far

### Completed:
- ✅ Prisma installed and initialized
- ✅ Prisma schema created (User model with Role enum)
- ✅ `.env` file configured
- ✅ Prisma client utility created (`lib/prisma.ts`)
- ✅ Dependencies installed (NextAuth, bcrypt, Prisma)

### Next Steps:
- ⬜ Create database in PostgreSQL
- ⬜ Push schema to database
- ⬜ Configure NextAuth.js
- ⬜ Create login/signup pages
- ⬜ Build user management

---

## 🔧 Step 1: Create Database in PostgreSQL

You need to create the database before Prisma can push the schema.

### Option A: Using pgAdmin (GUI)
1. Open pgAdmin
2. Connect to your PostgreSQL server (localhost:5433)
3. Right-click "Databases"
4. Select "Create" → "Database"
5. Name: `supportflowcrm`
6. Owner: `postgres`
7. Click "Save"

### Option B: Using psql (Command Line)
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -c "CREATE DATABASE supportflowcrm;"
```

### Verify Database Created
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -l
```

---

## 🔧 Step 2: Push Prisma Schema

After creating the database, run:

```bash
cd D:\abdul-ai\supportflowcrm
npx prisma db push
```

This will create the `users` table with all fields.

### Verify Table Created
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -d supportflowcrm -c "\d users"
```

---

## 🔧 Step 3: Seed Initial Admin User

Create a seed file:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@supportflowcrm.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@supportflowcrm.com',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Run seed:
```bash
npx prisma db seed
```

---

## 🔧 Step 4: Configure NextAuth.js

### Create auth configuration

**File**: `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

---

## 🔧 Step 5: Create Login Page

**File**: `app/(auth)/login/page.tsx`

```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            SupportFlowCRM
          </CardTitle>
          <p className="text-center text-gray-500">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Default: admin@supportflowcrm.com / admin123
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔧 Step 6: Protect Routes

**File**: `middleware.ts` (in root)

```typescript
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/tickets/:path*', '/contacts/:path*'],
};
```

---

## 📦 Current Project Structure

```
supportflowcrm/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          ← To create
│   ├── (dashboard)/
│   │   └── dashboard/page.tsx      ← ✅ Done (Module 1)
│   └── api/
│       └── auth/
│           └── [...nextauth]/route.ts  ← To create
├── prisma/
│   ├── schema.prisma               ← ✅ Done
│   └── seed.ts                     ← To create
├── lib/
│   └── prisma.ts                   ← ✅ Done
├── .env                            ← ✅ Done
└── middleware.ts                   ← To create
```

---

## ✅ Testing Checklist

After completing setup:

1. ✅ Database created in PostgreSQL
2. ✅ Schema pushed successfully
3. ✅ Admin user seeded
4. ✅ Can login at `/login`
5. ✅ Redirects to `/dashboard` after login
6. ✅ Protected routes require authentication
7. ✅ Can logout

---

## 🚀 Quick Commands

```bash
# Check database
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -l

# Create database
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -p 5433 -c "CREATE DATABASE supportflowcrm;"

# Push schema
cd D:\abdul-ai\supportflowcrm
npx prisma db push

# Generate Prisma client
npx prisma generate

# Run seed
npx prisma db seed

# Open Prisma Studio
npx prisma studio

# Start dev server
npm run dev
```

---

## 📝 Next Module After Completion

**Module 3**: Ticket & Contact Management
- Will use the authenticated user context
- Role-based permissions
- CRUD operations with Prisma

---

## 🆘 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify port 5433 is correct
- Check password in `.env`

### NextAuth Error
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your local URL

### Prisma Error
- Run `npx prisma generate` after schema changes
- Check DATABASE_URL format

---

**Ready to continue Module 2?** Let me know when the database is created!

