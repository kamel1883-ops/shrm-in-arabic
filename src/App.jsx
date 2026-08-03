import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Admin from './pages/Admin';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import ExamSimulation from './pages/ExamSimulation';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import EnrollmentSuccess from './pages/EnrollmentSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Flashcards from './pages/Flashcards';
import ProgressReport from './pages/ProgressReport';
import InstructorAbout from './pages/InstructorAbout';
import CourseOutline from './pages/CourseOutline';
import ResourceLibrary from './pages/ResourceLibrary';
import CertificationGuide from './pages/CertificationGuide';
import Notifications from './pages/Notifications';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/enrollment-success" element={<EnrollmentSuccess />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/flashcards" element={<Flashcards />} />
      <Route path="/progress-report" element={<ProgressReport />} />
      <Route path="/instructor-about" element={<InstructorAbout />} />
      <Route path="/course-outline" element={<CourseOutline />} />
      <Route path="/resource-library" element={<ResourceLibrary />} />
      <Route path="/certification-guide" element={<CertificationGuide />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/admin" element={<Admin />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:courseId" element={<CourseView />} />
        <Route path="/exam/:courseId" element={<ExamSimulation />} />
        <Route path="/checkout/:courseId" element={<Checkout />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;