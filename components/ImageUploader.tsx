"use client";

import { useState, useCallback, useRef, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { validateImageFile } from "@/lib/upload";

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  existingImages?: string[];
  onRemoveExistingImage?: (index: number) => void;
  maxFiles?: number;
}

export default function ImageUploader({
  onFilesChange,
  existingImages = [],
  onRemoveExistingImage,
  maxFiles = 10,
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    let errorMsg: string | null = null;

    // Check total file count
    const totalFiles = files.length + existingImages.length + fileArray.length;
    if (totalFiles > maxFiles) {
      errorMsg = `Maximum ${maxFiles} images allowed. You have ${files.length + existingImages.length} already.`;
      setError(errorMsg);
      return;
    }

    for (const file of fileArray) {
      const validationError = validateImageFile(file);
      if (validationError) {
        errorMsg = validationError;
        break;
      }
      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    }

    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    if (validFiles.length === 0) return;

    const updatedFiles = [...files, ...validFiles];
    const updatedPreviews = [...previewUrls, ...newPreviewUrls];

    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    onFilesChange(updatedFiles);
    setError(null);
  }, [files, previewUrls, existingImages.length, maxFiles, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leak
    URL.revokeObjectURL(previewUrls[index]);
    
    setFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    onFilesChange(updatedFiles);
  };

  const removeExistingImage = (index: number) => {
    if (onRemoveExistingImage) {
      onRemoveExistingImage(index);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Clean up object URLs on unmount
  const cleanup = useCallback(() => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  }, [previewUrls]);

  // Cleanup on unmount
  useState(() => {
    return () => cleanup();
  });

  const allImages = [
    ...existingImages.map((url, index) => ({ type: 'existing' as const, url, index })),
    ...previewUrls.map((url, index) => ({ type: 'new' as const, url, index })),
  ];

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? "border-gray-900 bg-gray-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          className="hidden"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-gray-100 rounded-full">
            <Upload className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              Drag & drop images here or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports JPG, PNG, WebP, GIF • Max 5MB per file
            </p>
            <p className="text-sm text-gray-500">
              {allImages.length} of {maxFiles} images selected
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Image Previews */}
      {allImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Selected Images ({allImages.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allImages.map((item, idx) => (
              <div
                key={`${item.type}-${item.index}`}
                className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square"
              >
                <img
                  src={item.url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.type === 'existing') {
                      removeExistingImage(item.index);
                    } else {
                      removeFile(item.index);
                    }
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                  {item.type === 'existing' ? 'Existing' : 'New'}
                </div>
              </div>
            ))}
            
            {/* Add more placeholder */}
            {allImages.length < maxFiles && (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-square cursor-pointer hover:border-gray-400 transition-colors"
                onClick={triggerFileInput}
              >
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Add more</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}