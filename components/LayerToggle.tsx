"use client";

import React from "react";
import { Eye, EyeOff, CheckSquare, Square, Info } from "lucide-react";
import { LayerVisibility } from "@/lib/types";

interface LayerToggleProps {
  module: "meniscus" | "segmentation" | "implant";
  visibility: LayerVisibility;
  onChange: (key: keyof LayerVisibility, value: boolean) => void;
  className?: string;
}

export function LayerToggle({
  module,
  visibility,
  onChange,
  className = "",
}: LayerToggleProps) {
  const isMeniscus = module === "meniscus";
  const isImplant = module === "implant";

  return (
    <div className={`bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border p-3.5 shadow-card ${className}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-clinical" />
          Anatomical Layer Isolation
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Colorblind-Safe</span>
      </div>

      <div className="space-y-2">
        {isMeniscus ? (
          <>
            {/* Meniscus Mask Layer */}
            <button
              type="button"
              onClick={() => onChange("meniscus", !visibility.meniscus)}
              className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-all ${
                visibility.meniscus
                  ? "border-teal-400 bg-teal-950/70 text-white shadow-sm"
                  : "border-border bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 text-slate-400 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#0D9488] ring-1 ring-black/10 shrink-0" />
                <div className="text-left">
                  <span className="font-semibold block">Medial Meniscus Mask</span>
                  <span className="text-[10px] text-slate-300">Posterior horn segmentation (Teal)</span>
                </div>
              </div>
              {visibility.meniscus ? (
                <CheckSquare className="w-4 h-4 text-[#0D9488]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Bounding Box Annotation */}
            <button
              type="button"
              onClick={() => onChange("boundingBox", !visibility.boundingBox)}
              className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-all ${
                visibility.boundingBox
                  ? "border-clinical bg-clinical/20 text-white shadow-sm"
                  : "border-border bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 text-slate-400 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-sm border-2 border-dashed border-[#0F6E8C] shrink-0" />
                <div className="text-left">
                  <span className="font-semibold block">ROI Bounding Box</span>
                  <span className="text-[10px] text-slate-300">Region-of-interest coordinates</span>
                </div>
              </div>
              {visibility.boundingBox ? (
                <CheckSquare className="w-4 h-4 text-clinical" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </>
        ) : (
          <>
            {/* Femur Layer Toggle */}
            <button
              type="button"
              onClick={() => onChange("femur", !visibility.femur)}
              className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-all ${
                visibility.femur
                  ? "border-sky-400 bg-sky-950/70 text-white shadow-sm"
                  : "border-border bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 text-slate-400 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#0284C7] ring-1 ring-black/10 shrink-0" />
                <div className="text-left">
                  <span className="font-semibold block">Femur Contour &amp; Body</span>
                  <span className="text-[10px] text-slate-300">Distal femoral condyles (Azure Blue)</span>
                </div>
              </div>
              {visibility.femur ? (
                <CheckSquare className="w-4 h-4 text-[#0284C7]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Tibia Layer Toggle */}
            <button
              type="button"
              onClick={() => onChange("tibia", !visibility.tibia)}
              className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-all ${
                visibility.tibia
                  ? "border-amber-400 bg-amber-950/70 text-white shadow-sm"
                  : "border-border bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 text-slate-400 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-[#D97706] ring-1 ring-black/10 shrink-0" />
                <div className="text-left">
                  <span className="font-semibold block">Tibia Contour &amp; Plateau</span>
                  <span className="text-[10px] text-slate-300">Proximal tibial plateau (Amber Gold)</span>
                </div>
              </div>
              {visibility.tibia ? (
                <CheckSquare className="w-4 h-4 text-[#D97706]" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Caliper Measurements Overlay */}
            <button
              type="button"
              onClick={() => onChange("measurements", !visibility.measurements)}
              className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-all ${
                visibility.measurements
                  ? "border-clinical bg-clinical/20 text-white shadow-sm"
                  : "border-border bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 text-slate-400 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-sm border-2 border-[#0F6E8C] flex items-center justify-center text-[8px] font-bold text-clinical shrink-0">
                  ↔
                </span>
                <div className="text-left">
                  <span className="font-semibold block">Morphometric Calipers</span>
                  <span className="text-[10px] text-slate-300">Width vectors &amp; joint space gap</span>
                </div>
              </div>
              {visibility.measurements ? (
                <CheckSquare className="w-4 h-4 text-clinical" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Implant Overlay (Module 3 Only) */}
            {isImplant && (
              <button
                type="button"
                onClick={() => onChange("implant", !visibility.implant)}
                className={`w-full flex items-center justify-between p-2 rounded-md border text-xs transition-all ${
                  visibility.implant
                    ? "border-purple-400 bg-purple-950/70 text-white shadow-sm"
                    : "border-border bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 text-slate-400 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#D946EF] ring-1 ring-black/10 shrink-0" />
                  <div className="text-left">
                    <span className="font-semibold block">TKA Implant Template</span>
                    <span className="text-[10px] text-slate-300">Sizing overlay (Magenta)</span>
                  </div>
                </div>
                {visibility.implant ? (
                  <CheckSquare className="w-4 h-4 text-[#D946EF]" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
            )}
          </>
        )}
      </div>

      <div className="mt-2.5 pt-2 border-t border-border flex items-center gap-1.5 text-[10px] text-slate-300">
        <Info className="w-3 h-3 text-clinical shrink-0" />
        <span>Layers render with independent opacity &amp; contrast controls</span>
      </div>
    </div>
  );
}
