import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from './components/ui/tooltip';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { OnboardingModal } from './components/shared/OnboardingModal';

import { Toaster } from 'sonner';

// Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/public/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/public/RefundPolicy'));
const Disclaimer = lazy(() => import('./pages/public/Disclaimer'));
const CourseDetail = lazy(() => import('./pages/public/CourseDetail'));
const Checkout = lazy(() => import('./pages/public/Checkout'));
const Courses = lazy(() => import('./pages/public/Courses'));
const Resources = lazy(() => import('./pages/public/Resources'));
const ResourceDetail = lazy(() => import('./pages/public/ResourceDetail'));
const BlogListing = lazy(() => import('./pages/public/BlogListing'));
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'));

// Dashboard Pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const MyCourses = lazy(() => import('./pages/dashboard/MyCourses'));
const Tests = lazy(() => import('./pages/dashboard/Tests'));
const TestDetail = lazy(() => import('./pages/dashboard/TestDetail'));
const StudentResources = lazy(() => import('./pages/dashboard/StudentResources'));
const Payments = lazy(() => import('./pages/dashboard/Payments'));
const PaymentDetail = lazy(() => import('./pages/dashboard/PaymentDetail'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <Router>
            <OnboardingModal />
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
              </div>
            }>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/course/:id" element={<CourseDetail />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/:id" element={<ResourceDetail />} />
                  <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
                  <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
                  <Route path="/blog" element={<BlogListing />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                </Route>

                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="courses" element={<MyCourses />} />
                  <Route path="tests" element={<Tests />} />
                  <Route path="tests/:id" element={<TestDetail />} />
                  <Route path="resources" element={<StudentResources />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="payments/:id" element={<PaymentDetail />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </QueryProvider>
  );
}


