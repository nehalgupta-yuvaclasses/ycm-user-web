# Yuva Classes Web Application

Welcome to the **Yuva Classes** web repository. This project serves as the modern, high-performance web platform for Yuva Classes students, providing access to courses, resources, profile management, and more.

## ✨ Tech Stack

This project is built using a modern, scalable web stack focusing on performance and an excellent developer experience.

*   **Frontend Framework:** React 19 + TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS (v4) with standard components from Shadcn/ui & Radix UI
*   **Routing:** React Router v7
*   **State Management:** React Query (Tanstack)
*   **Authentication:** Firebase (specifically mapped for OTP/Phone auth conflicts logic)
*   **Database & Backend API:** Supabase (PostgreSQL edge backend via `@supabase/supabase-js`)
*   **Payments:** Razorpay Integration

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with `npm` (or `yarn`/`pnpm`).

### 1. Clone the repository
```bash
git clone https://github.com/nehalgupta-yuvaclasses/ycm-user-web.git
cd ycm-user-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
To connect this frontend to its backend services, you'll need the environment variables matching the configuration in your Firebase, Supabase, and Razorpay dashboards. Create a `.env` file in the root of the project:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SECRET_KEY=your_supabase_secret_key

# Firebase Authentication Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will launch on your local network (e.g. `http://localhost:3000`).

## ☁️ Deployment (Vercel)

This application is structurally prepared for seamless edge deployment through **Vercel**. 

1. Push your code to your designated GitHub repository.
2. In the Vercel Dashboard, select **Import Project** and link to `nehalgupta-yuvaclasses/ycm-user-web`.
3. Vercel will auto-detect "Vite" preset. Leave Build Settings at their defaults (`vite build` -> `dist`).
4. **Important**: Go to the *Environment Variables* tab during setup and inject all keys defined in your `.env` file.
5. Hit **Deploy**.

*(Note: Custom client-side routing on Vercel is reliably mapped by the configured `vercel.json` included in the root directory).*

## 📖 License & Legal

**Confidential and Proprietary:** All source code, components, and intellectual capital within this repository are the property of Yuva Classes. Unauthorized duplication or distribution is prohibited.
