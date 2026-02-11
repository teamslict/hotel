import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Helper to determine the backend URL
const getBackendUrl = () => {
    return process.env.ERP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const API_BASE = getBackendUrl();

    const targetUrl = `${API_BASE}/${pathString}${searchParams ? `?${searchParams}` : ''}`;

    // Cache strategy - mirror spareparts logic
    // Config related endpoints can be cached briefly to prevent rate limiting
    const isConfig = pathString.includes('config');
    const isCacheable = isConfig;

    const fetchOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: isCacheable ? 'force-cache' : 'no-store',
        next: isCacheable ? { revalidate: 300 } : undefined,
    };

    try {
        const response = await fetch(targetUrl, fetchOptions);

        if (!response.ok) {
            return NextResponse.json(
                { error: `Backend Error: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        const cacheHeader = isCacheable
            ? 'public, max-age=300, s-maxage=300, stale-while-revalidate=60'
            : 'no-store, max-age=0';

        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Cache-Control': cacheHeader,
            },
        });

    } catch (error) {
        console.error('[Proxy Critical] GET request failed:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathString = path.join('/');
    const API_BASE = getBackendUrl();
    const targetUrl = `${API_BASE}/${pathString}`;

    try {
        const body = await request.json();

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        if (!response.ok) {
            const text = await response.text();
            return new NextResponse(text, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'no-store, max-age=0' },
        });
    } catch (error) {
        console.error('[Proxy Critical] POST request failed:', error);
        return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
    }
}
