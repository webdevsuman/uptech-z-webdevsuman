# Production-Level MERN Stack Udemy Clone E-Learning Platform

## Project Title

Udemy Clone E-Learning Platform (MERN Stack: MongoDB, Express.js, React/Next.js, Node.js + Cloudinary)

---

## 1. Project Overview

This project is a full-featured, production-ready E-Learning Marketplace built on the **MERN** stack (MongoDB, Express.js, Next.js 15 / React 19, and Node.js) with **Cloudinary** for video and image streaming/management.

It replaces the previous Supabase backend with a fully self-hosted, scalable, and customizable RESTful API service equipped with JWT-based authentication, Role-Based Access Control (RBAC), robust database indexing, and automated media pipelines.

The platform provides dedicated interfaces and capabilities for three primary user roles:

- **Students / Users**: Discover, search, and filter courses, preview lectures, enroll, stream video lessons with progress tracking, take notes, ask Q&A questions, submit reviews, and claim certificates.
- **Instructors**: Create and manage courses, design multi-section curriculum, upload lecture videos and attachments via Cloudinary, set pricing, answer student Q&As, publish announcements, and track revenue/analytics.
- **Admins**: Platform oversight, approve/reject submitted courses, moderate reviews, manage user/instructor accounts, manage categories and tags, and analyze platform-wide financial and enrollment metrics.

### Key Use Cases:
- Enterprise-grade online course marketplace (Udemy, Coursera, Skillshare style).
- Instructor monetization platform with video curriculum streaming.
- Portfolio showcase for advanced Full-Stack MERN architecture, media streaming, and RBAC security.

---

## 2. Tech Stack

### Backend
- **Runtime**: Node.js (v20+ LTS)
- **Framework**: Express.js (v4 or v5)
- **Database**: MongoDB (v6+ / Atlas Cloud)
- **ODM**: Mongoose (v8+)
- **Architecture**: Clean MVC / Layered Architecture (Controllers, Services, Models, Routes, Middlewares, Validations)

### Media Storage & Processing
- **Cloudinary SDK**: Cloud video streaming, adaptive bitrate delivery, automated thumbnail generation, and secure image hosting.
- **Multer / Multer-Storage-Cloudinary**: Multipart form-data handling for file and video streams.

### Authentication & Security
- **JWT (JSON Web Tokens)**: Short-lived Access Tokens (15m) + Long-lived Refresh Tokens (7d) stored in HTTP-only, secure cookies.
- **Password Hashing**: `bcryptjs` (salt rounds: 10).
- **Security Headers**: `helmet` (configured for cross-origin media embedding).
- **Rate Limiting**: `express-rate-limit` (DDoS prevention on auth and public endpoints).
- **Sanitization**: `express-mongo-sanitize` (NoSQL injection prevention) & `xss-clean` / `validator`.
- **CORS**: `cors` configured for Next.js frontend origin with credentials enabled.
- **Cookie Handling**: `cookie-parser`.

### Request Validation
- **Joi** or **Zod**: Strict schema validation for headers, query params, and request bodies before hitting controllers.

### Frontend (Existing Client)
- **Framework**: Next.js 15.4 (App Router) + React 19
- **Language**: TypeScript
- **State Management**: Redux Toolkit (Auth, UI state)
- **Server State & Caching**: TanStack React Query (v5)
- **UI Components & Styling**: Material UI (MUI v7), Emotion, Tailwind CSS (v4)
- **Media Player**: Custom HTML5 / MUI interactive video player with progress persistence
- **Certificate Generation**: `jspdf` (client-side PDF generation) / server-side certificate verification

### Payments & Notifications (Production Add-ons)
- **Payment Gateway**: Stripe / Razorpay (webhooks for automated course enrollment).
- **Email Service**: Nodemailer (SMTP / SendGrid / Resend) for welcome emails, password resets, and course announcements.

### Logging, Testing & Documentation
- **Logging**: `morgan` (HTTP traffic) and `winston` (application and error logs).
- **Testing**: `jest`, `supertest` for API integration and unit testing.
- **Documentation**: Swagger UI (`swagger-ui-express`, `yamljs`) / Postman Collection.

---

## 3. Directory & Folder Structure

The project follows a modular monorepo structure separating the backend API and the Next.js frontend:

```text
Udemy Clone MERN/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB Mongoose connection
│   │   │   ├── cloudinary.js         # Cloudinary SDK credentials & config
│   │   │   └── corsOptions.js        # Allowed origins & credentials
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, login, refresh, logout, password reset
│   │   │   ├── userController.js     # Profile management, avatar upload, password update
│   │   │   ├── courseController.js   # Course CRUD, filtering, search, status transitions
│   │   │   ├── lectureController.js  # Section & lecture management, video uploads
│   │   │   ├── enrollmentController.js# Purchase/enrollment handling, enrolled course list
│   │   │   ├── progressController.js # Timestamp persistence, lecture completion tracking
│   │   │   ├── reviewController.js   # Rating and review submissions, approvals
│   │   │   ├── wishlistController.js # Add/remove/list wishlist items
│   │   │   ├── qnaController.js      # Student questions, instructor answers
│   │   │   ├── announcementController.js # Instructor course announcements
│   │   │   ├── categoryController.js # Category & tag management
│   │   │   ├── certificateController.js # Completion certificate verification & issuance
│   │   │   └── adminController.js    # Platform dashboard analytics, user moderation
│   │   │
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     # Verify JWT access token from header/cookie
│   │   │   ├── roleMiddleware.js     # authorizeRoles('admin', 'instructor', 'student')
│   │   │   ├── uploadMiddleware.js   # Multer middleware for images & video streams
│   │   │   ├── errorMiddleware.js    # Centralized global error handler
│   │   │   └── validateMiddleware.js # Joi/Zod request payload validator
│   │   │
│   │   ├── models/
│   │   │   ├── User.js               # Users (Student, Instructor, Admin)
│   │   │   ├── Category.js           # Categories & tags
│   │   │   ├── Course.js             # Course metadata, pricing, syllabus, ratings
│   │   │   ├── Section.js            # Course curriculum sections
│   │   │   ├── Lecture.js            # Video lectures, attachments, duration, Cloudinary public_ids
│   │   │   ├── Enrollment.js         # Course purchases/enrollments
│   │   │   ├── Progress.js           # Real-time lecture progress, last watched timestamp
│   │   │   ├── Review.js             # Course reviews and star ratings
│   │   │   ├── Wishlist.js           # Student wishlist entries
│   │   │   ├── QnA.js                # Questions and instructor replies
│   │   │   ├── Announcement.js       # Course broadcast announcements
│   │   │   └── Certificate.js        # Generated completion credentials
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── lectureRoutes.js
│   │   │   ├── enrollmentRoutes.js
│   │   │   ├── progressRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── wishlistRoutes.js
│   │   │   ├── qnaRoutes.js
│   │   │   ├── announcementRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── certificateRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── index.js              # Aggregated API v1 router
│   │   │
│   │   ├── services/
│   │   │   ├── tokenService.js       # JWT generation, cookie assignment, refresh token store
│   │   │   ├── cloudinaryService.js  # Upload, streaming URLs, asset deletion
│   │   │   ├── emailService.js       # Nodemailer notification templates
│   │   │   └── analyticsService.js   # Aggregation pipeline analytics calculations
│   │   │
│   │   ├── utils/
│   │   │   ├── apiResponse.js        # Standardized { success, message, data } formatter
│   │   │   ├── appError.js           # Custom operational AppError class
│   │   │   ├── apiFeatures.js        # Reusable class for Filter, Sort, Limit, Paginate
│   │   │   └── logger.js             # Winston logger setup
│   │   │
│   │   ├── validations/
│   │   │   ├── authValidation.js
│   │   │   ├── courseValidation.js
│   │   │   ├── reviewValidation.js
│   │   │   └── userValidation.js
│   │   │
│   │   ├── app.js                    # Express app configuration & middleware mounts
│   │   └── server.js                 # Server listener & database bootstrap
│   │
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/                         # Next.js 15 Client (Existing Codebase)
│   ├── src/
│   │   ├── api/
│   │   │   ├── axiosInstance.ts      # Configured Axios with interceptors for refresh token
│   │   │   ├── endpoints.ts          # Centralized API endpoint routes
│   │   │   └── functions/            # TanStack Query fetchers (courses, auth, reviews, etc.)
│   │   ├── app/                      # App router pages (courses, admin, instructor, student)
│   │   ├── hooks/                    # Custom React hooks & React Query hooks
│   │   ├── redux-toolkit/            # Slices (authSlice, uiSlice)
│   │   ├── ui/                       # Components (Navbar, Footer, CoursePlayer, Modals)
│   │   └── utils/                    # Media URL helpers, formatters
│   ├── .env.local.example
│   └── package.json
│
└── Scope.md
```

---

## 4. User Roles & Permission Matrix

The platform implements Role-Based Access Control (RBAC) with three distinct roles:

| Feature / Resource | Student | Instructor | Admin |
| :--- | :---: | :---: | :---: |
| **Browse, Search & Filter Courses** | ✅ | ✅ | ✅ |
| **View Free Preview Lectures** | ✅ | ✅ | ✅ |
| **Wishlist Management** | ✅ | ❌ | ❌ |
| **Enroll / Buy Course** | ✅ | ❌ | ❌ |
| **Watch Full Course & Track Progress** | ✅ (If enrolled) | ✅ (Own courses) | ✅ (All courses) |
| **Submit Course Review & Rating** | ✅ (If enrolled) | ❌ | ❌ |
| **Ask Lecture Questions (Q&A)** | ✅ (If enrolled) | ✅ (Own courses) | ✅ |
| **Download Course Completion Certificate**| ✅ (100% progress)| ❌ | ❌ |
| **Create / Update Courses** | ❌ | ✅ (Own courses) | ✅ (All courses) |
| **Upload Videos / Curriculum (Cloudinary)**| ❌ | ✅ (Own courses) | ✅ |
| **Publish Course Announcements** | ❌ | ✅ (Own courses) | ✅ |
| **View Instructor Earnings & Stats** | ❌ | ✅ (Personal) | ✅ (Platform-wide) |
| **Approve / Reject Course Submission** | ❌ | ❌ | ✅ |
| **Moderate / Delete Reviews** | ❌ | ❌ | ✅ |
| **Manage Users (Block / Role Update)** | ❌ | ❌ | ✅ |
| **Manage Categories & Tags** | ❌ | ❌ | ✅ |
| **Admin Financial & Analytics Dashboard** | ❌ | ❌ | ✅ |

---

## 5. Authentication & Security Flow

### 1. Registration
- Supports registration as **Student** (default) or **Instructor**.
- Password strength validation and hashing using `bcryptjs` (salt: 10).
- Prevents registering with role `admin` through public registration endpoints.

### 2. Login & Token Strategy (Dual JWT System)
- **Access Token**: Short-lived JWT (e.g., 15 minutes) containing `{ id, role, email }`. Sent via `Authorization: Bearer <token>` header or Secure Cookie.
- **Refresh Token**: Long-lived JWT (e.g., 7 days) stored securely in an `HttpOnly`, `SameSite: Strict`, `Secure` cookie and saved hashed in the database.
- **Silent Refresh**: Frontend Axios response interceptor intercepts `401 Unauthorized` errors, requests `/api/v1/auth/refresh-token`, receives a fresh Access Token, and retries the failed request seamlessly.

### 3. Forgot & Reset Password
- Sends a crypto-generated temporary reset token (expires in 10 minutes) via Nodemailer to the registered email.
- Verifies hashed token and updates password.

### 4. Logout
- Clears the Refresh Token cookie and invalidates the session in the database.

---

## 6. RBAC & Security Middleware

### `authenticateUser`
Validates JWT Access Token from `Authorization: Bearer <token>` or request cookies. Attaches `req.user = { id, role, email }` to the request object.

### `authorizeRoles(...roles)`
Ensures `roles.includes(req.user.role)`. Throws `403 Forbidden` if unauthorized.

```javascript
// Example Usage in Routes:
router.post('/courses', authenticateUser, authorizeRoles('instructor', 'admin'), createCourse);
router.patch('/admin/courses/:id/status', authenticateUser, authorizeRoles('admin'), updateCourseStatus);
```

### `verifyCourseOwnership`
Middleware checking whether `req.user.id` matches the course's `instructor_id` or if `req.user.role === 'admin'`.

---

## 7. Database Models & Schema Design (Mongoose)

### 1. User Model (`User.js`)
```javascript
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
      index: true
    },
    avatar: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' }
    },
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    website: { type: String, default: '' },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String
    },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, select: false },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  { timestamps: true }
);
```

### 2. Category Model (`Category.js`)
```javascript
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
```

### 3. Course Model (`Course.js`)
```javascript
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true, index: 'text' },
    price: { type: Number, required: true, min: 0, default: 0 },
    discountPrice: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert', 'All Levels'],
      default: 'Beginner',
      index: true
    },
    language: { type: String, default: 'English' },
    thumbnail: {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    },
    promoVideo: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' }
    },
    syllabus: [
      {
        sectionTitle: { type: String, required: true },
        lectures: [
          {
            title: { type: String, required: true },
            videoUrl: { type: String, required: true },
            public_id: { type: String, required: true },
            duration: { type: Number, default: 0 }, // in seconds
            isPreview: { type: Boolean, default: false }
          }
        ]
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'pending',
      index: true
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5, index: true },
    totalReviews: { type: Number, default: 0 },
    enrolledStudentsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text' });
```

### 4. Enrollment Model (`Enrollment.js`)
```javascript
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    amountPaid: { type: Number, required: true, default: 0 },
    paymentMethod: { type: String, default: 'free' },
    transactionId: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    completedAt: Date
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
```

### 5. Progress Model (`Progress.js`)
```javascript
const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    completedLectures: [
      {
        lectureId: { type: String, required: true },
        completedAt: { type: Date, default: Date.now }
      }
    ],
    lastWatchedLecture: { type: String, default: '' },
    lastWatchedTime: { type: Number, default: 0 }, // video playback position in seconds
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });
```

### 6. Review Model (`Review.js`)
```javascript
const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true } // for admin moderation
  },
  { timestamps: true }
);

reviewSchema.index({ course: 1, student: 1 }, { unique: true });
```

### 7. Wishlist Model (`Wishlist.js`)
```javascript
const wishlistSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ]
  },
  { timestamps: true }
);
```

### 8. Q&A Model (`QnA.js`)
```javascript
const qnaSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    lectureId: { type: String, default: '' },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: { type: String, required: true },
    answers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: { type: String, required: true },
        isInstructor: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);
```

### 9. Announcement Model (`Announcement.js`)
```javascript
const announcementSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);
```

### 10. Certificate Model (`Certificate.js`)
```javascript
const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueDate: { type: Date, default: Date.now },
    certificateUrl: { type: String, default: '' }
  },
  { timestamps: true }
);
```

---

## 8. Cloudinary Media Storage Pipeline

Cloudinary replaces Supabase Storage buckets (`course-images` and `course-videos`).

### 1. Course Thumbnails & User Avatars
- Managed via `multer` memory storage.
- Uploaded directly via Cloudinary Uploader stream (`resource_type: 'image'`).
- Auto-crops, converts to WebP/AVIF format for optimal loading performance.
- Saves both secure `url` and `public_id` in MongoDB for easy asset deletion.

### 2. Course Lecture Videos
- Uploaded as `resource_type: 'video'`.
- Supports chunked uploads for large video files (up to several GBs).
- Cloudinary generates adaptive streaming URLs, duration metadata, and automatic thumbnail frames.
- Enables signed/authenticated video URLs to prevent direct hotlinking or piracy.

### 3. Cleanup & Garbage Collection
- When a course or lecture is deleted, a Mongoose pre-hook or controller utility triggers `cloudinary.uploader.destroy(public_id, { resource_type: 'video' | 'image' })` to keep Cloudinary storage within limits.

---

## 9. Comprehensive REST API Endpoints

### 1. Authentication APIs (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new Student or Instructor |
| `POST` | `/api/v1/auth/login` | Public | Login with email/password; returns Access Token & sets Refresh Cookie |
| `POST` | `/api/v1/auth/refresh-token` | Public | Refresh expired Access Token using HttpOnly Refresh Token |
| `POST` | `/api/v1/auth/logout` | Authenticated | Invalidate refresh token and clear cookie |
| `POST` | `/api/v1/auth/forgot-password` | Public | Request password reset email |
| `PATCH`| `/api/v1/auth/reset-password/:token` | Public | Reset password with token |
| `GET`  | `/api/v1/auth/me` | Authenticated | Fetch current authenticated user profile & role |

### 2. User & Profile APIs (`/api/v1/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/users/profile` | Authenticated | Get current user's full profile |
| `PUT`  | `/api/v1/users/profile` | Authenticated | Update name, headline, bio, social links |
| `PATCH`| `/api/v1/users/avatar` | Authenticated | Upload profile avatar to Cloudinary |
| `PUT`  | `/api/v1/users/change-password` | Authenticated | Update account password |

### 3. Category & Tag APIs (`/api/v1/categories`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/categories` | Public | Get all active categories with course count |
| `GET`  | `/api/v1/categories/:slug` | Public | Get category details by slug |
| `POST` | `/api/v1/categories` | Admin | Create category with tags |
| `PUT`  | `/api/v1/categories/:id` | Admin | Update category details |
| `DELETE`| `/api/v1/categories/:id`| Admin | Delete or deactivate category |

### 4. Course APIs (`/api/v1/courses`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/courses` | Public | Get published courses with filters, sorting & pagination |
| `GET`  | `/api/v1/courses/featured` | Public | Get top-rated featured courses |
| `GET`  | `/api/v1/courses/trending` | Public | Get most enrolled trending courses |
| `GET`  | `/api/v1/courses/:id` | Public | Get course details (syllabus, instructor, preview videos) |
| `POST` | `/api/v1/courses` | Instructor / Admin | Create new course (supports thumbnail & syllabus) |
| `PUT`  | `/api/v1/courses/:id` | Instructor / Admin | Update course content, metadata & pricing |
| `DELETE`| `/api/v1/courses/:id`| Instructor / Admin | Delete course and associated Cloudinary assets |
| `POST` | `/api/v1/courses/:id/upload-video`| Instructor / Admin| Upload lecture video to Cloudinary |
| `GET`  | `/api/v1/courses/instructor/my-courses`| Instructor | List all courses created by logged-in instructor |

### 5. Enrollment & Progress APIs (`/api/v1/enrollments`, `/api/v1/progress`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/enrollments/:courseId` | Student | Enroll in a free course or process checkout |
| `GET`  | `/api/v1/enrollments/my-learning` | Student | Get all courses enrolled by the student |
| `GET`  | `/api/v1/enrollments/:courseId/check` | Student | Check if student is already enrolled |
| `GET`  | `/api/v1/progress/:courseId` | Student / Enrolled | Fetch saved progress, last timestamp, completed lectures |
| `POST` | `/api/v1/progress/:courseId/update` | Student / Enrolled | Save video playback timestamp and completed lecture status |

### 6. Reviews & Ratings APIs (`/api/v1/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/reviews/:courseId` | Public | Get approved reviews and average rating for a course |
| `POST` | `/api/v1/reviews/:courseId` | Student / Enrolled | Add review and rating for enrolled course |
| `PUT`  | `/api/v1/reviews/:id` | Student (Owner) | Update personal review |
| `DELETE`| `/api/v1/reviews/:id` | Student (Owner) / Admin | Delete review |

### 7. Wishlist APIs (`/api/v1/wishlist`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/wishlist` | Student | Get student's wishlist courses |
| `POST` | `/api/v1/wishlist/:courseId` | Student | Add course to wishlist |
| `DELETE`| `/api/v1/wishlist/:courseId`| Student | Remove course from wishlist |

### 8. Q&A & Announcements APIs (`/api/v1/qna`, `/api/v1/announcements`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/qna/:courseId` | Enrolled / Instructor | Get questions and answers for a course |
| `POST` | `/api/v1/qna/:courseId` | Student / Enrolled | Ask a new question |
| `POST` | `/api/v1/qna/:questionId/reply` | Enrolled / Instructor | Reply to question |
| `GET`  | `/api/v1/announcements/:courseId` | Enrolled / Instructor| Get announcements posted by instructor |
| `POST` | `/api/v1/announcements/:courseId` | Instructor (Owner) | Create and broadcast announcement |

### 9. Certificates APIs (`/api/v1/certificates`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/certificates/:courseId/claim` | Student | Claim certificate once course progress is 100% |
| `GET`  | `/api/v1/certificates/my-certificates`| Student | Get list of all earned certificates |
| `GET`  | `/api/v1/certificates/verify/:certificateId`| Public | Verify certificate validity by ID |

### 10. Admin Moderation & Analytics APIs (`/api/v1/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/admin/dashboard-stats` | Admin | Total users, courses, revenue, enrollments |
| `GET`  | `/api/v1/admin/users` | Admin | List all users with pagination and search |
| `PATCH`| `/api/v1/admin/users/:id/status` | Admin | Activate, suspend, or block user account |
| `PATCH`| `/api/v1/admin/users/:id/role` | Admin | Change user role (student <-> instructor <-> admin) |
| `GET`  | `/api/v1/admin/courses` | Admin | List courses across all statuses (draft, pending, published) |
| `PATCH`| `/api/v1/admin/courses/:id/status` | Admin | Approve or reject course submission |
| `GET`  | `/api/v1/admin/reviews` | Admin | View all reviews across platform |
| `DELETE`| `/api/v1/admin/reviews/:id` | Admin | Moderate / delete inappropriate review |

---

## 10. Search, Filtering, Sorting & Pagination Specifications

### Query Parameters
`GET /api/v1/courses?search=react&category=65f12a...&level=Beginner&minPrice=0&maxPrice=50&rating=4&sort=-createdAt&page=1&limit=12`

### Filtering Logic:
- `search`: Case-insensitive regex or MongoDB `$text` search on `title` and `description`.
- `category`: Matches Category `ObjectId`.
- `level`: Matches `Beginner`, `Intermediate`, `Expert`, or `All Levels`.
- `price`: MongoDB `$gte` and `$lte` range filters (including free courses where `price: 0`).
- `rating`: Filters courses where `averageRating >= requestedRating`.

### Sorting Options:
- `sort=-createdAt`: Newest first (default).
- `sort=price`: Price: Low to High.
- `sort=-price`: Price: High to Low.
- `sort=-enrolledStudentsCount`: Most Popular.
- `sort=-averageRating`: Highest Rated.

### Standardized Response Format:
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [ ... ],
    "pagination": {
      "total": 145,
      "page": 1,
      "limit": 12,
      "totalPages": 13,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## 11. Dashboard Analytics Specifications

### 1. Admin Platform Dashboard
Using MongoDB Aggregation Pipeline:
- **Total Metrics**: Total Students, Total Instructors, Total Published Courses, Total Platform Revenue.
- **Monthly Revenue Chart**: Aggregated revenue grouped by month (`$dateToString`).
- **Enrollment Trends**: Daily/Monthly student enrollments.
- **Course Status Distribution**: Count of Published, Pending Approval, Draft, and Rejected courses.

### 2. Instructor Dashboard
- **Total Earnings**: Total revenue share generated from enrolled students.
- **Enrolled Students**: Count of unique students across all owned courses.
- **Course Performance**: Individual rating, review count, and enrollment count per course.
- **Pending Questions**: Count of unreplied Q&A inquiries.

### 3. Student Dashboard
- **Learning Overview**: In-progress courses count, completed courses count, certificates earned.
- **Recent Activity**: Quick resume link to the last watched video and timestamp.

---

## 12. Migration Roadmap: From Supabase to MERN

| Area | Previous (Supabase) | New MERN Stack Implementation |
| :--- | :--- | :--- |
| **Authentication** | Supabase Auth (`supabase.auth.signInWithPassword`, sessions) | Express Auth with JWT Access Tokens + HTTP-Only Refresh Tokens via `authController` |
| **Database** | Supabase PostgreSQL tables & foreign keys | MongoDB documents with Mongoose Schemas, subdocuments, and references (`ObjectId`) |
| **Media Storage** | Supabase Storage (`course-images`, `course-videos`) | Cloudinary with Multer for automated CDN delivery, compression, and adaptive video streaming |
| **API Client** | Direct SDK queries (`supabase.from('courses').select(...)`) | Custom `axiosInstance` with automated token refresh interceptor calling Express REST APIs |
| **State Management** | Redux storing Supabase session | Redux Toolkit storing authenticated user state synced with JWT access token |
| **Data Fetching** | TanStack React Query wrapping Supabase calls | TanStack React Query wrapping Axios REST API functions in `src/api/functions/` |

---

## 13. Production Security & Performance Best Practices

1. **Centralized Error Handling**:
   - Generic `AppError` class inheriting from `Error` with `statusCode` and `isOperational`.
   - Global `errorMiddleware` sanitizing stack traces in production (`process.env.NODE_ENV === 'production'`).
2. **Database Performance**:
   - Indexed fields: `email`, `role`, `slug`, `category`, `instructor`, `status`, `averageRating`.
   - Compound unique index on `{ student: 1, course: 1 }` in Enrollments and Reviews to prevent duplicate purchases or double reviews.
   - Using `.lean()` on read-only queries to bypass Mongoose hydration overhead.
3. **Media Security**:
   - Video upload size limits enforced via Multer (`limits: { fileSize: 500 * 1024 * 1024 }`).
   - Private/Authenticated Cloudinary access URLs to prevent unauthorized video scraping.
4. **CORS & Cookies**:
   - `credentials: true` with strict explicit origin whitelisting (`process.env.CLIENT_URL`).
   - `SameSite: 'Lax'` or `'Strict'` with `Secure: true` in production.

---

## 14. Environment Variables Specification

### Backend `.env`
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/udemy_clone?retryWrites=true&w=majority

# JWT Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret_key_12345
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_67890
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@udemyclone.com

# Payment (Stripe - Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 15. Real Production Workflow

### Course Publishing Lifecycle:
```text
Instructor Drafts Course -> Uploads Syllabus & Cloudinary Videos -> Submits for Review (status: 'pending')
                          ↓
Admin Reviews Curriculum & Content -> Approves (status: 'published') OR Rejects with Feedback
                          ↓
Course appears on Home & Search Catalog -> Students Enroll
```

### Student Learning Lifecycle:
```text
Student Enrolls -> Accesses Course Player -> Streams Cloudinary Video
                          ↓
Player tracks last_time & lecture completion -> Saved via /api/v1/progress
                          ↓
All Lectures Completed (100% Progress) -> System issues Certificate with unique ID
```

---

## 16. Resume Project Highlights

> **MERN Stack Udemy Clone with Cloudinary & Role-Based Access Control (RBAC)**  
> - Engineered a full-scale e-learning marketplace serving Students, Instructors, and Admins using Node.js, Express, MongoDB, and Next.js 15.  
> - Designed and deployed a dual-token JWT authentication architecture (short-lived access tokens + HttpOnly refresh token cookies) with automated silent token refresh.  
> - Integrated Cloudinary for high-performance video streaming, lecture attachments, and automated thumbnail extraction with Multer stream handling.  
> - Implemented advanced MongoDB aggregation pipelines for instructor revenue calculation, course rating averages, and admin analytics dashboards.  
> - Built full-text search, multi-attribute filtering (category, rating, price, level), pagination, and real-time lecture progress persistence.

---

## 17. Future Improvements & Roadmap

- **Live Streaming Sessions**: WebRTC or Zoom API integration for live instructor webinars.
- **Interactive Quizzes & Coding Exercises**: In-browser code runner and section quizzes with instant grading.
- **AI Course Assistant**: LLM integration to answer student questions based on lecture transcripts.
- **Real-Time Notifications**: WebSocket / Socket.io for immediate announcements, Q&A replies, and instructor feedback.
- **Mobile Application**: React Native mobile app utilizing the same REST API.
