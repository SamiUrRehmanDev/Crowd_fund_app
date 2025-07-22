import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'CrowdFund API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'POST method received',
    timestamp: new Date().toISOString()
  });
}
