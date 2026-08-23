"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  FileImage,
  Sparkles,
  ArrowLeft,
  Sliders,
  CheckCircle2,
  Layers,
  FileText,
} from "lucide-react";

import { SegmentationViewer } from "@/components/SegmentationViewer";
import { ImplantPanel } from "@/components/ImplantPanel";
import { LayerToggle } from "@/components/LayerToggle";
import { RagCopilot } from "@/components/RagCopilot";
import { ClinicalReportModal } from "@/components/ClinicalReportModal";

import {
  MOCK_XRAY_AP_SVG,
  MOCK_IMPLANT_RESPONSE,
  MOCK_IMPLANT_OVERLAY_SVG,
  PRESET_SAMPLES,
} from "@/lib/fixtures";

import { calculateExactImplantMatch } from "@/lib/implant-catalog";

import {
  ImplantAnalysisResponse,
  CalibrationConfig,
  LayerVisibility,
} from "@/lib/types";

/*
 * We do NOT import PresetSample from fixtures/types.
 *
 * Instead, TypeScript automatically gets the correct type
 * from the PRESET_SAMPLES array.
 */
type PresetSample = (typeof PRESET_SAMPLES)[number];

/*
 * Metadata helper type.
 *
 * Some preset metadata objects have different properties.
 * Using this type lets us safely check properties before
 * reading them.
 */
type PresetMetadata = Record<string, unknown>;

function ImplantWorkspaceContent() {
  const searchParams = useSearchParams();

  // ---------------------------------------------------------
  // Basic scan information
  // ---------------------------------------------------------

  const [scanOrigin, setScanOrigin] = useState<string>(
    "Module 2 Active Patient Radiograph"
  );

  const [fileName, setFileName] = useState<string>(
    "Patient-XRay-AP-Standing.dcm"
  );

  const [imageUrl, setImageUrl] =
    useState<string>(MOCK_XRAY_AP_SVG);

  const [catalog, setCatalog] =
    useState<string>("Stryker Triathlon");

  // ---------------------------------------------------------
  // Patient measurements
  // ---------------------------------------------------------

  const [femurMl, setFemurMl] =
    useState<number>(64.5);

  const [tibiaMl, setTibiaMl] =
    useState<number>(72.1);

  const [varusValgus, setVarusValgus] =
    useState<number>(2.1);

  // ---------------------------------------------------------
  // Report modal
  // ---------------------------------------------------------

  const [isReportOpen, setIsReportOpen] =
    useState<boolean>(false);

  // ---------------------------------------------------------
  // Calibration
  // ---------------------------------------------------------

  const [calibration, setCalibration] =
    useState<CalibrationConfig>({
      unit: "mm",
      pixelSpacingMm: 0.25,
    });

  // ---------------------------------------------------------
  // Layer visibility
  // ---------------------------------------------------------

  const [layers, setLayers] =
    useState<LayerVisibility>({
      femur: false,
      tibia: false,
      meniscus: false,
      implant: true,
      boundingBox: false,
      measurements: true,
    });

  // ---------------------------------------------------------
  // Initial implant result
  // ---------------------------------------------------------

  const [result, setResult] =
    useState<ImplantAnalysisResponse>(() => {
      const initialMatch =
        calculateExactImplantMatch({
          femurMlMm: 64.5,
          tibiaMlMm: 72.1,
          catalogName: "Stryker Triathlon",
          varusValgusDeg: 2.1,
        });

      return {
        ...MOCK_IMPLANT_RESPONSE,

        femur_recommended_size:
          initialMatch.femurRecommendedSize,

        tibia_recommended_size:
          initialMatch.tibiaRecommendedSize,

        polyethylene_thickness_mm:
          initialMatch.polyethyleneThicknessMm,

        confidence:
          initialMatch.confidencePercent,

        mask_image_url:
          MOCK_IMPLANT_OVERLAY_SVG,

        overlay_image_url:
          MOCK_IMPLANT_OVERLAY_SVG,

        metadata: {
          catalog_name: "Stryker Triathlon",
          femur_ap_width_mm: 64.5,
          tibia_ml_width_mm: 72.1,
          implant_alignment_varus_deg: 2.1,
        },
      };
    });

  // ---------------------------------------------------------
  // Get active scan from Module 2
  // URL parameters OR sessionStorage
  // ---------------------------------------------------------

  useEffect(() => {
    let sourceScanFound = false;

    // -------------------------------------------------------
    // 1. Read URL parameters
    // -------------------------------------------------------

    const paramFemur =
      searchParams.get("femurMl");

    const paramTibia =
      searchParams.get("tibiaMl");

    if (paramFemur && paramTibia) {
      const fVal = parseFloat(paramFemur);
      const tVal = parseFloat(paramTibia);

      if (
        Number.isFinite(fVal) &&
        Number.isFinite(tVal)
      ) {
        setFemurMl(fVal);
        setTibiaMl(tVal);

        setScanOrigin(
          "Module 2 (Exported Morphometry)"
        );

        setFileName(
          "Transferred-Bone-Segmentation.dcm"
        );

        sourceScanFound = true;
      }
    }

    // -------------------------------------------------------
    // 2. Read sessionStorage
    // -------------------------------------------------------

    if (
      !sourceScanFound &&
      typeof window !== "undefined"
    ) {
      try {
        const stored =
          sessionStorage.getItem(
            "knee_ai_active_scan"
          );

        if (stored) {
          const parsed = JSON.parse(stored);

          if (
            typeof parsed.femurMlMm === "number" &&
            typeof parsed.tibiaMlMm === "number"
          ) {
            setFemurMl(parsed.femurMlMm);
            setTibiaMl(parsed.tibiaMlMm);

            if (
              typeof parsed.imageUrl === "string"
            ) {
              setImageUrl(parsed.imageUrl);
            }

            if (
              typeof parsed.fileName === "string"
            ) {
              setFileName(parsed.fileName);
            }

            if (
              typeof parsed.varusValgusDeg ===
              "number"
            ) {
              setVarusValgus(
                parsed.varusValgusDeg
              );
            }

            if (
              typeof parsed.sourceModule ===
              "string"
            ) {
              setScanOrigin(
                parsed.sourceModule
              );
            } else {
              setScanOrigin(
                "Module 2 Active Patient Radiograph"
              );
            }

            sourceScanFound = true;
          }
        }
      } catch (error) {
        console.warn(
          "Could not read sessionStorage scan:",
          error
        );
      }
    }
  }, [searchParams]);

  // ---------------------------------------------------------
  // Recalculate implant match whenever measurements change
  // ---------------------------------------------------------

  useEffect(() => {
    const exactMatch =
      calculateExactImplantMatch({
        femurMlMm: femurMl,
        tibiaMlMm: tibiaMl,
        catalogName: catalog,
        varusValgusDeg: varusValgus,
      });

    setResult((previous) => ({
      ...previous,

      femur_recommended_size:
        exactMatch.femurRecommendedSize,

      tibia_recommended_size:
        exactMatch.tibiaRecommendedSize,

      polyethylene_thickness_mm:
        exactMatch.polyethyleneThicknessMm,

      confidence:
        exactMatch.confidencePercent,

      metadata: {
        catalog_name: catalog,
        femur_ap_width_mm: femurMl,
        tibia_ml_width_mm: tibiaMl,
        implant_alignment_varus_deg:
          varusValgus,
      },
    }));
  }, [
    femurMl,
    tibiaMl,
    catalog,
    varusValgus,
  ]);

  // ---------------------------------------------------------
  // Layer toggle
  // ---------------------------------------------------------

  const handleLayerToggle = (
    key: keyof LayerVisibility,
    value: boolean
  ) => {
    setLayers((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // ---------------------------------------------------------
  // Switch preset
  // ---------------------------------------------------------

  const handleSwitchPreset = (
    preset: PresetSample
  ) => {
    setImageUrl(preset.imageUrl);
    setFileName(preset.name);
    setScanOrigin("Research Cohort Preset");

    if (!preset.mockResult?.metadata) {
      return;
    }

    /*
     * Convert metadata to a generic object.
     *
     * This prevents TypeScript from complaining because
     * different presets can have different metadata shapes.
     */
    const metadata =
      preset.mockResult.metadata as PresetMetadata;

    // Femur
    const femurWidth =
      metadata["femur_ap_width_mm"];

    if (
      typeof femurWidth === "number" &&
      Number.isFinite(femurWidth)
    ) {
      setFemurMl(femurWidth);
    }

    // Tibia
    const tibiaWidth =
      metadata["tibia_ml_width_mm"];

    if (
      typeof tibiaWidth === "number" &&
      Number.isFinite(tibiaWidth)
    ) {
      setTibiaMl(tibiaWidth);
    }

    // Alignment
    const alignment =
      metadata[
        "implant_alignment_varus_deg"
      ];

    if (
      typeof alignment === "number" &&
      Number.isFinite(alignment)
    ) {
      setVarusValgus(alignment);
    }

    // Catalog
    const catalogName =
      metadata["catalog_name"];

    if (typeof catalogName === "string") {
      setCatalog(catalogName);
    }
  };

  // ---------------------------------------------------------
  // Implant presets
  // ---------------------------------------------------------

  const implantPresets =
    PRESET_SAMPLES.filter(
      (sample) => sample.module === "implant"
    );

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div className="space-y-1">

          <div className="flex items-center gap-2 text-xs text-slate-300">

            <Link
              href="/"
              className="hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Research Hub</span>
            </Link>

            <span>/</span>

            <Link
              href="/segmentation"
              className="hover:text-white flex items-center gap-1"
            >
              <span>
                Module 2 (Bone Segmentation)
              </span>
            </Link>

            <span>/</span>

            <span className="text-white font-semibold">
              Module 3 (Implant Matching)
            </span>

          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">

            <Layers className="w-6 h-6 text-purple-400" />

            Patient Prosthetic Matching &amp; Templating

          </h1>

        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">

          <button
            type="button"
            onClick={() =>
              setIsReportOpen(true)
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-clinical hover:bg-clinical-hover rounded-md font-bold transition-all shadow-md"
          >
            <FileText className="w-3.5 h-3.5" />

            <span>
              Generate Surgical Plan Report
            </span>
          </button>

          <Link
            href="/segmentation"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-md border border-white/10 transition-all shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-clinical" />

            <span>
              Adjust Morphometry in Module 2
            </span>
          </Link>

        </div>
      </div>

      {/* =====================================================
          ACTIVE SCAN BANNER
      ====================================================== */}

      <div className="bg-black/85 backdrop-blur-md !text-white border-purple-500/40 rounded-xl border p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0">
            <FileImage className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">

            <div className="flex items-center gap-2 flex-wrap">

              <span className="text-xs font-bold text-white">
                {fileName}
              </span>

              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                ● Auto-Inherited from{" "}
                {scanOrigin}
              </span>

            </div>

            <p className="text-[11px] text-slate-300">
              Matched against{" "}
              <strong>{catalog}</strong>{" "}
              sizing specs without requiring a
              new upload.
            </p>

          </div>
        </div>

        {/* Patient metrics */}

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-center">

            <span className="text-[10px] text-slate-400 block font-mono">
              Patient Femur ML
            </span>

            <span className="text-xs font-bold font-mono text-sky-400">
              {femurMl.toFixed(1)} mm
            </span>

          </div>

          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-center">

            <span className="text-[10px] text-slate-400 block font-mono">
              Patient Tibia ML
            </span>

            <span className="text-xs font-bold font-mono text-amber-400">
              {tibiaMl.toFixed(1)} mm
            </span>

          </div>

          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-center">

            <span className="text-[10px] text-slate-400 block font-mono">
              Alignment
            </span>

            <span className="text-xs font-bold font-mono text-purple-300">

              {Math.abs(
                varusValgus
              ).toFixed(1)}
              °{" "}

              {varusValgus >= 0
                ? "Varus"
                : "Valgus"}

            </span>

          </div>

        </div>
      </div>

      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ===================================================
            LEFT COLUMN
        ==================================================== */}

        <div className="lg:col-span-8 space-y-4">

          {/* Viewer */}

          <div className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-xl border p-4 shadow-card space-y-3">

            <div className="flex items-center justify-between pb-2 border-b border-white/10">

              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">

                <Sparkles className="w-3.5 h-3.5 text-purple-400" />

                Active Radiograph Templating Viewer

              </span>

              <span className="text-[10px] text-slate-400 font-mono">
                512 × 512 • 8-bit Calibrated
              </span>

            </div>

            <SegmentationViewer
              module="implant"
              originalImageUrl={imageUrl}
              maskImageUrl={
                result.mask_image_url
              }
              overlayImageUrl={
                result.overlay_image_url
              }
              layerVisibility={layers}
            />

          </div>

          {/* Presets */}

          <div className="bg-black/60 backdrop-blur-md !text-white border-white/10 rounded-xl border p-4 space-y-3">

            <div className="flex items-center justify-between">

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Compare with Alternative
                Patient Cases
              </h3>

              <span className="text-[10px] text-slate-400 font-mono">
                {implantPresets.length} Catalog
                Presets Ready
              </span>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

              {implantPresets.map(
                (preset) => (

                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      handleSwitchPreset(
                        preset
                      )
                    }
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      fileName === preset.name
                        ? "border-purple-500 bg-purple-950/60 shadow-sm"
                        : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >

                    <div className="flex items-center justify-between mb-1">

                      <span className="text-xs font-bold text-white truncate">
                        {preset.name}
                      </span>

                      {fileName ===
                        preset.name && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                      )}

                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>

                  </button>

                )
              )}

            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDEBAR
        ==================================================== */}

        <div className="lg:col-span-4 space-y-4">

          <ImplantPanel
            data={result}
            calibration={calibration}
            onCalibrationChange={
              setCalibration
            }
            catalog={catalog}
            onCatalogChange={
              setCatalog
            }
          />

          <LayerToggle
            visibility={layers}
            onChange={handleLayerToggle}
            module="implant"
          />

          <RagCopilot
            data={result}
            catalogName={catalog}
          />

        </div>
      </div>

      {/* =====================================================
          CLINICAL REPORT MODAL
      ====================================================== */}

      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() =>
          setIsReportOpen(false)
        }
        module="implant"
        fileName={fileName}
        originalImageUrl={
          imageUrl ||
          MOCK_XRAY_AP_SVG
        }
        maskImageUrl={
          result?.mask_image_url ||
          MOCK_IMPLANT_OVERLAY_SVG
        }
        overlayImageUrl={
          result?.overlay_image_url ||
          MOCK_IMPLANT_OVERLAY_SVG
        }
        implantData={result}
        calibration={calibration}
        catalogName={catalog}
      />

    </div>
  );
}

// =============================================================
// PAGE EXPORT
// =============================================================

export default function ImplantPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center text-slate-400 font-mono text-xs">
          Loading Active Patient Implant Matching...
        </div>
      }
    >
      <ImplantWorkspaceContent />
    </Suspense>
  );
}
