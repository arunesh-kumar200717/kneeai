import React from "react";
import Link from "next/link";
import {
  Disc,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  Sparkles,
  Lock,
  Activity,
  FileCheck,
  CheckCircle2,
  Database,
  ExternalLink,
} from "lucide-react";

export default function HubPage() {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero / Platform Overview Banner */}
      <section className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-xl border border-border p-6 sm:p-8 shadow-card">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-clinical-light border border-clinical-border text-xs font-semibold text-clinical">
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical Research &amp; Decision-Support Suite</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Knee Osteoarthritis Imaging &amp; Quantitative Anatomical Segmentation
          </h1>

        </div>
      </section>

      {/* Modules Hub Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Clinical Imaging Workspaces
            </h2>
            <p className="text-xs text-slate-300">
              Select an imaging modality below to initiate analysis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
          {/* Module 1: Meniscus MRI */}
          <div className="bg-black/85 backdrop-blur-xl !text-white border-white/30 rounded-2xl border-2 p-8 shadow-2xl hover:border-clinical transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(15,110,140,0.3)]">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border-2 border-teal-200 flex items-center justify-center shadow-inner">
                  <Disc className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-emerald-50 text-emerald-800 border-2 border-emerald-300 shadow-sm">
                  MODULE 1 • ACTIVE
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white group-hover:text-clinical transition-colors">
                  Medial Meniscus MRI Segmentation
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  2D U-Net segmentation tailored for Sagittal T2 Fast Spin-Echo MRI slices.
                  Identifies posterior and anterior meniscal horns, computes 2D surface area,
                  and provides confidence intervals.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border text-xs text-slate-300">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Input Resolution:</span>
                  <strong className="text-white">256 × 256 px</strong>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Output:</span>
                  <strong className="text-teal-700">Binary Mask [0, 1]</strong>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Accepted Formats:</span>
                  <span className="text-slate-400">DICOM (.dcm), PNG, JPG</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/meniscus"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg bg-clinical text-white hover:bg-clinical-hover font-extrabold text-sm transition-all shadow-lg hover:shadow-clinical/50"
              >
                <span>Launch Meniscus Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Module 2: X-Ray Bone Segmentation */}
          <div className="bg-black/85 backdrop-blur-xl !text-white border-white/30 rounded-2xl border-2 p-8 shadow-2xl hover:border-clinical transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(15,110,140,0.3)]">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 border-2 border-sky-200 flex items-center justify-center shadow-inner">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-emerald-50 text-emerald-800 border-2 border-emerald-300 shadow-sm">
                  MODULE 2 • ACTIVE
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white group-hover:text-clinical transition-colors">
                  Knee X-Ray Bone Segmentation
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  Dual-contour segmentation of the distal femur and proximal tibia on AP plain radiographs.
                  Features colorblind-safe layer isolation, calibrated morphometry, and joint space calipers.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border text-xs text-slate-300">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Isolated Structures:</span>
                  <strong className="text-white">Femur &amp; Tibia</strong>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Palette:</span>
                  <span className="text-white font-semibold">Colorblind-Safe</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Payload Limit:</span>
                  <span className="text-slate-400">Strict 10 MB limit</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/segmentation"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg bg-clinical text-white hover:bg-clinical-hover font-extrabold text-sm transition-all shadow-lg hover:shadow-clinical/50"
              >
                <span>Launch Bone Segmentation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Module 3: Implant Matching (Active) */}
          <div className="bg-black/85 backdrop-blur-xl !text-white border-white/30 rounded-2xl border-2 p-8 shadow-2xl hover:border-clinical transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(15,110,140,0.3)]">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border-2 border-purple-200 flex items-center justify-center shadow-inner">
                  <Database className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-emerald-50 text-emerald-800 border-2 border-emerald-300 shadow-sm">
                  MODULE 3 • ACTIVE
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-white group-hover:text-clinical transition-colors">
                  Implant &amp; Prosthetic Matching
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  Pre-operative templating engine to match patient-specific femoral and tibial
                  morphology against prosthetic geometry catalogs for total knee arthroplasty (TKA).
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-border text-xs text-slate-300">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Outputs:</span>
                  <strong className="text-white">Femoral / Tibial Sizes</strong>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Visuals:</span>
                  <span className="text-purple-700">TKA Overlay</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>Supported:</span>
                  <span className="text-slate-400">AP X-Ray</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/implant"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg bg-clinical text-white hover:bg-clinical-hover font-extrabold text-sm transition-all shadow-lg hover:shadow-clinical/50"
              >
                <span>Launch Implant Matching</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline & Technical Reference Architecture */}
      <section className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-xl border border-border p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-clinical" />
          Clinical Pipeline &amp; Data Flow Architecture
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border space-y-1">
            <span className="text-[10px] font-mono text-clinical font-bold">01. INGESTION</span>
            <h4 className="text-xs font-bold text-white">DICOM / Matrix Ingest</h4>
            <p className="text-[11px] text-slate-300">
              Validates header metadata, bit depth (12/16-bit to 8-bit), and photometric interpretation.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border space-y-1">
            <span className="text-[10px] font-mono text-clinical font-bold">02. PREPROCESSING</span>
            <h4 className="text-xs font-bold text-white">Resampling &amp; Normalization</h4>
            <p className="text-[11px] text-slate-300">
              Standardizes resolution to 256×256 / 512×512 with bicubic interpolation and [0,1] normalization.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border space-y-1">
            <span className="text-[10px] font-mono text-clinical font-bold">03. INFERENCE</span>
            <h4 className="text-xs font-bold text-white">Server-Side Execution</h4>
            <p className="text-[11px] text-slate-300">
              Zero-client ML execution. Dispatched to isolated FastAPI backend via typed REST endpoint.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm !text-slate-200 border-white/5 border border-border space-y-1">
            <span className="text-[10px] font-mono text-clinical font-bold">04. MORPHOMETRY</span>
            <h4 className="text-xs font-bold text-white">Calibrated Quantitation</h4>
            <p className="text-[11px] text-slate-300">
              Computes geometric boundaries, anatomical widths, and calibrated metric area outputs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
