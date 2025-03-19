
import React from "react";

const VillageLetterhead: React.FC = () => {
  return (
    <div className="border-b-2 border-black pb-4 print:border-b print:pb-2">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <span className="text-xs">Logo Desa</span>
          </div>
        </div>
        <div className="flex-grow text-center">
          <div className="uppercase text-xs font-semibold mb-1">Pemerintah Kabupaten Karawang</div>
          <div className="uppercase text-xs font-semibold mb-1">Kecamatan Telukjambe Timur</div>
          <h1 className="text-xl font-bold uppercase mb-1">Desa Sukamaju</h1>
          <div className="text-xs">
            Jalan Raya Sukamaju No. 123, Kode Pos 41361, Telp. (0267) 123456
          </div>
          <div className="text-xs">
            Email: desa.sukamaju@gmail.com | Website: www.desasukamaju.desa.id
          </div>
        </div>
        <div className="flex-shrink-0 ml-4 hidden sm:block">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <span className="text-xs">Logo Kab.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillageLetterhead;
