# UpTech-Z — Administrator Control Center

The administrative control center and moderation dashboard for the **UpTech-Z** E-Learning ecosystem. Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS.

---

## 🚀 Key Modules

- **Executive Analytics Dashboard**: Real-time KPI cards and interactive charts for platform revenue, enrollments, course activity, and student registration volume powered by ApexCharts.
- **Course Moderation**:
  - Comprehensive course catalog with search, status filtering, and pagination.
  - Deep curriculum inspection (chapters, lectures, video resources).
  - Lifecycle state management: `Draft` ➔ `Pending Approval` ➔ `Approved` / `Rejected`.
  - Feature & Trending toggles to highlight top-performing courses on the student marketplace.
- **User Management**:
  - Centralized directory of students and instructors.
  - Verification badge toggling and account activation/deactivation controls.
- **Taxonomy Management**:
  - Hierarchical categories with custom slugs and descriptions.
  - Tags manager with real-time color badge preview.
- **Review Moderation**: Audit and flag student ratings and reviews.
- **Content Management System (CMS)**: Manage promotional banners, headline copy, and featured sections on the public homepage.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Lucide Icons, Iconify
- **State & Data Fetching**: TanStack React Query v5, Axios with interceptors
- **Tables & Visualization**: TanStack React Table v9, ApexCharts (`react-apexcharts`), FullCalendar v6
- **Real-Time Layer**: `socket.io-client` for live administrative alerts
- **Feedback & Notifications**: Sonner toast alerts

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
NEXT_APP_BASE_URL="http://localhost:5000"
NEXT_PUBLIC_UI_URL="http://localhost:5000"
NEXT_PUBLIC_SERVER_ORIGIN="http://localhost:5000"

NEXT_APP_TOKEN_NAME="uptechz_admin_access_token"
NEXT_APP_REFRESH_TOKEN_NAME="uptechz_admin_refresh_token"
NEXT_APP_ENCRYPTION_KEY_NAME="uptechz_admin_encryption_key"
NEXT_APP_REMEMBER_ME_KEY_NAME="uptechz_admin_remember_me"
```

### 3. Run Development Server
```bash
npm run dev -- -p 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.
