import React, { useState, useRef, useEffect } from "react";
import { XMarkIcon, PhotoIcon, PencilIcon } from "@heroicons/react/24/outline";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  userName: string;
  userEmail: string;
  userRole: string;
  userPhoneNumber?: string;
  userLinkedIn?: string;
  userGitHub?: string;
  userAlumniWorkplace?: string;
  onSave: (data: {
    email?: string;
    phone_number?: string;
    linkedin_url?: string;
    github_url?: string;
    alumni_workplace?: string;
    photo?: File;
  }) => Promise<void>;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  currentImage,
  userName,
  userEmail,
  userRole,
  userPhoneNumber = "",
  userLinkedIn = "",
  userGitHub = "",
  userAlumniWorkplace = "",
  onSave,
}: ProfileEditModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [email, setEmail] = useState(userEmail);
  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber);
  const [linkedIn, setLinkedIn] = useState(userLinkedIn);
  const [gitHub, setGitHub] = useState(userGitHub);
  const [alumniWorkplace, setAlumniWorkplace] = useState(userAlumniWorkplace);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setEmail(userEmail);
      setPhoneNumber(userPhoneNumber);
      setLinkedIn(userLinkedIn);
      setGitHub(userGitHub);
      setAlumniWorkplace(userAlumniWorkplace);
      setPreview(null);
      setSelectedFile(null);
    }
  }, [
    isOpen,
    userEmail,
    userPhoneNumber,
    userLinkedIn,
    userGitHub,
    userAlumniWorkplace,
  ]);

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

  const handleSave = async () => {
    setUploading(true);
    try {
      const data: any = {};

      // Only include changed fields
      if (email !== userEmail) data.email = email;
      if (phoneNumber !== userPhoneNumber) data.phone_number = phoneNumber;
      if (linkedIn !== userLinkedIn) data.linkedin_url = linkedIn;
      if (gitHub !== userGitHub) data.github_url = gitHub;
      if (alumniWorkplace !== userAlumniWorkplace)
        data.alumni_workplace = alumniWorkplace;
      if (selectedFile) data.photo = selectedFile;

      await onSave(data);
      onClose();
      setPreview(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save profile. Please try again.");
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

  const isAlumni = userRole === "ALUMNI";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1a1b2e] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <PencilIcon className="w-5 h-5" />
            Edit Profile
          </h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Profile Picture Section */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center gap-6">
              {/* Current/Preview Image */}
              <div className="relative flex-shrink-0">
                {preview || currentImage ? (
                  <img
                    src={preview || currentImage}
                    alt={userName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-500 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-purple-500 shadow-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                {preview && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    New
                  </div>
                )}
              </div>

              {/* Upload Area - Compact */}
              <div className="flex-1">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer ${
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
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] || null)
                    }
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <PhotoIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-white font-medium">
                        {selectedFile ? selectedFile.name : "Choose image"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                          : "PNG, JPG up to 5MB"}
                      </p>
                    </div>
                    {selectedFile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setSelectedFile(null);
                        }}
                        className="ml-auto text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Phone Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="+977 98XXXXXXXX"
            />
          </div>

          {/* LinkedIn Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              LinkedIn Profile
            </label>
            <input
              type="url"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          {/* GitHub Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Profile
            </label>
            <input
              type="url"
              value={gitHub}
              onChange={(e) => setGitHub(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="https://github.com/username"
            />
          </div>

          {/* Alumni Workplace Field - Only for Alumni */}
          {isAlumni && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Workplace
              </label>
              <input
                type="text"
                value={alumniWorkplace}
                onChange={(e) => setAlumniWorkplace(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Google, Microsoft, Freelance"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700 bg-gray-900/30 flex-shrink-0">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg font-medium"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <PencilIcon className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
