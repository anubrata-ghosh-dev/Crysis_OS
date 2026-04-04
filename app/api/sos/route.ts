import { NextRequest, NextResponse } from 'next/server';

// Mock storage for SOS signals
let sosSignals: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, description, location, timestamp } = body;

    if (!type || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sosSignal = {
      id: `sos-${Date.now()}`,
      type,
      description,
      location,
      timestamp,
      status: 'pending',
    };

    sosSignals.push(sosSignal);

    // Keep only last 50 signals
    sosSignals = sosSignals.slice(-50);

    return NextResponse.json({
      success: true,
      signal: sosSignal,
      message: 'SOS signal dispatched to emergency services',
    });
  } catch (error) {
    console.error('SOS error:', error);
    return NextResponse.json({ error: 'SOS submission failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    signals: sosSignals,
  });
}
