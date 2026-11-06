import { ImageResponse } from "next/og";
import { BRAND_COLORS, RIBBON_PATHS } from "@/lib/brand";

export const alt =
  "Motiveva — Tu mejor versión, sin ruido. Seguidor de hábitos con cuenta gratuita y sync en la nube.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CHIPS = ["Sync en la nube", "Cuenta gratis", "Sin anuncios", "Verificado"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          backgroundColor: BRAND_COLORS.ivory,
          backgroundImage:
            "radial-gradient(circle at 90% 8%, rgba(220,230,217,0.9), transparent 52%), radial-gradient(circle at 10% 100%, rgba(184,156,120,0.16), transparent 48%)",
          color: BRAND_COLORS.deepForest,
          fontFamily: "sans-serif",
          padding: "62px 76px",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -150,
            top: -190,
            width: 540,
            height: 540,
            borderRadius: 999,
            backgroundColor: "rgba(168,189,166,0.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 180,
            bottom: -170,
            width: 360,
            height: 360,
            borderRadius: 999,
            backgroundColor: "rgba(184,156,120,0.12)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <svg width="92" height="40" viewBox="0 0 324 140">
            <defs>
              <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={BRAND_COLORS.softGreen} />
                <stop offset="0.52" stopColor={BRAND_COLORS.sage} />
                <stop offset="1" stopColor={BRAND_COLORS.softGreen} />
              </linearGradient>
            </defs>
            <path d={RIBBON_PATHS.main} fill="url(#ribbon)" />
            <path d={RIBBON_PATHS.upright} fill={BRAND_COLORS.softGreen} />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: -1.8,
              lineHeight: 1,
            }}
          >
            motiveva
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
              maxWidth: 720,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 78,
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: -3.6,
              }}
            >
              <span>Tu mejor versión,</span>
              <span style={{ color: BRAND_COLORS.forest }}>sin ruido.</span>
            </div>
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.4,
                color: BRAND_COLORS.forest,
                maxWidth: 650,
              }}
            >
              Rachas honestas, estadísticas claras y tus datos bajo tu control.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 210,
              height: 210,
              borderRadius: 52,
              backgroundColor: BRAND_COLORS.deepForest,
              boxShadow: "0 24px 60px rgba(38,61,48,0.18)",
            }}
          >
            <svg width="152" height="66" viewBox="0 0 324 140">
              <defs>
                <linearGradient id="ribbon-tile" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor={BRAND_COLORS.sage} />
                  <stop offset="0.52" stopColor={BRAND_COLORS.softGreen} />
                  <stop offset="1" stopColor={BRAND_COLORS.sage} />
                </linearGradient>
              </defs>
              <path d={RIBBON_PATHS.main} fill="url(#ribbon-tile)" />
              <path d={RIBBON_PATHS.upright} fill={BRAND_COLORS.sage} />
            </svg>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {CHIPS.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(82,113,91,0.2)",
                backgroundColor: "rgba(220,230,217,0.58)",
                color: BRAND_COLORS.deepForest,
                fontSize: 18,
              }}
            >
              {chip}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              color: BRAND_COLORS.forest,
              fontSize: 18,
              letterSpacing: 0.4,
            }}
          >
            motiveva.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
