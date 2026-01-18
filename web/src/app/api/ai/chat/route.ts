import { HfInference } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

const hf = new HfInference(process.env.HF_API_TOKEN);

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // System prompt for lounge concierge
    const systemPrompt = `You are an expert airport lounge concierge assistant for TakeYourLounge.com.

You have access to our database of 2,045 premium airport lounges across 703 airports in 175 countries.

Your role:
1. Help travelers find the perfect lounge for their needs
2. Answer questions about lounge amenities, access methods, and locations
3. Provide recommendations based on user preferences
4. Be friendly, helpful, and concise

Guidelines:
- Always recommend specific lounges when possible
- Mention access methods (Priority Pass, Amex Centurion, LoungeKey, etc.)
- Keep responses under 200 words
- If you don't know something, suggest browsing the directory at takeyourlounge.com
- Be professional but warm and welcoming`;

    const fullMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages
    ];

    const response = await hf.chatCompletion({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      messages: fullMessages as any,
      max_tokens: 400,
      temperature: 0.7,
    });

    const aiMessage = response.choices[0].message.content;

    return NextResponse.json({
      message: aiMessage,
      success: true
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
