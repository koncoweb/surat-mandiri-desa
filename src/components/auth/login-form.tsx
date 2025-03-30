
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { signIn } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Form tidak lengkap",
        description: "Email dan password harus diisi",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { user, error } = await signIn(email, password);
      
      if (error) {
        let errorMessage = "Terjadi kesalahan saat masuk. Coba lagi.";
        
        if (typeof error === 'object' && error !== null && 'code' in error) {
          const errorCode = (error as any).code;
          
          if (errorCode === 'auth/invalid-credential') {
            errorMessage = "Email atau password tidak valid";
          } else if (errorCode === 'auth/user-not-found') {
            errorMessage = "Pengguna tidak ditemukan";
          } else if (errorCode === 'auth/too-many-requests') {
            errorMessage = "Terlalu banyak percobaan. Coba lagi nanti.";
          }
        }
        
        toast({
          title: "Gagal masuk",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (user) {
        toast({
          title: "Berhasil masuk",
          description: "Selamat datang kembali!",
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
        <CardTitle className="text-2xl font-bold">Masuk</CardTitle>
        <CardDescription>
          Masukkan email dan password untuk mengakses sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-xs"
                onClick={() => navigate("/auth/forgot-password")}
              >
                Lupa password?
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="current-password"
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
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
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
              "Masuk"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-center text-muted-foreground">
          Dengan masuk, Anda menyetujui untuk mengikuti syarat dan ketentuan serta kebijakan privasi kami.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
