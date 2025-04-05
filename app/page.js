import ImageUploader from "@/components/ImageUploader";
import IndiaMap from "@/components/IndiaMap";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full overflow-x-hidden">
      {/* <ImageUploader /> */}
      <IndiaMap />
    </div>
  );
}
