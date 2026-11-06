import { ImageResponse } from "next/og";
import { BRAND_COLORS, RIBBON_PATHS } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND_COLORS.deepForest,
          backgroundImage:
            "radial-gradient(circle at 28% 18%, rgba(168,189,166,0.2), transparent 55%), radial-gradient(circle at 82% 86%, rgba(184,156,120,0.14), transparent 58%)",
        }}
      >
        <svg width="132" height="58" viewBox="0 0 324 140">
          <defs>
            <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={BRAND_COLORS.sage} />
              <stop offset="0.52" stopColor={BRAND_COLORS.softGreen} />
              <stop offset="1" stopColor={BRAND_COLORS.sage} />
            </linearGradient>
          </defs>
          <path d={RIBBON_PATHS.main} fill="url(#ribbon)" />
          <path d={RIBBON_PATHS.upright} fill={BRAND_COLORS.sage} />
        </svg>
      </div>
    ),
    size,
  );
}
