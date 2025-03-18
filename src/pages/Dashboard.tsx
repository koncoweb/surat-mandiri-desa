
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FilePlus,
  FileCheck,
  FileX,
  Clock,
  BarChart2,
  FileText,
  Users,
  FilterIcon,
} from "lucide-react";
import { getLetters } from "@/lib/firebase";
import LetterCard from "@/components/ui/letter-card";
import { Letter } from "@/lib/types";

const Dashboard: React.FC = () => {
  const [recentLetters, setRecentLetters] = useState<Letter[]>([]);
  const [letterStats, setLetterStats] = useState({
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        const { letters, error } = await getLetters();
        
        if (error) {
          console.error("Error fetching letters:", error);
          return;
        }
        
        if (letters) {
          // Set recent letters (latest 5)
          setRecentLetters(letters.slice(0, 5));
          
          // Calculate stats
          const stats = {
            draft: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            total: letters.length,
          };
          
          letters.forEach((letter: Letter) => {
            if (letter.status === "draft") stats.draft++;
            if (letter.status === "pending") stats.pending++;
            if (letter.status === "approved") stats.approved++;
            if (letter.status === "rejected") stats.rejected++;
          });
          
          setLetterStats(stats);
        }
      } catch (error) {
        console.error("Error in loadData:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Simulate loading state for demo
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      
      // Demo data if no letters are found
      if (recentLetters.length === 0) {
        setLetterStats({
          draft: 3,
          pending: 2,
          approved: 7,
          rejected: 1,
          total: 13,
        });
      }
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, [recentLetters.length]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Beranda</h2>
          <p className="text-muted-foreground">
            Selamat datang di Sistem Surat Elektronik Desa
          </p>
        </div>
        <Button asChild className="flex items-center">
          <Link to="/create-letter">
            <FilePlus className="mr-2 h-4 w-4" />
            Buat Surat
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-subtle transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Surat</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                letterStats.total
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Surat yang telah dibuat
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-subtle transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                letterStats.pending
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Surat yang belum disetujui
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-subtle transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Surat Disetujui</CardTitle>
            <FileCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                letterStats.approved
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Surat yang telah disetujui
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-subtle transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Surat Ditolak</CardTitle>
            <FileX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-12 bg-muted animate-pulse rounded"></div>
              ) : (
                letterStats.rejected
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Surat yang tidak disetujui
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Surat Terbaru</CardTitle>
                <CardDescription>
                  Daftar surat yang baru dibuat atau diperbarui
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <FilterIcon className="h-3.5 w-3.5 mr-1" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="h-6 w-1/3 bg-muted animate-pulse rounded mb-3"></div>
                    <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentLetters.length > 0 ? (
              <div className="space-y-4">
                {recentLetters.map((letter) => (
                  <LetterCard key={letter.id} letter={letter} />
                ))}
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline" asChild>
                    <Link to="/letters">Lihat Semua Surat</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium mb-2">Belum ada surat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Anda belum membuat surat apa pun. Mulai dengan membuat surat baru.
                </p>
                <Button asChild>
                  <Link to="/create-letter">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Buat Surat
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas</CardTitle>
            <CardDescription>
              Aktivitas terbaru dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-full bg-muted animate-pulse rounded mb-1"></div>
                      <div className="h-3 w-1/3 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2 mt-0.5">
                    <FilePlus className="h-3 w-3 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Budi Santoso membuat surat baru</p>
                    <p className="text-xs text-muted-foreground">Surat Keterangan Domisili • 10 menit yang lalu</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-2 mt-0.5">
                    <FileCheck className="h-3 w-3 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Kepala Desa menyetujui surat</p>
                    <p className="text-xs text-muted-foreground">Surat Rekomendasi • 2 jam yang lalu</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 p-2 mt-0.5">
                    <Users className="h-3 w-3 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ani Wijaya ditambahkan sebagai staff</p>
                    <p className="text-xs text-muted-foreground">Manajemen Pengguna • 5 jam yang lalu</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-yellow-100 p-2 mt-0.5">
                    <Clock className="h-3 w-3 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Surat menunggu persetujuan</p>
                    <p className="text-xs text-muted-foreground">Surat Undangan • 1 hari yang lalu</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-red-100 p-2 mt-0.5">
                    <FileX className="h-3 w-3 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Surat ditolak dengan catatan</p>
                    <p className="text-xs text-muted-foreground">Surat Permohonan • 1 hari yang lalu</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Bulanan</CardTitle>
          <CardDescription>
            Jumlah surat berdasarkan jenis dalam 30 hari terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 bg-muted animate-pulse rounded"></div>
          ) : (
            <div className="h-64 flex items-center justify-center border rounded">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Data statistik akan muncul saat ada lebih banyak surat
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
