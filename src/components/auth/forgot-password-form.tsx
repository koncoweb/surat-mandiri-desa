import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Form tidak lengkap",
        description: "Email harus diisi",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true);
      toast({
        title: "Email terkirim",
        description: "Silakan periksa email Anda untuk instruksi reset password",
      });
    } catch (error) {
      let errorMessage = "Terjadi kesalahan saat mengirim email reset password. Coba lagi.";
      
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const errorCode = (error as any).code;
        
        if (errorCode === 'auth/user-not-found') {
          errorMessage = "Email tidak terdaftar";
        } else if (errorCode === 'auth/invalid-email') {
          errorMessage = "Format email tidak valid";
        } else if (errorCode === 'auth/too-many-requests') {
          errorMessage = "Terlalu banyak percobaan. Coba lagi nanti.";
        }
      }
      
      toast({
        title: "Gagal mengirim email",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-elevation animate-scale-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Lupa Password</CardTitle>
        <CardDescription>
          Masukkan email Anda untuk menerima instruksi reset password
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
              <p>Email dengan instruksi reset password telah dikirim ke <strong>{email}</strong>.</p>
              <p className="mt-2">Silakan periksa kotak masuk email Anda dan ikuti petunjuk untuk mengatur ulang password.</p>
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              Kembali ke halaman login
            </Button>
          </div>
        ) : (
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
                className="transition-all duration-200"
              />
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
                "Kirim Instruksi Reset"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onBack}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Login
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-center text-muted-foreground">
          Jika Anda tidak menerima email dalam beberapa menit, periksa folder spam atau coba lagi.
        </p>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;