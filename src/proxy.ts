import { NextResponse, type NextRequest } from "next/server";

/**
 * Adds a per-request nonce and a strict Content-Security-Policy.
 *
 * Next.js reads the nonce from the CSP request header and applies it to the
 * scripts it renders. The same value is exposed as `x-nonce` so server
 * components can sign their own inline JSON-LD blocks.
 */
function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";

  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? ["'unsafe-eval'"] : []),
  ];

  const connectSrc = [
    "'self'",
    ...(process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/^https:/, "wss:"),
        ]
      : []),
    ...(isDev ? ["ws:", "wss:"] : []),
  ];

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|opengraph-image|twitter-image|sitemap.xml|robots.txt|manifest.webmanifest).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
