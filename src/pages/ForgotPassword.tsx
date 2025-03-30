import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="bg-muted rounded-full h-10 w-10 mx-auto mb-4"></div>
          <div className="bg-muted rounded h-4 w-24 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex bg-blue-600 md:bg-gradient-to-br from-blue-600 to-blue-900 items-center justify-center p-8">
          <div className="max-w-md space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-primary-foreground">
                Sistem Surat Menyurat Elektronik Desa
              </h1>
              <p className="text-primary-foreground/80">
                Platform pengelolaan surat digital yang mempermudah administrasi pemerintahan desa.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center p-8">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2 text-center md:hidden">
              <h1 className="text-2xl font-bold tracking-tighter">
                Sistem Surat Elektronik Desa
              </h1>
              <p className="text-muted-foreground">
                Reset password akun Anda
              </p>
            </div>
            
            <ForgotPasswordForm onBack={() => navigate("/auth")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;