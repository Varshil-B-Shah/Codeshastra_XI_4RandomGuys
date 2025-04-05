import ImageUploader from "@/components/ImageUploader";
import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full overflow-x-hidden">
      {/* <ImageUploader /> */}
      <Hero />
    </div>
  );
}
