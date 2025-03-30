
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";
import FirestoreRulesHelper from "@/components/auth/firestore-rules-helper";

const Auth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showRulesHelper, setShowRulesHelper] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
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
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-lg bg-white/10 backdrop-blur-sm p-6 w-full max-w-sm text-left">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-primary-foreground">Fitur Unggulan</h3>
                  <ul className="space-y-2 text-sm text-primary-foreground/90">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 mr-2 text-primary-foreground/70"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Penomoran surat sesuai standar terbaru
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 mr-2 text-primary-foreground/70"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Manajemen pengguna dengan peran yang berbeda
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 mr-2 text-primary-foreground/70"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Alur persetujuan dan verifikasi digital
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 mr-2 text-primary-foreground/70"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Penyimpanan dan pencarian surat yang mudah
                    </li>
                  </ul>
                </div>
              </div>
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
                {authMode === "login" ? "Silakan masuk untuk melanjutkan" : "Daftar untuk membuat akun baru"}
              </p>
            </div>
            
            {authMode === "login" ? (
              <>
                <LoginForm onSuccess={() => navigate("/")} />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Belum memiliki akun?{" "}
                    <button
                      onClick={() => setAuthMode("signup")}
                      className="text-primary underline hover:text-primary/90 cursor-pointer"
                    >
                      Daftar Sekarang
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <SignupForm onSuccess={() => navigate("/")} />
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Sudah memiliki akun?{" "}
                    <button
                      onClick={() => setAuthMode("login")}
                      className="text-primary underline hover:text-primary/90 cursor-pointer"
                    >
                      Masuk
                    </button>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <button
                      onClick={() => setShowRulesHelper(!showRulesHelper)}
                      className="text-primary underline hover:text-primary/90 cursor-pointer"
                    >
                      {showRulesHelper ? "Sembunyikan" : "Lihat"} panduan konfigurasi Firestore Rules
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {showRulesHelper && <FirestoreRulesHelper />}
    </div>
  );
};

export default Auth;
