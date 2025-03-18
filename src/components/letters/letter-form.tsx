import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, PlusCircle, Save, SendHorizontal, Trash2 } from "lucide-react";
import { auth, createLetter, uploadFile } from "@/lib/firebase";
import { LetterType } from "@/lib/types";
import RecipientSelector from "./recipient-selector";

const LetterForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [letterType, setLetterType] = useState<LetterType>("UMUM");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState<string>("");
  const [additionalRecipients, setAdditionalRecipients] = useState<string[]>([]);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddAdditionalRecipient = () => {
    setAdditionalRecipients([...additionalRecipients, ""]);
  };

  const handleRemoveAdditionalRecipient = (index: number) => {
    const newRecipients = [...additionalRecipients];
    newRecipients.splice(index, 1);
    setAdditionalRecipients(newRecipients);
  };

  const handleAdditionalRecipientChange = (index: number, value: string) => {
    const newRecipients = [...additionalRecipients];
    newRecipients[index] = value;
    setAdditionalRecipients(newRecipients);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...attachments];
    newFiles.splice(index, 1);
    setAttachments(newFiles);
  };

  const handleSubmit = async (status: "draft" | "pending") => {
    if (!subject.trim()) {
      toast({
        title: "Form tidak lengkap",
        description: "Perihal surat harus diisi",
        variant: "destructive",
      });
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Tidak dapat membuat surat",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine main recipient with additional recipients
      const allRecipients: string[] = [];
      if (recipient) {
        allRecipients.push(recipient);
      }
      
      // Add additional recipients if any
      const filteredAdditionalRecipients = additionalRecipients.filter(r => r.trim() !== "");
      allRecipients.push(...filteredAdditionalRecipients);
      
      // Upload attachments if any
      const uploadedAttachments = [];
      
      if (attachments.length > 0) {
        for (const file of attachments) {
          const path = `letters/${currentUser.uid}/${Date.now()}_${file.name}`;
          const { url, error } = await uploadFile(file, path);
          
          if (error) {
            throw new Error(`Failed to upload file: ${file.name}`);
          }
          
          if (url) {
            uploadedAttachments.push({
              name: file.name,
              url,
              type: file.type,
              size: file.size,
              uploadedAt: new Date(),
            });
          }
        }
      }
      
      // Create letter in Firestore
      const letterData = {
        type: letterType,
        subject,
        content,
        recipients: allRecipients,
        priority,
        status,
        notes,
        attachments: uploadedAttachments,
      };
      
      const { id, letterNumber, error } = await createLetter(letterData, currentUser.uid);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Surat berhasil dibuat",
        description: `Surat telah disimpan dengan nomor: ${letterNumber}`,
      });
      
      // Redirect to letter detail
      navigate(`/letters/${id}`);
    } catch (error) {
      console.error("Error creating letter:", error);
      toast({
        title: "Gagal membuat surat",
        description: "Terjadi kesalahan saat menyimpan surat. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="content">Konten</TabsTrigger>
          <TabsTrigger value="recipients">Penerima</TabsTrigger>
          <TabsTrigger value="attachments">Lampiran</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="letter-type">Jenis Surat</Label>
                  <Select 
                    value={letterType} 
                    onValueChange={(value) => setLetterType(value as LetterType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis surat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UMUM">Umum</SelectItem>
                      <SelectItem value="KETERANGAN">Keterangan</SelectItem>
                      <SelectItem value="REKOMENDASI">Rekomendasi</SelectItem>
                      <SelectItem value="PENGUMUMAN">Pengumuman</SelectItem>
                      <SelectItem value="UNDANGAN">Undangan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Perihal</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Perihal surat"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select 
                    value={priority} 
                    onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Normal</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan tambahan (opsional)"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setActiveTab("content")}>
              Selanjutnya
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="content">Isi Surat</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Isi surat"
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("general")}>
              Kembali
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("recipients")}>
              Selanjutnya
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <RecipientSelector 
                  value={recipient}
                  onChange={setRecipient}
                  label="Penerima Utama"
                />
                
                <div className="flex justify-between items-center mt-6">
                  <Label>Penerima Tambahan</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAdditionalRecipient}
                    className="flex items-center text-xs"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Tambah Penerima
                  </Button>
                </div>
                
                {additionalRecipients.map((additionalRecipient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={additionalRecipient}
                      onChange={(e) => handleAdditionalRecipientChange(index, e.target.value)}
                      placeholder="Nama penerima atau instansi"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAdditionalRecipient(index)}
                      className="h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Hapus penerima</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("content")}>
              Kembali
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("attachments")}>
              Selanjutnya
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4 animate-fade-in">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Lampiran</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center text-xs"
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Tambah Lampiran
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                
                {attachments.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    Belum ada lampiran
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded border"
                      >
                        <div className="flex items-center">
                          <div className="ml-2 overflow-hidden">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(index)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Hapus lampiran</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("recipients")}>
              Kembali
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Draft
              </Button>
              <Button
                onClick={() => handleSubmit("pending")}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="mr-2 h-4 w-4" />
                )}
                Kirim
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LetterForm;
