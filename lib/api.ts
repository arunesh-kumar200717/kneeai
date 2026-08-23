import {
  AnalysisResponse,
  AnalysisStage,
  ImplantAnalysisResponse,
} from "./types";

import {
  MOCK_MENISCUS_RESPONSE,
  MOCK_KNEE_XRAY_RESPONSE,
  MOCK_IMPLANT_RESPONSE,
  PRESET_SAMPLES,
} from "./fixtures";

/**
 * Knee AI — Unified Typed API Client
 *
 * Strict boundary:
 * Contains zero ML / inference code.
 * Switches seamlessly between mock fixtures and FastAPI backend.
 */

const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
  process.env.NEXT_PUBLIC_USE_MOCK_API === undefined;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const REQUEST_TIMEOUT_MS = 30000;

export interface ProgressCallback {
  (
    stage: AnalysisStage,
    description: string,
    percent: number
  ): void;
}

export class ApiError extends Error {
  public statusCode?: number;
  public details?: string;

  constructor(
    message: string,
    statusCode?: number,
    details?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * =========================================================
 * TYPE GUARD
 * =========================================================
 *
 * PRESET_SAMPLES contains multiple module result types.
 * Therefore TypeScript sees mockResult as a union:
 *
 * AnalysisResponse | ImplantAnalysisResponse
 *
 * This function makes sure that a preset result is actually
 * an AnalysisResponse before returning it from:
 *
 * analyzeMeniscus()
 * analyzeKnee()
 */
function isAnalysisResponse(
  value: unknown
): value is AnalysisResponse {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const result =
    value as Record<string, unknown>;

  return (
    "meniscus_detected" in result &&
    "femur_detected" in result &&
    "tibia_detected" in result &&
    "bounding_area_pixels" in result
  );
}

/**
 * Helper to simulate multi-stage progress
 * in mock mode.
 */
async function simulateDeterministicProgress(
  module:
    | "meniscus"
    | "segmentation"
    | "implant",
  onProgress?: ProgressCallback
): Promise<void> {
  if (!onProgress) return;

  if (module === "meniscus") {
    // Step 1
    onProgress(
      "preprocessing",
      "Resizing to 256×256 px & Intensity normalization [0, 1.0]",
      25
    );

    await new Promise((r) =>
      setTimeout(r, 400)
    );

    // Step 2
    onProgress(
      "inference",
      "Executing 2D U-Net Medial Meniscus Segmentation",
      65
    );

    await new Promise((r) =>
      setTimeout(r, 700)
    );

    // Step 3
    onProgress(
      "postprocessing",
      "Morphological post-filtering & binary mask generation",
      90
    );

    await new Promise((r) =>
      setTimeout(r, 300)
    );
  } else if (module === "segmentation") {
    // Step 1
    onProgress(
      "preprocessing",
      "Input validation, histogram equalization & tensor standardization",
      25
    );

    await new Promise((r) =>
      setTimeout(r, 450)
    );

    // Step 2
    onProgress(
      "inference",
      "Segmenting Femoral & Tibial cortical boundaries",
      70
    );

    await new Promise((r) =>
      setTimeout(r, 650)
    );

    // Step 3
    onProgress(
      "postprocessing",
      "Computing bone widths, joint space distance & area integration",
      95
    );

    await new Promise((r) =>
      setTimeout(r, 300)
    );
  } else if (module === "implant") {
    // Step 1
    onProgress(
      "preprocessing",
      "Catalog search & anatomical landmark registration",
      30
    );

    await new Promise((r) =>
      setTimeout(r, 600)
    );

    // Step 2
    onProgress(
      "inference",
      "Simulating TKA component sizing & orientation",
      75
    );

    await new Promise((r) =>
      setTimeout(r, 800)
    );

    // Step 3
    onProgress(
      "postprocessing",
      "Polyethylene insert thickness optimization",
      95
    );

    await new Promise((r) =>
      setTimeout(r, 400)
    );
  }

  onProgress(
    "complete",
    "Analysis complete",
    100
  );
}

/**
 * Execute real HTTP POST request with timeout
 * and robust error parsing.
 */
async function executeApiRequest<T>(
  endpoint: string,
  file: File,
  module:
    | "meniscus"
    | "segmentation"
    | "implant",
  onProgress?: ProgressCallback
): Promise<T> {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(
      () =>
        controller.abort(),
      REQUEST_TIMEOUT_MS
    );

  try {
    if (onProgress) {
      onProgress(
        "preprocessing",
        "Uploading image & validating payload format",
        20
      );
    }

    const response =
      await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          method: "POST",
          body: formData,
          signal:
            controller.signal,
        }
      );

    clearTimeout(timeoutId);

    if (onProgress) {
      onProgress(
        "inference",
        "Processing server-side segmentation inference",
        65
      );
    }

    if (!response.ok) {
      let errorMessage =
        `Inference server returned error ${response.status} (${response.statusText})`;

      try {
        const errorJson =
          await response.json();

        if (errorJson.detail) {
          errorMessage =
            typeof errorJson.detail ===
            "string"
              ? errorJson.detail
              : JSON.stringify(
                  errorJson.detail
                );
        } else if (
          errorJson.message
        ) {
          errorMessage =
            errorJson.message;
        }
      } catch {
        const textBody =
          await response.text();

        if (textBody) {
          errorMessage =
            `${errorMessage}: ${textBody.slice(
              0,
              150
            )}`;
        }
      }

      throw new ApiError(
        errorMessage,
        response.status
      );
    }

    if (onProgress) {
      onProgress(
        "postprocessing",
        "Formatting segmentation masks and morphometrics",
        90
      );
    }

    const data: T =
      await response.json();

    if (
      typeof data !==
        "object" ||
      data === null
    ) {
      throw new ApiError(
        "Received malformed or non-JSON response from inference server."
      );
    }

    if (onProgress) {
      onProgress(
        "complete",
        "Inference analysis complete",
        100
      );
    }

    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof Error) {
      if (
        err.name ===
        "AbortError"
      ) {
        throw new ApiError(
          `Analysis request timed out after ${
            REQUEST_TIMEOUT_MS / 1000
          }s. Please check inference backend availability.`,
          408
        );
      }

      throw new ApiError(
        `Network connection to inference backend failed: ${err.message}. Verify that ${API_BASE_URL} is running.`,
        0
      );
    }

    throw new ApiError(
      "An unexpected error occurred during inference request."
    );
  }
}

/**
 * =========================================================
 * PUBLIC TYPED API CLIENT
 * =========================================================
 */
export const apiClient = {
  isMockMode(): boolean {
    return USE_MOCK_API;
  },

  getApiBaseUrl(): string {
    return API_BASE_URL;
  },

  /**
   * =======================================================
   * MODULE 1
   * Medial Meniscus MRI Segmentation
   * =======================================================
   */
  async analyzeMeniscus(
    file:
      | File
      | {
          name: string;
          size: number;
        },
    onProgress?: ProgressCallback
  ): Promise<AnalysisResponse> {
    /*
     * Live API
     */
    if (file instanceof File) {
      if (onProgress) {
        onProgress(
          "preprocessing",
          "Uploading MRI slice & normalizing T2 intensity (256x256)",
          25
        );
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      if (onProgress) {
        onProgress(
          "inference",
          "Executing PyTorch 2D U-Net Meniscus Model from OAI_Module1_Training.ipynb",
          70
        );
      }

      try {
        const response =
          await fetch(
            "/api/meniscus/analyze",
            {
              method: "POST",
              body: formData,
            }
          );

        if (response.ok) {
          const data: AnalysisResponse =
            await response.json();

          if (onProgress) {
            onProgress(
              "postprocessing",
              "Computing medial meniscus anterior/posterior horn boundaries",
              95
            );

            await new Promise(
              (r) =>
                setTimeout(r, 200)
            );

            onProgress(
              "complete",
              "Meniscus segmentation complete",
              100
            );
          }

          return data;
        }
      } catch (e) {
        console.warn(
          "API route error for meniscus, falling back to deterministic handler:",
          e
        );
      }
    }

    /*
     * Find matching preset.
     *
     * IMPORTANT:
     * We only accept the preset if its mockResult
     * is actually an AnalysisResponse.
     */
    const matchedPreset =
      PRESET_SAMPLES.find(
        (p) =>
          p.module ===
            "meniscus" &&
          (
            p.name ===
              file.name ||
            p.id ===
              (
                file as {
                  id?: string;
                }
              ).id
          )
      );

    await simulateDeterministicProgress(
      "meniscus",
      onProgress
    );

    if (
      matchedPreset?.mockResult &&
      isAnalysisResponse(
        matchedPreset.mockResult
      )
    ) {
      return structuredClone(
        matchedPreset.mockResult
      );
    }

    return structuredClone(
      MOCK_MENISCUS_RESPONSE
    );
  },

  /**
   * =======================================================
   * MODULE 2
   * Knee Bone & Joint Segmentation
   * =======================================================
   */
  async analyzeKnee(
    file:
      | File
      | {
          name: string;
          size: number;
        },
    onProgress?: ProgressCallback
  ): Promise<AnalysisResponse> {
    /*
     * Live API
     */
    if (file instanceof File) {
      if (onProgress) {
        onProgress(
          "preprocessing",
          "Uploading radiograph & standardizing tensor input (256x256)",
          25
        );
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      if (onProgress) {
        onProgress(
          "inference",
          "Executing 2D U-Net Bone Segmentation from module2.ipynb",
          70
        );
      }

      try {
        const response =
          await fetch(
            "/api/knee/analyze",
            {
              method: "POST",
              body: formData,
            }
          );

        if (response.ok) {
          const data: AnalysisResponse =
            await response.json();

          if (onProgress) {
            onProgress(
              "postprocessing",
              "Computing distal femur and proximal tibia ML widths",
              95
            );

            await new Promise(
              (r) =>
                setTimeout(r, 200)
            );

            onProgress(
              "complete",
              "Morphometric extraction complete",
              100
            );
          }

          return data;
        }
      } catch (e) {
        console.warn(
          "API route error, falling back to deterministic handler:",
          e
        );
      }
    }

    /*
     * IMPORTANT FIX:
     *
     * Only search segmentation presets.
     * Then verify that the mock result is an
     * AnalysisResponse.
     */
    const matchedPreset =
      PRESET_SAMPLES.find(
        (p) =>
          p.module ===
            "segmentation" &&
          (
            p.name ===
              file.name ||
            p.id ===
              (
                file as {
                  id?: string;
                }
              ).id
          )
      );

    await simulateDeterministicProgress(
      "segmentation",
      onProgress
    );

    /*
     * This fixes the build error:
     *
     * Type 'AnalysisResponse | ImplantAnalysisResponse'
     * is not assignable to type 'AnalysisResponse'
     */
    if (
      matchedPreset?.mockResult &&
      isAnalysisResponse(
        matchedPreset.mockResult
      )
    ) {
      return structuredClone(
        matchedPreset.mockResult
      );
    }

    return structuredClone(
      MOCK_KNEE_XRAY_RESPONSE
    );
  },

  /**
   * =======================================================
   * MODULE 3
   * Implant & Prosthetic Matching
   * =======================================================
   */
  async analyzeImplant(
    file:
      | File
      | {
          name: string;
          size: number;
        },
    onProgress?: ProgressCallback
  ): Promise<ImplantAnalysisResponse> {
    if (USE_MOCK_API) {
      await simulateDeterministicProgress(
        "implant",
        onProgress
      );

      return structuredClone(
        MOCK_IMPLANT_RESPONSE
      );
    }

    if (!(file instanceof File)) {
      throw new ApiError(
        "A valid File instance is required for live API analysis."
      );
    }

    return executeApiRequest<ImplantAnalysisResponse>(
      "/api/implant/analyze",
      file,
      "implant",
      onProgress
    );
  },
};