"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  FileText,
  Database,
  Loader2,
  Send,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Scale,
  RefreshCw,
} from "lucide-react";

import {
  RetrievedCitation,
  RagResponsePayload,
  RiskItem,
  executeRagPipeline,
} from "@/lib/rag/rag-service";

// FIX: Import ImplantAnalysisResponse
import type { ImplantAnalysisResponse } from "@/lib/types";

interface RagCopilotProps {
  data: ImplantAnalysisResponse;
  catalogName?: string;
}

type ActiveTab =
  | "rationale"
  | "risks"
  | "balancing"
  | "citations";

export function RagCopilot({
  data,
  catalogName = "Generic Standard TKA",
}: RagCopilotProps) {
  const [isQuerying, setIsQuerying] =
    useState(false);

  const [streamedText, setStreamedText] =
    useState("");

  const [isStreaming, setIsStreaming] =
    useState(false);

  const [hasCompleted, setHasCompleted] =
    useState(false);

  const [citations, setCitations] =
    useState<RetrievedCitation[]>([]);

  const [metrics, setMetrics] =
    useState<
      RagResponsePayload["metrics"] | null
    >(null);

  const [riskItems, setRiskItems] =
    useState<RiskItem[]>([]);

  const [gapProtocols, setGapProtocols] =
    useState<string[]>([]);

  const [sizeStepComp, setSizeStepComp] =
    useState<
      RagResponsePayload["sizeStepComparison"] | null
    >(null);

  const [activeTab, setActiveTab] =
    useState<ActiveTab>("rationale");

  const [customQuestion, setCustomQuestion] =
    useState("");

  const [lastQuery, setLastQuery] =
    useState("");

  const containerRef =
    useRef<HTMLDivElement>(null);

  const QUICK_PROMPTS = [
    "Analyze Overhang & Cortical Fit",
    "Why not Size Up or Size Down?",
    "Sequential Ligament Balancing",
    "AAOS Clinical Guidelines on Alignment",
  ];

  const triggerRagQuery = async (
    queryText?: string
  ) => {
    try {
      setIsQuerying(true);
      setStreamedText("");
      setHasCompleted(false);
      setLastQuery(queryText || "");

      let result: RagResponsePayload;

      try {
        // Try calling the Next.js API Route
        const response = await fetch(
          "/api/rag",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              query: queryText,
              implantData: data,
              catalogName:
                catalogName ||
                data?.metadata?.catalog_name,
            }),
          }
        );

        if (response.ok) {
          result =
            (await response.json()) as RagResponsePayload;
        } else {
          // Direct local fallback
          result =
            await executeRagPipeline({
              query: queryText,
              implantData: data,
              catalogName:
                catalogName ||
                data?.metadata?.catalog_name,
            });
        }
      } catch {
        // Direct local fallback
        result =
          await executeRagPipeline({
            query: queryText,
            implantData: data,
            catalogName:
              catalogName ||
              data?.metadata?.catalog_name,
          });
      }

      setCitations(
        result.retrievedCitations || []
      );

      setMetrics(
        result.metrics || null
      );

      setRiskItems(
        result.riskAssessment || []
      );

      setGapProtocols(
        result.gapBalancingProtocol || []
      );

      setSizeStepComp(
        result.sizeStepComparison || null
      );

      setIsQuerying(false);
      setIsStreaming(true);

      // Stream the response with typewriter animation
      const targetText =
        result.explanation || "";

      let index = 0;

      const speed = 8;

      const typeInterval =
        window.setInterval(() => {
          setStreamedText(
            targetText.substring(
              0,
              index
            )
          );

          index++;

          if (containerRef.current) {
            containerRef.current.scrollTop =
              containerRef.current.scrollHeight;
          }

          if (
            index >
            targetText.length
          ) {
            window.clearInterval(
              typeInterval
            );

            setIsStreaming(false);
            setHasCompleted(true);
          }
        }, speed);
    } catch (err) {
      console.error(
        "Failed to run RAG query:",
        err
      );

      setIsQuerying(false);
      setIsStreaming(false);

      setStreamedText(
        "Error executing RAG retrieval."
      );

      setHasCompleted(true);
    }
  };

  const handleCustomSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !customQuestion.trim() ||
      isQuerying ||
      isStreaming
    ) {
      return;
    }

    const q =
      customQuestion.trim();

    setCustomQuestion("");

    triggerRagQuery(q);
  };

  // Reset when implant data changes
  useEffect(() => {
    setStreamedText("");
    setIsQuerying(false);
    setIsStreaming(false);
    setHasCompleted(false);
    setCitations([]);
    setMetrics(null);
    setRiskItems([]);
    setGapProtocols([]);
    setSizeStepComp(null);
    setActiveTab("rationale");
    setLastQuery("");
  }, [data, catalogName]);

  return (
    <div className="bg-black/85 backdrop-blur-md !text-white border-white/20 rounded-xl border p-4 shadow-card hover:border-clinical/50 transition-all space-y-3">

      {/* =====================================================
          TOP HEADER & DATABASE STATUS
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">

        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-clinical-light">

          <Sparkles className="w-4 h-4 text-clinical" />

          RAG Clinical Decision Copilot

        </span>

        <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">

          <Database className="w-3 h-3 text-emerald-400" />

          Vector DB Online (
          {metrics?.chunksSearched || 14}
          {" "}Chunks)

        </span>

      </div>

      {/* =====================================================
          INITIAL PROMPT STATE
      ====================================================== */}

      {!isQuerying &&
        !isStreaming &&
        !hasCompleted && (
          <div className="space-y-3">

            <p className="text-xs text-slate-300 leading-relaxed">

              Execute real-time vector search across{" "}

              <strong>
                {catalogName}
              </strong>{" "}

              surgical technique manuals to retrieve
              sizing rationale, overhang limits, and
              gap balancing protocols.

            </p>

            <button
              type="button"
              onClick={() =>
                triggerRagQuery()
              }
              className="w-full py-2.5 px-3 rounded-md bg-clinical hover:bg-clinical-hover text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-clinical/40"
            >

              <BookOpen className="w-4 h-4" />

              Query{" "}
              {catalogName}{" "}
              Surgical Guidelines

            </button>

            {/* Quick Prompt Suggestions */}

            <div className="space-y-1.5 pt-1">

              <span className="text-[10px] text-slate-400 font-medium block">

                Suggested Clinical Queries:

              </span>

              <div className="flex flex-wrap gap-1.5">

                {QUICK_PROMPTS.map(
                  (prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        triggerRagQuery(
                          prompt
                        )
                      }
                      className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors"
                    >
                      {prompt}
                    </button>
                  )
                )}

              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          LOADING VECTOR SEARCH STATE
      ====================================================== */}

      {isQuerying && (
        <div className="flex flex-col items-center justify-center py-8 space-y-3 text-clinical-light">

          <Loader2 className="w-7 h-7 animate-spin text-clinical" />

          <div className="text-center space-y-1">

            <p className="text-xs font-mono font-semibold text-white animate-pulse">

              Embedding patient morphometry &amp;
              ranking surgical manual chunks...

            </p>

            <p className="text-[10px] text-slate-400">

              Retrieving relevant technique protocols
              for {catalogName}

            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          STREAMED OUTPUT & INTERACTIVE TABS
      ====================================================== */}

      {(isStreaming ||
        hasCompleted) && (
        <div className="space-y-3">

          {/* Metadata Performance Strip */}

          {metrics && (
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1.5 rounded border border-white/5">

              <span className="flex items-center gap-1 text-clinical-light">

                <CheckCircle2 className="w-3 h-3 text-emerald-400" />

                Retrieved{" "}
                {citations.length}{" "}
                sources (
                {metrics.totalLatencyMs}
                ms)

              </span>

              <span className="text-slate-300">

                Peak Cosine Match:{" "}

                <strong className="text-emerald-400">

                  {(
                    metrics.topSimilarityScore *
                    100
                  ).toFixed(1)}
                  %

                </strong>

              </span>

            </div>
          )}

          {/* =================================================
              INTERACTIVE TABS
          ================================================== */}

          {hasCompleted && (
            <div className="flex items-center gap-1 border-b border-white/10 pb-1 text-xs overflow-x-auto">

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "rationale"
                  )
                }
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeTab ===
                  "rationale"
                    ? "bg-clinical text-white font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >

                <FileText className="w-3 h-3" />

                Surgical Decision

              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "risks"
                  )
                }
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeTab ===
                  "risks"
                    ? "bg-clinical text-white font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >

                <ShieldCheck className="w-3 h-3" />

                Safety &amp; Risks

              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "balancing"
                  )
                }
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeTab ===
                  "balancing"
                    ? "bg-clinical text-white font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >

                <Scale className="w-3 h-3" />

                Gap Balancing

              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab(
                    "citations"
                  )
                }
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                  activeTab ===
                  "citations"
                    ? "bg-clinical text-white font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >

                <BookOpen className="w-3 h-3" />

                Citations (
                {citations.length}
                )

              </button>

            </div>
          )}

          {/* =================================================
              TAB 1 - SURGICAL DECISION
          ================================================== */}

          {(activeTab ===
            "rationale" ||
            isStreaming) && (
            <div
              ref={containerRef}
              className="bg-black/60 border border-white/10 rounded-md p-3.5 max-h-[240px] overflow-y-auto font-sans"
            >

              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">

                {streamedText}

                {isStreaming && (
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-clinical animate-pulse align-middle" />
                )}

              </p>

            </div>
          )}

          {/* =================================================
              TAB 2 - SAFETY & RISKS
          ================================================== */}

          {activeTab ===
            "risks" &&
            hasCompleted && (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">

                {riskItems.length >
                0 ? (
                  riskItems.map(
                    (risk, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-md bg-white/5 border border-white/10 flex items-start justify-between gap-2"
                      >

                        <div className="space-y-0.5">

                          <div className="flex items-center gap-1.5">

                            <span className="text-xs font-bold text-white">

                              {risk.name}

                            </span>

                            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">

                              {risk.score}

                            </span>

                          </div>

                          <p className="text-[10px] text-slate-300 leading-tight">

                            {risk.details}

                          </p>

                        </div>

                        <span className="text-[9px] uppercase font-bold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.5 rounded shrink-0">

                          {risk.status}

                        </span>

                      </div>
                    )
                  )
                ) : (
                  <div className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-md p-3">

                    No risk assessment items
                    were returned.

                  </div>
                )}

                {/* Size Step Comparison */}

                {sizeStepComp && (
                  <div className="p-2.5 rounded-md bg-purple-950/40 border border-purple-500/30 space-y-1 text-[11px]">

                    <span className="font-bold text-purple-300 block">

                      Adjacent Size Differential:

                    </span>

                    <div className="text-[10px] text-slate-300 space-y-0.5">

                      <p>
                        •{" "}
                        <strong>
                          Downsize:
                        </strong>{" "}
                        {sizeStepComp.sizeDown}
                      </p>

                      <p>
                        •{" "}
                        <strong>
                          Upsize:
                        </strong>{" "}
                        {sizeStepComp.sizeUp}
                      </p>

                    </div>

                  </div>
                )}

              </div>
            )}

          {/* =================================================
              TAB 3 - GAP BALANCING
          ================================================== */}

          {activeTab ===
            "balancing" &&
            hasCompleted && (
              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">

                <div className="text-xs font-bold text-clinical-light flex items-center gap-1.5">

                  <Scale className="w-3.5 h-3.5 text-clinical" />

                  Intra-Operative Gap
                  Balancing Sequence:

                </div>

                <div className="space-y-1.5">

                  {gapProtocols.length >
                  0 ? (
                    gapProtocols.map(
                      (step, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-white/5 border border-white/10 text-[11px] text-slate-200 leading-snug"
                        >
                          {step}
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-md p-3">

                      No gap balancing
                      protocol was returned.

                    </div>
                  )}

                </div>

              </div>
            )}

          {/* =================================================
              TAB 4 - CITATIONS
          ================================================== */}

          {activeTab ===
            "citations" &&
            hasCompleted && (
              <div className="p-2.5 space-y-2 bg-black/40 text-[11px] divide-y divide-white/5 max-h-[240px] overflow-y-auto">

                {citations.length >
                0 ? (
                  citations.map(
                    (cite, i) => (
                      <div
                        key={
                          cite.id || i
                        }
                        className="pt-2 first:pt-0 space-y-1"
                      >

                        <div className="flex items-center justify-between text-slate-300 gap-2">

                          <span className="font-bold text-white truncate">

                            [{i + 1}]{" "}
                            {
                              cite.documentTitle
                            }

                          </span>

                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">

                            {(
                              cite.similarityScore *
                              100
                            ).toFixed(0)}
                            % match

                          </span>

                        </div>

                        <div className="text-[10px] text-slate-400 font-mono">

                          Section:{" "}
                          {cite.section}{" "}
                          • Page{" "}
                          {
                            cite.pageNumber
                          }

                        </div>

                        <p className="text-[10px] text-slate-300 italic bg-white/5 p-2 rounded border border-white/5">

                          &quot;
                          {
                            cite.snippet
                          }
                          &quot;

                        </p>

                      </div>
                    )
                  )
                ) : (
                  <div className="text-xs text-slate-400 p-3">

                    No citations were
                    retrieved.

                  </div>
                )}

              </div>
            )}

          {/* =================================================
              QUICK FILTER BUTTONS
          ================================================== */}

          {hasCompleted && (
            <div className="flex flex-wrap gap-1 pt-1">

              {QUICK_PROMPTS.map(
                (prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      triggerRagQuery(
                        prompt
                      )
                    }
                    disabled={
                      isQuerying ||
                      isStreaming
                    }
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 disabled:opacity-40 text-slate-300 border border-white/10 transition-colors"
                  >
                    {prompt}
                  </button>
                )
              )}

            </div>
          )}

          {/* =================================================
              CLINICIAN Q&A INPUT
          ================================================== */}

          {hasCompleted && (
            <form
              onSubmit={
                handleCustomSubmit
              }
              className="pt-1 flex gap-1.5"
            >

              <input
                type="text"
                placeholder="Ask clinical guideline question (e.g., 'Why not Size 5?')..."
                value={
                  customQuestion
                }
                onChange={(e) =>
                  setCustomQuestion(
                    e.target.value
                  )
                }
                disabled={
                  isQuerying ||
                  isStreaming
                }
                className="flex-1 bg-white/10 border border-white/15 rounded-md px-2.5 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-clinical disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={
                  !customQuestion.trim() ||
                  isQuerying ||
                  isStreaming
                }
                className="px-3 py-1.5 bg-clinical hover:bg-clinical-hover disabled:opacity-40 text-white rounded-md text-xs font-bold flex items-center gap-1 transition-colors"
              >

                <Send className="w-3 h-3" />

                <span>
                  Ask
                </span>

              </button>

            </form>
          )}

          {/* =================================================
              REGENERATE
          ================================================== */}

          {hasCompleted && (
            <div className="flex justify-between items-center pt-1 text-[10px] text-slate-400 border-t border-white/10">

              <button
                type="button"
                onClick={() =>
                  triggerRagQuery()
                }
                disabled={
                  isQuerying ||
                  isStreaming
                }
                className="hover:text-clinical disabled:opacity-40 flex items-center gap-1 transition-colors"
              >

                <RefreshCw className="w-3 h-3" />

                Regenerate Default
                Rationale

              </button>

              <span className="font-mono">

                Engine: In-App Semantic
                RAG (Cosine TF-IDF)

              </span>

            </div>
          )}

        </div>
      )}

    </div>
  );
}