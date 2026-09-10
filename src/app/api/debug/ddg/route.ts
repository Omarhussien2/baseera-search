import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || 'test';
  
  try {
    const response = await fetch(`https://www.bing.com/search?q=${encodeURIComponent(q)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store'
    });
    
    const html = await response.text();
    const status = response.status;
    
    // quick count
    const algoCount = (html.match(/<li class="b_algo"/g) || []).length;
    
    return NextResponse.json({
      status,
      algoCount,
      htmlLength: html.length,
      htmlSnippet: html.substring(0, 500)
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
