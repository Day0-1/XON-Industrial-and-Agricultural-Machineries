import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#a1a1aa",
          }}
        >
          XON
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Industrial &amp; Agricultural Machineries
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            lineHeight: 1.4,
            color: "#d4d4d8",
            maxWidth: 800,
          }}
        >
          Browse products · Inquire on WhatsApp
        </div>
      </div>
    ),
    { ...size },
  );
}
