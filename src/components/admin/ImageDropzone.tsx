"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  filesToLocalDrafts,
  revokeAllDraftPreviews,
  revokeDraftPreview,
  type DraftProductImage,
} from "@/types/product-draft";

type ImageDropzoneProps = {
  items: DraftProductImage[];
  onChange: (items: DraftProductImage[]) => void;
};

function previewSrc(item: DraftProductImage): string {
  return item.kind === "local" ? item.previewUrl : item.imageUrl;
}

function itemKey(item: DraftProductImage, index: number): string {
  return item.kind === "local" ? item.id : `${item.cloudinaryPublicId}-${index}`;
}

export function ImageDropzone({ items, onChange }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef(items);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  itemsRef.current = items;

  useEffect(() => {
    return () => revokeAllDraftPreviews(itemsRef.current);
  }, []);

  function addFiles(files: FileList | File[]) {
    const locals = filesToLocalDrafts(Array.from(files));
    if (locals.length === 0) {
      setError("Please choose image files only.");
      return;
    }
    setError("");
    onChange([...items, ...locals]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function removeImage(index: number) {
    const target = items[index];
    if (target) revokeDraftPreview(target);
    onChange(items.filter((_, i) => i !== index));
  }

  function movePrimary(index: number) {
    if (index === 0) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[24px] px-6 py-10 text-center transition ${
          dragging
            ? "bg-slate-200 ring-2 ring-slate-400 ring-offset-2"
            : "bg-slate-100 hover:bg-slate-200/70"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <ImagePlus className="h-8 w-8 text-slate-400" aria-hidden />
        <p className="mt-3 text-sm font-medium text-slate-700">
          Drag & drop product images here
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Local preview first · uploads when you save the product
        </p>
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => {
            const src = previewSrc(item);
            const isLocal = item.kind === "local";

            return (
              <div
                key={itemKey(item, index)}
                className="group relative overflow-hidden rounded-2xl bg-slate-100"
              >
                <div className="relative aspect-square">
                  {isLocal ? (
                    // eslint-disable-next-line @next/next/no-img-element -- blob preview
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Image src={src} alt="" fill sizes="(max-width: 640px) 50vw, 200px" className="object-cover" />
                  )}
                </div>
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Cover
                  </span>
                )}
                {isLocal && (
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    Local
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePrimary(index);
                      }}
                      className="flex-1 rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-900"
                    >
                      Set cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="rounded-lg bg-white/90 p-1 text-slate-900"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
