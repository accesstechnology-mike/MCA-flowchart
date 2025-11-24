import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MCA Decision Making Pathway - Mental Capacity Act Assessment Tool",
    short_name: "MCA Pathway",
    description: "Professional decision-making tool for assessing mental capacity under the Mental Capacity Act (2005)",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["healthcare", "medical", "productivity"],
    lang: "en-GB",
    dir: "ltr",
    prefer_related_applications: false,
  };
}

