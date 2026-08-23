import React from "react";
import { AlertCircle } from "lucide-react";

interface DisclaimerBannerProps {
  className?: string;
}

export function DisclaimerBanner({ className = "" }: DisclaimerBannerProps) {
  return (
    <aside
      aria-label="Clinical Research Disclaimer"
      className={`w-full bg-[#0B1F3A] text-white border-b border-navy-700 px-4 py-2 text-xs select-none ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center sm:text-left">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 inline" aria-hidden="true" />
        <span className="font-medium text-slate-200 tracking-wide">
          <strong className="text-white uppercase font-bold text-[10px] tracking-wider bg-white/10 px-1.5 py-0.5 rounded mr-1.5 border border-white/20">
            RESEARCH USE ONLY
          </strong>
          This application is for research and educational decision-support purposes only and does not provide a medical diagnosis.
        </span>
      </div>
    </aside>
  );
}
