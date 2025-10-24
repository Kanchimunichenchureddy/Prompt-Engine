
import React, { useState, useCallback, useMemo } from 'react';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { FileIcon } from './icons/FileIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  disabled: boolean;
}

interface FilePreview {
  file: File;
  previewUrl: string | null;
}

const MAX_FILES = 5;
const MAX_SIZE_MB = 20;

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, disabled }) => {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((incomingFiles: FileList | null) => {
    if (!incomingFiles) return;

    const newPreviews: FilePreview[] = [];
    
    Array.from(incomingFiles).slice(0, MAX_FILES - previews.length).forEach(file => {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`File ${file.name} is too large (max ${MAX_SIZE_MB}MB).`);
        return;
      }
      if (file.type.startsWith('image/')) {
        newPreviews.push({ file, previewUrl: URL.createObjectURL(file) });
      } else {
        newPreviews.push({ file, previewUrl: null });
      }
    });

    setPreviews(prev => {
        const updated = [...prev, ...newPreviews];
        onFilesChange(updated.map(p => p.file));
        return updated;
    });
  }, [previews, onFilesChange]);

  const handleRemoveFile = (fileName: string) => {
    setPreviews(prev => {
      const updated = prev.filter(p => p.file.name !== fileName);
      onFilesChange(updated.map(p => p.file));
      return updated;
    });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };
  
  const fileInputId = useMemo(() => `file-upload-${Math.random().toString(36).substring(7)}`, []);


  return (
    <div className="mt-6">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' :
          isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      >
        <UploadCloudIcon className={`w-12 h-12 mx-auto ${isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <label htmlFor={fileInputId} className={`font-medium ${disabled ? '' : 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'}`}>
            Click to upload
          </label>
          {' '}or drag and drop files here
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Images or text files (Max {MAX_FILES} files, {MAX_SIZE_MB}MB each)</p>
        <input id={fileInputId} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} disabled={disabled} accept="image/*,text/*,.md,.py,.js,.html,.css" />
      </div>
      {previews.length > 0 && (
        <div className="mt-4 space-y-2">
          {previews.map(({ file, previewUrl }) => (
            <div key={file.name} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img src={previewUrl} alt={file.name} className="w-10 h-10 object-cover rounded" />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded">
                    <FileIcon className="text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div className="text-sm">
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs">{file.name}</p>
                  <p className="text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button onClick={() => handleRemoveFile(file.name)} className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                <XCircleIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
