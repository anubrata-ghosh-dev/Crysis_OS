import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_DISASTERS } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    // In a real app, fetch from database
    // For now, return mock data with some randomization
    const disasters = INITIAL_DISASTERS.map((d) => ({
      ...d,
      affectedPeople: Math.floor(d.affectedPeople * (0.7 + Math.random() * 0.6)),
    }));

    return NextResponse.json({
      disasters,
      timestamp: new Date().toISOString(),
      total: disasters.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch disasters' }, { status: 500 });
  }
}
