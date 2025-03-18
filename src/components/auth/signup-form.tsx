
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { signUp } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName || !email || !password || !confirmPassword) {
      toast({
        title: "Form tidak lengkap",
        description: "Semua field harus diisi",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password terlalu pendek",
        description: "Password harus minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = {
        displayName,
        role: "viewer", // Default role for new users
      };
      
      const { user, error } = await signUp(email, password, userData);
      
      if (error) {
        let errorMessage = "Terjadi kesalahan saat mendaftar. Coba lagi.";
        
        if (typeof error === 'object' && error !== null && 'code' in error) {
          const errorCode = (error as any).code;
          
          if (errorCode === 'auth/email-already-in-use') {
            errorMessage = "Email sudah terdaftar";
          } else if (errorCode === 'auth/invalid-email') {
            errorMessage = "Format email tidak valid";
          } else if (errorCode === 'auth/weak-password') {
            errorMessage = "Password terlalu lemah";
          }
        }
        
        toast({
          title: "Pendaftaran gagal",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (user) {
        toast({
          title: "Pendaftaran berhasil",
          description: "Akun Anda telah berhasil dibuat!",
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-elevation animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Daftar Akun</CardTitle>
        <CardDescription>
          Lengkapi form di bawah ini untuk membuat akun baru
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nama Lengkap</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
              required
              className="transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@desa.go.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="username"
              className="transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="new-password"
                className="pr-10 transition-all duration-200"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-1 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Sembunyikan password" : "Tampilkan password"}
                </span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="new-password"
                className="pr-10 transition-all duration-200"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-center text-muted-foreground">
          Dengan mendaftar, Anda menyetujui untuk mengikuti syarat dan ketentuan serta kebijakan privasi kami.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
