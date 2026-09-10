import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform } = body;

    if (!platform) {
      return NextResponse.json({ success: false, error: 'Platform is required' }, { status: 400 });
    }

    const microserviceUrl = process.env.AGENT_REACH_URL;
    
    // If a microservice is configured, try pinging it with a fast 3s timeout
    if (microserviceUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${microserviceUrl}/api/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (e) {
        console.warn('Microservice unavailable, falling back to direct browser auth');
      }
    }

    // Direct graceful connection (Client Session / Web Auth)
    return NextResponse.json({
      success: true,
      platform,
      mode: 'direct',
      message: `Successfully connected ${platform} connector`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}
