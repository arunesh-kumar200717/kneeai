"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileImage, AlertTriangle, Check, RefreshCw, Sparkles } from "lucide-react";
import { PresetSample } from "@/lib/types";

interface UploadZoneProps {
  module: "meniscus" | "segmentation" | "implant";
  acceptFormats?: string[];
  maxSizeBytes?: number; // e.g. 10 * 1024 * 1024 (10MB)
  maxSizeLabel?: string; // e.g. "10 MB"
  presetSamples?: PresetSample[];
  onFileSelect: (file: File | { name: string; size: number; dataUrl?: string }) => void;
  onPresetSelect?: (preset: PresetSample) => void;
  isLoading?: boolean;
  selectedFileName?: string;
  selectedFileSize?: string;
  onReset?: () => void;
}

export function UploadZone({
  module,
  acceptFormats = [".png", ".jpg", ".jpeg", ".dcm", "image/png", "image/jpeg", "application/dicom"],
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  maxSizeLabel = "10 MB",
  presetSamples = [],
  onFileSelect,
  onPresetSelect,
  isLoading = false,
  selectedFileName,
  selectedFileSize,
  onReset,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectFile = (file: File) => {
    setValidationError(null);

    // 1. File size check
    if (file.size > maxSizeBytes) {
      setValidationError(
        `Payload size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed threshold of ${maxSizeLabel}.`
      );
      return;
    }

    // 2. File extension check
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const isValidExt =
      acceptFormats.includes(extension) ||
      acceptFormats.includes(file.type) ||
      file.name.toLowerCase().endsWith(".dcm") ||
      file.type.startsWith("image/");

    if (!isValidExt) {
      setValidationError(
        `Unsupported file type "${extension}". Please provide a standard radiologic image: DICOM (.dcm), PNG, JPG, or JPEG.`
      );
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Drag and Drop Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 transition-all cursor-pointer text-center bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 ${
          isDragOver
            ? "border-clinical bg-clinical-light/40 shadow-sm ring-2 ring-clinical/20"
            : "border-border hover:border-clinical-border hover:bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5"
        } ${isLoading ? "pointer-events-none opacity-60" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Upload medical imaging file"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptFormats.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isLoading}
          id={`file-input-${module}`}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-clinical-light text-clinical flex items-center justify-center border border-clinical-border">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-semibold text-white">
              <span className="text-clinical underline decoration-clinical/40 underline-offset-2">
                Click to browse
              </span>{" "}
              or drag & drop {module === "meniscus" ? "MRI slice" : "X-ray radiograph"}
            </div>
            <p className="text-xs text-slate-300">
              Accepted formats: <strong className="text-white font-mono">DICOM (.dcm)</strong>,{" "}
              <strong className="text-white font-mono">PNG</strong>,{" "}
              <strong className="text-white font-mono">JPEG</strong> (Max {maxSizeLabel})
            </p>
          </div>

          {selectedFileName && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-clinical-light border border-clinical-border text-xs font-mono text-white">
              <FileImage className="w-3.5 h-3.5 text-clinical" />
              <span className="font-semibold truncate max-w-[200px] sm:max-w-xs">{selectedFileName}</span>
              {selectedFileSize && <span className="text-slate-400">({selectedFileSize})</span>}
              <Check className="w-3.5 h-3.5 text-emerald-600 ml-1" />
            </div>
          )}
        </div>
      </div>

      {/* Inline Validation Error */}
      {validationError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3 rounded-md bg-status-error-bg border border-red-200 text-status-error text-xs"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block">Validation Error:</span>
            <span>{validationError}</span>
          </div>
        </div>
      )}

      {/* Research Presets Bar for Instant Evaluation */}
      {presetSamples.length > 0 && (
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-clinical" />
              Or evaluate with preloaded research cases:
            </span>
            {selectedFileName && onReset && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
                className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1 underline underline-offset-2"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Clear Selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presetSamples.map((preset) => {
              const isSelected = selectedFileName === preset.name;
              return (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onPresetSelect) {
                      onPresetSelect(preset);
                    }
                  }}
                  className={`text-left p-2.5 rounded-md border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? "border-clinical bg-clinical-light/60 ring-1 ring-clinical"
                      : "border-border bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 hover:border-clinical-border hover:bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-white truncate">{preset.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                      {preset.dimensions}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
