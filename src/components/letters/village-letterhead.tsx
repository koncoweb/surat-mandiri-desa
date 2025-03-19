
import React from "react";

interface VillageLetterheadProps {
  villageName?: string;
  district?: string;
  regency?: string;
  province?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  villageLogo?: string;
  regencyLogo?: string;
}

const VillageLetterhead: React.FC<VillageLetterheadProps> = ({
  villageName = "Desa Sukamaju",
  district = "Telukjambe Timur",
  regency = "Karawang",
  province = "Jawa Barat",
  address = "Jalan Raya Sukamaju No. 123",
  postalCode = "41361",
  phone = "(0267) 123456",
  email = "desa.sukamaju@gmail.com",
  website = "www.desasukamaju.desa.id",
  villageLogo = "",
  regencyLogo = ""
}) => {
  return (
    <div className="border-b-2 border-black pb-4 print:border-b print:pb-2">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          {villageLogo ? (
            <img 
              src={villageLogo} 
              alt="Logo Desa"
              className="w-20 h-20 object-contain"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <span className="text-xs">Logo Desa</span>
            </div>
          )}
        </div>
        <div className="flex-grow text-center">
          <div className="uppercase text-xs font-semibold mb-1">Pemerintah Kabupaten {regency}</div>
          <div className="uppercase text-xs font-semibold mb-1">Kecamatan {district}</div>
          <h1 className="text-xl font-bold uppercase mb-1">{villageName}</h1>
          <div className="text-xs">
            {address}, Kode Pos {postalCode}, Telp. {phone}
          </div>
          <div className="text-xs">
            Email: {email} | Website: {website}
          </div>
        </div>
        <div className="flex-shrink-0 ml-4 hidden sm:block">
          {regencyLogo ? (
            <img 
              src={regencyLogo} 
              alt="Logo Kabupaten"
              className="w-20 h-20 object-contain"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <span className="text-xs">Logo Kab.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VillageLetterhead;
