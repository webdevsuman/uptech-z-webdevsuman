# Uptech-Z — Enterprise E-Learning & Course Marketplace Platform

An enterprise-grade, full-stack online learning and course marketplace platform built with modern web technologies. Uptech-Z delivers a multi-role experience across **Students**, **Instructors**, and **Platform Administrators**, featuring course creation pipelines, video streaming, interactive Q&A, review moderation, real-time notifications, and Stripe payment processing.

---

## 🏛 Architecture Overview

The system is organized as a unified multi-app workspace:

```text
├── backend/                  # Express 5 REST API & Socket.io WebSocket server
│   ├── src/
│   │   ├── config/           # Database, Redis, Mail, Stripe & Cloudinary configs
│   │   ├── constants/        # System constants & environment bindings
│   │   ├── controllers/      # Request handlers for auth, courses, payments, etc.
│   │   ├── middlewares/      # RBAC, JWT auth, Multer upload & rate limiters
│   │   ├── models/           # Mongoose schemas (Users, Roles, Courses, Reviews, etc.)
│   │   ├── routes/           # Express endpoint routers
│   │   ├── scripts/          # Database seeders (RBAC & Super Admin)
│   │   ├── services/         # Business logic layer
│   │   ├── socket/           # Real-time WebSocket connection & room handlers
│   │   ├── utils/            # Winston logger, error classes, mailer utilities
│   │   └── validators/       # Zod input validation schemas
│   └── index.js              # Server entry point
│
├── frontend/                 # Student & Instructor Portal (Next.js 16 App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/       # Login, Register, OTP verification, Password Reset
│   │   │   ├── (marketing)/  # Homepage, Course Catalog, Course Details
│   │   │   ├── instructor/   # Course Builder, Curriculum Manager, Q&A, Announcements
│   │   │   └── student/      # Student Learning Dashboard & Enrolled Courses
│   │   ├── components/       # Shared UI components & design system
│   │   ├── config/           # API endpoints & Axios client instances
│   │   └── hooks/            # Custom React Query & auth hooks
│   └── package.json
│
└── admin/                    # Platform Management Panel (Next.js 16 App Router)
    ├── src/
    │   ├── app/(admin)/      # Dashboard, Users, Courses, Categories, Tags, Reviews, CMS
    │   ├── components/       # Data tables, dropzones, modals, charts
    │   ├── context/          # Admin state & auth contexts
    │   ├── lib/              # Admin API clients & constants
    │   └── module/           # Domain-specific admin table and form components
    └── package.json
```

---

## 💻 Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Backend Core** | **Node.js** (ES Modules), **Express 5**, **HTTP** server |
| **Database & Cache** | **MongoDB** (via **Mongoose 9** ODM), **Redis Cloud** (via **ioredis**) |
| **Real-time Layer** | **Socket.io** (Bidirectional event communication, Admin and User rooms) |
| **Media & Storage** | **Cloudinary v2** (Video lectures, course thumbnails, materials), **Multer** |
| **Payments** | **Stripe Node SDK** (Checkout Sessions & Webhook HMAC Verification) |
| **Security & Auth** | **JWT** (`jsonwebtoken`), **bcrypt**, **Helmet** (CSP), **express-rate-limit**, **CORS** |
| **Validation & Utilities** | **Zod 4**, **Winston 3** (structured logging), **Morgan**, **Nodemailer** |
| **Frontend Web App** | **Next.js 16** (Turbopack, App Router), **React 19**, **TypeScript** |
| **Frontend UI/UX** | **Tailwind CSS 4**, **Material UI (MUI v9)**, **Emotion**, **Lucide React**, **Sonner**, **Swiper** |
| **Admin Web App** | **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4** |
| **Admin Data & Viz** | **TanStack React Table v9**, **ApexCharts** (`react-apexcharts`), **FullCalendar v6**, **React-DnD** |
| **State & Networking** | **TanStack React Query v5**, **Axios** (interceptors with token renewal), **cookies-next** |

---

## ✨ Features Breakdown

### 1. Student Experience (`/frontend`)
- **Discovery Homepage**: Dynamic promotional banners, featured course carousels, and trending course highlights.
- **Faceted Course Search & Filtering**: Real-time filtering by category, tags, skill level, pricing (free/paid), and customer ratings.
- **Course Detail & Syllabus Preview**: Comprehensive course landing page featuring learning objectives, instructor bios, curriculum lecture breakdowns with preview tags, student ratings, and verified reviews.
- **Wishlist & Saved Courses**: Bookmark courses for future enrollment.
- **Seamless Checkout**: Direct enrollment for free courses and instant Stripe hosted checkout for premium courses.
- **Student Dashboard**: Track active course enrollments, learning progress, and completion status.
- **Interactive Q&A**: Ask lecture-specific questions and receive answers from course instructors.
- **Ratings & Reviews**: Submit structured ratings and text reviews for enrolled courses.

### 2. Instructor Studio (`/frontend/instructor`)
- **Instructor Dashboard**: Overview of enrolled students, course reach, and ratings.
- **Multi-Step Course Creation**:
  - Course metadata: title, subtitle, category, tags, difficulty level, and multi-language support.
  - Pricing & monetization options.
  - Media asset uploads: promotional video trailers, course cover images, and syllabus documents via Cloudinary.
- **Curriculum Builder**: Organize content into structured chapters, add lectures, upload video lessons, and attach downloadable resources.
- **Q&A Resolution Hub**: View student questions categorized by course, reply to questions, and resolve discussions.
- **Course Announcements**: Broadcast updates and messages directly to enrolled students.
- **Instructor Profile Management**: Public instructor bio, profile avatar, credentials, and social links.

### 3. Admin Management Panel (`/admin`)
- **Executive Analytics Dashboard**: Platform KPIs including total revenue, active enrollments, course counts, and user registration velocity powered by ApexCharts.
- **User & Instructor Moderation**:
  - Detailed directory of students and instructors.
  - Account status toggles (activate/deactivate).
  - Verification badges and audit trails.
- **Course Approval Workflow**:
  - Detailed curriculum inspection tool.
  - Lifecycle state management: `Draft` ➔ `Pending Approval` ➔ `Approved` / `Rejected`.
  - Feature & Trending flags to promote top-tier content on the marketing homepage.
- **Taxonomy Management**:
  - **Categories**: Create hierarchical categories with URL-friendly slugs and descriptions.
  - **Tags**: Create, edit, and assign colored tags with real-time badge previews.
- **Review Moderation**: Audit student reviews, moderate flagged content, and remove spam or abusive feedback.
- **CMS & Landing Page Controls**: Manage homepage banners, headline copy, and featured sections.

### 4. Backend Engine (`/backend`)
- **RESTful API**: Standardized JSON response envelope across all endpoints.
- **WebSocket Gateway (`socket.io`)**: Real-time announcements, instant Q&A notifications, and admin activity streams.
- **High-Performance Caching**: Redis integration for caching frequent lookups and tracking active sessions.
- **Automated Seeder**: Pre-configured RBAC seeding script (`npm run seed:rbac`) for roles and permissions.

---

## 🔒 Security Architecture

UpTech-Z implements defense-in-depth security best practices:

1. **Granular Role-Based Access Control (RBAC)**:
   - Dynamic role and permission models in MongoDB (`Role`, `Permission`, `User`).
   - Route-level middleware (`checkPermission('course:create')`, `checkPermission('user:manage')`) verifies permissions on every request.
2. **Dual-Token JWT Authentication**:
   - Short-lived Access Tokens for API authorization.
   - Long-lived Refresh Tokens stored in secure HTTP-only cookies to prevent XSS exfiltration.
3. **Multi-Tier Rate Limiting**:
   - `authRateLimiter`: Limits authentication attempts (max 20 requests per 15 minutes per IP).
   - `otpResendRateLimiter`: Stricter limits on email OTP endpoints (max 5 requests per 15 minutes per IP) to prevent email exhaustion attacks.
4. **HTTP Header Hardening & Network Security**:
   - `helmet` with custom Content Security Policy (CSP) headers.
   - Strict CORS origin whitelisting matching frontend and admin domain origins.
   - `trust proxy` enabled for secure deployment behind Nginx, Docker, or Cloudflare reverse proxies.
5. **Data Protection & Sanitization**:
   - Passwords hashed using `bcrypt` with salt rounds.
   - Sensitive fields (`password`, `refreshToken`, `resetToken`) excluded from Mongoose queries by default.
   - Strict request body validation via `zod` schemas.

---

## 💳 Payment Processing Architecture

The platform uses **Stripe** to process student course purchases:

```text
[ Student ] 
     │  Clicks "Enroll Now" on a paid course
     ▼
[ Frontend ] 
     │  POST /api/payments/create-checkout-session
     ▼
[ Backend API ] 
     │  Validates course pricing & creates Stripe Checkout Session
     ▼
[ Stripe Checkout ] 
     │  Student enters payment details securely on Stripe-hosted page
     │
     ├──► [ Redirect: /courses/:id?session_id={CHECKOUT_SESSION_ID} ]
     │        │
     │        ▼
     │    Frontend calls /api/payments/verify-session
     │
     └──► [ Webhook: POST /api/payments/webhook ]
              │
              ▼
          Backend verifies HMAC signature with STRIPE_WEBHOOK_SECRET
          Creates Enrollment record & grants student immediate access
```

- **Dual Fulfillment Safety**: Enrollment is verified both via the redirect return URL and asynchronously via Stripe Webhook events (`checkout.session.completed`). This prevents enrollment loss even if a user closes their browser before redirection completes.
- **Tamper Resistance**: Webhooks are verified using raw request signatures against `STRIPE_WEBHOOK_SECRET`.

---

## 🛠 Local Development & Setup

### Prerequisites
- **Node.js**: `v20.x` or later
- **MongoDB**: Local instance or MongoDB Atlas cluster URI
- **Redis**: Local Redis server or Redis Cloud instance
- **Stripe Account**: Test API keys
- **Cloudinary Account**: Cloud name, API key, and API secret

---

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd "Uptech-Z"

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install

# Install Admin Panel dependencies
cd ../admin
npm install
```

---

### Step 2: Configure Environment Variables

Create `.env` files in `backend/`, `frontend/`, and `admin/` using the provided `.env.example` templates:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env

# Admin configuration
cp admin/.env.example admin/.env
```

---

### Step 3: Seed Roles, Permissions & Super Admin

Initialize the database with the pre-configured RBAC roles, permissions, and initial Super Admin user:

```bash
cd backend
npm run seed:rbac
```

---

### Step 4: Run Development Servers

Run each component in separate terminal windows:

#### Terminal 1 — Backend (Port 5000)
```bash
cd backend
npm run dev
```

#### Terminal 2 — Frontend (Port 3000)
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Terminal 3 — Admin Panel (Port 3001)
```bash
cd admin
npm run dev -- -p 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📁 Environment Configuration Reference

### Backend (`backend/.env`)
- `PORT`: HTTP server port (Default: `5000`).
- `MONGO_URL`: MongoDB connection string.
- `SUPER_ADMIN_EMAIL`: Initial email for RBAC seeder.
- `SUPER_ADMIN_PASSWORD`: Initial password for RBAC seeder.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`: SMTP mail transport settings for OTP and notifications.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary media storage credentials.
- `JWT_SECRET`, `JWT_REFRESH_SECRET`: Secrets for signing access and refresh tokens.
- `REDIS_URL`: Redis connection string.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CURRENCY`: Stripe credentials and default currency.
- `FRONTEND_BASE_URL`, `CLIENT_URL`, `ADMIN_URL`: CORS-allowed client URLs.

### Frontend (`frontend/.env`)
- `NEXT_PUBLIC_BASE_URL`: Full base URL to backend API (e.g., `http://localhost:5000/api/`).
- `NEXT_APP_ACCESS_TOKEN_NAME`: Key name for client access token cookie.
- `NEXT_APP_REFRESH_TOKEN_NAME`: Key name for client refresh token cookie.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe public key for frontend checkout interactions.

### Admin Panel (`admin/.env`)
- `NEXT_APP_BASE_URL`: Base backend URL (e.g., `http://localhost:5000`).
- `NEXT_PUBLIC_UI_URL`: Origin for public-facing web UI.
- `NEXT_PUBLIC_SERVER_ORIGIN`: Base backend server origin.
- `NEXT_APP_TOKEN_NAME`: Access token cookie key name for admin auth.
- `NEXT_APP_REFRESH_TOKEN_NAME`: Refresh token cookie key name for admin auth.
- `NEXT_APP_ENCRYPTION_KEY_NAME`: Storage encryption identifier.
- `NEXT_APP_REMEMBER_ME_KEY_NAME`: Remember-me token storage key.


