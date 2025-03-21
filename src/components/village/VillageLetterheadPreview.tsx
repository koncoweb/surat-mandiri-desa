
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import VillageLetterhead from "@/components/letters/village-letterhead";
import { VillageData } from "@/lib/types";

interface VillageLetterheadPreviewProps {
  villageData: VillageData;
}

const VillageLetterheadPreview: React.FC<VillageLetterheadPreviewProps> = ({ villageData }) => {
  return (
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
  );
};

export default VillageLetterheadPreview;
