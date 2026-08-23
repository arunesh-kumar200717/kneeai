import React from "react";
import { Cpu, ShieldCheck, Binary, Sliders, Box, Award } from "lucide-react";

interface ModelSpecCardProps {
  module?: "meniscus" | "segmentation";
  className?: string;
}

export function ModelSpecCard({ module = "meniscus", className = "" }: ModelSpecCardProps) {
  const isMeniscus = module === "meniscus";

  const specs = isMeniscus
    ? [
        { label: "Network Architecture", value: "PyTorch 2D U-Net (OAI Training Protocol)", icon: Cpu },
        { label: "Input Matrix", value: "256 × 256 × 1 (Grayscale FP32)", icon: Box },
        { label: "Decision Threshold", value: "τ = 0.45 (Sigmoid Probability Gate)", icon: Sliders },
        { label: "Output Representation", value: "Binary Mask (1 = Meniscus, 0 = Background)", icon: Binary },
        { label: "Training Benchmark", value: "Osteoarthritis Initiative (OAI) T2 FSE", icon: ShieldCheck },
        { label: "Validation Mean Dice", value: "0.894 ± 0.031", icon: Award },
      ]
    : [
        { label: "Network Architecture", value: "Multi-Head Dual Contour U-Net", icon: Cpu },
        { label: "Input Matrix", value: "512 × 512 × 1 (High-Res Plain Radiograph)", icon: Box },
        { label: "Output Representation", value: "Dual Class Mask (Femur + Tibia)", icon: Binary },
        { label: "Loss Formulation", value: "Focal Tversky + Boundary Loss", icon: Sliders },
        { label: "Training Benchmark", value: "Clinical AP Standing Radiograph Cohort", icon: ShieldCheck },
        { label: "Validation Mean IoU", value: "0.928 (Femur) / 0.916 (Tibia)", icon: Award },
      ];

  return (
    <div className={`bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border shadow-card overflow-hidden ${className}`}>
      {/* Spec Sheet Header */}
      <div className="bg-navy-800 text-white px-4 py-2.5 flex items-center justify-between border-b border-navy-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Model Technical Specification Sheet
          </h3>
        </div>
        <span className="font-mono text-[10px] text-cyan-300 bg-navy-900 px-2 py-0.5 rounded border border-navy-700">
          {isMeniscus ? "SPEC: UNET-MENISCUS-2D-v2" : "SPEC: XRAY-BONE-CONTOUR-v3"}
        </span>
      </div>

      {/* Spec Grid */}
      <div className="p-3.5 divide-y divide-border">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs ${
                idx === 0 ? "pt-0" : ""
              } ${idx === specs.length - 1 ? "pb-0" : ""}`}
            >
              <div className="flex items-center gap-2 text-slate-300">
                <Icon className="w-3.5 h-3.5 text-clinical shrink-0" />
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="font-mono font-semibold text-white text-[11px] sm:text-xs tabular-nums text-left sm:text-right pl-5 sm:pl-0">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Spec Footer Notes */}
      <div className="bg-surface-muted px-4 py-2 border-t border-border flex items-center justify-between text-[10px] text-slate-300">
        <span>Inference Framework: ONNX Runtime / TensorRT backend</span>
        <span className="font-mono text-white font-semibold">Latency Target: &lt; 2.0s</span>
      </div>
    </div>
  );
}
