import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

// Required by Next.js when `output: "export"` is set.
export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#ededed",
        fontSize: 96,
        fontWeight: 700,
        letterSpacing: -2,
      }}
    >
      {SITE_NAME.charAt(0).toUpperCase()}
    </div>,
    { ...size }
  );
}
