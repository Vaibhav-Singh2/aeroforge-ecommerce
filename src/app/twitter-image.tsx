import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "AeroForge Labs – Next-Gen Drones, Aeronautics & Rapid Prototyping";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#080c14",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(2, 132, 199, 0.25) 0%, rgba(8, 12, 20, 1) 75%)",
          position: "relative",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "24px",
              backgroundColor: "rgba(14, 165, 233, 0.15)",
              border: "2px solid rgba(56, 189, 248, 0.4)",
            }}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 6L40 17L35 24L24 16L13 24L8 17L24 6Z"
                fill="#38bdf8"
              />
              <path
                d="M24 15L35 33L24 28L13 33L24 15Z"
                fill="#0284c7"
              />
              <path
                d="M24 26L28 35L24 42L20 35L24 26Z"
                fill="#f59e0b"
              />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "44px",
                  fontWeight: 900,
                  color: "#f8fafc",
                  letterSpacing: "-0.03em",
                }}
              >
                AeroForge
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#38bdf8",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Labs
              </span>
            </div>
            <span
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              Aeronautics & Rapid Prototyping
            </span>
          </div>
        </div>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "950px",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: "0 0 20px 0",
          }}
        >
          High-Performance FPV Drones & Custom Rapid Manufacturing
        </h1>

        <div
          style={{
            position: "absolute",
            bottom: "30px",
            color: "#64748b",
            fontSize: "15px",
            fontFamily: "monospace",
          }}
        >
          aeroforge-labs.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
