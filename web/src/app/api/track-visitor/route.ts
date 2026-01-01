import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * Visitor Tracking API Route
 *
 * Saves visitor data to Google Sheets
 *
 * Required Environment Variables:
 * - GOOGLE_SHEETS_CLIENT_EMAIL
 * - GOOGLE_SHEETS_PRIVATE_KEY
 * - GOOGLE_SHEET_ID
 */

export async function POST(request: NextRequest) {
  try {
    const visitorData = await request.json();

    // Get IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'Unknown';

    // Get location from IP (using ipapi.co free API) with timeout
    let locationData = {};
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (geoResponse.ok) {
        locationData = await geoResponse.json();
      }
    } catch (error) {
      console.error('Failed to get location:', error);
      // Continue without location data
    }

    // Combine data
    const fullData = {
      ...visitorData,
      ip,
      ...(locationData as any),
    };

    // Save to Google Sheets (non-blocking)
    if (process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
        process.env.GOOGLE_SHEETS_PRIVATE_KEY &&
        process.env.GOOGLE_SHEET_ID) {

      // Run in background, don't wait for completion
      saveToGoogleSheets(fullData).catch(error => {
        console.error('Background save to Google Sheets failed:', error);
      });
    } else {
      console.warn('Google Sheets credentials not configured');
    }

    // Return immediately without waiting for Google Sheets
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}

async function saveToGoogleSheets(data: any) {
  try {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Prepare row data
    const row = [
      new Date(data.timestamp).toISOString(),
      data.deviceId,
      data.ip || '',
      data.country_name || data.country || '',
      data.city || '',
      data.region || '',
      data.latitude || '',
      data.longitude || '',
      data.browser,
      data.browserVersion,
      data.os,
      data.osVersion,
      data.deviceType,
      data.platform,
      data.language,
      data.screenResolution,
      data.timezone,
      data.landingPage,
      data.referrer,
      data.userAgent,
    ];

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Visitors!A:T',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log('Visitor data saved to Google Sheets');
  } catch (error) {
    console.error('Failed to save to Google Sheets:', error);
    throw error;
  }
}
