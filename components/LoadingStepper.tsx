"use client";

import React from "react";
import { CheckCircle2, Loader2, Sparkles, Server, Cpu, Database } from "lucide-react";
import { AnalysisStage, ProgressState } from "@/lib/types";

interface LoadingStepperProps {
  module: "meniscus" | "segmentation" | "implant";
  stage: AnalysisStage;
  percent: number;
  stageName: string;
  description: string;
  className?: string;
}

export function LoadingStepper({
  module,
  stage,
  percent,
  stageName,
  description,
  className = "",
}: LoadingStepperProps) {
  const isMeniscus = module === "meniscus";
  const isImplant = module === "implant";

  const steps = isMeniscus
    ? [
        {
          id: "preprocessing",
          title: "Preprocessing & Resampling",
          detail: "256×256 matrix resizing, bicubic filter & [0, 1.0] intensity normalization",
          icon: Database,
        },
        {
          id: "inference",
          title: "2D U-Net Inference Execution",
          detail: "Feature extraction & soft-dice medial meniscus segmentation map",
          icon: Cpu,
        },
        {
          id: "postprocessing",
          title: "Morphological Postprocessing",
          detail: "Thresholding, connected component contouring & bounding coordinates",
          icon: Sparkles,
        },
      ]
    : isImplant
    ? [
        {
          id: "preprocessing",
          title: "Catalog Search & Geometry Registration",
          detail: "Cross-referencing standard implant catalogs & anatomical landmark mapping",
          icon: Database,
        },
        {
          id: "inference",
          title: "Simulating TKA Component Sizing",
          detail: "Optimizing femoral component and tibial tray geometries against bone contours",
          icon: Cpu,
        },
        {
          id: "postprocessing",
          title: "Insert Optimization & Verification",
          detail: "Polyethylene insert thickness optimization for joint gap normalization",
          icon: Sparkles,
        },
      ]
    : [
        {
          id: "preprocessing",
          title: "X-Ray Quality & Contrast Equalization",
          detail: "CLAHE contrast normalization, bone boundary filtering & tensor standardization",
          icon: Database,
        },
        {
          id: "inference",
          title: "Dual Bone Contour Inference",
          detail: "Multi-class segmentation: Distal Femur (Azure) & Proximal Tibia (Amber)",
          icon: Cpu,
        },
        {
          id: "postprocessing",
          title: "Morphometric Caliper Computation",
          detail: "Condylar width, plateau width, JSW estimation & pixel-metric calibration",
          icon: Sparkles,
        },
      ];

  const getStepStatus = (stepId: string) => {
    if (stage === "complete") return "done";
    if (stepId === stage) return "active";

    const stepOrder = ["preprocessing", "inference", "postprocessing", "complete"];
    const currentIndex = stepOrder.indexOf(stage);
    const stepIndex = stepOrder.indexOf(stepId);

    if (currentIndex > stepIndex) return "done";
    return "pending";
  };

  return (
    <div className={`bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border p-6 shadow-card space-y-6 ${className}`}>
      {/* Header with Progress Percentage */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-clinical animate-spin" />
            <h3 className="text-sm font-bold text-white">
              Executing Multi-Stage Clinical Analysis Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">{description}</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-xl font-bold text-clinical tabular-nums">
            {percent}%
          </span>
        </div>
      </div>

      {/* Determinisic Progress Bar */}
      <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden border border-border">
        <div
          className="bg-clinical h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${Math.max(5, percent)}%` }}
        />
      </div>

      {/* Sequential Stepper */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-md border transition-all flex items-start gap-3 ${
                status === "active"
                  ? "bg-clinical-light/40 border-clinical ring-1 ring-clinical/40"
                  : status === "done"
                  ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border-border opacity-50"
              }`}
            >
              <div className="mt-0.5">
                {status === "done" ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                ) : status === "active" ? (
                  <div className="w-5 h-5 rounded-full bg-clinical text-white flex items-center justify-center animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-surface-muted border border-border text-slate-400 flex items-center justify-center text-[10px] font-mono">
                    0{index + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      status === "active"
                        ? "text-clinical font-bold"
                        : status === "done"
                        ? "text-emerald-900"
                        : "text-slate-300"
                    }`}
                  >
                    Step {index + 1}: {step.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {status === "done" ? "Completed" : status === "active" ? "In Progress" : "Queued"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
