import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface ClaimRequest {
  loungeId: string;
  loungeName: string;
  airportCode: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  position: string;
  message?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ClaimRequest = await request.json();
    const {
      loungeId,
      loungeName,
      airportCode,
      companyName,
      contactName,
      email,
      phone,
      website,
      position,
      message,
      timestamp,
    } = body;

    // Validation
    if (!loungeId || !companyName || !contactName || !email || !phone || !position) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Log claim to file
    const logDir = path.join(process.cwd(), "logs", "claims");
    await fs.mkdir(logDir, { recursive: true });

    const logFile = path.join(logDir, `${new Date().toISOString().split("T")[0]}.jsonl`);
    const logEntry = JSON.stringify({
      loungeId,
      loungeName,
      airportCode,
      companyName,
      contactName,
      email,
      phone,
      website,
      position,
      message,
      timestamp,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent"),
      status: "pending_verification",
    }) + "\n";

    await fs.appendFile(logFile, logEntry);

    // TODO: Send email to operator (confirmation)
    // TODO: Send email to admin (notification)
    // TODO: Update database with claim status

    // Send email notification (placeholder - use Resend in production)
    try {
      const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: `Lounge Claim Request Received - ${loungeName}`,
          html: `
            <h2>Thank you for claiming your lounge!</h2>
            <p>We've received your claim request for <strong>${loungeName}</strong> at ${airportCode}.</p>
            <p>Our team will review your request and contact you within 1-2 business days.</p>
            <hr />
            <p><small>This is an automated message from TakeYourLounge.com</small></p>
          `,
        }),
      });

      console.log("Email sent:", emailResponse.ok);
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Claim request submitted successfully",
      nextSteps: [
        "We'll verify your information within 1-2 business days",
        "You'll receive an email confirmation",
        "Once verified, you'll get access to your dashboard",
      ],
    });
  } catch (error) {
    console.error("Claim API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
