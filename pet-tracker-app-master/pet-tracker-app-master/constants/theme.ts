export const theme = {
  colors: {
    primary: {
      DEFAULT: "#4F46E5", // Indigo
      light: "#818CF8",
      dark: "#3730A3",
    },
    secondary: {
      DEFAULT: "#10B981", // Emerald
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      DEFAULT: "#FFFFFF",
      dark: "#1F2937",
    },
    text: {
      DEFAULT: "#1F2937",
      light: "#6B7280",
      dark: "#F9FAFB",
    },
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },
  borderRadius: {
    sm: 4,
    DEFAULT: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    fontFamily: {
      sans: "System",
      heading: "System",
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
    },
  },
} as const;

export type Theme = typeof theme;
