
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  User,
  Bell,
  LogOut,
  Settings,
  X,
  Search
} from "lucide-react";
import { signOut, auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Set page title based on current route
    const path = location.pathname;
    
    if (path === "/") {
      setPageTitle("Beranda");
    } else if (path === "/letters") {
      setPageTitle("Daftar Surat");
    } else if (path === "/create-letter") {
      setPageTitle("Buat Surat");
    } else if (path === "/settings") {
      setPageTitle("Pengaturan");
    } else if (path === "/users") {
      setPageTitle("Manajemen Pengguna");
    } else if (path.includes("/letters/")) {
      setPageTitle("Detail Surat");
    } else {
      setPageTitle("Surat Elektronik Desa");
    }
  }, [location]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Gagal keluar",
        description: "Terjadi kesalahan saat keluar. Coba lagi.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil keluar",
        description: "Anda telah keluar dari sistem.",
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ease-apple ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-subtle" 
          : "bg-background"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
            aria-label={isSidebarOpen ? "Tutup menu" : "Buka menu"}
          >
            {isSidebarOpen && isMobile ? <X size={20} /> : <Menu size={20} />}
          </Button>
          
          <div className="flex flex-col">
            <h1 className="text-lg font-medium hidden md:block">
              {pageTitle}
            </h1>
            <span className="text-xs text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative rounded-full bg-muted px-3 py-1.5 items-center max-w-xs transition-all duration-300 ease-apple focus-within:max-w-md">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari surat..."
              className="bg-transparent border-none outline-none focus:outline-none px-2 text-sm w-full"
            />
          </div>

          {user && (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 border-2 border-muted overflow-hidden"
                  >
                    <User size={16} />
                    <span className="sr-only">Profil Pengguna</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Staff</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings size={16} className="mr-2" />
                      <span>Pengaturan</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
