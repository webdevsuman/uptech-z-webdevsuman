# UpTech-Z — Student & Instructor Web Platform

The public marketplace and learning portal for the **UpTech-Z** E-Learning ecosystem. Built with Next.js 16 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS, and Material UI.

---

## 🌟 Portals & Features

### Student Experience
- **Discovery Marketplace**: Dynamic homepage with hero banners, career accelerators, and category carousels.
- **Faceted Course Search**: Real-time filtering by category, level, price (free vs paid), and ratings.
- **Course Syllabus & Preview**: Comprehensive course view with lecture breakdown, instructor bio, preview videos, and verified reviews.
- **Seamless Enrollment**: Instant enrollment for free courses and Stripe Checkout integration for premium courses.
- **Student Dashboard**: Track active course enrollments, learning progress, certificates, wishlist, and reviews.
- **Interactive Q&A**: Ask lecture questions and collaborate with instructors.

### Instructor Studio (`/instructor`)
- **Instructor Dashboard**: Overview of enrolled students, course reach, and ratings.
- **Course Builder**: Multi-step wizard covering title, description, category, tags, and media uploads.
- **Curriculum Manager**: Organize sections and lectures, upload video lessons, and attach study materials via Cloudinary.
- **Q&A Center**: Dedicated interface to answer student questions and resolve inquiries.
- **Announcements**: Broadcast updates to enrolled students.
- **Instructor Profile**: Manage bio, credentials, qualifications, and avatar.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Material UI (MUI v9), Emotion, Lucide React, Sonner
- **State & Networking**: TanStack React Query v5, Axios with JWT refresh interceptors
- **Forms & Validation**: React Hook Form, Zod schema validation
- **Carousels & Media**: Swiper
- **Real-Time Layer**: `socket.io-client`
- **Payments**: Stripe React / Node integration

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template file:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/
NEXT_APP_ACCESS_TOKEN_NAME=uptechz_frontend_access_token
NEXT_APP_REFRESH_TOKEN_NAME=uptechz_frontend_refresh_token
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
