"use client";

import { useState } from "react";
import { RetentionImagesModal } from "./RetentionImagesModal";

interface RetentionImage {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  image_url: string;
  is_active: boolean;
  display_order: number;
}

interface RetentionLinkProps {
  images: RetentionImage[];
}

export function RetentionLink({ images }: RetentionLinkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors font-medium"
      >
        vaata tõestust siit
      </button>
      <RetentionImagesModal
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
