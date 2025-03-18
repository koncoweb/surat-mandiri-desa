
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  FilePlus,
  Users,
  Settings,
  FileArchive,
  ChevronDown,
  Globe,
  Clock,
} from "lucide-react";
import { auth, getUserRole } from "@/lib/firebase";

interface SidebarProps {
  isSidebarOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
  badge?: number | string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive,
  onClick,
  badge,
}) => {
  return (
    <Link to={href} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-3 transition-all duration-200 ease-apple",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        {icon}
        <span className="text-sm">{label}</span>
        {badge !== undefined && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {badge}
          </span>
        )}
      </Button>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onClose }) => {
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLetterDropdownOpen, setIsLetterDropdownOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      }
    };
    
    fetchUserRole();
    
    // Check if current path is letters related to open the dropdown
    if (location.pathname.includes('/letters') || location.pathname.includes('/create-letter')) {
      setIsLetterDropdownOpen(true);
    }
  }, [location.pathname]);

  const checkIsActive = (path: string) => location.pathname === path;
  const checkIsActivePath = (path: string) => location.pathname.includes(path);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-apple lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border p-4">
        <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
          <span className="h-7 w-7 rounded bg-primary flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-heading font-bold text-lg">SuratDesa</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          <SidebarItem
            icon={<Home size={18} />}
            label="Beranda"
            href="/"
            isActive={checkIsActive("/")}
            onClick={onClose}
          />

          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full justify-start items-center gap-2 px-3 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              onClick={() => setIsLetterDropdownOpen(!isLetterDropdownOpen)}
            >
              <FileText size={18} />
              <span className="text-sm">Surat</span>
              <ChevronDown
                size={16}
                className={cn(
                  "ml-auto transition-transform duration-200",
                  isLetterDropdownOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </Button>

            {isLetterDropdownOpen && (
              <div className="ml-6 mt-1 space-y-1 border-l border-sidebar-border pl-2">
                <SidebarItem
                  icon={<FileText size={16} />}
                  label="Daftar Surat"
                  href="/letters"
                  isActive={checkIsActive("/letters")}
                  onClick={onClose}
                />
                <SidebarItem
                  icon={<FilePlus size={16} />}
                  label="Buat Surat"
                  href="/create-letter"
                  isActive={checkIsActive("/create-letter")}
                  onClick={onClose}
                />
                <SidebarItem
                  icon={<Clock size={16} />}
                  label="Menunggu Persetujuan"
                  href="/letters/pending"
                  isActive={checkIsActive("/letters/pending")}
                  onClick={onClose}
                  badge={3}
                />
                <SidebarItem
                  icon={<FileArchive size={16} />}
                  label="Arsip Surat"
                  href="/letters/archived"
                  isActive={checkIsActive("/letters/archived")}
                  onClick={onClose}
                />
              </div>
            )}
          </div>

          {userRole === "admin" && (
            <SidebarItem
              icon={<Users size={18} />}
              label="Manajemen Pengguna"
              href="/users"
              isActive={checkIsActivePath("/users")}
              onClick={onClose}
            />
          )}

          <SidebarItem
            icon={<Globe size={18} />}
            label="Profil Desa"
            href="/village-profile"
            isActive={checkIsActive("/village-profile")}
            onClick={onClose}
          />

          <SidebarItem
            icon={<Settings size={18} />}
            label="Pengaturan"
            href="/settings"
            isActive={checkIsActive("/settings")}
            onClick={onClose}
          />
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <p className="text-xs text-sidebar-accent-foreground font-medium mb-2">
            SuratDesa v1.0
          </p>
          <p className="text-xs text-sidebar-accent-foreground/70">
            Sistem manajemen surat elektronik untuk pemerintah desa
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
