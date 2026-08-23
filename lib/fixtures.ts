import { AnalysisResponse, PresetSample, ImplantAnalysisResponse } from "./types";

/**
 * High-fidelity SVG Data URI generators for realistic medical imaging visualization
 * in mock mode without external dependencies or broken external image links.
 */

// 1. Realistic MRI Sagittal Knee slice (Grayscale with anatomical contours)
export const MOCK_MRI_SAGITTAL_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#080A0F;">
  <defs>
    <radialGradient id="femurCondyle" cx="45%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#4B5563" />
      <stop offset="60%" stop-color="#1F2937" />
      <stop offset="100%" stop-color="#0B0F19" />
    </radialGradient>
    <radialGradient id="tibiaPlateau" cx="50%" cy="75%" r="45%">
      <stop offset="0%" stop-color="#4B5563" />
      <stop offset="70%" stop-color="#1F2937" />
      <stop offset="100%" stop-color="#0B0F19" />
    </radialGradient>
    <filter id="noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0"/>
      <feComposite in2="SourceGraphic" in="gl" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
    </filter>
  </defs>

  <!-- Background tissue noise / subcutaneous fat layer -->
  <path d="M 60 40 Q 256 10 460 50 Q 490 256 460 460 Q 256 500 60 460 Q 20 256 60 40 Z" fill="#111827" opacity="0.6"/>
  <ellipse cx="256" cy="256" rx="210" ry="230" fill="#131B2E" opacity="0.4"/>

  <!-- Femoral Condyle (Sagittal profile) -->
  <path d="M 140 60 C 150 140 180 230 256 245 C 330 245 370 190 380 90 L 320 60 Z" fill="url(#femurCondyle)" stroke="#6B7280" stroke-width="1.5" opacity="0.9"/>
  <!-- Femoral Cortical bone rim -->
  <path d="M 150 70 C 160 140 190 230 256 240 C 320 240 360 190 370 100" fill="none" stroke="#9CA3AF" stroke-width="2" opacity="0.7"/>

  <!-- Tibial Plateau -->
  <path d="M 130 290 C 200 280 320 280 390 295 C 380 380 340 450 310 490 L 210 490 C 180 430 140 370 130 290 Z" fill="url(#tibiaPlateau)" stroke="#6B7280" stroke-width="1.5" opacity="0.9"/>
  <!-- Tibial Cortical bone rim -->
  <path d="M 135 292 C 200 282 320 282 385 297" fill="none" stroke="#9CA3AF" stroke-width="2" opacity="0.8"/>

  <!-- Patella & Patellar Tendon anterior -->
  <path d="M 390 120 C 430 150 430 200 400 230 C 380 220 370 170 380 130 Z" fill="#374151" stroke="#4B5563" stroke-width="1" opacity="0.75"/>
  <path d="M 395 230 C 400 260 395 285 385 305" fill="none" stroke="#6B7280" stroke-width="3" stroke-dasharray="2,2" opacity="0.5"/>

  <!-- Meniscus low-signal wedge (Anterior horn) -->
  <polygon points="345,260 375,268 348,276" fill="#030712" stroke="#374151" stroke-width="1"/>
  <!-- Meniscus low-signal wedge (Posterior horn - target region) -->
  <polygon points="175,260 215,268 178,278" fill="#030712" stroke="#374151" stroke-width="1"/>

  <!-- MRI Technical Grid / Scale Annotations -->
  <text x="16" y="24" fill="#6B7280" font-family="monospace" font-size="11">SAG T2 FSE | TE: 65 TR: 2800</text>
  <text x="16" y="40" fill="#6B7280" font-family="monospace" font-size="11">FOV: 160mm | SL: 3.0mm</text>
  <text x="440" y="24" fill="#6B7280" font-family="monospace" font-size="11">KNEE R</text>
  <text x="16" y="496" fill="#4B5563" font-family="monospace" font-size="10">RESEARCH USE ONLY</text>
</svg>
`)}`;

// 2. Meniscus Segmentation Mask Only (Teal #0D9488)
export const MOCK_MENISCUS_MASK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:transparent;">
  <!-- Posterior Horn Meniscal Mask (Teal #0D9488) -->
  <path d="M 172 258 C 190 260 212 265 218 270 C 210 274 190 278 174 279 C 168 273 166 264 172 258 Z" fill="#0D9488" fill-opacity="0.9" stroke="#14B8A6" stroke-width="2"/>
  <!-- Anterior Horn Meniscal Mask -->
  <path d="M 342 259 C 358 261 378 266 380 270 C 372 274 354 277 344 278 C 338 272 338 263 342 259 Z" fill="#0D9488" fill-opacity="0.9" stroke="#14B8A6" stroke-width="2"/>
</svg>
`)}`;

// 3. Meniscus Overlay (MRI + Mask + Bounding Box)
export const MOCK_MENISCUS_OVERLAY_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#080A0F;">
  <defs>
    <radialGradient id="femurCondyle2" cx="45%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#4B5563" />
      <stop offset="60%" stop-color="#1F2937" />
      <stop offset="100%" stop-color="#0B0F19" />
    </radialGradient>
    <radialGradient id="tibiaPlateau2" cx="50%" cy="75%" r="45%">
      <stop offset="0%" stop-color="#4B5563" />
      <stop offset="70%" stop-color="#1F2937" />
      <stop offset="100%" stop-color="#0B0F19" />
    </radialGradient>
  </defs>

  <!-- Background tissue -->
  <path d="M 60 40 Q 256 10 460 50 Q 490 256 460 460 Q 256 500 60 460 Q 20 256 60 40 Z" fill="#111827" opacity="0.6"/>
  <ellipse cx="256" cy="256" rx="210" ry="230" fill="#131B2E" opacity="0.4"/>

  <!-- Femur & Tibia Bones -->
  <path d="M 140 60 C 150 140 180 230 256 245 C 330 245 370 190 380 90 L 320 60 Z" fill="url(#femurCondyle2)" stroke="#6B7280" stroke-width="1.5" opacity="0.9"/>
  <path d="M 130 290 C 200 280 320 280 390 295 C 380 380 340 450 310 490 L 210 490 C 180 430 140 370 130 290 Z" fill="url(#tibiaPlateau2)" stroke="#6B7280" stroke-width="1.5" opacity="0.9"/>
  <path d="M 390 120 C 430 150 430 200 400 230 C 380 220 370 170 380 130 Z" fill="#374151" stroke="#4B5563" stroke-width="1" opacity="0.75"/>

  <!-- Predicted Meniscus Overlay: Posterior Horn (Colorblind Teal #0D9488) -->
  <path d="M 172 258 C 190 260 212 265 218 270 C 210 274 190 278 174 279 C 168 273 166 264 172 258 Z" fill="#0D9488" fill-opacity="0.65" stroke="#14B8A6" stroke-width="2"/>
  
  <!-- Predicted Meniscus Overlay: Anterior Horn -->
  <path d="M 342 259 C 358 261 378 266 380 270 C 372 274 354 277 344 278 C 338 272 338 263 342 259 Z" fill="#0D9488" fill-opacity="0.65" stroke="#14B8A6" stroke-width="2"/>

  <!-- Bounding Box Annotation for Posterior Horn Target -->
  <rect x="162" y="250" width="64" height="36" fill="none" stroke="#0F6E8C" stroke-width="1.5" stroke-dasharray="3,3"/>
  <rect x="162" y="234" width="76" height="15" fill="#0F6E8C" rx="2"/>
  <text x="165" y="245" fill="#FFFFFF" font-family="sans-serif" font-size="9" font-weight="600">POST HORN 94.5%</text>

  <!-- Technical overlays -->
  <text x="16" y="24" fill="#9CA3AF" font-family="monospace" font-size="11">SAG T2 FSE | 2D U-NET INFERENCE</text>
  <text x="16" y="496" fill="#0D9488" font-family="monospace" font-size="10">MASK AREA: 342 px² (85.5 mm²)</text>
</svg>
`)}`;

// 4. Realistic AP Knee Plain Radiograph X-ray (Distal Femur + Proximal Tibia)
export const MOCK_XRAY_AP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#0A0D14;">
  <defs>
    <linearGradient id="femurBone" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4B5563" />
      <stop offset="70%" stop-color="#9CA3AF" />
      <stop offset="95%" stop-color="#E5E7EB" />
      <stop offset="100%" stop-color="#F3F4F6" />
    </linearGradient>
    <linearGradient id="tibiaBone" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F3F4F6" />
      <stop offset="5%" stop-color="#E5E7EB" />
      <stop offset="30%" stop-color="#9CA3AF" />
      <stop offset="100%" stop-color="#4B5563" />
    </linearGradient>
  </defs>

  <!-- Soft tissue silhouette -->
  <path d="M 120 0 C 110 240 100 260 110 512 L 400 512 C 410 260 400 240 390 0 Z" fill="#1F2937" opacity="0.35"/>

  <!-- Distal Femur (Shaft down to Medial & Lateral Condyles) -->
  <path d="M 210 0 L 210 110 C 205 150 160 190 155 225 C 150 240 180 250 220 245 C 240 242 256 228 265 228 C 275 228 290 242 315 245 C 350 250 375 238 370 220 C 360 185 320 150 315 110 L 315 0 Z" fill="url(#femurBone)" stroke="#E5E7EB" stroke-width="1.5" opacity="0.85"/>

  <!-- Femoral Intercondylar notch & joint margin -->
  <path d="M 170 235 C 210 248 240 230 265 230 C 290 230 320 248 355 235" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.9"/>

  <!-- Patella faint overlay -->
  <ellipse cx="265" cy="180" rx="35" ry="42" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="1" opacity="0.25"/>

  <!-- Proximal Tibia (Plateau down to Shaft) -->
  <path d="M 160 265 C 190 260 240 264 256 254 C 270 264 320 260 355 265 C 365 285 340 330 320 380 L 320 512 L 210 512 L 210 380 C 190 330 155 285 160 265 Z" fill="url(#tibiaBone)" stroke="#E5E7EB" stroke-width="1.5" opacity="0.85"/>

  <!-- Tibial Intercondylar Eminence (Spines) -->
  <path d="M 245 260 L 252 248 L 258 260 L 268 250 L 273 260" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.9"/>

  <!-- Fibular Head (Lateral side) -->
  <path d="M 135 290 C 145 280 160 285 160 300 C 158 350 148 440 145 512 L 125 512 C 128 440 130 350 135 290 Z" fill="#9CA3AF" stroke="#6B7280" stroke-width="1" opacity="0.6"/>

  <!-- Radiographic Annotations -->
  <text x="20" y="30" fill="#9CA3AF" font-family="monospace" font-size="12">KNEE AP STANDING | 75kVp 12mAs</text>
  <text x="440" y="30" fill="#9CA3AF" font-family="sans-serif" font-weight="bold" font-size="16">R</text>
  <text x="20" y="495" fill="#6B7280" font-family="monospace" font-size="10">RESEARCH USE ONLY - DECISION SUPPORT</text>
</svg>
`)}`;

// 5. Knee Bone Segmentation Mask (Femur #0284C7 + Tibia #D97706)
export const MOCK_XRAY_BONE_MASK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:transparent;">
  <!-- Femur Segmentation Mask (Azure Blue #0284C7) -->
  <path id="femur-mask" d="M 210 0 L 210 110 C 205 150 160 190 155 225 C 150 240 180 250 220 245 C 240 242 256 228 265 228 C 275 228 290 242 315 245 C 350 250 375 238 370 220 C 360 185 320 150 315 110 L 315 0 Z" fill="#0284C7" fill-opacity="0.85" stroke="#38BDF8" stroke-width="2"/>

  <!-- Tibia Segmentation Mask (Amber Gold #D97706) -->
  <path id="tibia-mask" d="M 160 265 C 190 260 240 264 256 254 C 270 264 320 260 355 265 C 365 285 340 330 320 380 L 320 512 L 210 512 L 210 380 C 190 330 155 285 160 265 Z" fill="#D97706" fill-opacity="0.85" stroke="#FBBF24" stroke-width="2"/>
</svg>
`)}`;

// Dynamic Knee Bone Segmentation Overlay Generator
export function createDynamicXrayOverlaySvg(
  femurPx: number = 186,
  tibiaPx: number = 160,
  confidence: number = 96.2,
  timeSec: number = 1.2,
  spacing: number = 0.25
): string {
  const f_mm = (femurPx * spacing).toFixed(1);
  const t_mm = (tibiaPx * spacing).toFixed(1);

  const halfSpanF = Math.min(120, Math.max(60, Math.round(femurPx / 2)));
  const fx1 = 256 - halfSpanF;
  const fx2 = 256 + halfSpanF;

  const halfSpanT = Math.min(115, Math.max(55, Math.round(tibiaPx / 2)));
  const tx1 = 256 - halfSpanT;
  const tx2 = 256 + halfSpanT;

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#0A0D14;">
  <defs>
    <linearGradient id="femurBone2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4B5563" />
      <stop offset="70%" stop-color="#9CA3AF" />
      <stop offset="95%" stop-color="#E5E7EB" />
      <stop offset="100%" stop-color="#F3F4F6" />
    </linearGradient>
    <linearGradient id="tibiaBone2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F3F4F6" />
      <stop offset="5%" stop-color="#E5E7EB" />
      <stop offset="30%" stop-color="#9CA3AF" />
      <stop offset="100%" stop-color="#4B5563" />
    </linearGradient>
  </defs>

  <!-- Anatomical X-Ray Structure -->
  <path d="M 120 0 C 110 240 100 260 110 512 L 400 512 C 410 260 400 240 390 0 Z" fill="#1F2937" opacity="0.35"/>
  <path d="M 210 0 L 210 110 C 205 150 160 190 155 225 C 150 240 180 250 220 245 C 240 242 256 228 265 228 C 275 228 290 242 315 245 C 350 250 375 238 370 220 C 360 185 320 150 315 110 L 315 0 Z" fill="url(#femurBone2)" stroke="#E5E7EB" stroke-width="1.5" opacity="0.85"/>
  <path d="M 160 265 C 190 260 240 264 256 254 C 270 264 320 260 355 265 C 365 285 340 330 320 380 L 320 512 L 210 512 L 210 380 C 190 330 155 285 160 265 Z" fill="url(#tibiaBone2)" stroke="#E5E7EB" stroke-width="1.5" opacity="0.85"/>

  <!-- Femur Segmentation Overlay (Azure #0284C7) -->
  <path d="M 210 0 L 210 110 C 205 150 160 190 155 225 C 150 240 180 250 220 245 C 240 242 256 228 265 228 C 275 228 290 242 315 245 C 350 250 375 238 370 220 C 360 185 320 150 315 110 L 315 0 Z" fill="#0284C7" fill-opacity="0.45" stroke="#38BDF8" stroke-width="2"/>

  <!-- Tibia Segmentation Overlay (Amber #D97706) -->
  <path d="M 160 265 C 190 260 240 264 256 254 C 270 264 320 260 355 265 C 365 285 340 330 320 380 L 320 512 L 210 512 L 210 380 C 190 330 155 285 160 265 Z" fill="#D97706" fill-opacity="0.45" stroke="#FBBF24" stroke-width="2"/>

  <!-- Femur Width Caliper Line (${femurPx} px) -->
  <line x1="${fx1}" y1="230" x2="${fx2}" y2="230" stroke="#0284C7" stroke-width="2.5" stroke-dasharray="4,2"/>
  <circle cx="${fx1}" cy="230" r="4" fill="#38BDF8"/>
  <circle cx="${fx2}" cy="230" r="4" fill="#38BDF8"/>
  <rect x="196" y="206" width="120" height="20" fill="#0284C7" rx="4"/>
  <text x="256" y="220" fill="#FFFFFF" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle">Femur: ${femurPx} px (${f_mm} mm)</text>

  <!-- Tibia Width Caliper Line (${tibiaPx} px) -->
  <line x1="${tx1}" y1="270" x2="${tx2}" y2="270" stroke="#D97706" stroke-width="2.5" stroke-dasharray="4,2"/>
  <circle cx="${tx1}" cy="270" r="4" fill="#FBBF24"/>
  <circle cx="${tx2}" cy="270" r="4" fill="#FBBF24"/>
  <rect x="196" y="276" width="120" height="20" fill="#D97706" rx="4"/>
  <text x="256" y="290" fill="#FFFFFF" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle">Tibia: ${tibiaPx} px (${t_mm} mm)</text>

  <!-- Legend & Annotations -->
  <text x="20" y="30" fill="#E2E8F0" font-family="monospace" font-size="11">X-RAY SEGMENTATION | COLORBLIND-SAFE</text>
  <text x="20" y="495" fill="#94A3B8" font-family="monospace" font-size="10">CONFIDENCE: ${confidence}% | TIME: ${timeSec}s</text>
</svg>
`)}`;
}

// 6. Default Mock X-Ray Overlay
export const MOCK_XRAY_BONE_OVERLAY_SVG = createDynamicXrayOverlaySvg(186, 160, 96.2, 1.2);

// 7. Mock Implant Overlay (X-ray + TKA Template)
export const MOCK_IMPLANT_OVERLAY_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" style="background:#0A0D14;">
  <!-- Base X-ray structures -->
  <path d="M 120 0 C 110 240 100 260 110 512 L 400 512 C 410 260 400 240 390 0 Z" fill="#1F2937" opacity="0.35"/>
  <path d="M 210 0 L 210 110 C 205 150 160 190 155 225 C 150 240 180 250 220 245 C 240 242 256 228 265 228 C 275 228 290 242 315 245 C 350 250 375 238 370 220 C 360 185 320 150 315 110 L 315 0 Z" fill="#4B5563" stroke="#9CA3AF" stroke-width="1.5" opacity="0.75"/>
  <path d="M 160 265 C 190 260 240 264 256 254 C 270 264 320 260 355 265 C 365 285 340 330 320 380 L 320 512 L 210 512 L 210 380 C 190 330 155 285 160 265 Z" fill="#4B5563" stroke="#9CA3AF" stroke-width="1.5" opacity="0.75"/>

  <!-- TKA Femoral Component Template (Purple/Magenta highlight for metallic implant) -->
  <path d="M 165 240 C 185 245 230 235 265 235 C 300 235 345 245 360 235 C 350 200 320 180 300 170 C 280 160 250 160 230 170 C 210 180 175 200 165 240 Z" fill="#D946EF" fill-opacity="0.3" stroke="#F0ABFC" stroke-width="2.5"/>
  <rect x="235" y="150" width="12" height="25" fill="none" stroke="#F0ABFC" stroke-width="2"/>
  <rect x="285" y="150" width="12" height="25" fill="none" stroke="#F0ABFC" stroke-width="2"/>

  <!-- TKA Tibial Tray Template (Green highlight) -->
  <path d="M 170 260 L 350 260 L 335 275 L 185 275 Z" fill="#10B981" fill-opacity="0.3" stroke="#6EE7B7" stroke-width="2.5"/>
  <polygon points="250,275 270,275 265,340 255,340" fill="none" stroke="#6EE7B7" stroke-width="2"/>

  <!-- Annotation Labels -->
  <line x1="365" y1="210" x2="400" y2="190" stroke="#F0ABFC" stroke-width="1.5"/>
  <text x="405" y="185" fill="#F0ABFC" font-family="sans-serif" font-size="10" font-weight="bold">FEMUR SIZE 4</text>

  <line x1="355" y1="270" x2="400" y2="290" stroke="#6EE7B7" stroke-width="1.5"/>
  <text x="405" y="295" fill="#6EE7B7" font-family="sans-serif" font-size="10" font-weight="bold">TIBIA SIZE 3</text>

  <!-- Alignment Axis -->
  <line x1="260" y1="50" x2="260" y2="450" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="6,4"/>
</svg>
`)}`;

/**
 * Standard mock responses adhering strictly to the JSON schema
 */
export const MOCK_MENISCUS_RESPONSE: AnalysisResponse = {
  status: "success",
  meniscus_detected: true,
  femur_detected: true,
  tibia_detected: true,
  bounding_area_pixels: 342,
  femur_width_px: 182,
  tibia_width_px: 156,
  confidence: 94.5,
  mask_image_url: MOCK_MENISCUS_MASK_SVG,
  overlay_image_url: MOCK_MENISCUS_OVERLAY_SVG,
  processing_time: 1.4,
  metadata: {
    pixel_spacing_mm: 0.25,
    original_resolution: [512, 512],
    joint_space_medial_px: 18,
    joint_space_lateral_px: 22,
  },
};

export const MOCK_KNEE_XRAY_RESPONSE: AnalysisResponse = {
  status: "success",
  meniscus_detected: false,
  femur_detected: true,
  tibia_detected: true,
  bounding_area_pixels: 342,
  femur_width_px: 186,
  tibia_width_px: 160,
  confidence: 96.2,
  mask_image_url: MOCK_XRAY_BONE_MASK_SVG,
  overlay_image_url: createDynamicXrayOverlaySvg(186, 160, 96.2, 1.2),
  processing_time: 1.2,
  metadata: {
    pixel_spacing_mm: 0.25,
    original_resolution: [512, 512],
    joint_space_medial_px: 18,
    joint_space_lateral_px: 22,
  },
};

export const MOCK_IMPLANT_RESPONSE: ImplantAnalysisResponse = {
  status: "success",
  femur_recommended_size: "Size 4 (Standard)",
  tibia_recommended_size: "Size 3 (Standard)",
  polyethylene_thickness_mm: 10,
  confidence: 96.2,
  mask_image_url: MOCK_IMPLANT_OVERLAY_SVG,
  overlay_image_url: MOCK_IMPLANT_OVERLAY_SVG,
  processing_time: 1.8,
  metadata: {
    catalog_name: "Generic TKA System",
    femur_ap_width_mm: 64.5,
    tibia_ml_width_mm: 72.1,
    implant_alignment_varus_deg: 2.1,
  },
};

/**
 * Research Sample Presets for instant clinical evaluation
 */
export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "mri-sample-01",
    name: "Sagittal T2 MRI — Normal Medial Meniscus",
    description: "Sagittal Fast Spin-Echo slice through medial compartment with intact triangular low-signal horn.",
    module: "meniscus",
    imageUrl: MOCK_MRI_SAGITTAL_SVG,
    fileSizeFormatted: "1.2 MB",
    dimensions: "512 × 512",
    mockResult: MOCK_MENISCUS_RESPONSE,
  },
  {
    id: "mri-sample-02",
    name: "Sagittal T2 MRI — Meniscal Extrusion / OA Grade 2",
    description: "Medial meniscus posterior horn with degenerative signal and minor radial extrusion.",
    module: "meniscus",
    imageUrl: MOCK_MRI_SAGITTAL_SVG,
    fileSizeFormatted: "1.4 MB",
    dimensions: "512 × 512",
    mockResult: {
      ...MOCK_MENISCUS_RESPONSE,
      confidence: 91.8,
      bounding_area_pixels: 388,
      processing_time: 1.52,
    },
  },
  {
    id: "xray-sample-01",
    name: "AP Weight-Bearing Knee Radiograph — Standard Normal",
    description: "Standard calibrated AP radiograph with preserved medial/lateral joint space width and normal 2.1° alignment.",
    module: "segmentation",
    imageUrl: MOCK_XRAY_AP_SVG,
    fileSizeFormatted: "2.8 MB",
    dimensions: "512 × 512",
    mockResult: {
      ...MOCK_KNEE_XRAY_RESPONSE,
      femur_width_px: 182,
      tibia_width_px: 156,
      bounding_area_pixels: 342,
      confidence: 96.8,
      processing_time: 1.15,
      overlay_image_url: createDynamicXrayOverlaySvg(182, 156, 96.8, 1.15),
      metadata: {
        pixel_spacing_mm: 0.25,
        femur_ap_width_mm: 45.5,
        tibia_ml_width_mm: 39.0,
        implant_alignment_varus_deg: 2.1,
        joint_space_medial_px: 18,
        joint_space_lateral_px: 22,
        original_resolution: [512, 512],
      }
    },
  },
  {
    id: "xray-sample-02",
    name: "AP Weight-Bearing Knee Radiograph — Medial OA (Grade 3)",
    description: "Moderate medial compartment joint space narrowing with subchondral sclerosis and condylar widening.",
    module: "segmentation",
    imageUrl: MOCK_XRAY_AP_SVG,
    fileSizeFormatted: "3.1 MB",
    dimensions: "512 × 512",
    mockResult: {
      ...MOCK_KNEE_XRAY_RESPONSE,
      femur_width_px: 196,
      tibia_width_px: 168,
      bounding_area_pixels: 390,
      confidence: 95.4,
      processing_time: 1.35,
      overlay_image_url: createDynamicXrayOverlaySvg(196, 168, 95.4, 1.35),
      metadata: {
        pixel_spacing_mm: 0.25,
        femur_ap_width_mm: 49.0,
        tibia_ml_width_mm: 42.0,
        implant_alignment_varus_deg: 6.4,
        joint_space_medial_px: 10,
        joint_space_lateral_px: 24,
        original_resolution: [512, 512],
      }
    },
  },
  {
    id: "xray-sample-03",
    name: "AP Weight-Bearing Knee Radiograph — Severe Varus Collapse",
    description: "Severe medial bone-on-bone contact with significant osteophytic spurring and 8.5° varus deformity.",
    module: "segmentation",
    imageUrl: MOCK_XRAY_AP_SVG,
    fileSizeFormatted: "3.4 MB",
    dimensions: "512 × 512",
    mockResult: {
      ...MOCK_KNEE_XRAY_RESPONSE,
      femur_width_px: 212,
      tibia_width_px: 178,
      bounding_area_pixels: 435,
      confidence: 97.1,
      processing_time: 1.45,
      overlay_image_url: createDynamicXrayOverlaySvg(212, 178, 97.1, 1.45),
      metadata: {
        pixel_spacing_mm: 0.25,
        femur_ap_width_mm: 53.0,
        tibia_ml_width_mm: 44.5,
        implant_alignment_varus_deg: 8.5,
        joint_space_medial_px: 4,
        joint_space_lateral_px: 26,
        original_resolution: [512, 512],
      }
    },
  },
  {
    id: "xray-sample-04",
    name: "AP Weight-Bearing Knee Radiograph — Valgus Deformity",
    description: "Lateral compartment joint space loss with valgus coronal tilt and reduced medial condylar stress.",
    module: "segmentation",
    imageUrl: MOCK_XRAY_AP_SVG,
    fileSizeFormatted: "2.9 MB",
    dimensions: "512 × 512",
    mockResult: {
      ...MOCK_KNEE_XRAY_RESPONSE,
      femur_width_px: 174,
      tibia_width_px: 148,
      bounding_area_pixels: 305,
      confidence: 94.8,
      processing_time: 1.25,
      overlay_image_url: createDynamicXrayOverlaySvg(174, 148, 94.8, 1.25),
      metadata: {
        pixel_spacing_mm: 0.25,
        femur_ap_width_mm: 43.5,
        tibia_ml_width_mm: 37.0,
        implant_alignment_varus_deg: -5.2,
        joint_space_medial_px: 24,
        joint_space_lateral_px: 8,
        original_resolution: [512, 512],
      }
    },
  },
  {
    id: "implant-sample-01",
    name: "TKA Templating — Standard AP Knee",
    description: "Automated implant matching and sizing overlay for standard total knee arthroplasty.",
    module: "implant",
    imageUrl: MOCK_XRAY_AP_SVG,
    fileSizeFormatted: "2.8 MB",
    dimensions: "512 × 512",
    mockResult: MOCK_IMPLANT_RESPONSE,
  },
  {
    id: "implant-sample-02",
    name: "TKA Templating — Severe Varus Deformity",
    description: "Complex implant sizing for a knee with severe medial joint collapse and varus angulation.",
    module: "implant",
    imageUrl: MOCK_XRAY_AP_SVG,
    fileSizeFormatted: "3.2 MB",
    dimensions: "1024 × 1024",
    mockResult: {
      ...MOCK_IMPLANT_RESPONSE,
      femur_recommended_size: "Size 6 (Large)",
      tibia_recommended_size: "Size 5 (Medium-Large)",
      polyethylene_thickness_mm: 14,
      metadata: {
        catalog_name: "Stryker Triathlon System",
        femur_ap_width_mm: 72.1,
        tibia_ml_width_mm: 78.4,
        implant_alignment_varus_deg: 8.5,
      }
    }
  },
  {
    id: "implant-sample-03",
    name: "TKA Templating — Valgus Deformity",
    description: "Implant matching for lateral compartment OA with valgus deformity requiring a constrained insert.",
    module: "implant",
    imageUrl: MOCK_XRAY_AP_SVG,
    fileSizeFormatted: "2.9 MB",
    dimensions: "512 × 512",
    mockResult: {
      ...MOCK_IMPLANT_RESPONSE,
      femur_recommended_size: "Size 3 (Small)",
      tibia_recommended_size: "Size 3 (Small)",
      polyethylene_thickness_mm: 12,
      metadata: {
        catalog_name: "Zimmer Persona",
        femur_ap_width_mm: 58.2,
        tibia_ml_width_mm: 64.0,
        implant_alignment_varus_deg: -5.2,
      }
    }
  },
  {
    id: "implant-sample-04",
    name: "UKA Templating — Medial Unicompartmental",
    description: "Templating for partial (unicompartmental) knee arthroplasty focusing only on the medial condyle.",
    module: "implant",
    imageUrl: MOCK_XRAY_AP_SVG,
    fileSizeFormatted: "1.9 MB",
    dimensions: "512 × 512",
    mockResult: {
      ...MOCK_IMPLANT_RESPONSE,
      femur_recommended_size: "Size 2 (UKA)",
      tibia_recommended_size: "Size 2 (UKA)",
      polyethylene_thickness_mm: 8,
      metadata: {
        catalog_name: "Oxford Partial Knee",
        femur_ap_width_mm: 42.1,
        tibia_ml_width_mm: 45.3,
        implant_alignment_varus_deg: 3.1,
      }
    }
  },
];
