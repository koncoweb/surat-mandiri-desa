
import React from "react";
import LetterForm from "@/components/letters/letter-form";

const CreateLetter: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Buat Surat Baru</h2>
        <p className="text-muted-foreground">
          Buat surat elektronik dengan format yang sesuai
        </p>
      </div>

      <LetterForm />
    </div>
  );
};

export default CreateLetter;
