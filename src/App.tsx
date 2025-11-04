
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
import EnhancedCoursePage from "./components/course/EnhancedCoursePage";
import ModulePage from "./pages/ModulePage";




const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Database migration is now handled through SQL scripts
    // The new hierarchical database structure is already in place
    console.log("Application starting with new database structure");
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
        <Route path="/course/:courseSlug" element={<EnhancedCoursePage />} />
        <Route path="/course/:courseSlug/module/:moduleId" element={<ModulePage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/assess" element={<Assess />} />
        <Route path="/personalize" element={<Personalize />} />
        <Route path="/communicate" element={<Communicate />} />




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
