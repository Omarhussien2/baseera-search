import { NextResponse } from 'next/server';
import { ddgLiteSearch } from '@/connectors/web';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || 'test';
  
  try {
    const rawResults = await ddgLiteSearch(q);
    
    // Also test a direct fetch to see the raw HTML Vercel gets
    const response = await fetch('https://lite.duckduckgo.com/lite/', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(q)}`,
      cache: 'no-store'
    });
    
    const html = await response.text();
    const status = response.status;
    
    return NextResponse.json({
      status,
      htmlLength: html.length,
      htmlSnippet: html,
      parsedResults: rawResults
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
