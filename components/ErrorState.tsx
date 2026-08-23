"use client";

import React from "react";
import { AlertTriangle, RefreshCw, ServerOff, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message: string;
  statusCode?: number;
  onRetry?: () => void;
  onReset?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Inference Pipeline Encountered an Error",
  message,
  statusCode,
  onRetry,
  onReset,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-red-200 p-6 shadow-card space-y-4 ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-full bg-status-error-bg text-status-error flex items-center justify-center shrink-0 border border-red-200">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="space-y-1 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">{title}</h3>
            {statusCode !== undefined && (
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                HTTP {statusCode}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 p-3 rounded border border-border font-mono text-[11px]">
            {message}
          </p>
        </div>
      </div>

      {/* Troubleshooting recommendations */}
      <div className="bg-surface-muted p-3.5 rounded-md border border-border space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-clinical" />
          Clinical Troubleshooting Checklist
        </span>
        <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
          <li>Verify image resolution is adequate (minimum 256×256 px) and not severely corrupted.</li>
          <li>If using a live server, check if <code className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 px-1 py-0.5 rounded border border-border text-white">http://localhost:8000</code> is accessible.</li>
          <li>For DICOM files (.dcm), ensure the pixel data tag (7FE0,0010) is uncompressed or transfer-syntax compatible.</li>
          <li>You can switch back to offline Mock mode anytime using <code className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 px-1 py-0.5 rounded border border-border text-white">NEXT_PUBLIC_USE_MOCK_API=true</code>.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-muted rounded-md border border-border transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Select Another Image</span>
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-muted rounded-md border border-border transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Hub</span>
          </Link>
        )}

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-clinical hover:bg-clinical-hover rounded-md transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Analysis</span>
          </button>
        )}
      </div>
    </div>
  );
}
