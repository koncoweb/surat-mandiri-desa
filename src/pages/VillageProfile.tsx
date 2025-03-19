
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, Upload, Building } from "lucide-react";
import { db, storage, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import VillageLetterhead from "@/components/letters/village-letterhead";

interface VillageData {
  name: string;
  code: string;
  address: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  headName: string;
  headPosition: string;
  villageLogo?: string;
  regencyLogo?: string;
}

const VillageProfile: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [villageData, setVillageData] = useState<VillageData>({
    name: "Desa Sukamaju",
    code: "DESA",
    address: "Jl. Raya Sukamaju No. 123",
    district: "Telukjambe Timur",
    regency: "Karawang",
    province: "Jawa Barat",
    postalCode: "41361",
    phone: "(0267) 123456",
    email: "desa.sukamaju@gmail.com",
    website: "www.desasukamaju.desa.id",
    headName: "H. Sumarna, S.Sos",
    headPosition: "Kepala Desa",
    villageLogo: "",
    regencyLogo: ""
  });

  useEffect(() => {
    const fetchVillageData = async () => {
      try {
        const villageDocRef = doc(db, "settings", "village");
        const villageDoc = await getDoc(villageDocRef);
        
        if (villageDoc.exists()) {
          setVillageData({ ...villageData, ...villageDoc.data() as VillageData });
        } else {
          // If no document exists, create one with default values
          await setDoc(villageDocRef, villageData);
        }
      } catch (error) {
        console.error("Error fetching village data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data desa",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVillageData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVillageData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, logoType: 'villageLogo' | 'regencyLogo') => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const fileName = `${logoType}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `village/${fileName}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update state
      setVillageData(prev => ({ ...prev, [logoType]: downloadURL }));
      
      toast({
        title: "Berhasil",
        description: "Logo berhasil diunggah",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error",
        description: "Gagal mengunggah logo",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const villageDocRef = doc(db, "settings", "village");
      await updateDoc(villageDocRef, villageData);
      
      toast({
        title: "Berhasil",
        description: "Data desa berhasil disimpan",
      });
    } catch (error) {
      console.error("Error saving village data:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data desa",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse bg-muted rounded-full h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profil Desa</h2>
          <p className="text-muted-foreground">
            Kelola informasi desa untuk kop surat dan dokumen resmi
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Edit Profil" : "Pratinjau"}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Pratinjau Kop Surat</CardTitle>
            <CardDescription>
              Tampilan kop surat yang akan muncul pada dokumen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border p-4 rounded-md">
              <VillageLetterhead 
                villageName={villageData.name}
                district={villageData.district}
                regency={villageData.regency}
                province={villageData.province}
                address={villageData.address}
                postalCode={villageData.postalCode}
                phone={villageData.phone}
                email={villageData.email}
                website={villageData.website}
                villageLogo={villageData.villageLogo}
                regencyLogo={villageData.regencyLogo}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Data Desa</CardTitle>
              <CardDescription>
                Informasi desa yang akan ditampilkan pada surat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-24 w-24 rounded-md border border-input flex items-center justify-center overflow-hidden">
                    {villageData.villageLogo ? (
                      <img 
                        src={villageData.villageLogo} 
                        alt="Logo Desa" 
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Building className="h-12 w-12 text-muted-foreground/70" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="villageLogo" className="cursor-pointer text-sm text-center block">
                      <span className="px-2 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                        Upload Logo Desa
                      </span>
                      <Input 
                        id="villageLogo" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleLogoUpload(e, 'villageLogo')}
                      />
                    </Label>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-24 w-24 rounded-md border border-input flex items-center justify-center overflow-hidden">
                    {villageData.regencyLogo ? (
                      <img 
                        src={villageData.regencyLogo} 
                        alt="Logo Kabupaten" 
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Building className="h-12 w-12 text-muted-foreground/70" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="regencyLogo" className="cursor-pointer text-sm text-center block">
                      <span className="px-2 py-1 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                        Upload Logo Kabupaten
                      </span>
                      <Input 
                        id="regencyLogo" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleLogoUpload(e, 'regencyLogo')}
                      />
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Desa</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nama desa"
                    value={villageData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Kode Desa</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="Kode desa"
                    value={villageData.code}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Alamat desa"
                    value={villageData.address}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Kecamatan</Label>
                  <Input
                    id="district"
                    name="district"
                    placeholder="Kecamatan"
                    value={villageData.district}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regency">Kabupaten</Label>
                  <Input
                    id="regency"
                    name="regency"
                    placeholder="Kabupaten"
                    value={villageData.regency}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input
                    id="province"
                    name="province"
                    placeholder="Provinsi"
                    value={villageData.province}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="Kode pos"
                    value={villageData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telepon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Telepon"
                    value={villageData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={villageData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="Website"
                    value={villageData.website}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headName">Nama Kepala Desa</Label>
                  <Input
                    id="headName"
                    name="headName"
                    placeholder="Nama kepala desa"
                    value={villageData.headName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headPosition">Jabatan Kepala</Label>
                  <Input
                    id="headPosition"
                    name="headPosition"
                    placeholder="Jabatan kepala"
                    value={villageData.headPosition}
                    onChange={handleInputChange}
                  />
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
        </>
      )}
    </div>
  );
};

export default VillageProfile;
