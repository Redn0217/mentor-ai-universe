
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ScrollToTop } from "./components/ScrollToTop";
import { useEffect } from "react";
import { migrateDataToSupabase } from "./utils/migrateData";

// Page imports
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";
import Pricing from "./pages/Pricing";
import Certifications from "./pages/Certifications";
import Corporate from "./pages/Corporate";
import TechnologyCourse from "./pages/TechnologyCourse";
import CoursesList from "./pages/admin/CoursesList";
import CourseEditor from "./pages/admin/CourseEditor";
import Create from "./pages/Create";
import Assess from "./pages/Assess";
import Personalize from "./pages/Personalize";
import Communicate from "./pages/Communicate";
import AIInterviewer from "./pages/AIInterviewer";
import AnimatedSphereTest from "./pages/AnimatedSphereTest";
import WebGLContextTest from "./pages/WebGLContextTest";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Attempt to migrate data when the app starts
    const attemptMigration = async () => {
      try {
        console.log("Attempting to migrate data to Supabase...");
        await migrateDataToSupabase();
        console.log("Data migration process completed");
      } catch (error) {
        // This should not happen anymore since we've made migrateDataToSupabase
        // handle errors internally, but just in case:
        console.error("Unexpected error during data migration:", error);
        // Silently fail - the app can still function with the API
      }
    };

    attemptMigration();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/tech/:slug" element={<TechnologyCourse />} />
        <Route path="/create" element={<Create />} />
        <Route path="/assess" element={<Assess />} />
        <Route path="/personalize" element={<Personalize />} />
        <Route path="/communicate" element={<Communicate />} />
        <Route path="/ai-interviewer" element={<AIInterviewer />} />
        <Route path="/sphere-test" element={<AnimatedSphereTest />} />
        <Route path="/webgl-context-test" element={<WebGLContextTest />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/courses" element={<CoursesList />} />
          <Route path="/admin/courses/:slug" element={<CourseEditor />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
