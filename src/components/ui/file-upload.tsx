import { useState } from "react";

interface FileUploadProps {
  id: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
}

export const FileUpload = ({ id, onFileChange, accept = "image/*" }: FileUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      onFileChange(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-2">
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <label htmlFor={id} className="w-full cursor-pointer rounded-md border-2 border-dashed border-muted-foreground/50 p-4 text-sm text-muted-foreground hover:border-primary hover:text-primary">
        {previewUrl ? (
          <div className="flex items-center justify-center space-x-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-16 w-16 object-cover"
            />
            <span>Click to change image</span>
          </div>
        ) : (
          <span>Click to upload image</span>
        )}
      </label>
    </div>
  );
};
