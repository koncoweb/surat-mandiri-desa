
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { VillageData } from "@/lib/types";
import VillageForm from "@/components/village/VillageForm";
import VillageLetterheadPreview from "@/components/village/VillageLetterheadPreview";

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
          await setDoc(villageDocRef, { ...villageData });
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

  const handleLogoChange = (logoType: 'villageLogo' | 'regencyLogo', url: string) => {
    setVillageData(prev => ({ ...prev, [logoType]: url }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const villageDocRef = doc(db, "settings", "village");
      
      // Convert villageData to a plain object before sending to Firestore
      const plainData = { ...villageData };
      
      await setDoc(villageDocRef, plainData);
      
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
        <VillageLetterheadPreview villageData={villageData} />
      ) : (
        <VillageForm 
          villageData={villageData}
          isSaving={isSaving}
          onInputChange={handleInputChange}
          onLogoChange={handleLogoChange}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default VillageProfile;
