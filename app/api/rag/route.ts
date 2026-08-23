import { NextRequest, NextResponse } from "next/server";
import { executeRagPipeline, RagRequestPayload } from "@/lib/rag/rag-service";
import { MOCK_IMPLANT_RESPONSE } from "@/lib/fixtures";

export async function GET() {
  return NextResponse.json(
    {
      service: "Knee AI - RAG Decision Support Route",
      status: "online",
      message: "Ready for POST requests with patient morphometry and query.",
      ui_workspace: "http://localhost:3000/implant",
    },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    let body: Partial<RagRequestPayload> = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const payload: RagRequestPayload = {
      query: body?.query,
      catalogName: body?.catalogName || "Stryker Triathlon",
      implantData: body?.implantData || MOCK_IMPLANT_RESPONSE,
    };

    const response = await executeRagPipeline(payload);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("RAG Pipeline execution error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal RAG Pipeline Error" },
      { status: 500 }
    );
  }
}
