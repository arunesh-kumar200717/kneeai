/**
 * Knee AI — Type Definitions
 * Matches the backend API contract and provides strict clinical UI state types.
 */

export interface AnalysisResponse {
  status: "success" | "error";
  meniscus_detected: boolean;
  femur_detected: boolean;
  tibia_detected: boolean;
  bounding_area_pixels: number;
  femur_width_px: number;
  tibia_width_px: number;
  confidence: number; // e.g. 94.5 (percentage)
  mask_image_url: string;
  overlay_image_url: string;
  processing_time: number; // seconds, e.g. 1.4
  error_message?: string;
  // Optional detailed anatomical coordinates for vector overlays in advanced viewer
  metadata?: {
    pixel_spacing_mm?: number;
    original_resolution?: [number, number];
    joint_space_medial_px?: number;
    joint_space_lateral_px?: number;
  };
}

export type AnalysisStage =
  | "idle"
  | "preprocessing"
  | "inference"
  | "postprocessing"
  | "complete"
  | "error";

export interface ImplantAnalysisResponse {
  status: "success" | "error";
  femur_recommended_size: string;
  tibia_recommended_size: string;
  polyethylene_thickness_mm: number;
  confidence: number;
  mask_image_url: string;
  overlay_image_url: string;
  processing_time: number;
  error_message?: string;
  metadata?: {
    catalog_name: string;
    femur_ap_width_mm?: number;
    tibia_ml_width_mm?: number;
    implant_alignment_varus_deg?: number;
  };
}

export interface ProgressState {
  stage: AnalysisStage;
  stageName: string;
  description: string;
  percent: number;
  elapsedSeconds: number;
}

export type ViewerMode = "overlay" | "side-by-side" | "mask-only" | "original";

export interface LayerVisibility {
  femur: boolean;
  tibia: boolean;
  meniscus: boolean;
  implant?: boolean;
  boundingBox: boolean;
  measurements: boolean;
}

export interface CalibrationConfig {
  pixelSpacingMm: number; // e.g. 0.25 mm/px
  unit: "px" | "mm";
}

export interface PresetSample {
  id: string;
  name: string;
  description: string;
  module: "meniscus" | "segmentation" | "implant";
  imageUrl: string;
  fileSizeFormatted: string;
  dimensions: string;
  mockResult: AnalysisResponse | ImplantAnalysisResponse;
}

export interface ModelSpec {
  name: string;
  version: string;
  architecture: string;
  inputShape: string;
  outputFormat: string;
  lossFunction: string;
  dataset: string;
  diceScore: string;
  inferenceDevice: string;
}
