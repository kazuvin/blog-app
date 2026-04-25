import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// Required by Next.js when `output: "export"` is set — the OG image route is a
// route handler under the hood and must opt into static rendering.
export const dynamic = "force-static";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#ededed",
        padding: "80px",
      }}
    >
      <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1 }}>{SITE_NAME}</div>
      <div style={{ fontSize: 36, marginTop: 32, opacity: 0.7, lineHeight: 1.3 }}>
        {SITE_DESCRIPTION}
      </div>
    </div>,
    { ...size }
  );
}
