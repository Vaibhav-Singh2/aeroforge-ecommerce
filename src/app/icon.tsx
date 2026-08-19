import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#090d16",
          borderRadius: "8px",
        }}
      >
        <svg
          width="24"
          height="24"
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
    ),
    {
      ...size,
    }
  );
}
