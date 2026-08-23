"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  ArrowLeft,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Lock,
  ArrowRight,
  Info,
  Ruler,
  FileText,
} from "lucide-react";
import { UploadZone } from "@/components/UploadZone";
import { ModelSpecCard } from "@/components/ModelSpecCard";
import { SegmentationViewer } from "@/components/SegmentationViewer";
import { LayerToggle } from "@/components/LayerToggle";
import { MeasurementsPanel } from "@/components/MeasurementsPanel";
import { LoadingStepper } from "@/components/LoadingStepper";
import { ErrorState } from "@/components/ErrorState";
import { ClinicalReportModal } from "@/components/ClinicalReportModal";
import { apiClient, ApiError } from "@/lib/api";
import {
  AnalysisResponse,
  AnalysisStage,
  CalibrationConfig,
  LayerVisibility,
  PresetSample,
} from "@/lib/types";
import { PRESET_SAMPLES, MOCK_XRAY_AP_SVG } from "@/lib/fixtures";

export default function SegmentationModulePage() {
  // State management
  const [selectedFile, setSelectedFile] = useState<File | { name: string; size: number; dataUrl?: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState<AnalysisStage>("idle");
  const [stageName, setStageName] = useState<string>("");
  const [stageDescription, setStageDescription] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | undefined>(undefined);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Calibration Config (0.25 mm/px standard for plain radiograph)
  const [calibration, setCalibration] = useState<CalibrationConfig>({
    pixelSpacingMm: 0.25,
    unit: "px",
  });

  // Layer Visibility
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    femur: true,
    tibia: true,
    meniscus: false,
    boundingBox: true,
    measurements: true,
  });

  // Filter preset samples for X-ray segmentation
  const xrayPresets = PRESET_SAMPLES.filter((s) => s.module === "segmentation");

  // Handle local file selection with 10MB strict limit
  const handleFileSelect = (file: File | { name: string; size: number; dataUrl?: string }) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setErrorMessage(null);
    setAnalysisStage("idle");

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (file.dataUrl) {
      setPreviewUrl(file.dataUrl);
    } else {
      setPreviewUrl(MOCK_XRAY_AP_SVG);
    }
  };

  // Handle research preset selection
  const handlePresetSelect = (preset: PresetSample) => {
    setSelectedFile({
      name: preset.name,
      size: 2800000,
      dataUrl: preset.imageUrl,
    });
    setPreviewUrl(preset.imageUrl);
    setAnalysisResult(null);
    setErrorMessage(null);
    setAnalysisStage("idle");
  };

  // Trigger analysis execution
  const executeAnalysis = async () => {
    if (!selectedFile) return;

    setAnalysisStage("preprocessing");
    setErrorMessage(null);
    setProgressPercent(20);
    setStageDescription("Executing CLAHE radiographic contrast standardization...");

    try {
      const result = await apiClient.analyzeKnee(
        selectedFile,
        (stage, description, percent) => {
          setAnalysisStage(stage);
          setStageName(stage.toUpperCase());
          setStageDescription(description);
          setProgressPercent(percent);
        }
      );

      setAnalysisResult(result);
      setAnalysisStage("complete");

      // Seamlessly sync active scan to Module 3 (Implant Matching)
      if (typeof window !== "undefined") {
        const spacing = calibration.pixelSpacingMm || 0.25;
        const femurMm = Number((result.femur_width_px * spacing).toFixed(1));
        const tibiaMm = Number((result.tibia_width_px * spacing).toFixed(1));
        sessionStorage.setItem(
          "knee_ai_active_scan",
          JSON.stringify({
            sourceModule: "Module 2 (Knee Bone Segmentation)",
            fileName: selectedFile.name,
            imageUrl: previewUrl || result.overlay_image_url || MOCK_XRAY_AP_SVG,
            femurMlMm: femurMm,
            tibiaMlMm: tibiaMm,
            varusValgusDeg: 2.1,
            pixelSpacingMm: spacing,
          })
        );
      }
    } catch (err: unknown) {
      setAnalysisStage("error");
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        setErrorStatus(err.statusCode);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during X-ray bone segmentation.");
      }
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    setAnalysisStage("idle");
    setProgressPercent(0);
  };

  const handleLayerChange = (key: keyof LayerVisibility, value: boolean) => {
    setLayerVisibility((prev) => ({ ...prev, [key]: value }));
  };

  const isAnalyzing = ["preprocessing", "inference", "postprocessing"].includes(analysisStage);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Research Hub</span>
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Module 2</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-600" />
            Knee X-Ray Bone Segmentation &amp; Morphometry
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {analysisResult && (
            <>
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-clinical hover:bg-clinical-hover rounded-md font-bold transition-all shadow-md"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Morphometry Report</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-surface-muted rounded-md border border-border transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Analysis</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload / Controls / Specs / Module 3 Nav */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Zone with Hard 10MB Limit */}
          <div className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5 text-clinical" />
                Radiograph Upload (Max 10 MB)
              </h2>
              <span className="text-[10px] font-mono text-slate-300">
                DICOM / PNG / JPEG
              </span>
            </div>

            <UploadZone
              module="segmentation"
              maxSizeBytes={10 * 1024 * 1024} // Hard 10MB limit
              maxSizeLabel="10 MB"
              presetSamples={xrayPresets}
              onFileSelect={handleFileSelect}
              onPresetSelect={handlePresetSelect}
              isLoading={isAnalyzing}
              selectedFileName={selectedFile ? selectedFile.name : undefined}
              selectedFileSize={
                selectedFile
                  ? selectedFile instanceof File
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : "2.8 MB"
                  : undefined
              }
              onReset={handleReset}
            />

            {/* Run Analysis Action Button */}
            {selectedFile && !analysisResult && !isAnalyzing && (
              <button
                type="button"
                onClick={executeAnalysis}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-clinical hover:bg-clinical-hover text-white text-xs font-bold transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Bone Segmentation &amp; Morphometry</span>
              </button>
            )}
          </div>

          {/* Colorblind-Safe Anatomical Layer Isolation (When results are ready) */}
          {analysisResult && (
            <LayerToggle
              module="segmentation"
              visibility={layerVisibility}
              onChange={handleLayerChange}
            />
          )}

          {/* Model Specification Card */}
          <ModelSpecCard module="segmentation" />

          {/* Module 3 Nav Card (Active) */}
          <div className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border p-4 shadow-2xs space-y-3 select-none hover:border-clinical-border transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Module 3: Implant Matching
                  </h4>
                  <span className="text-[10px] text-slate-300">
                    Pre-operative TKA templating
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Automated morphometric geometric contour mapping against commercial femoral/tibial
              implant sizing libraries.
            </p>
            <div className="pt-1">
              <Link
                href="/implant"
                className="w-full py-1.5 px-3 rounded bg-clinical text-white text-xs font-semibold hover:bg-clinical-hover transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Template Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Viewer / Stepper / Error / Measurements */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loading State: Multi-Stage Stepper (Distinct from Module 1) */}
          {isAnalyzing && (
            <LoadingStepper
              module="segmentation"
              stage={analysisStage}
              percent={progressPercent}
              stageName={stageName}
              description={stageDescription}
            />
          )}

          {/* Error State */}
          {analysisStage === "error" && errorMessage && (
            <ErrorState
              message={errorMessage}
              statusCode={errorStatus}
              onRetry={executeAnalysis}
              onReset={handleReset}
            />
          )}

          {/* Empty / Initial State */}
          {!analysisResult && !isAnalyzing && analysisStage !== "error" && (
            <div className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border p-8 text-center shadow-card space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-muted text-slate-400 flex items-center justify-center mx-auto border border-border">
                <Layers className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-sm font-bold text-white">
                  No Knee Radiograph Loaded
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Select a research case or upload an AP standing radiograph to extract femoral and tibial
                  cortical contours with calibrated width morphometrics.
                </p>
              </div>

              {previewUrl && (
                <div className="pt-4 border-t border-border">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                    Source Radiograph Preview:
                  </span>
                  <div className="max-w-xs mx-auto rounded border border-border overflow-hidden bg-black">
                    <img
                      src={previewUrl}
                      alt="Source knee X-ray radiograph preview"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Completed State: Segmentation Viewer & Calibrated Measurements */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Clinical Multi-Mode Segmentation Viewer */}
              <SegmentationViewer
                module="segmentation"
                originalImageUrl={previewUrl || MOCK_XRAY_AP_SVG}
                maskImageUrl={analysisResult.mask_image_url}
                overlayImageUrl={analysisResult.overlay_image_url}
                analysisData={analysisResult}
                layerVisibility={layerVisibility}
                onLayerChange={handleLayerChange}
              />

              {/* Calibrated Morphometric Measurements Panel (Femur width, Tibia width, Area, px/mm) */}
              <MeasurementsPanel
                module="segmentation"
                data={analysisResult}
                calibration={calibration}
                onCalibrationChange={setCalibration}
              />
            </div>
          )}
        </div>
      </div>

      {/* Clinical Report Modal */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        module="segmentation"
        fileName={selectedFile?.name || "Knee_AP_Radiograph.png"}
        originalImageUrl={previewUrl || MOCK_XRAY_AP_SVG}
        maskImageUrl={analysisResult?.mask_image_url}
        overlayImageUrl={analysisResult?.overlay_image_url}
        analysisData={analysisResult}
        calibration={calibration}
      />
    </div>
  );
}
