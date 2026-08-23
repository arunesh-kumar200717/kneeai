"use client";

import React from "react";
import { MOCK_MRI_SAGITTAL_SVG, MOCK_XRAY_AP_SVG } from "@/lib/fixtures";
import { Activity, Hexagon, Layers, Crosshair } from "lucide-react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black/40">
      
      {/* Huge subtle X-Ray floating on the right */}
      <div className="absolute -bottom-10 -right-20 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] opacity-[0.15] animate-drift mix-blend-screen drop-shadow-2xl filter blur-sm">
        <img src={MOCK_XRAY_AP_SVG} alt="" className="w-full h-full object-contain" />
      </div>

      {/* Huge subtle MRI floating on the left */}
      <div className="absolute -top-10 -left-10 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] opacity-[0.20] animate-float mix-blend-screen drop-shadow-2xl filter blur-[2px]">
        <img src={MOCK_MRI_SAGITTAL_SVG} alt="" className="w-full h-full object-contain" />
      </div>

      {/* Secondary floating medical vectors - Sleek Clinical Blue & Slate */}
      <div className="absolute top-[15%] right-[25%] opacity-[0.25] animate-drift-reverse text-clinical drop-shadow-lg">
        <Activity className="w-32 h-32" strokeWidth={1} />
      </div>

      <div className="absolute bottom-[25%] left-[20%] opacity-[0.15] animate-float text-slate-400 drop-shadow-lg" style={{ animationDelay: '-5s' }}>
        <Layers className="w-48 h-48" strokeWidth={0.5} />
      </div>

      <div className="absolute top-[65%] right-[15%] opacity-[0.20] animate-drift text-slate-500 drop-shadow-lg" style={{ animationDelay: '-10s' }}>
        <Crosshair className="w-40 h-40" strokeWidth={0.5} />
      </div>

      <div className="absolute top-[10%] left-[45%] opacity-[0.15] animate-float text-clinical/60 drop-shadow-lg" style={{ animationDelay: '-15s' }}>
        <Hexagon className="w-64 h-64" strokeWidth={0.5} />
      </div>
    </div>
  );
}
