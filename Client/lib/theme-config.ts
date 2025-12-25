// Theme configuration types and utilities

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    accent: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    fontSize: {
      base: string
      h1: string
      h2: string
      h3: string
    }
  }
  layout: {
    containerWidth: "1024" | "1280" | "1536" | "full"
    borderRadius: "none" | "small" | "medium" | "large"
    sectionSpacing: "compact" | "normal" | "relaxed"
    headerStyle: "fixed" | "sticky" | "static"
  }
}

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: "#8b5cf6",
    secondary: "#10b981",
    background: "#ffffff",
    foreground: "#0a0a0a",
    muted: "#f5f5f5",
    accent: "#f97316",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: {
      base: "16px",
      h1: "48px",
      h2: "36px",
      h3: "24px",
    },
  },
  layout: {
    containerWidth: "1280",
    borderRadius: "medium",
    sectionSpacing: "normal",
    headerStyle: "fixed",
  },
}

export function generateCSSVariables(theme: ThemeConfig): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-background: ${theme.colors.background};
      --color-foreground: ${theme.colors.foreground};
      --color-muted: ${theme.colors.muted};
      --color-accent: ${theme.colors.accent};
      
      --font-heading: ${theme.typography.headingFont}, sans-serif;
      --font-body: ${theme.typography.bodyFont}, sans-serif;
      
      --container-width: ${theme.layout.containerWidth}px;
      --border-radius: ${
        theme.layout.borderRadius === "none"
          ? "0"
          : theme.layout.borderRadius === "small"
            ? "4px"
            : theme.layout.borderRadius === "medium"
              ? "8px"
              : "16px"
      };
    }
  `
}

export function applyTheme(theme: ThemeConfig) {
  if (typeof document !== "undefined") {
    const style = document.createElement("style")
    style.innerHTML = generateCSSVariables(theme)
    document.head.appendChild(style)
  }
}
