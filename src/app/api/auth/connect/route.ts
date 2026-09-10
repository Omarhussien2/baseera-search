import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform } = body;

    if (!platform) {
      return NextResponse.json({ success: false, error: 'Platform is required' }, { status: 400 });
    }

    const microserviceUrl = process.env.AGENT_REACH_URL || 'https://gent-reach-service.onrender.com';
    
    try {
      const response = await fetch(`${microserviceUrl}/api/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Microservice unreachable:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Agent-Reach Microservice is unreachable. Ensure the VPS is running.' },
        { status: 503 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
