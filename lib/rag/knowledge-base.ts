/**
 * Comprehensive Clinical Surgical Knowledge Base for RAG Retrieval
 * Contains indexed document chunks from manufacturer surgical technique guides
 * (Stryker Triathlon, Zimmer Persona, DePuy Attune, Zimmer NexGen, Oxford UKA)
 * and AAOS Orthopedic Practice Guidelines.
 */

export interface DocumentChunk {
  id: string;
  catalog: string;
  documentTitle: string;
  section: string;
  pageNumber: number;
  content: string;
  tags: string[];
  femurApRangeMm?: [number, number];
  tibiaMlRangeMm?: [number, number];
  recommendedSize?: {
    femur: string;
    tibia: string;
    polyethyleneMm: number;
  };
}

export const SURGICAL_KNOWLEDGE_BASE: DocumentChunk[] = [
  // =========================================================================
  // 1. Stryker Triathlon Surgical Protocols
  // =========================================================================
  {
    id: "stryker-triathlon-01",
    catalog: "Stryker Triathlon",
    documentTitle: "Triathlon Total Knee System Surgical Protocol",
    section: "Femoral Component Sizing & AP Resection",
    pageNumber: 24,
    content:
      "When evaluating the femoral anteroposterior (AP) dimension on standard plain radiograph templating, a measured AP width between 68.0 mm and 74.5 mm indicates a Triathlon Size 6 Femoral Component. The 7-degree anterior flange geometry provides optimal trochlear tracking without anterior femoral notching. If measured between sizes, prioritize maintaining posterior condylar offset to preserve mid-flexion stability.",
    tags: ["femur", "sizing", "ap-width", "flange", "triathlon", "large"],
    femurApRangeMm: [68.0, 75.0],
    recommendedSize: {
      femur: "Size 6 (Large)",
      tibia: "Size 5 (Medium-Large)",
      polyethyleneMm: 14,
    },
  },
  {
    id: "stryker-triathlon-02",
    catalog: "Stryker Triathlon",
    documentTitle: "Triathlon Total Knee System Surgical Protocol",
    section: "Tibial Baseplate Coverage & Mediolateral Sizing",
    pageNumber: 31,
    content:
      "Tibial baseplate size selection must achieve >90% cortical rim coverage without mediolateral overhang exceeding 1.0 mm. For a measured tibial mediolateral (ML) plateau width between 74.0 mm and 80.5 mm, the Size 5 symmetric universal baseplate is recommended. Rotational alignment should reference the junction of the medial and middle third of the tibial tubercle.",
    tags: ["tibia", "sizing", "ml-width", "overhang", "cortical-coverage", "triathlon"],
    tibiaMlRangeMm: [74.0, 81.0],
  },
  {
    id: "stryker-triathlon-03",
    catalog: "Stryker Triathlon",
    documentTitle: "Triathlon Total Knee System Surgical Protocol",
    section: "Soft Tissue Balancing & Polyethylene Insert Selection in Severe Varus",
    pageNumber: 48,
    content:
      "In knees presenting with severe fixed or flexible varus deformity (>6.0°), medial collateral ligament (MCL) contracture and medial tibial bone loss necessitate sequential medial release (deep MCL followed by posteromedial capsule). To reconstruct the anatomical joint line and prevent medial joint laxity in 90° flexion, a thicker polyethylene insert (12 mm to 14 mm X3 poly) is indicated. Ensure symmetrical extension and flexion gaps (±1.5 mm tolerance).",
    tags: ["varus", "polyethylene", "thickness", "soft-tissue", "balancing", "deformity"],
  },
  {
    id: "stryker-triathlon-04",
    catalog: "Stryker Triathlon",
    documentTitle: "Triathlon Total Knee System Surgical Protocol",
    section: "Single-Radius Design Kinematics & Patellofemoral Stability",
    pageNumber: 12,
    content:
      "The single-radius design maintains a constant center of rotation from 10° to 110° flexion. This minimizes quadriceps force requirements by up to 57% and eliminates the paradoxical anterior femoral sliding observed in multi-radius geometries. Precise AP sizing prevents overstuffing the patellofemoral joint, which is the primary cause of anterior knee pain post-operatively.",
    tags: ["single-radius", "quadriceps", "patellofemoral", "kinematics", "triathlon"],
  },

  // =========================================================================
  // 2. Zimmer Biomet Persona & NexGen Surgical Protocols
  // =========================================================================
  {
    id: "zimmer-persona-01",
    catalog: "Zimmer Persona",
    documentTitle: "Persona The Personalized Knee System Technique Guide",
    section: "Morphometric Anatomical Femoral Sizing & Aspect Ratios",
    pageNumber: 18,
    content:
      "The Persona system provides standard and narrow femoral profiles in 2 mm AP increments. For an AP measurement of 56.0 mm to 60.5 mm, a Size 3 Standard or Narrow component matches the anatomic aspect ratio, reducing soft tissue impingement on the popliteus tendon laterally and avoiding anterior overstuffing.",
    tags: ["femur", "sizing", "ap-width", "persona", "zimmer", "small"],
    femurApRangeMm: [55.0, 61.0],
    recommendedSize: {
      femur: "Size 3 (Small)",
      tibia: "Size 3 (Small)",
      polyethyleneMm: 12,
    },
  },
  {
    id: "zimmer-persona-02",
    catalog: "Zimmer Persona",
    documentTitle: "Persona The Personalized Knee System Technique Guide",
    section: "Tibial Component Sizing & Valgus Deformity Correction",
    pageNumber: 36,
    content:
      "In valgus knee deformities (femorotibial mechanical angle < -3.0°), lateral compartment wear typically causes lateral soft tissue contracture (iliotibial band and popliteus tendon). A Size 3 anatomic tibial baseplate matched with a 10 mm to 12 mm Medial Congruent (MC) or Cruciate Retaining (CR) ultra-high-molecular-weight polyethylene insert restores lateral joint stability while preserving medial compartment kinematics.",
    tags: ["valgus", "tibia", "sizing", "polyethylene", "persona", "lateral-release"],
    tibiaMlRangeMm: [60.0, 66.0],
  },
  {
    id: "zimmer-persona-03",
    catalog: "Zimmer Persona",
    documentTitle: "Persona The Personalized Knee System Technique Guide",
    section: "Anatomic Asymmetric Baseplate Landmarking",
    pageNumber: 42,
    content:
      "Persona asymmetric tibial baseplates mirror native tibial plateau morphology, yielding up to 94% cortical rim coverage without rotation compromise. The anterior cutout avoids impingement against the patellar tendon during deep flexion. Verify that the lateral tray border aligns flush with the lateral cortical boundary.",
    tags: ["asymmetric", "tibia", "cortical-coverage", "persona", "rotational-alignment"],
  },
  {
    id: "zimmer-nexgen-01",
    catalog: "Zimmer Biomet NexGen",
    documentTitle: "NexGen Complete Knee Solution Surgical Technique",
    section: "Standard Anatomic Templating & Sizing",
    pageNumber: 15,
    content:
      "For a standard knee with balanced alignment (0° to 3° varus), an AP femoral dimension of 62.0 mm to 66.0 mm correlates with NexGen Size D/E. The tibial component Size 3 or 4 provides stable seating on the cancellous bed. A 10 mm standard poly insert maintains the native 9 mm anatomical joint line.",
    tags: ["standard", "nexgen", "femur", "tibia", "neutral-alignment"],
    femurApRangeMm: [62.0, 66.5],
    tibiaMlRangeMm: [69.0, 74.0],
    recommendedSize: {
      femur: "Size 4 (Standard)",
      tibia: "Size 3 (Standard)",
      polyethyleneMm: 10,
    },
  },

  // =========================================================================
  // 3. DePuy Synthes Attune Surgical Protocols
  // =========================================================================
  {
    id: "depuy-attune-01",
    catalog: "DePuy Synthes Attune",
    documentTitle: "Attune Total Knee System Surgical Technique",
    section: "Multi-Radius Femoral Component Kinematics",
    pageNumber: 22,
    content:
      "The Attune multi-radius design provides gradual femoral radius reduction. For femoral AP dimensions of 63.0 mm to 67.0 mm, Size 5 achieves anatomical anterior bone coverage and smooth mid-flexion transition. The Logiclock tibial baseplate mechanism reduces micromotion and backside wear to <0.1 mm/year.",
    tags: ["depuy", "attune", "femur", "multi-radius", "sizing"],
    femurApRangeMm: [63.0, 67.5],
  },
  {
    id: "depuy-attune-02",
    catalog: "DePuy Synthes Attune",
    documentTitle: "Attune Total Knee System Surgical Technique",
    section: "Calibrated Tibial Resection & Polyethylene Selection",
    pageNumber: 40,
    content:
      "Attune fixed bearing inserts are calibrated in 1 mm increments (5 mm to 18 mm). Resection of 9 mm of proximal tibial bone from the unaffected compartment corresponds to a 5 mm or 6 mm base thickness, resulting in a reconstructed 9 mm composite construct. In cases with combined varus and extension deficit, insert thickness must balance flexion-extension gaps equally.",
    tags: ["depuy", "attune", "polyethylene", "tibial-cut", "gap-balancing"],
  },
  {
    id: "depuy-attune-03",
    catalog: "DePuy Synthes Attune",
    documentTitle: "Attune Total Knee System Surgical Technique",
    section: "SOFCUT Anterior Chamfer & Femoral Notching Prevention",
    pageNumber: 28,
    content:
      "The patented SOFCUT anterior resection prevents anterior femoral cortical notch creation by tapering the resection plane 3 degrees anteriorly. If the anterior sizing stylus falls between graduation lines, selecting the smaller femoral size with a 2 mm anterior cut adjustment avoids flexion gap over-tightening.",
    tags: ["notching", "chamfer", "femur", "gap-balancing", "attune"],
  },

  // =========================================================================
  // 4. Oxford Partial Knee (UKA) Protocols
  // =========================================================================
  {
    id: "oxford-uka-01",
    catalog: "Oxford Partial Knee",
    documentTitle: "Oxford Partial Knee Phase 3 Surgical Technique",
    section: "Medial Unicompartmental Arthroplasty (UKA) Indications & Sizing",
    pageNumber: 12,
    content:
      "Indications for medial UKA include anteromedial osteoarthritis with intact anterior cruciate ligament (ACL), fully preserved lateral joint cartilage, and correctable intra-articular varus (<10°). For isolated medial condylar AP length between 39.0 mm and 44.0 mm, an Oxford Size 2 or Small femoral component is indicated. A spherical femoral component articulates with a mobile bearing polyethylene meniscus.",
    tags: ["oxford", "uka", "unicompartmental", "partial-knee", "medial-oa"],
    femurApRangeMm: [38.0, 45.0],
    tibiaMlRangeMm: [40.0, 48.0],
    recommendedSize: {
      femur: "Size 2 (UKA)",
      tibia: "Size 2 (UKA)",
      polyethyleneMm: 8,
    },
  },
  {
    id: "oxford-uka-02",
    catalog: "Oxford Partial Knee",
    documentTitle: "Oxford Partial Knee Phase 3 Surgical Technique",
    section: "Mobile Bearing Meniscal Polyethylene Insert Sizing",
    pageNumber: 26,
    content:
      "In mobile-bearing unicompartmental knee replacement, insert thickness should match the physiological extension gap without over-correction. An 8 mm or 9 mm meniscal bearing insert maintains collateral ligament tension without inducing lateral compartment stress transfer.",
    tags: ["oxford", "mobile-bearing", "meniscal", "polyethylene", "gap"],
  },

  // =========================================================================
  // 5. AAOS Clinical Guidelines & Biomechanical Principles
  // =========================================================================
  {
    id: "aaos-guidelines-01",
    catalog: "AAOS Clinical Guidelines",
    documentTitle: "AAOS Clinical Practice Guideline: Surgical Management of Osteoarthritis of the Knee",
    section: "Coronal Plane Mechanical Alignment Targets & Outcomes",
    pageNumber: 45,
    content:
      "Strong evidence supports restoring post-operative coronal hip-knee-ankle (HKA) mechanical axis to within ±3° of neutral (180° HKA). Achieving neutral alignment significantly reduces early polyethylene wear rates and asymmetric tibial component loosening at 10-year follow-up compared to outliers (>3° varus/valgus).",
    tags: ["aaos", "mechanical-axis", "hka", "longevity", "alignment", "clinical-guidelines"],
  },
  {
    id: "aaos-guidelines-02",
    catalog: "AAOS Clinical Guidelines",
    documentTitle: "AAOS Clinical Practice Guideline: Surgical Management of Osteoarthritis of the Knee",
    section: "Component Sizing & Mediolateral Overhang Thresholds",
    pageNumber: 58,
    content:
      "Mediolateral femoral or tibial component overhang exceeding 2.0 mm is directly correlated with chronic post-operative soft tissue impingement, pes anserinus bursitis, and elevated Visual Analog Scale (VAS) pain scores. Components should be downsized or lateralized when overhang risk is identified.",
    tags: ["overhang", "pain", "aaos", "sizing-threshold", "complications"],
  },
  {
    id: "biomechanics-01",
    catalog: "Orthopedic Biomechanics Reference",
    documentTitle: "Principles of Knee Arthroplasty Biomechanics (Insigna & Scott)",
    section: "Joint Line Preservation & Posterior Condylar Offset",
    pageNumber: 114,
    content:
      "Elevating the native joint line by >4.0 mm leads to mid-flexion instability, altered patellofemoral contact pressures, and restricted maximum flexion. Precise distal femoral resection matched to implant distal condylar thickness (typically 8.5 mm to 9.5 mm) is critical to preserve the anatomic joint line.",
    tags: ["joint-line", "biomechanics", "posterior-offset", "stability"],
  },
];
