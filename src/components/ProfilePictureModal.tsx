import React, { useState, useRef } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  userName: string;
  onUpload: (file: File) => Promise<void>;
}

export default function ProfilePictureModal({
  isOpen,
  onClose,
  currentImage,
  userName,
  onUpload,
}: ProfilePictureModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await onUpload(selectedFile);
      onClose();
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      onClose();
      setPreview(null);
      setSelectedFile(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1b2e] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Change Profile Picture
          </h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current/Preview Image */}
          <div className="flex justify-center">
            <div className="relative">
              {preview || currentImage ? (
                <img
                  src={preview || currentImage}
                  alt={userName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-purple-500 shadow-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              {preview && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                  New
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
              dragActive
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-600 hover:border-purple-500/50 hover:bg-white/5"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3 text-center">
              <PhotoIcon className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-white font-medium">
                  Drop an image here or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PhotoIcon className="w-5 h-5 text-purple-400" />
                <div className="text-sm">
                  <p className="text-white font-medium truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700 bg-gray-900/30">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span>Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
