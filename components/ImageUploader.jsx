"use client"
import { useState } from 'react';
import { Camera, Calendar, MapPin, Info, FileImage, Upload } from 'lucide-react';

export default function ImageUploder() {
  const [imageData, setImageData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target.result);
    };
    reader.readAsDataURL(file);

    extractMetadata(file);
  };

  const extractMetadata = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const basicMetadata = {
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          lastModified: new Date(file.lastModified).toLocaleString(),
        };
        
        const img = new Image();
        img.onload = () => {
          const extendedMetadata = {
            ...basicMetadata,
            width: img.width,
            height: img.height,
            dimensions: `${img.width} × ${img.height}`,
          };
          
          setMetadata(extendedMetadata);
          setLoading(false);
        };
        img.src = event.target.result;
      } catch (error) {
        console.error("Error extracting metadata:", error);
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-orange-700">
            Incredible India - Image Explorer
          </h1>
          <p className="text-lg text-orange-600 mt-2">
            Upload your travel memories and discover image details
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-orange-300">
          <div className="mb-6">
            <label 
              htmlFor="image-upload" 
              className="block w-full cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg p-3 text-center transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center justify-center space-x-2">
                <Upload size={24} />
                <span>Upload Travel Image</span>
              </div>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          )}

          {imageData && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 mb-3 flex items-center">
                  <FileImage className="mr-2" size={20} />
                  Travel Memory
                </h2>
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-orange-300">
                  <img 
                    src={imageData} 
                    alt="Uploaded preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h2 className="text-xl font-semibold text-orange-800 mb-3 flex items-center">
                  <Info className="mr-2" size={20} />
                  Image Details
                </h2>
                
                {metadata && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                      <FileImage className="text-orange-600 mt-1" size={18} />
                      <div>
                        <p className="font-medium text-orange-900">File Name</p>
                        <p className="text-orange-700">{metadata.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                      <Camera className="text-orange-600 mt-1" size={18} />
                      <div>
                        <p className="font-medium text-orange-900">Dimensions</p>
                        <p className="text-orange-700">{metadata.dimensions}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                      <Info className="text-orange-600 mt-1" size={18} />
                      <div>
                        <p className="font-medium text-orange-900">File Size</p>
                        <p className="text-orange-700">{metadata.size}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                      <Calendar className="text-orange-600 mt-1" size={18} />
                      <div>
                        <p className="font-medium text-orange-900">Last Modified</p>
                        <p className="text-orange-700">{metadata.lastModified}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                      <MapPin className="text-orange-600 mt-1" size={18} />
                      <div>
                        <p className="font-medium text-orange-900">File Type</p>
                        <p className="text-orange-700">{metadata.type}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!imageData && !loading && (
            <div className="py-16 text-center text-orange-600">
              <FileImage size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Upload an image to see its details</p>
              <p className="mt-2 text-orange-500">Share your beautiful memories from India</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-orange-700 italic">
          <p>Discover the metadata behind your journey through Incredible India</p>
        </div>
      </div>
    </div>
  );
}