
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLetter } from "@/lib/firebase";
import { Letter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Users,
  MessageSquare,
  Clock,
  Printer,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import VillageLetterhead from "@/components/letters/village-letterhead";

const LetterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetter = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const { letter: fetchedLetter, error } = await getLetter(id);
        
        if (error) {
          console.error("Error fetching letter:", error);
          setError("Gagal memuat data surat");
          return;
        }
        
        if (fetchedLetter) {
          setLetter(fetchedLetter);
        } else {
          setError("Surat tidak ditemukan");
        }
      } catch (err) {
        console.error("Error in fetchLetter:", err);
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetter();
  }, [id]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "sent":
        return "blue";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            className="mb-2 p-0 h-auto text-muted-foreground"
            onClick={() => navigate("/letters")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke daftar surat
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Detail Surat</h2>
          <p className="text-muted-foreground">
            Lihat informasi lengkap tentang surat
          </p>
        </div>
        <Button onClick={handlePrint} className="print:hidden">
          <Printer className="mr-2 h-4 w-4" />
          Cetak Surat
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-3">
              <div className="h-6 w-2/3 bg-muted rounded-md animate-pulse"></div>
              <div className="h-24 w-full bg-muted rounded-md animate-pulse"></div>
              <div className="h-6 w-1/3 bg-muted rounded-md animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-6">
              <FileText className="h-12 w-12 text-muted-foreground/25 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                {error || "Surat tidak ditemukan"}
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Surat yang Anda cari mungkin telah dihapus atau tidak tersedia
              </p>
              <Button onClick={() => navigate("/letters")}>
                Kembali ke daftar surat
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : letter ? (
        <div className="space-y-6">
          <div className="print:hidden grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Nomor Surat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{letter.letterNumber}</p>
                <div className="flex items-center mt-2">
                  <Badge variant={getStatusBadgeColor(letter.status)}>
                    {letter.status === "draft"
                      ? "Draft"
                      : letter.status === "pending"
                      ? "Menunggu"
                      : letter.status === "approved"
                      ? "Disetujui"
                      : letter.status === "rejected"
                      ? "Ditolak"
                      : letter.status === "sent"
                      ? "Terkirim"
                      : "Diarsipkan"}
                  </Badge>
                  {letter.priority && (
                    <Badge
                      variant="outline"
                      className={`ml-2 ${
                        letter.priority === "high"
                          ? "border-red-500 text-red-500"
                          : letter.priority === "medium"
                          ? "border-amber-500 text-amber-500"
                          : "border-blue-500 text-blue-500"
                      }`}
                    >
                      {letter.priority === "high"
                        ? "Prioritas Tinggi"
                        : letter.priority === "medium"
                        ? "Prioritas Sedang"
                        : "Prioritas Rendah"}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Informasi Surat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Jenis</p>
                      <p className="font-medium">{letter.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal</p>
                      <p className="font-medium">
                        {formatDate(new Date(letter.createdAt))}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Penerima</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ditujukan kepada
                    </p>
                    <ul className="list-disc list-inside ml-1">
                      {letter.recipients.map((recipient, index) => (
                        <li key={index} className="font-medium">
                          {recipient}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-md border shadow-sm p-6 print:shadow-none print:border-none">
            <div className="print:block">
              <VillageLetterhead />
              
              <div className="text-center mt-6 mb-8">
                <h1 className="text-lg font-bold uppercase mb-1">
                  {letter.type === "UNDANGAN"
                    ? "SURAT UNDANGAN"
                    : letter.type === "KETERANGAN"
                    ? "SURAT KETERANGAN"
                    : letter.type === "REKOMENDASI"
                    ? "SURAT REKOMENDASI"
                    : letter.type === "PENGUMUMAN"
                    ? "PENGUMUMAN"
                    : "SURAT"}
                </h1>
                <p className="text-sm">Nomor: {letter.letterNumber}</p>
              </div>

              <div className="space-y-4">
                {letter.type !== "PENGUMUMAN" && (
                  <div>
                    <p>Kepada Yth,</p>
                    <ul className="list-disc ml-8 my-2">
                      {letter.recipients.map((recipient, index) => (
                        <li key={index}>{recipient}</li>
                      ))}
                    </ul>
                    <p>di Tempat</p>
                  </div>
                )}

                <div className="mt-6">
                  <p className="font-bold">Perihal: {letter.subject}</p>
                </div>

                <div
                  className="mt-4 prose prose-p:my-2 max-w-none"
                  dangerouslySetInnerHTML={{ __html: letter.content }}
                />

                <div className="mt-8 text-right mr-12">
                  <p>{formatDate(new Date())}</p>
                  <p className="mt-1">Kepala Desa,</p>
                  {letter.signatureURL ? (
                    <img
                      src={letter.signatureURL}
                      alt="Tanda tangan kepala desa"
                      className="h-20 mr-4 ml-auto my-4"
                    />
                  ) : (
                    <div className="h-20"></div>
                  )}
                  <p className="font-bold underline">BUDI DARMAWAN</p>
                </div>
              </div>
            </div>
          </div>

          <div className="print:hidden">
            <Separator className="my-6" />
            
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Aktivitas</CardTitle>
                <CardDescription>
                  Riwayat perubahan status surat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-2 bg-primary/20 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Surat dibuat</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(letter.createdAt))}
                      </p>
                    </div>
                  </div>
                  
                  {letter.approvedAt && (
                    <div className="flex items-start">
                      <div className="mr-2 bg-green-100 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Surat disetujui</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(letter.approvedAt))}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {letter.sentAt && (
                    <div className="flex items-start">
                      <div className="mr-2 bg-blue-100 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Surat dikirim</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(letter.sentAt))}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LetterDetail;
