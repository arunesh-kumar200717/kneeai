"use client";

import React, { useState, useRef, MouseEvent, WheelEvent } from "react";
import Image from "next/image";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Layers,
  Split,
  Eye,
  Sliders,
  Move,
  Crosshair,
  Download,
} from "lucide-react";
import { ViewerMode, LayerVisibility, AnalysisResponse } from "@/lib/types";

interface SegmentationViewerProps {
  module: "meniscus" | "segmentation" | "implant";
  originalImageUrl: string;
  maskImageUrl: string;
  overlayImageUrl: string;
  analysisData?: AnalysisResponse;
  layerVisibility: LayerVisibility;
  onLayerChange?: (key: keyof LayerVisibility, value: boolean) => void;
  className?: string;
}

export function SegmentationViewer({
  module,
  originalImageUrl,
  maskImageUrl,
  overlayImageUrl,
  analysisData,
  layerVisibility,
  onLayerChange,
  className = "",
}: SegmentationViewerProps) {
  const [viewMode, setViewMode] = useState<ViewerMode>("overlay");
  const [opacity, setOpacity] = useState<number>(65); // 65% overlay opacity default
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [showCrosshair, setShowCrosshair] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) / zoomLevel);
      const y = Math.round((e.clientY - rect.top) / zoomLevel);
      setCursorPos({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setCursorPos(null);
  };

  const isMeniscus = module === "meniscus";
  const imageAltDescription = isMeniscus
    ? "Sagittal Knee T2 MRI slice displaying medial meniscus segmentation"
    : "AP Weight-Bearing Knee Radiograph displaying femur and tibia anatomical segmentation";

  return (
    <div className={`bg-navy-900 rounded-lg border border-navy-700 shadow-elevated overflow-hidden flex flex-col ${className}`}>
      {/* Top Viewer Control Bar */}
      <div className="bg-navy-800 border-b border-navy-700 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200 select-none">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-navy-900 p-1 rounded-md border border-navy-700">
          <button
            type="button"
            onClick={() => setViewMode("original")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "original"
                ? "bg-clinical text-white font-bold"
                : "text-slate-300 hover:text-white hover:bg-navy-800"
            }`}
          >
            Original {isMeniscus ? "MRI" : "X-Ray"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mask-only")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "mask-only"
                ? "bg-clinical text-white font-bold"
                : "text-slate-300 hover:text-white hover:bg-navy-800"
            }`}
          >
            Predicted Mask
          </button>
          <button
            type="button"
            onClick={() => setViewMode("overlay")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "overlay"
                ? "bg-clinical text-white font-bold"
                : "text-slate-300 hover:text-white hover:bg-navy-800"
            }`}
          >
            Blended Overlay
          </button>
          <button
            type="button"
            onClick={() => setViewMode("side-by-side")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === "side-by-side"
                ? "bg-clinical text-white font-bold"
                : "text-slate-300 hover:text-white hover:bg-navy-800"
            }`}
          >
            Side-by-Side
          </button>
        </div>

        {/* Viewport Zoom / Pan / Crosshair Tools */}
        <div className="flex items-center gap-2">
          {/* Opacity Slider (Only in overlay mode) */}
          {viewMode === "overlay" && (
            <div className="flex items-center gap-2 bg-navy-900 px-2.5 py-1 rounded border border-navy-700 mr-1">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] text-slate-300">Opacity:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-16 h-1 bg-navy-700 rounded appearance-none cursor-pointer accent-cyan-400"
                aria-label="Overlay mask opacity"
              />
              <span className="font-mono text-[11px] font-bold text-cyan-300 tabular-nums w-8">
                {opacity}%
              </span>
            </div>
          )}

          {/* Zoom Buttons */}
          <div className="flex items-center bg-navy-900 rounded border border-navy-700 overflow-hidden">
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Zoom Out"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-navy-800 border-r border-navy-700"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-300 font-bold tabular-nums">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Zoom In"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-navy-800 border-l border-navy-700"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset View"
            className="p-1.5 rounded bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowCrosshair(!showCrosshair)}
            title="Toggle Inspection Reticle"
            className={`p-1.5 rounded border transition-colors ${
              showCrosshair
                ? "bg-clinical/40 border-cyan-500 text-cyan-300"
                : "bg-navy-900 border-navy-700 text-slate-400"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full h-[400px] sm:h-[480px] bg-[#07090E] overflow-hidden flex items-center justify-center select-none ${
          isDragging ? "viewer-pan cursor-grabbing" : "viewer-pan"
        }`}
      >
        {/* Side-by-Side Mode */}
        {viewMode === "side-by-side" ? (
          <div
            className="grid grid-cols-2 gap-2 w-full h-full p-2 transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
          >
            {/* Left: Original */}
            <div className="relative w-full h-full bg-black/40 rounded border border-navy-700 overflow-hidden flex items-center justify-center">
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300 border border-white/10">
                RAW {isMeniscus ? "MRI" : "X-RAY"}
              </span>
              <img
                src={originalImageUrl}
                alt={`Original ${imageAltDescription}`}
                className="max-h-full max-w-full object-contain pointer-events-none"
              />
            </div>

            {/* Right: Overlay/Mask */}
            <div className="relative w-full h-full bg-black/40 rounded border border-navy-700 overflow-hidden flex items-center justify-center">
              <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-clinical/80 text-[10px] font-mono text-white border border-white/10 font-bold">
                SEGMENTED PREDICTION
              </span>
              <img
                src={overlayImageUrl}
                alt={`Segmented overlay of ${imageAltDescription}`}
                className="max-h-full max-w-full object-contain pointer-events-none"
              />
            </div>
          </div>
        ) : (
          /* Single Canvas / Multi-Layer Overlay Mode */
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
          >
            {/* Layer 1: Base Original Image */}
            {viewMode !== "mask-only" && (
              <img
                src={originalImageUrl}
                alt={`Base image for ${imageAltDescription}`}
                className="max-h-full max-w-full object-contain pointer-events-none absolute"
              />
            )}

            {/* Layer 2: Mask Only View */}
            {viewMode === "mask-only" && (
              <img
                src={maskImageUrl}
                alt={`Binary predicted mask for ${imageAltDescription}`}
                className="max-h-full max-w-full object-contain pointer-events-none absolute"
              />
            )}

            {/* Layer 3: Blended Overlay View */}
            {viewMode === "overlay" && (
              <div
                className="relative max-h-full max-w-full flex items-center justify-center pointer-events-none"
                style={{ opacity: opacity / 100 }}
              >
                <img
                  src={overlayImageUrl}
                  alt={`Model overlay mask for ${imageAltDescription}`}
                  className="max-h-full max-w-full object-contain pointer-events-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Viewport HUD Overlays */}
        <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1">
          <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-mono text-slate-300">
            MATRIX: 512 × 512 | FOV 160mm
          </div>
          {analysisData && (
            <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-xs border border-white/10 text-[10px] font-mono text-cyan-300">
              CONFIDENCE: {analysisData.confidence}%
            </div>
          )}
        </div>

        {/* Reticle / Cursor Spatial Coordinates */}
        {showCrosshair && cursorPos && (
          <div className="absolute bottom-3 right-3 pointer-events-none px-2 py-1 rounded bg-black/75 backdrop-blur-xs border border-white/10 text-[10px] font-mono text-slate-300 tabular-nums">
            X: {cursorPos.x}px | Y: {cursorPos.y}px
          </div>
        )}

        <div className="absolute bottom-3 left-3 pointer-events-none text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
          Click &amp; drag to pan • Zoom controls above
        </div>
      </div>

      {/* Footer Status Strip */}
      <div className="bg-navy-800 border-t border-navy-700 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            High-Resolution Rendering Active
          </span>
          <span className="hidden sm:inline">Color-calibrated D65 standard</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const a = document.createElement("a");
              a.href = overlayImageUrl;
              a.download = `knee-segmentation-overlay-${Date.now()}.svg`;
              a.click();
            }}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Download PNG/SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
