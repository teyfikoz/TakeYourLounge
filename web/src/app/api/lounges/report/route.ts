import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface ReportRequest {
  loungeId: string;
  loungeName: string;
  report: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();
    const { loungeId, loungeName, report, timestamp } = body;

    if (!loungeId || !report || report.length < 10) {
      return NextResponse.json(
        { error: "Invalid report. Please provide detailed information." },
        { status: 400 }
      );
    }

    // Log report to file
    const logDir = path.join(process.cwd(), "logs", "reports");
    await fs.mkdir(logDir, { recursive: true });

    const logFile = path.join(logDir, `${new Date().toISOString().split("T")[0]}.jsonl`);
    const logEntry = JSON.stringify({
      loungeId,
      loungeName,
      report,
      timestamp,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent"),
    }) + "\n";

    await fs.appendFile(logFile, logEntry);

    // TODO: Send email notification to admin
    // TODO: Update database with report count

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully",
    });
  } catch (error) {
    console.error("Report API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
