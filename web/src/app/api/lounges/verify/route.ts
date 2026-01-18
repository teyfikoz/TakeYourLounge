import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface VerificationRequest {
  loungeId: string;
  vote: "accurate" | "inaccurate";
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerificationRequest = await request.json();
    const { loungeId, vote, timestamp } = body;

    if (!loungeId || !vote) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log verification to file (simple implementation)
    const logDir = path.join(process.cwd(), "logs", "verifications");
    await fs.mkdir(logDir, { recursive: true });

    const logFile = path.join(logDir, `${new Date().toISOString().split("T")[0]}.jsonl`);
    const logEntry = JSON.stringify({
      loungeId,
      vote,
      timestamp,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent"),
    }) + "\n";

    await fs.appendFile(logFile, logEntry);

    // TODO: Update database with verification count
    // For now, just return success

    return NextResponse.json({
      success: true,
      message: "Verification recorded",
    });
  } catch (error) {
    console.error("Verification API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
