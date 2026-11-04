import { ImageResponse } from "next/og";

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
          backgroundColor: "#030014",
          backgroundImage:
            "radial-gradient(circle at 30% 22%, rgba(229,156,255,0.22), transparent 52%), radial-gradient(circle at 76% 82%, rgba(80,70,228,0.28), transparent 55%)",
        }}
      >
        <div
          style={{
            width: 118,
            height: 118,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            border: "2px solid rgba(185,168,255,0.5)",
            color: "#f4f1ff",
            fontSize: 62,
            fontWeight: 500,
          }}
        >
          <svg
            width="62"
            height="62"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f4f1ff"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>
    ),
    { ...size },
  );
}
