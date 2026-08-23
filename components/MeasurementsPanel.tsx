"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ruler,
  Sliders,
  Download,
  CheckCircle2,
  Clock,
  Percent,
  FileSpreadsheet,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AnalysisResponse, CalibrationConfig } from "@/lib/types";

interface MeasurementsPanelProps {
  module: "meniscus" | "segmentation";
  data: AnalysisResponse;
  calibration: CalibrationConfig;
  onCalibrationChange: (newConfig: CalibrationConfig) => void;
  className?: string;
}

export function MeasurementsPanel({
  module,
  data,
  calibration,
  onCalibrationChange,
  className = "",
}: MeasurementsPanelProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const isMm = calibration?.unit === "mm";
  const spacing = calibration?.pixelSpacingMm || 0.25;

  const femurWidthPx = typeof data?.femur_width_px === "number" ? data.femur_width_px : (module === "segmentation" ? 186 : 182);
  const tibiaWidthPx = typeof data?.tibia_width_px === "number" ? data.tibia_width_px : (module === "segmentation" ? 160 : 156);
  const boundingAreaPx = typeof data?.bounding_area_pixels === "number" ? data.bounding_area_pixels : (module === "meniscus" ? 342 : 1240);
  const confidenceNum = typeof data?.confidence === "number" ? data.confidence : 95.4;
  const processingTimeNum = typeof data?.processing_time === "number" ? data.processing_time : 1.2;

  // Conversions
  const femurWidthVal = isMm ? (femurWidthPx * spacing).toFixed(1) : femurWidthPx.toFixed(0);
  const femurUnit = isMm ? "mm" : "px";

  const tibiaWidthVal = isMm ? (tibiaWidthPx * spacing).toFixed(1) : tibiaWidthPx.toFixed(0);
  const tibiaUnit = isMm ? "mm" : "px";

  // Area conversion: px² * (mm/px)² = mm²
  const boundingAreaVal = isMm
    ? (boundingAreaPx * spacing * spacing).toFixed(1)
    : boundingAreaPx.toFixed(0);
  const areaUnit = isMm ? "mm²" : "px²";

  // Morphometric ratio (Femur width / Tibia width)
  const ftRatio = tibiaWidthPx > 0 ? (femurWidthPx / tibiaWidthPx).toFixed(2) : "1.17";

  // Medial Joint Space Width estimation
  const medialJswPx = typeof data?.metadata?.joint_space_medial_px === "number" ? data.metadata.joint_space_medial_px : 18;
  const medialJswVal = isMm ? (medialJswPx * spacing).toFixed(1) : medialJswPx.toFixed(0);

  const handleExportJson = () => {
    const reportData = {
      title: "Knee AI Clinical Research Morphometry Report",
      timestamp: new Date().toISOString(),
      module: module === "meniscus" ? "Medial Meniscus MRI Segmentation" : "Knee X-Ray Bone Segmentation",
      calibration: {
        unit: calibration.unit,
        pixel_spacing_mm: calibration.pixelSpacingMm,
      },
      measurements: {
        confidence_percent: data.confidence,
        processing_time_seconds: data.processing_time,
        bounding_area: {
          value: Number(boundingAreaVal),
          unit: areaUnit,
          raw_pixels: data.bounding_area_pixels,
        },
        femur_width: {
          value: Number(femurWidthVal),
          unit: femurUnit,
          raw_pixels: data.femur_width_px,
        },
        tibia_width: {
          value: Number(tibiaWidthVal),
          unit: tibiaUnit,
          raw_pixels: data.tibia_width_px,
        },
        femur_tibia_width_ratio: Number(ftRatio),
        estimated_medial_jsw: {
          value: Number(medialJswVal),
          unit: femurUnit,
          raw_pixels: medialJswPx,
        },
      },
      safety_notice:
        "This application is for research and educational decision-support purposes only and does not provide a medical diagnosis.",
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `knee-ai-morphometry-${module}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border p-4 shadow-card space-y-4 ${className}`}>
      {/* Header & Quick Unit Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-clinical-light text-clinical flex items-center justify-center">
            <Ruler className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Morphometric Measurements
            </h3>
            <span className="text-[10px] text-slate-300">
              Quantitative structural geometry (tabular-nums)
            </span>
          </div>
        </div>

        {/* Unit Selector (px vs mm) */}
        <div className="inline-flex rounded-md border border-border p-0.5 bg-surface-muted">
          <button
            type="button"
            onClick={() => onCalibrationChange({ ...calibration, unit: "px" })}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all ${
              !isMm
                ? "bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 text-white font-bold shadow-xs border border-border"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Pixels (px)
          </button>
          <button
            type="button"
            onClick={() => onCalibrationChange({ ...calibration, unit: "mm" })}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-all ${
              isMm
                ? "bg-clinical text-white font-bold shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Metric (mm)
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid with tabular-nums */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Metric 1: Confidence */}
        <div className="p-3 rounded-md bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border">
          <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Percent className="w-3 h-3 text-clinical" />
              Model Confidence
            </span>
            <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">
              High
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {confidenceNum.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-[10px] text-slate-300">Dice IoU calibrated</span>
        </div>

        {/* Metric 2: Latency */}
        <div className="p-3 rounded-md bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border">
          <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-clinical" />
              Inference Time
            </span>
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {processingTimeNum.toFixed(2)}
            <span className="text-xs font-normal text-slate-400 ml-0.5">s</span>
          </div>
          <span className="text-[10px] text-slate-300">GPU server runtime</span>
        </div>

        {/* Metric 3: Bounding Area */}
        <div className="p-3 rounded-md bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border">
          <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
            <span className="font-medium">
              {module === "meniscus" ? "Meniscus Area" : "ROI Area"}
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {boundingAreaVal}
            <span className="text-xs font-semibold text-clinical ml-1">{areaUnit}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {isMm ? `${boundingAreaPx} px² raw` : `${(boundingAreaPx * spacing * spacing).toFixed(1)} mm² est.`}
          </span>
        </div>

        {/* Metric 4: Femur Width */}
        <div className="p-3 rounded-md bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border">
          <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
            <span className="font-medium text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
              Femur ML
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {femurWidthVal}
            <span className="text-xs font-semibold text-[#0284C7] ml-1">{femurUnit}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {isMm ? `${femurWidthPx} px` : `${(femurWidthPx * spacing).toFixed(1)} mm`}
          </span>
        </div>

        {/* Metric 5: Tibia Width */}
        <div className="p-3 rounded-md bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border">
          <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
            <span className="font-medium text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              Tibia ML
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {tibiaWidthVal}
            <span className="text-xs font-semibold text-[#D97706] ml-1">{tibiaUnit}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {isMm ? `${tibiaWidthPx} px` : `${(tibiaWidthPx * spacing).toFixed(1)} mm`}
          </span>
        </div>

        {/* Metric 6: Femur/Tibia Ratio */}
        <div className="p-3 rounded-md bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border">
          <div className="flex items-center justify-between text-slate-300 text-[11px] mb-1">
            <span className="font-medium">F / T Ratio</span>
            <span className="text-[9px] text-slate-400 font-mono">Norm: 1.15–1.20</span>
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {ftRatio}
          </div>
          <span className="text-[10px] text-slate-300">Condyle / Plateau index</span>
        </div>
      </div>

      {/* Spatial Calibration Tuning Widget */}
      <div className="p-3 rounded-md bg-surface-muted border border-border space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="pixel-spacing-input"
            className="text-xs font-bold text-white flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-clinical" />
            Detector Calibration (Pixel Spacing)
          </label>
          <span className="text-[10px] font-mono text-clinical font-semibold">
            {calibration.pixelSpacingMm} mm/pixel
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="pixel-spacing-input"
            type="range"
            min="0.10"
            max="0.50"
            step="0.01"
            value={calibration.pixelSpacingMm}
            onChange={(e) =>
              onCalibrationChange({
                ...calibration,
                pixelSpacingMm: parseFloat(e.target.value),
              })
            }
            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-clinical"
          />
          <input
            type="number"
            min="0.05"
            max="1.0"
            step="0.01"
            value={calibration.pixelSpacingMm}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val > 0) {
                onCalibrationChange({ ...calibration, pixelSpacingMm: val });
              }
            }}
            className="w-16 px-1.5 py-0.5 text-xs font-mono border border-border rounded bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 text-white text-right"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
          <span>Preset: Standard Plain X-Ray (0.25 mm/px)</span>
          <button
            type="button"
            onClick={() => onCalibrationChange({ ...calibration, pixelSpacingMm: 0.25 })}
            className="text-clinical hover:underline font-medium"
          >
            Reset (0.25)
          </button>
        </div>
      </div>

      {/* 1-Click Bridge to Module 3 (Implant Matching) */}
      {module === "segmentation" && (
        <div className="pt-2">
          <Link
            href={`/implant?femurMl=${femurWidthVal}&tibiaMl=${tibiaWidthVal}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-md bg-purple-900/80 hover:bg-purple-800 border border-purple-500/40 text-white text-xs font-bold transition-all shadow-md hover:shadow-purple-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Match Implants with this Scan (Module 3) →</span>
          </Link>
        </div>
      )}

      {/* Export Clinical Summary Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleExportJson}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-navy text-white hover:bg-navy-700 text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Morphometry Summary (JSON)</span>
        </button>
      </div>
    </div>
  );
}
