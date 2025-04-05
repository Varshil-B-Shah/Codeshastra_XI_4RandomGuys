"use client";
import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Calendar,
  MapPin,
  Info,
  FileImage,
  Upload,
  Globe,
  Map,
} from "lucide-react";
import gsap from "gsap";
import EXIF from "exif-js";

const LANDMARKS = [
  { name: "Taj Mahal", color: "#f9fafa" },
  { name: "Jaipur Pink City", color: "#e8a798" },
  { name: "Kerala Backwaters", color: "#3aa555" },
  { name: "Golden Temple", color: "#f4c542" },
  { name: "Varanasi Ghats", color: "#e67e22" },
  { name: "Hampi Ruins", color: "#cd853f" },
  { name: "Khajuraho Temples", color: "#b5651d" },
  { name: "Goa Beaches", color: "#add8e6" },
];

export default function ImageUploader() {
  const [imageData, setImageData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLandmark, setCurrentLandmark] = useState(0);
  const [locationData, setLocationData] = useState(null);
  const [mapUrl, setMapUrl] = useState(null);

  const headerRef = useRef(null);
  const uploadBoxRef = useRef(null);
  const pageRef = useRef(null);
  const landmarkRefs = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(pageRef.current, {
      backgroundColor: "#fff",
      duration: 1.5,
      ease: "power2.inOut",
    });

    tl.from(
      headerRef.current,
      {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.8"
    );

    tl.from(
      uploadBoxRef.current,
      {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    );

    createLandmarkElements();

    const landmarkInterval = setInterval(() => {
      setCurrentLandmark((prev) => (prev + 1) % LANDMARKS.length);
    }, 5000);

    return () => clearInterval(landmarkInterval);
  }, []);

  useEffect(() => {
    if (landmarkRefs.current.length > 0) {
      gsap.to(pageRef.current, {
        backgroundColor: `${LANDMARKS[currentLandmark].color}20`, 
        duration: 3,
        ease: "power2.inOut",
      });

      landmarkRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.to(ref, {
            opacity: index === currentLandmark ? 0.1 : 0.05,
            scale: index === currentLandmark ? 1.1 : 1,
            duration: 2,
            ease: "power2.inOut",
          });
        }
      });
    }
  }, [currentLandmark]);

  const createLandmarkElements = () => {
    LANDMARKS.forEach((landmark, index) => {
      const element = document.createElement("div");
      element.className = "landmark-element";
      element.textContent = landmark.name;
      element.style.position = "fixed";
      element.style.zIndex = "-1";
      element.style.fontSize = "3rem";
      element.style.fontWeight = "bold";
      element.style.color = landmark.color;
      element.style.opacity = index === 0 ? 0.1 : 0.05;

      element.style.left = `${Math.random() * 70 + 10}%`;
      element.style.top = `${Math.random() * 70 + 10}%`;

      document.body.appendChild(element);
      landmarkRefs.current[index] = element;

      gsap.to(element, {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-5, 5)",
        duration: "random(15, 30)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    gsap.to(".upload-section", {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageData(event.target.result);
        };
        reader.readAsDataURL(file);
        extractMetadata(file);
      },
    });
  };

  const extractMetadata = async (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const basicMetadata = {
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          lastModified: new Date(file.lastModified).toLocaleString(),
        };

        EXIF.getData(file, function () {
          let locationDataObj = null;

          if (
            EXIF.getTag(this, "GPSLatitude") &&
            EXIF.getTag(this, "GPSLongitude")
          ) {
            const latitudeArray = EXIF.getTag(this, "GPSLatitude");
            const longitudeArray = EXIF.getTag(this, "GPSLongitude");
            const latitudeRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
            const longitudeRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";

            const latitude =
              (latitudeArray[0] +
                latitudeArray[1] / 60 +
                latitudeArray[2] / 3600) *
              (latitudeRef === "N" ? 1 : -1);

            const longitude =
              (longitudeArray[0] +
                longitudeArray[1] / 60 +
                longitudeArray[2] / 3600) *
              (longitudeRef === "E" ? 1 : -1);

            const formatDMS = (coord, type) => {
              const deg = Math.floor(Math.abs(coord));
              const min = Math.floor((Math.abs(coord) - deg) * 60);
              const sec = ((Math.abs(coord) - deg - min / 60) * 3600).toFixed(
                2
              );
              const dir =
                type === "lat"
                  ? coord >= 0
                    ? "N"
                    : "S"
                  : coord >= 0
                  ? "E"
                  : "W";
              return `${deg}° ${min}' ${sec}" ${dir}`;
            };

            locationDataObj = {
              latitude,
              longitude,
              formattedLatitude: formatDMS(latitude, "lat"),
              formattedLongitude: formatDMS(longitude, "lon"),
            };

            setLocationData(locationDataObj);

            const mapUrlStr = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
            setMapUrl(mapUrlStr);
          }

          const img = new Image();
          img.onload = () => {
            const extendedMetadata = {
              ...basicMetadata,
              width: img.width,
              height: img.height,
              dimensions: `${img.width} × ${img.height}`,
              location: locationDataObj,
              model: EXIF.getTag(file, "Model"),
              fNumber: EXIF.getTag(file, "FNumber"),
              iso: EXIF.getTag(file, "ISOSpeedRatings"),
            };

            setMetadata(extendedMetadata);
            setLoading(false);

            setTimeout(() => {
              gsap.from(".result-container", {
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                stagger: 0.2,
              });

              gsap.from(".metadata-item", {
                x: -30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.3,
              });
            }, 100);
          };
          img.src = event.target.result;
        });
      } catch (error) {
        console.error("Error extracting metadata:", error);
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className="min-h-screen p-6 font-sans transition-colors duration-1000 ease-in-out"
      ref={pageRef}
    >
      <div className="max-w-4xl mx-auto relative">
        <div className="mb-8 text-center" ref={headerRef}>
          <h1 className="text-4xl font-bold text-orange-700 mb-2">
            Incredible India - Image Explorer
          </h1>
          <div className="h-1 w-40 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-4"></div>
          <p className="text-lg text-orange-600 mt-2">
            Upload your travel memories and discover image details with location
            data
          </p>
        </div>

        <div
          className="bg-white rounded-lg shadow-lg p-6 border-2 border-orange-300 relative overflow-hidden"
          ref={uploadBoxRef}
        >
          <div className="upload-section mb-6">
            <label
              htmlFor="image-upload"
              className="block w-full cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg p-3 text-center transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-2">
                <Upload size={24} className="animate-bounce" />
                <span>Upload Your India Memories</span>
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
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-4 border-t-orange-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-orange-500 text-xs">
                  Loading
                </div>
              </div>
              <p className="mt-4 text-orange-600">
                Discovering the story behind your image...
              </p>
            </div>
          )}

          {imageData && !loading && (
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="result-container bg-orange-50 p-4 rounded-lg border border-orange-200 overflow-hidden">
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
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500/10"></div>
                  </div>
                </div>

                <div className="result-container bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h2 className="text-xl font-semibold text-orange-800 mb-3 flex items-center">
                    <Info className="mr-2" size={20} />
                    Image Details
                  </h2>

                  {metadata && (
                    <div className="space-y-4">
                      <div className="metadata-item flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                        <FileImage className="text-orange-600 mt-1" size={18} />
                        <div>
                          <p className="font-medium text-orange-900">
                            File Name
                          </p>
                          <p className="text-orange-700">{metadata.name}</p>
                        </div>
                      </div>

                      <div className="metadata-item flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                        <Camera className="text-orange-600 mt-1" size={18} />
                        <div>
                          <p className="font-medium text-orange-900">
                            Dimensions
                          </p>
                          <p className="text-orange-700">
                            {metadata.dimensions}
                          </p>
                        </div>
                      </div>

                      <div className="metadata-item flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                        <Info className="text-orange-600 mt-1" size={18} />
                        <div>
                          <p className="font-medium text-orange-900">
                            File Size
                          </p>
                          <p className="text-orange-700">{metadata.size}</p>
                        </div>
                      </div>

                      <div className="metadata-item flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                        <Calendar className="text-orange-600 mt-1" size={18} />
                        <div>
                          <p className="font-medium text-orange-900">
                            Last Modified
                          </p>
                          <p className="text-orange-700">
                            {metadata.lastModified}
                          </p>
                        </div>
                      </div>

                      <div className="metadata-item flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                        <MapPin className="text-orange-600 mt-1" size={18} />
                        <div>
                          <p className="font-medium text-orange-900">
                            File Type
                          </p>
                          <p className="text-orange-700">{metadata.type}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {locationData && (
                <div className="result-container bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h2 className="text-xl font-semibold text-orange-800 mb-3 flex items-center">
                    <Globe className="mr-2" size={20} />
                    Captured Location
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="metadata-item flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                        <MapPin className="text-orange-600 mt-1" size={18} />
                        <div>
                          <p className="font-medium text-orange-900">
                            Latitude
                          </p>
                          <p className="text-orange-700">
                            {locationData.formattedLatitude}
                          </p>
                        </div>
                      </div>

                      <div className="metadata-item flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                        <MapPin className="text-orange-600 mt-1" size={18} />
                        <div>
                          <p className="font-medium text-orange-900">
                            Longitude
                          </p>
                          <p className="text-orange-700">
                            {locationData.formattedLongitude}
                          </p>
                        </div>
                      </div>

                      <div className="metadata-item flex items-start space-x-3 p-2 bg-white rounded-md border border-orange-200">
                        <Map className="text-orange-600 mt-1" size={18} />
                        <div>
                          <p className="font-medium text-orange-900">
                            View on Map
                          </p>
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Open in OpenStreetMap
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg overflow-hidden border-2 border-orange-300 h-48 relative animate-fadeIn">
                      <div className="absolute inset-0 bg-orange-100 flex items-center justify-center">
                        <iframe
                          title="Image Location"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                            locationData.longitude - 0.01
                          }%2C${locationData.latitude - 0.01}%2C${
                            locationData.longitude + 0.01
                          }%2C${
                            locationData.latitude + 0.01
                          }&amp;layer=mapnik&amp;marker=${
                            locationData.latitude
                          }%2C${locationData.longitude}`}
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!imageData && !loading && (
            <div className="py-16 text-center text-orange-600">
              <FileImage
                size={48}
                className="mx-auto mb-4 opacity-50 animate-pulse"
              />
              <p className="text-lg font-medium">
                Upload an image to see its details
              </p>
              <p className="mt-2 text-orange-500">
                Share your beautiful memories from India
              </p>
              <p className="mt-4 text-sm text-orange-600">
                <MapPin className="inline mr-1" size={14} />
                Geo-tagged images will show location information and map
              </p>

              <div className="mt-8 grid grid-cols-3 gap-2">
                {["Taj Mahal", "Jaipur", "Kerala"].map((spot, i) => (
                  <div
                    key={i}
                    className="py-2 px-3 rounded-full bg-orange-100 text-orange-700 text-sm inline-block"
                  >
                    #{spot.toLowerCase().replace(/\s/g, "")}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-orange-700 italic">
          <p>
            Discover the metadata and location behind your journey through
            Incredible India
          </p>
        </div>
      </div>
    </div>
  );
}
