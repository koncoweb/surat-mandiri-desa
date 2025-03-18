
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getLetters } from "@/lib/firebase";
import LetterCard from "@/components/ui/letter-card";
import { Letter, LetterStatus, LetterType } from "@/lib/types";
import {
  FilePlus,
  ArrowUpDown,
  Search,
  Filter,
  FileText,
} from "lucide-react";

const Letters: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const fetchLetters = async () => {
      setIsLoading(true);
      
      try {
        const filters: Record<string, any> = {};
        
        if (statusFilter !== "all") {
          filters.status = statusFilter;
        }
        
        if (typeFilter !== "all") {
          filters.type = typeFilter;
        }
        
        const { letters: fetchedLetters, error } = await getLetters(filters);
        
        if (error) {
          console.error("Error fetching letters:", error);
          return;
        }
        
        if (fetchedLetters) {
          // Ensure all fields required by the Letter type are present
          const validLetters = fetchedLetters.filter(letter => 
            letter.letterNumber && 
            letter.number && 
            letter.year && 
            letter.month && 
            letter.type && 
            letter.subject && 
            letter.content && 
            letter.recipients
          ) as Letter[];
          
          setLetters(validLetters);
        }
      } catch (error) {
        console.error("Error in fetchLetters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetters();
  }, [statusFilter, typeFilter]);

  // For now we'll use client-side filtering, in a real app you'd want to handle this on the server
  const filteredLetters = letters
    .filter((letter) => {
      if (!searchTerm) return true;
      
      const searchTermLower = searchTerm.toLowerCase();
      return (
        letter.subject.toLowerCase().includes(searchTermLower) ||
        letter.letterNumber.toLowerCase().includes(searchTermLower) ||
        letter.content.toLowerCase().includes(searchTermLower)
      );
    })
    .sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
      
      if (sortBy === "newest") {
        return dateB.getTime() - dateA.getTime();
      } else if (sortBy === "oldest") {
        return dateA.getTime() - dateB.getTime();
      } else if (sortBy === "alphabetical") {
        return a.subject.localeCompare(b.subject);
      }
      return 0;
    });

  const letterCountByStatus = letters.reduce(
    (acc, letter) => {
      const status = letter.status;
      if (status in acc) {
        acc[status]++;
      }
      return acc;
    },
    { draft: 0, pending: 0, approved: 0, rejected: 0, sent: 0, archived: 0 } as Record<LetterStatus, number>
  );

  // Simulate loading state for demo
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (letters.length === 0) {
        // Demo data
        setLetters([
          {
            id: "1",
            letterNumber: "001/UMUM/DESA/07/2023",
            number: 1,
            year: 2023,
            month: "07",
            type: "UMUM" as LetterType,
            subject: "Undangan Rapat Desa",
            content: "<p>Dengan hormat, kami mengundang Bapak/Ibu untuk menghadiri rapat desa pada...</p>",
            recipients: ["Kepala Dusun", "Ketua RT/RW", "Tokoh Masyarakat"],
            status: "approved" as LetterStatus,
            createdBy: "user1",
            createdAt: new Date(2023, 6, 15),
            approvedBy: "admin1",
            approvedAt: new Date(2023, 6, 16),
            priority: "medium"
          },
          {
            id: "2",
            letterNumber: "002/PENG/DESA/07/2023",
            number: 2,
            year: 2023,
            month: "07",
            type: "PENGUMUMAN" as LetterType,
            subject: "Pengumuman Jadwal Posyandu",
            content: "<p>Diumumkan kepada seluruh warga desa bahwa kegiatan Posyandu akan dilaksanakan pada...</p>",
            recipients: ["Seluruh Warga Desa"],
            status: "sent" as LetterStatus,
            createdBy: "user2",
            createdAt: new Date(2023, 6, 18),
            approvedBy: "admin1",
            approvedAt: new Date(2023, 6, 19),
            sentAt: new Date(2023, 6, 20),
            priority: "high"
          },
          {
            id: "3",
            letterNumber: "003/KET/DESA/07/2023",
            number: 3,
            year: 2023,
            month: "07",
            type: "KETERANGAN" as LetterType,
            subject: "Surat Keterangan Domisili",
            content: "<p>Yang bertanda tangan di bawah ini menerangkan bahwa...</p>",
            recipients: ["Budi Santoso"],
            status: "draft" as LetterStatus,
            createdBy: "user3",
            createdAt: new Date(2023, 6, 22),
            priority: "low"
          }
        ]);
      }
      
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, [letters.length]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Daftar Surat</h2>
          <p className="text-muted-foreground">
            Kelola semua surat dalam sistem
          </p>
        </div>
        <Button asChild>
          <Link to="/create-letter">
            <FilePlus className="mr-2 h-4 w-4" />
            Buat Surat
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-5">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Filter & Pencarian</CardTitle>
                <CardDescription>
                  Temukan surat yang Anda cari
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="h-6 px-2" variant="outline">
                  {filteredLetters.length} surat
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari berdasarkan nomor, perihal, atau isi surat..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                    <SelectItem value="sent">Terkirim</SelectItem>
                    <SelectItem value="archived">Diarsipkan</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Jenis" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="UMUM">Umum</SelectItem>
                    <SelectItem value="KETERANGAN">Keterangan</SelectItem>
                    <SelectItem value="REKOMENDASI">Rekomendasi</SelectItem>
                    <SelectItem value="PENGUMUMAN">Pengumuman</SelectItem>
                    <SelectItem value="UNDANGAN">Undangan</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Urutkan" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                    <SelectItem value="alphabetical">Abjad (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:col-span-5">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-5 w-20 bg-muted rounded-md animate-pulse"></div>
                    <div className="h-5 w-24 bg-muted rounded-md animate-pulse"></div>
                  </div>
                  <div className="h-6 w-2/3 bg-muted rounded-md animate-pulse mb-2"></div>
                  <div className="h-4 w-1/3 bg-muted rounded-md animate-pulse mb-4"></div>
                  <div className="h-16 w-full bg-muted rounded-md animate-pulse"></div>
                </div>
              </Card>
            ))
          ) : filteredLetters.length > 0 ? (
            filteredLetters.map((letter) => (
              <LetterCard key={letter.id} letter={letter} />
            ))
          ) : (
            <Card className="md:col-span-5">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/25 mb-4" />
                <h3 className="text-xl font-medium mb-2">Tidak ada surat ditemukan</h3>
                <p className="text-muted-foreground text-center mb-6">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Coba ubah filter atau kata kunci pencarian"
                    : "Belum ada surat yang dibuat. Mulai dengan membuat surat baru."}
                </p>
                <Button asChild>
                  <Link to="/create-letter">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Buat Surat Baru
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Letters;
