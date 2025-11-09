# 🔐 SkillSense Authentication Architecture

## Overview
Dual authentication system for **Employees** (talent/job seekers) and **Employers** (recruiters/HR).

---

## 🎯 User Roles

### 👤 Employee (Talent)
**Purpose**: Build and manage personal skill profile

**Features:**
- ✅ Upload and analyze CV
- ✅ View own skill profile
- ✅ Control profile visibility
- ✅ Track skill development
- ✅ Get job recommendations
- ✅ Export enhanced CV
- ✅ Privacy controls

**Permissions:**
- Can CRUD own profile
- Can set visibility (private/employers/public)
- Can view own analytics
- Cannot search other profiles

### 🏢 Employer (Recruiter/HR)
**Purpose**: Find and evaluate talent

**Features:**
- ✅ Search talent pool
- ✅ Post job openings
- ✅ AI candidate matching
- ✅ Team composition tools
- ✅ Skill gap analysis
- ✅ Bulk screening

**Permissions:**
- Can search public profiles
- Can view candidates who applied
- Can post jobs
- Cannot see private profiles
- Cannot modify candidate data

---

## 🏗️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('employee', 'employer')),
    company_id UUID REFERENCES companies(id),  -- For employers
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Companies Table (for Employers)
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    size VARCHAR(50),
    industry VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Profiles Table (for Employees)
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    visibility VARCHAR(20) DEFAULT 'private' 
        CHECK (visibility IN ('private', 'employers', 'public')),
    job_id VARCHAR(255),  -- Link to existing job analysis
    resume_url VARCHAR(500),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔑 Authentication Flow

### Registration
```
1. User chooses role (Employee/Employer)
2. Provides email + password
3. If Employer: provide company details
4. Email verification sent
5. Account created (inactive until verified)
```

### Login
```
1. User provides email + password
2. Backend validates credentials
3. Returns JWT token with role
4. Frontend stores token
5. Redirects based on role:
   - Employee → /dashboard
   - Employer → /employer/dashboard
```

### Token Structure
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "employee",
  "company_id": "uuid",  // if employer
  "exp": 1234567890
}
```

---

## 🛡️ API Endpoints

### Public (No Auth)
```
GET  /health
GET  /
POST /auth/register
POST /auth/login
POST /auth/forgot-password
```

### Employee Protected
```
POST /api/v1/ingest           # Upload CV
GET  /api/v1/profile/{jobId}  # View own profile
PUT  /api/v1/profile/{id}     # Update profile
DELETE /api/v1/profile/{id}   # Delete profile
GET  /api/v1/jobs/recommended # Get job matches
```

### Employer Protected
```
GET  /api/v1/search/talent    # Search public profiles
POST /api/v1/jobs             # Post job opening
GET  /api/v1/jobs/{id}/matches # Get candidate matches
GET  /api/v1/analytics/skills  # Skill market analytics
```

### Admin Protected
```
GET  /api/v1/admin/users
PUT  /api/v1/admin/verify-company/{id}
```

---

## 🔒 Privacy & Security

### Data Visibility Matrix

| Profile Visibility | Employee (Owner) | Other Employees | Employers | Public |
|-------------------|------------------|-----------------|-----------|--------|
| **Private**       | ✅ Full Access   | ❌ No Access    | ❌ No Access | ❌ No Access |
| **Employers Only**| ✅ Full Access   | ❌ No Access    | ✅ View Only | ❌ No Access |
| **Public**        | ✅ Full Access   | ✅ View Only    | ✅ View Only | ✅ View Only |

### Security Features
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens (short-lived)
- ✅ Refresh tokens
- ✅ Email verification
- ✅ Rate limiting
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ GDPR compliance (data export/deletion)

---

## 🚀 Implementation Priority

### Phase 1: MVP (Week 1)
- [ ] User registration (employee/employer)
- [ ] Login/logout
- [ ] JWT authentication
- [ ] Protected routes
- [ ] Basic profile CRUD

### Phase 2: Core Features (Week 2)
- [ ] Profile visibility controls
- [ ] Employer search functionality
- [ ] Job posting system
- [ ] Email verification

### Phase 3: Advanced (Week 3)
- [ ] AI candidate matching
- [ ] Team composition tools
- [ ] Analytics dashboard
- [ ] Audit logging

### Phase 4: Polish (Week 4)
- [ ] OAuth (Google, LinkedIn)
- [ ] Two-factor authentication
- [ ] Advanced privacy controls
- [ ] GDPR compliance tools

---

## 💻 Code Examples

### Backend: Auth Middleware
```python
# backend/app/core/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
import jwt

security = HTTPBearer()

def get_current_user(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY)
        return payload
    except:
        raise HTTPException(401, "Invalid token")

def require_role(role: str):
    def role_checker(user = Depends(get_current_user)):
        if user["role"] != role:
            raise HTTPException(403, "Insufficient permissions")
        return user
    return role_checker

# Usage
@app.get("/api/v1/search/talent")
async def search_talent(user = Depends(require_role("employer"))):
    # Only employers can access
    pass
```

### Frontend: Auth Context
```typescript
// frontend/src/contexts/AuthContext.tsx
interface User {
  id: string;
  email: string;
  role: 'employee' | 'employer';
  companyId?: string;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const { token, user } = await response.json();
    localStorage.setItem('token', token);
    setUser(user);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🎨 UI/UX Considerations

### Landing Page
```
┌─────────────────────────────────────┐
│         SkillSense Logo             │
├─────────────────────────────────────┤
│                                     │
│  Discover Your Hidden Talents       │
│                                     │
│  ┌──────────┐    ┌──────────┐     │
│  │ I'm      │    │ I'm      │     │
│  │ Looking  │    │ Hiring   │     │
│  │ for Work │    │ Talent   │     │
│  └──────────┘    └──────────┘     │
│  (Employee)      (Employer)        │
└─────────────────────────────────────┘
```

### Separate Dashboards
- **Employee Dashboard**: Focus on personal growth, skills, job matches
- **Employer Dashboard**: Focus on search, candidates, team building

---

## 📊 Benefits

### For Employees
- ✅ Own their data
- ✅ Control visibility
- ✅ Track progress
- ✅ Get matched to jobs

### For Employers
- ✅ Access talent pool
- ✅ AI-powered matching
- ✅ Efficient screening
- ✅ Team optimization

### For Platform
- ✅ User retention
- ✅ Data persistence
- ✅ Monetization potential
- ✅ Network effects

---

## 💰 Monetization (Future)

### Free Tier
- Employees: Unlimited (always free)
- Employers: 5 searches/month

### Premium Tier
- Employers: $99/month
  - Unlimited searches
  - Advanced filters
  - AI matching
  - Team tools
  - Analytics

---

**Next Steps**: Implement Phase 1 (MVP) with basic employee/employer auth! 🚀
