import { ImageResponse } from "next/og";

export const alt =
  "Motiveva — Tu mejor versión, sin ruido. Seguidor de hábitos local-first.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STARS = [
  { left: 120, top: 96, size: 3, opacity: 0.5 },
  { left: 310, top: 170, size: 2, opacity: 0.35 },
  { left: 520, top: 82, size: 2, opacity: 0.45 },
  { left: 880, top: 120, size: 3, opacity: 0.55 },
  { left: 1040, top: 210, size: 2, opacity: 0.4 },
  { left: 740, top: 250, size: 2, opacity: 0.3 },
  { left: 180, top: 400, size: 2, opacity: 0.3 },
  { left: 420, top: 470, size: 3, opacity: 0.35 },
  { left: 980, top: 430, size: 2, opacity: 0.4 },
  { left: 1110, top: 90, size: 2, opacity: 0.5 },
  { left: 60, top: 230, size: 2, opacity: 0.4 },
  { left: 640, top: 520, size: 2, opacity: 0.3 },
];

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
          backgroundColor: "#030014",
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(147,130,255,0.30), transparent 45%), radial-gradient(circle at 12% 96%, rgba(80,70,228,0.24), transparent 50%)",
          color: "#f4f1ff",
          fontFamily: "sans-serif",
          padding: "66px 80px",
        }}
      >
        {STARS.map((star, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              borderRadius: 999,
              backgroundColor: "#d9d2ff",
              opacity: star.opacity,
            }}
          />
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              backgroundImage:
                "linear-gradient(135deg, rgba(229,156,255,0.22), rgba(147,130,255,0.12))",
              border: "1px solid rgba(147,130,255,0.34)",
              color: "#f4f1ff",
              fontSize: 26,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f4f1ff"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.4 }}>
              Motiveva
            </div>
            <div style={{ fontSize: 15, color: "#8b84ad", letterSpacing: 0.4 }}>
              Tu mejor versión
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 78,
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: -3,
            }}
          >
            <span>Tu mejor versión,</span>
            <span style={{ color: "#b9a8ff" }}>sin ruido.</span>
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "#a8a2c4",
              maxWidth: 760,
            }}
          >
            Rachas honestas, estadísticas claras y tus datos bajo tu control.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {["Local-first", "Cuenta opcional", "Sin anuncios", "Gratis"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(147,130,255,0.22)",
                  backgroundColor: "rgba(6,3,23,0.72)",
                  color: "#c9c3e6",
                  fontSize: 18,
                }}
              >
                {chip}
              </div>
            ),
          )}
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              color: "#8b84ad",
              fontSize: 18,
              letterSpacing: 0.5,
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
