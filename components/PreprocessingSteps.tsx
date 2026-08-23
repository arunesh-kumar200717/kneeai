"use client";

import React from "react";
import { ArrowRight, Scaling, SlidersHorizontal, CheckCircle2, Cpu } from "lucide-react";

interface PreprocessingStepsProps {
  currentStage?: "idle" | "preprocessing" | "inference" | "postprocessing" | "complete" | "error";
  className?: string;
}

export function PreprocessingSteps({ currentStage = "idle", className = "" }: PreprocessingStepsProps) {
  const isPreprocessingActive = currentStage === "preprocessing";
  const isPreprocessingDone = ["inference", "postprocessing", "complete"].includes(currentStage);

  const steps = [
    {
      id: "resampling",
      title: "Resampling Matrix",
      value: "256 × 256 px",
      desc: "Bicubic anti-aliasing interpolation preserving anatomical aspect ratio",
      icon: Scaling,
    },
    {
      id: "normalization",
      title: "Intensity Normalization",
      value: "Range [0.0, 1.0]",
      desc: "Min-Max linear signal scaling with 0.5% percentile outlier clipping",
      icon: SlidersHorizontal,
    },
    {
      id: "tensor",
      title: "Tensor Format",
      value: "1 × 1 × 256 × 256 (FP32)",
      desc: "Single-channel grayscale float32 standard tensor representation",
      icon: Cpu,
    },
  ];

  return (
    <div className={`p-4 rounded-lg bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 border border-border shadow-card ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-clinical animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Deterministic Preprocessing Pipeline
          </h3>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
            isPreprocessingDone
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : isPreprocessingActive
              ? "bg-clinical-light text-clinical border-clinical-border animate-pulse"
              : "bg-surface-muted text-slate-400 border-border"
          }`}
        >
          {isPreprocessingDone
            ? "APPLIED & VERIFIED"
            : isPreprocessingActive
            ? "PROCESSING PIPELINE..."
            : "PRE-INFERENCE STANDARD"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-3 rounded-md border transition-all flex flex-col justify-between ${
                isPreprocessingDone
                  ? "bg-emerald-50/40 border-emerald-200"
                  : isPreprocessingActive
                  ? "bg-clinical-light/40 border-clinical ring-1 ring-clinical/30"
                  : "bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border-border"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 border border-border flex items-center justify-center text-white shadow-2xs">
                      <Icon className="w-3 h-3 text-clinical" />
                    </div>
                    <span className="text-[11px] font-bold text-white">{step.title}</span>
                  </div>
                  {isPreprocessingDone && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <div className="font-mono text-xs font-semibold text-clinical bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 px-2 py-1 rounded border border-border inline-block my-1 tabular-nums">
                  {step.value}
                </div>
                <p className="text-[10px] text-slate-300 leading-tight mt-1">
                  {step.desc}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:flex justify-end pt-1">
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
