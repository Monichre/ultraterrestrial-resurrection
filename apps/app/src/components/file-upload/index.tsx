'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileIcon, FileSpreadsheet, Upload, X } from "lucide-react";
import { useState, useRef, ChangeEvent } from 'react';

export interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onCancel?: () => void;
  acceptedTypes?: string;
  maxSize?: number; // in MB
  description?: string;
  className?: string;
  showButtons?: boolean;
}

export function FileUpload({
  onFileSelect,
  onCancel,
  acceptedTypes = "*/*",
  maxSize = 10,
  description = "Recommended max. size: 10 MB. Upload documents to analyze.",
  className = "",
  showButtons = true
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");
    
    if (!selectedFile) return;
    
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    setFile(selectedFile);
    if (onFileSelect) onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;
    
    if (droppedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    setFile(droppedFile);
    if (onFileSelect) onFileSelect(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onCancel) onCancel();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <FileIcon className="size-5 text-red-400" />;
      case 'doc': case 'docx': return <FileIcon className="size-5 text-blue-400" />;
      case 'csv': case 'xls': case 'xlsx': return <FileSpreadsheet className="size-5 text-green-400" />;
      default: return <FileIcon className="size-5 text-foreground" />;
    }
  };

  return (
    <div className={`${className}`}>
      <div
        className="rounded-md border border-dashed border-input px-4 py-6 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!file ? (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <div className="flex text-sm leading-6 text-foreground">
              <p>Drag and drop or</p>
              <Label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
              >
                <span>choose file</span>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept={acceptedTypes}
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          </div>
        ) : (
          <div className="relative rounded-lg bg-muted p-3">
            <div className="absolute right-1 top-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-sm p-2 text-muted-foreground hover:text-foreground"
                aria-label="Remove"
                onClick={handleRemoveFile}
              >
                <X className="size-4 shrink-0" />
              </Button>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-input">
                {getFileIcon(file.name)}
              </span>
              <div className="w-full">
                <p className="text-xs font-medium text-foreground">{file.name}</p>
                <p className="mt-0.5 flex justify-between text-xs text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  <span>Ready</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
      
      {showButtons && file && (
        <div className="mt-4 flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveFile}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onFileSelect && onFileSelect(file)}
          >
            Process Document
          </Button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;