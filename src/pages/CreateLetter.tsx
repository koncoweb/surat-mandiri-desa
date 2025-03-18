
import React, { useState } from "react";
import LetterForm from "@/components/letters/letter-form";
import FirestoreRulesHelper from "@/components/auth/firestore-rules-helper";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

const CreateLetter: React.FC = () => {
  const [showRulesHelper, setShowRulesHelper] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Buat Surat Baru</h2>
        <p className="text-muted-foreground">
          Buat surat elektronik dengan format yang sesuai
        </p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4 flex items-start">
          <InfoIcon className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Catatan Penggunaan</h3>
            <p className="text-sm text-amber-700 mt-1">
              Fitur pemilihan penerima membutuhkan izin Firestore untuk membaca data pengguna. 
              Jika Anda melihat error "Missing or insufficient permissions", Anda perlu mengubah Firestore rules.
            </p>
            <Button
              variant="link"
              className="text-amber-600 p-0 h-auto text-sm"
              onClick={() => setShowRulesHelper(!showRulesHelper)}
            >
              {showRulesHelper ? "Sembunyikan contoh rules" : "Lihat contoh Firestore rules"}
            </Button>
          </div>
        </div>
      </div>

      {showRulesHelper && <FirestoreRulesHelper />}
      
      <LetterForm />
    </div>
  );
};

export default CreateLetter;
