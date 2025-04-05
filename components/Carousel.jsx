"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Carousel({ items, renderItem, onItemChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    onItemChange?.(items[currentIndex]);
  }, [currentIndex, items, onItemChange]);

  const next = () => {
    setCurrentIndex((currentIndex + 1) % items.length);
  };

  const previous = () => {
    setCurrentIndex((currentIndex - 1 + items.length) % items.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        {renderItem(items[currentIndex], currentIndex)}
      </div>

      <button
        onClick={previous}
        className="absolute left-4 top-[150px] transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all z-10"
      >
        <ChevronLeftIcon className="h-8 w-8" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-[150px] transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all z-10"
      >
        <ChevronRightIcon className="h-8 w-8" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
