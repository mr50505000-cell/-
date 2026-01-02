
import React from 'react';

interface ImagePickerProps {
  label: string;
  icon: string;
  onImageSelect: (base64: string, name: string) => void;
  preview: string | null;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ label, icon, onImageSelect, preview }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer group relative overflow-hidden">
        {preview ? (
          <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <i className={`${icon} text-4xl text-slate-500 mb-4 group-hover:text-blue-500 transition-colors`}></i>
            <p className="mb-2 text-sm text-slate-400 font-semibold">{label}</p>
            <p className="text-xs text-slate-500">PNG, JPG or WEBP</p>
          </div>
        )}
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        
        {preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white font-medium text-sm px-4 py-2 bg-slate-900/80 rounded-full">Change Photo</span>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImagePicker;
