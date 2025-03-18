
import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "@/lib/firebase";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse bg-muted rounded-full h-12 w-12"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="h-full flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} onClose={() => isMobile && setIsSidebarOpen(false)} />
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ease-apple ${
            isSidebarOpen ? "ml-0 lg:ml-64" : "ml-0"
          }`}
        >
          <div className="container py-6 space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
