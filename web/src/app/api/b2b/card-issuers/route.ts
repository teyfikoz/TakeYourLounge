import { NextRequest, NextResponse } from 'next/server';
import { sendB2BInquiry } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, cardType, loungeProgram, message } = body;
    const currentProgram = loungeProgram; // Map field name
    const partnershipInterest = message; // Map field name

    // Validate required fields
    if (!name || !company || !email) {
      return NextResponse.json(
        { error: 'Name, company, and email are required' },
        { status: 400 }
      );
    }

    // Email content
    const emailContent = `
New Card Issuer Partnership Inquiry
====================================

Contact Information:
- Name: ${name}
- Company/Bank Name: ${company}
- Email: ${email}
- Card Type/Program: ${cardType || 'N/A'}
- Current Lounge Program: ${currentProgram || 'N/A'}

Partnership Interest:
${partnershipInterest || 'No details provided'}

---
Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC
From: TakeYourLounge.com - B2B Card Issuers Form
    `.trim();

    const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #9333ea; border-bottom: 3px solid #9333ea; padding-bottom: 10px;">
                💳 New Card Issuer Partnership Inquiry
              </h2>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Name:</td>
                    <td style="padding: 8px 0; color: #111827;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Company/Bank:</td>
                    <td style="padding: 8px 0; color: #111827;">${company}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #9333ea;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Card Type/Program:</td>
                    <td style="padding: 8px 0; color: #111827;">${cardType || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Current Lounge Program:</td>
                    <td style="padding: 8px 0; color: #111827;">${currentProgram || 'N/A'}</td>
                  </tr>
                </table>
              </div>

              ${partnershipInterest ? `
                <div style="background: white; padding: 20px; border-left: 4px solid #9333ea; margin: 20px 0;">
                  <h3 style="color: #374151; margin-top: 0;">Partnership Interest</h3>
                  <p style="color: #4b5563; white-space: pre-wrap;">${partnershipInterest}</p>
                </div>
              ` : ''}

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                <p>Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC</p>
                <p>From: <strong>TakeYourLounge.com</strong> - B2B Card Issuers Form</p>
              </div>
            </div>
    `;

    // Send email via centralized service
    await sendB2BInquiry({
      type: 'card-issuers',
      subject: `💳 New Card Issuer Partnership Inquiry - ${company}`,
      text: emailContent,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Your partnership inquiry has been submitted successfully. We will contact you within 24-48 hours.',
    });

  } catch (error) {
    console.error('❌ Error processing form submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again or email us directly at info@tsynca.com' },
      { status: 500 }
    );
  }
}
