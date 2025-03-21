
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface VillageLogoUploaderProps {
  villageLogo?: string;
  regencyLogo?: string;
  onLogoChange: (type: 'villageLogo' | 'regencyLogo', url: string) => void;
}

const VillageLogoUploader: React.FC<VillageLogoUploaderProps> = ({
  villageLogo,
  regencyLogo,
  onLogoChange,
}) => {
  const { toast } = useToast();

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
      
      // Update state through callback
      onLogoChange(logoType, downloadURL);
      
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

  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
      <div className="flex flex-col items-center space-y-2">
        <div className="h-24 w-24 rounded-md border border-input flex items-center justify-center overflow-hidden">
          {villageLogo ? (
            <img 
              src={villageLogo} 
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
          {regencyLogo ? (
            <img 
              src={regencyLogo} 
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
  );
};

export default VillageLogoUploader;
