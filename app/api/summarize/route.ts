import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // For now, return a mock summary
    // In production, this would call OpenAI
    const mockSummary = `Critical alert detected: ${text.substring(0, 50)}... Immediate response required.`;

    return NextResponse.json({
      summary: mockSummary,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Summarization failed' }, { status: 500 });
  }
}
