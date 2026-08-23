"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Disc,
  ArrowLeft,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Info,
  FileText,
} from "lucide-react";
import { UploadZone } from "@/components/UploadZone";
import { PreprocessingSteps } from "@/components/PreprocessingSteps";
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
import { PRESET_SAMPLES, MOCK_MRI_SAGITTAL_SVG } from "@/lib/fixtures";

export default function MeniscusModulePage() {
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

  // Calibration and Layer Visibility
  const [calibration, setCalibration] = useState<CalibrationConfig>({
    pixelSpacingMm: 0.25,
    unit: "px",
  });

  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>({
    femur: false,
    tibia: false,
    meniscus: true,
    boundingBox: true,
    measurements: true,
  });

  // Filter preset samples for meniscus
  const meniscusPresets = PRESET_SAMPLES.filter((s) => s.module === "meniscus");

  // Handle local file selection
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
      setPreviewUrl(MOCK_MRI_SAGITTAL_SVG);
    }
  };

  // Handle research preset click
  const handlePresetSelect = (preset: PresetSample) => {
    setSelectedFile({
      name: preset.name,
      size: 1420000,
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
    setProgressPercent(15);
    setStageDescription("Initializing preprocessing pipeline...");

    try {
      const result = await apiClient.analyzeMeniscus(
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
    } catch (err: unknown) {
      setAnalysisStage("error");
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        setErrorStatus(err.statusCode);
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during MRI analysis.");
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
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Research Hub</span>
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Module 1</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Disc className="w-6 h-6 text-teal-600" />
            Medial Meniscus MRI Segmentation (2D U-Net)
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
                <span>Generate Clinical Report</span>
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

      {/* Visual Preprocessing Steps Pipeline (Always explicit & visible) */}
      <PreprocessingSteps currentStage={analysisStage} />

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload / Controls / Specs */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Zone */}
          <div className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border p-4 sm:p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <FileImage className="w-3.5 h-3.5 text-clinical" />
                Input Imaging Source
              </h2>
              <span className="text-[10px] font-mono text-slate-300">
                DICOM / PNG / JPEG
              </span>
            </div>

            <UploadZone
              module="meniscus"
              presetSamples={meniscusPresets}
              onFileSelect={handleFileSelect}
              onPresetSelect={handlePresetSelect}
              isLoading={isAnalyzing}
              selectedFileName={selectedFile ? selectedFile.name : undefined}
              selectedFileSize={
                selectedFile
                  ? selectedFile instanceof File
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                    : "1.4 MB"
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
                <span>Execute Meniscus Segmentation Pipeline</span>
              </button>
            )}
          </div>

          {/* Model Specification Card (Spec sheet layout) */}
          <ModelSpecCard module="meniscus" />

          {/* Anatomical Layer Isolation (When results are ready) */}
          {analysisResult && (
            <LayerToggle
              module="meniscus"
              visibility={layerVisibility}
              onChange={handleLayerChange}
            />
          )}
        </div>

        {/* Right Column: Viewer / Stepper / Error / Measurements */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loading State: Multi-Stage Stepper (Never a bare spinner) */}
          {isAnalyzing && (
            <LoadingStepper
              module="meniscus"
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

          {/* Empty / Initial State (Before analysis or file selection) */}
          {!analysisResult && !isAnalyzing && analysisStage !== "error" && (
            <div className="bg-black/75 backdrop-blur-md !text-slate-100 border-white/10 rounded-lg border border-border p-8 text-center shadow-card space-y-4">
              <div className="w-16 h-16 rounded-full bg-surface-muted text-slate-400 flex items-center justify-center mx-auto border border-border">
                <Disc className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-sm font-bold text-white">
                  No MRI Slice Loaded for Inference
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Select a research preset on the left or upload a patient Sagittal T2 MRI slice to begin
                  automated 2D U-Net medial meniscus segmentation.
                </p>
              </div>

              {previewUrl && (
                <div className="pt-4 border-t border-border">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                    Source Slice Preview:
                  </span>
                  <div className="max-w-xs mx-auto rounded border border-border overflow-hidden bg-black">
                    <img
                      src={previewUrl}
                      alt="Source MRI slice preview"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Completed State: Segmentation Viewer & Quantitative Panel */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Clinical Multi-Mode Segmentation Viewer */}
              <SegmentationViewer
                module="meniscus"
                originalImageUrl={previewUrl || MOCK_MRI_SAGITTAL_SVG}
                maskImageUrl={analysisResult.mask_image_url}
                overlayImageUrl={analysisResult.overlay_image_url}
                analysisData={analysisResult}
                layerVisibility={layerVisibility}
                onLayerChange={handleLayerChange}
              />

              {/* Quantitative Measurements Panel */}
              <MeasurementsPanel
                module="meniscus"
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
        module="meniscus"
        fileName={selectedFile?.name || "Sagittal_T2_MRI.png"}
        originalImageUrl={previewUrl || MOCK_MRI_SAGITTAL_SVG}
        maskImageUrl={analysisResult?.mask_image_url}
        overlayImageUrl={analysisResult?.overlay_image_url}
        analysisData={analysisResult}
        calibration={calibration}
      />
    </div>
  );
}
