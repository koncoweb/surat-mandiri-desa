
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import VillageLogoUploader from "./VillageLogoUploader";
import { VillageData } from "@/lib/types";

interface VillageFormProps {
  villageData: VillageData;
  isSaving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onLogoChange: (type: 'villageLogo' | 'regencyLogo', url: string) => void;
  onSave: () => Promise<void>;
}

const VillageForm: React.FC<VillageFormProps> = ({
  villageData,
  isSaving,
  onInputChange,
  onLogoChange,
  onSave,
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Data Desa</CardTitle>
          <CardDescription>
            Informasi desa yang akan ditampilkan pada surat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <VillageLogoUploader 
            villageLogo={villageData.villageLogo}
            regencyLogo={villageData.regencyLogo}
            onLogoChange={onLogoChange}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Desa</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nama desa"
                value={villageData.name}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Kode Desa</Label>
              <Input
                id="code"
                name="code"
                placeholder="Kode desa"
                value={villageData.code}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Alamat desa"
                value={villageData.address}
                onChange={onInputChange}
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
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regency">Kabupaten</Label>
              <Input
                id="regency"
                name="regency"
                placeholder="Kabupaten"
                value={villageData.regency}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Input
                id="province"
                name="province"
                placeholder="Provinsi"
                value={villageData.province}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Kode Pos</Label>
              <Input
                id="postalCode"
                name="postalCode"
                placeholder="Kode pos"
                value={villageData.postalCode}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Telepon"
                value={villageData.phone}
                onChange={onInputChange}
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
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                placeholder="Website"
                value={villageData.website}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headName">Nama Kepala Desa</Label>
              <Input
                id="headName"
                name="headName"
                placeholder="Nama kepala desa"
                value={villageData.headName}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headPosition">Jabatan Kepala</Label>
              <Input
                id="headPosition"
                name="headPosition"
                placeholder="Jabatan kepala"
                value={villageData.headPosition}
                onChange={onInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving}>
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
  );
};

export default VillageForm;
