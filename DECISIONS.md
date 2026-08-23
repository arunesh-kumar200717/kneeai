# Knee AI — Clinical & Architectural Decisions (DECISIONS.md)

This document records the clinical rationale, technical trade-offs, and design system decisions established during the development of **Knee AI**.

---

## 1. Zero ML on Frontend (Architectural Boundary)
- **Decision:** The frontend is strictly an imaging and decision-support interface. No TensorFlow, PyTorch, ONNX, or model weights are bundled or executed client-side.
- **Rationale:** Medical imaging segmentation requires verified server-side GPU execution, reproducible floating-point inference, DICOM metadata compliance, and tight privacy boundaries. The frontend interacts strictly with typed REST endpoints (`/api/meniscus/analyze` and `/api/knee/analyze`).

---

## 2. API Contract & Mock Fixture Architecture
- **Contract Schema:**
  ```json
  {
    "status": "success",
    "meniscus_detected": true,
    "femur_detected": true,
    "tibia_detected": true,
    "bounding_area_pixels": 342,
    "femur_width_px": 182,
    "tibia_width_px": 156,
    "confidence": 94.5,
    "mask_image_url": "...",
    "overlay_image_url": "...",
    "processing_time": 1.4
  }
  ```
- **Unified Client (`lib/api.ts`):** All UI components call `apiClient.analyzeMeniscus()` or `apiClient.analyzeKnee()`. Switching between `NEXT_PUBLIC_USE_MOCK_API=true` and `NEXT_PUBLIC_API_URL=http://localhost:8000` is transparent to the UI layer.
- **Mock Simulation Behavior:** In mock mode, a realistic deterministic 3-stage progress sequence is executed:
  1. *Preprocessing & Resampling* (~350ms)
  2. *Model Inference Execution* (~750ms)
  3. *Postprocessing & Morphometric Extraction* (~300ms)
  Generating high-fidelity medical SVG/Canvas overlays representing true anatomical knee structures.

---

## 3. Colorblind-Safe Anatomical Segmentation Palette
- **Problem:** Conventional red/green segmentation masks cause severe readability failure in individuals with deuteranopia or protanopia (~8% of male clinicians).
- **Clinical Palette Selection:**
  - **Femur Layer:** `#0284C7` (Sky / Azure Blue) — high contrast against both bone density and black background.
  - **Tibia Layer:** `#D97706` (Amber / Ochre Gold) — distinctly separated from blue across all forms of color deficiency.
  - **Medial Meniscus:** `#0D9488` (Teal / Medical Cyan) — sharp contrast in Sagittal T2 MRI slices.
- **Verification:** Layer colors pass WCAG AA contrast against dark imaging canvases and provide distinct luminance channels.

---

## 4. Morphometric Calibration & Units
- **Default Resolution & Pixel Spacing:**
  - Standard knee radiograph calibration defaults to **0.25 mm/pixel** (typical for digital plain radiography with 100 µm–250 µm detector pitch).
  - Users can adjust this calibration factor dynamically in the Morphometrics Panel or toggle between Raw Pixels (`px`, `px²`) and Metric units (`mm`, `mm²`).
- **Tabular Numerics:** All clinical metrics use the `tabular-nums` CSS font feature to eliminate layout shift during recalculation and ensure aligned reading columns.

---

## 5. Non-Negotiable Safety & Clinical Tone
- **Persistent Header Banner:** Displayed across all routes:
  > *"This application is for research and educational decision-support purposes only and does not provide a medical diagnosis."*
- **Copy Restrictions:** Clinical predictions are systematically framed with qualifiers ("predicted", "estimated", "confidence interval", "research use only"). Absolutist diagnostic statements ("diagnosed with", "confirmed OA") are strictly forbidden.

---

## 6. Upload Validation & DICOM Handling
- **Module 1 (Meniscus MRI):** Accepts PNG, JPEG, JPG, and `.dcm` (DICOM).
- **Module 2 (X-Ray Segmentation):** Strict 10MB file size limit with real-time error banner preventing oversized payloads.
- **Research Presets:** Built-in sample cases (Normal Sagittal MRI, Degenerative Meniscal Tear MRI, Standard AP Knee Radiograph, Moderate Osteoarthritis Radiograph) allow immediate clinical workflow verification without requiring local DICOM files.
