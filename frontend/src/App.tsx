import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import React from 'react';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/patient/Dashboard";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorProfile from "./pages/doctor/Profile";
import PatientManagement from "./pages/doctor/PatientManagement";
import MedicalRecords from "./pages/doctor/MedicalRecords";
import CreateReport from "./pages/doctor/CreateReport";
import AnalyzeImages from "./pages/doctor/AnalyzeImages";
import Messages from "./pages/Messages";
import AdminDashboard from "./pages/admin/Dashboard";
import PatientsManagement from "./pages/admin/PatientsManagement";
import SymptomChecker from "./pages/SymptomChecker";
import Appointments from "./pages/Appointments";
import HistoryAnalysis from "./pages/patient/HistoryAnalysis";

// New Pages
import Doctors from "./pages/Doctors";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// AI Feature Pages
import DiagnosisAssistance from "./pages/ai/DiagnosisAssistance";
import PredictiveAnalysis from "./pages/ai/PredictiveAnalysis";
import ImageAnalysis from "./pages/ai/ImageAnalysis";

// New Alert Page
import FullAlert from "./pages/admin/fullAlert"; // Updated to lowercase 'fullAlert' to match file name

// Auth guard component
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Create a new instance of QueryClient
const queryClient = new QueryClient();

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth check to complete
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  if (isChecking) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-healwise-blue"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard if role doesn't match
    if (user.role === "patient") {
      return <Navigate to="/patient-dashboard" />;
    } else if (user.role === "doctor") {
      return <Navigate to="/doctor-dashboard" />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

// Make sure App is defined as a proper React function component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* New public pages */}
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />

              {/* Patient routes */}
              <Route
                path="/patient-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["patient"]}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/health-metrics"
                element={
                  <ProtectedRoute allowedRoles={["patient"]}>
                    <HistoryAnalysis />
                  </ProtectedRoute>
                }
              />

              {/* Doctor routes */}
              <Route
                path="/doctor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor-profile"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <DoctorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <PatientManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medical-records"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <MedicalRecords />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-report"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <CreateReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analyze-images"
                element={
                  <ProtectedRoute allowedRoles={["doctor"]}>
                    <AnalyzeImages />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/patients"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <PatientsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/alerts"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <FullAlert />
                  </ProtectedRoute>
                }
              />

              {/* AI Feature routes */}
              <Route
                path="/ai/diagnosis-assistance"
                element={
                  <ProtectedRoute>
                    <DiagnosisAssistance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/predictive-analysis"
                element={
                  <ProtectedRoute>
                    <PredictiveAnalysis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai/image-analysis"
                element={
                  <ProtectedRoute>
                    <ImageAnalysis />
                  </ProtectedRoute>
                }
              />

              {/* Common protected routes */}
              <Route
                path="/symptom-checker"
                element={
                  <ProtectedRoute>
                    <SymptomChecker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;