
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { firestoreRulesExample, simpleSignupRules, developmentRules, implementationGuide } from "@/lib/firestore-rules-example";

const FirestoreRulesHelper: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, ruleName: string) => {
    navigator.clipboard.writeText(text);
    setCopied(ruleName);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 shadow-md">
      <CardHeader>
        <CardTitle>Contoh Firestore Security Rules</CardTitle>
        <CardDescription>
          Gunakan contoh rules berikut untuk memperbaiki izin Firestore dan memungkinkan pendaftaran user serta penyimpanan data profil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signup">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signup">Rules Signup Sederhana</TabsTrigger>
            <TabsTrigger value="complete">Rules Lengkap</TabsTrigger>
            <TabsTrigger value="dev">Rules Development</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup" className="mt-4">
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{simpleSignupRules}</pre>
            </div>
            <Button 
              onClick={() => copyToClipboard(simpleSignupRules, 'signup')}
              className="mt-2"
              variant="outline"
            >
              {copied === 'signup' ? 'Tersalin!' : 'Salin Rules'}
            </Button>
          </TabsContent>
          
          <TabsContent value="complete" className="mt-4">
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{firestoreRulesExample}</pre>
            </div>
            <Button 
              onClick={() => copyToClipboard(firestoreRulesExample, 'complete')}
              className="mt-2"
              variant="outline"
            >
              {copied === 'complete' ? 'Tersalin!' : 'Salin Rules'}
            </Button>
          </TabsContent>
          
          <TabsContent value="dev" className="mt-4">
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">{developmentRules}</pre>
            </div>
            <div className="mt-2 text-destructive text-sm font-semibold">
              PERHATIAN: Rules ini memberikan akses penuh ke database Anda. JANGAN gunakan di lingkungan produksi!
            </div>
            <Button 
              onClick={() => copyToClipboard(developmentRules, 'dev')}
              className="mt-2"
              variant="outline"
            >
              {copied === 'dev' ? 'Tersalin!' : 'Salin Rules'}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <h3 className="text-sm font-semibold mb-2">Cara Menerapkan Rules:</h3>
        <div className="bg-muted p-4 rounded-md w-full">
          <pre className="text-xs whitespace-pre-wrap">{implementationGuide}</pre>
        </div>
        <Button 
          onClick={() => copyToClipboard(implementationGuide, 'guide')}
          className="mt-2"
          variant="outline"
        >
          {copied === 'guide' ? 'Tersalin!' : 'Salin Instruksi'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FirestoreRulesHelper;
