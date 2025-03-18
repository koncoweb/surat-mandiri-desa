
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, FilePenLine, Printer, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Letter } from "@/lib/types";

interface LetterCardProps {
  letter: Letter;
}

const LetterCard: React.FC<LetterCardProps> = ({ letter }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "sent":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "archived":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getLetterTypeLabel = (type: string) => {
    switch (type) {
      case "UMUM":
        return "Umum";
      case "KETERANGAN":
        return "Keterangan";
      case "REKOMENDASI":
        return "Rekomendasi";
      case "PENGUMUMAN":
        return "Pengumuman";
      case "UNDANGAN":
        return "Undangan";
      default:
        return type;
    }
  };

  const formatDate = (date: Date | any) => {
    if (!date) return "-";
    
    if (typeof date === "string") {
      date = new Date(date);
    }
    
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <Card className="overflow-hidden hover:shadow-elevation transition-all duration-300 ease-apple">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("font-normal", getStatusColor(letter.status))}>
              {letter.status === "draft" ? "Draft" : 
               letter.status === "pending" ? "Menunggu" :
               letter.status === "approved" ? "Disetujui" :
               letter.status === "rejected" ? "Ditolak" :
               letter.status === "sent" ? "Terkirim" : "Diarsipkan"}
            </Badge>
            <Badge variant="secondary">
              {getLetterTypeLabel(letter.type)}
            </Badge>
            {letter.priority === "high" && (
              <Badge variant="destructive">Penting</Badge>
            )}
          </div>
          <Link to={`/letters/${letter.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold mt-2 line-clamp-1">
              {letter.subject}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            No. {letter.letterNumber}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link to={`/letters/${letter.id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                <span>Lihat</span>
              </Link>
            </DropdownMenuItem>
            {letter.status === "draft" && (
              <DropdownMenuItem asChild>
                <Link to={`/letters/${letter.id}/edit`} className="flex items-center">
                  <FilePenLine className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>
            )}
            {letter.status === "pending" && (
              <DropdownMenuItem className="flex items-center">
                <FileCheck className="mr-2 h-4 w-4" />
                <span>Setujui</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="flex items-center">
              <Printer className="mr-2 h-4 w-4" />
              <span>Cetak</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {letter.content.replace(/<[^>]*>/g, "")}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground border-t mt-2">
        <div>
          Dibuat: {formatDate(letter.createdAt)}
        </div>
        <div>
          Penerima: {letter.recipients.length}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LetterCard;
