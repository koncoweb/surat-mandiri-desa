
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Upload, User, Building, ShieldCheck } from "lucide-react";

const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">
          Kelola pengaturan sistem surat desa
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="village" className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            Data Desa
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Keamanan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profil Pengguna</CardTitle>
              <CardDescription>
                Kelola informasi profil dan pengaturan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative rounded-full h-16 w-16 bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload className="mr-2 h-3 w-3" />
                    Unggah Foto
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG atau GIF, Maks 1MB
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input id="name" placeholder="Nama lengkap" defaultValue="Agus Supriatna" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email" defaultValue="agus@desa.go.id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Jabatan</Label>
                  <Input id="position" placeholder="Jabatan" defaultValue="Staff Administrasi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input id="phone" placeholder="Nomor telepon" defaultValue="081234567890" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="village" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Desa</CardTitle>
              <CardDescription>
                Informasi desa yang akan ditampilkan pada surat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-md h-20 w-20 bg-muted flex items-center justify-center">
                  <Building className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Upload className="mr-2 h-3 w-3" />
                    Unggah Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Logo desa untuk kop surat
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="village-name">Nama Desa</Label>
                  <Input id="village-name" placeholder="Nama desa" defaultValue="Desa Sukamanah" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village-code">Kode Desa</Label>
                  <Input id="village-code" placeholder="Kode desa" defaultValue="DESA" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="village-address">Alamat</Label>
                  <Textarea
                    id="village-address"
                    placeholder="Alamat desa"
                    defaultValue="Jl. Raya Sukamanah No. 123, Kecamatan Sukamaju, Kabupaten Sukajaya, Provinsi Jawa Barat"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Kecamatan</Label>
                  <Input id="district" placeholder="Kecamatan" defaultValue="Sukamaju" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regency">Kabupaten</Label>
                  <Input id="regency" placeholder="Kabupaten" defaultValue="Sukajaya" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input id="province" placeholder="Provinsi" defaultValue="Jawa Barat" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Kode Pos</Label>
                  <Input id="postal-code" placeholder="Kode pos" defaultValue="12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village-phone">Telepon</Label>
                  <Input id="village-phone" placeholder="Telepon" defaultValue="021-1234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village-email">Email</Label>
                  <Input id="village-email" type="email" placeholder="Email" defaultValue="info@sukamanah.desa.id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="head-name">Nama Kepala Desa</Label>
                  <Input id="head-name" placeholder="Nama kepala desa" defaultValue="H. Sumarna, S.Sos" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="head-position">Jabatan Kepala</Label>
                  <Input id="head-position" placeholder="Jabatan kepala" defaultValue="Kepala Desa" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
              <CardDescription>
                Kelola password dan pengaturan keamanan lainnya
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Password Saat Ini</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Perbarui Password
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
