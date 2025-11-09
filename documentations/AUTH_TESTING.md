# 🔐 Authentication System Testing Guide

## ✅ **What's Been Implemented**

### Backend (Complete)
- ✅ User & Company database models
- ✅ JWT authentication with bcrypt password hashing
- ✅ Register endpoint (`POST /api/v1/auth/register`)
- ✅ Login endpoint (`POST /api/v1/auth/login`)
- ✅ Get current user (`GET /api/v1/auth/me`)
- ✅ Role-based access control (employee/employer/admin)
- ✅ Protected route middleware

### Frontend (Complete)
- ✅ AuthContext with React hooks
- ✅ Login page (`/login`)
- ✅ Register page (`/register`)
- ✅ Token storage in localStorage
- ✅ Auto-login after registration

### TODO (Next Steps)
- [ ] Update App.tsx to include auth routes
- [ ] Add protected route wrapper
- [ ] Update Header with login/logout buttons
- [ ] Add role-based dashboard routing
- [ ] Email verification system
- [ ] Password reset functionality

---

## 🚀 **Setup & Testing**

### 1. Install Dependencies

```bash
# Backend
cd backend
source venv/bin/activate
pip install passlib[bcrypt] python-jose[cryptography] pydantic[email]

# Frontend  
cd frontend
npm install
# (AuthContext and pages already created)
```

### 2. Create Database Tables

```bash
cd backend
python create_auth_tables.py
```

**Expected Output:**
```
Creating authentication tables...
✅ Authentication tables created successfully!

Tables created:
  - users
  - companies
  - user_profiles
```

### 3. Start Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### 4. Test API Endpoints

#### Register Employee
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "password123",
    "role": "employee"
  }'
```

**Expected Response:**
```json
{
  "user_id": "uuid-here",
  "email": "employee@example.com",
  "role": "employee",
  "message": "Registration successful. Please verify your email."
}
```

#### Register Employer
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@example.com",
    "password": "password123",
    "role": "employer",
    "company_name": "Acme Corp"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "employee@example.com",
    "role": "employee",
    "company_id": null,
    "is_verified": false,
    "is_active": true
  }
}
```

#### Get Current User (Protected)
```bash
TOKEN="your-token-here"

curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Test Frontend

```bash
cd frontend
npm run dev
```

**Navigate to:**
- http://localhost:8080/register - Create account
- http://localhost:8080/login - Sign in

---

## 🧪 **Test Scenarios**

### Scenario 1: Employee Registration & Login
1. Go to `/register`
2. Select "Job Seeker / Employee"
3. Enter email: `test@employee.com`
4. Enter password: `password123`
5. Click "Create Account"
6. Should redirect to `/dashboard`
7. Check localStorage for token

### Scenario 2: Employer Registration
1. Go to `/register`
2. Select "Employer / Recruiter"
3. Enter company name: `Test Company`
4. Enter email: `test@employer.com`
5. Enter password: `password123`
6. Click "Create Account"
7. Should redirect to `/dashboard`

### Scenario 3: Login
1. Go to `/login`
2. Enter registered email
3. Enter password
4. Click "Sign In"
5. Should redirect to `/dashboard`

### Scenario 4: Token Persistence
1. Login successfully
2. Refresh page
3. Should remain logged in
4. Check localStorage for token

### Scenario 5: Logout
1. Login
2. Click logout button (when implemented)
3. Token should be removed
4. Redirect to login page

---

## 🔍 **Verification Checklist**

### Database
- [ ] Users table exists
- [ ] Companies table exists
- [ ] User_profiles table exists
- [ ] Can insert test users
- [ ] Passwords are hashed (not plain text)

### Backend API
- [ ] `/api/v1/auth/register` works for employees
- [ ] `/api/v1/auth/register` works for employers
- [ ] `/api/v1/auth/login` returns valid JWT
- [ ] `/api/v1/auth/me` requires authentication
- [ ] Invalid credentials return 401
- [ ] Duplicate email returns 400

### Frontend
- [ ] Register page renders
- [ ] Login page renders
- [ ] Form validation works
- [ ] Error messages display
- [ ] Success redirects to dashboard
- [ ] Token stored in localStorage
- [ ] AuthContext provides user data

---

## 🐛 **Common Issues & Fixes**

### Issue: "Module not found: passlib"
```bash
pip install passlib[bcrypt]
```

### Issue: "Module not found: python-jose"
```bash
pip install python-jose[cryptography]
```

### Issue: "Table already exists"
```bash
# Drop and recreate tables
python
>>> from app.core.db import engine
>>> from app.core.models import Base
>>> Base.metadata.drop_all(bind=engine)
>>> Base.metadata.create_all(bind=engine)
```

### Issue: "CORS error in frontend"
Check that backend CORS allows frontend origin:
```python
# app/main.py
allow_origins=["http://localhost:8080", "http://localhost:3000"]
```

### Issue: "Token not being sent"
Check Authorization header format:
```
Authorization: Bearer <token>
```

---

## 📊 **Database Schema**

### Users Table
```sql
SELECT * FROM users;
```

| id | email | password_hash | role | company_id | is_verified | is_active |
|----|-------|---------------|------|------------|-------------|-----------|
| uuid | user@example.com | $2b$12$... | employee | null | false | true |

### Companies Table
```sql
SELECT * FROM companies;
```

| id | name | website | size | industry | verified |
|----|------|---------|------|----------|----------|
| uuid | Acme Corp | acme.com | 50-100 | Tech | false |

### User_Profiles Table
```sql
SELECT * FROM user_profiles;
```

| id | user_id | visibility | job_id | resume_url |
|----|---------|------------|--------|------------|
| uuid | user-uuid | private | null | null |

---

## 🎯 **Next Steps**

1. **Update App.tsx** - Add auth routes
2. **Protected Routes** - Wrap dashboard/upload with auth check
3. **Header Component** - Add login/logout buttons
4. **Role-Based Routing** - Different dashboards for employee/employer
5. **Profile Management** - Allow users to update their profiles
6. **Email Verification** - Send verification emails
7. **Password Reset** - Forgot password flow

---

## 🚀 **Deployment**

### Environment Variables

**Backend (.env):**
```bash
JWT_SECRET_KEY=your-super-secret-key-change-this
DATABASE_URL=postgresql://...
GROQ_API_KEY=gsk_...
```

**Frontend (.env.production):**
```bash
VITE_API_BASE_URL=https://skillsense.onrender.com
```

### Render Deployment
Add to environment variables:
```
JWT_SECRET_KEY = <generate-random-string>
```

Generate secret key:
```python
import secrets
print(secrets.token_urlsafe(32))
```

---

**Authentication system is ready for testing!** 🎉
