import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F9FB",
        surface: "#FFFFFF",
        "surface-muted": "#F1F4F9",
        "surface-subtle": "#F6F8FA",
        border: {
          DEFAULT: "#E2E5EA",
          subtle: "#EDF0F4",
          strong: "#CBD5E1",
        },
        navy: {
          DEFAULT: "#0B1F3A",
          900: "#081629",
          800: "#0B1F3A",
          700: "#132D50",
          600: "#1E3E6B",
        },
        clinical: {
          DEFAULT: "#0F6E8C",
          hover: "#0B566E",
          active: "#084154",
          light: "#E6F3F7",
          border: "#B3DBE6",
        },
        slate: {
          muted: "#8C9BAE",
          secondary: "#475569",
        },
        // Colorblind-safe high contrast anatomical segmentation palette
        anatomy: {
          femur: "#0284C7",    // Azure Blue (Femur segmentation)
          "femur-light": "#E0F2FE",
          tibia: "#D97706",    // Amber Gold (Tibia segmentation)
          "tibia-light": "#FEF3C7",
          meniscus: "#0D9488", // Teal/Emerald (Meniscus segmentation)
          "meniscus-light": "#CCFBF1",
        },
        status: {
          success: "#059669",
          "success-bg": "#ECFDF5",
          warning: "#D97706",
          "warning-bg": "#FFFBEB",
          error: "#DC2626",
          "error-bg": "#FEF2F2",
          info: "#0284C7",
          "info-bg": "#F0F9FF",
        }
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(11, 31, 58, 0.05), 0 1px 2px -1px rgba(11, 31, 58, 0.03)",
        elevated: "0 4px 6px -1px rgba(11, 31, 58, 0.07), 0 2px 4px -2px rgba(11, 31, 58, 0.04)",
        viewer: "inset 0 0 0 1px #E2E5EA, 0 2px 8px rgba(11, 31, 58, 0.06)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"IBM Plex Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
