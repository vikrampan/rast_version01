import type { Config } from "tailwindcss";
import type { PluginAPI } from 'tailwindcss/types/config';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // Dashboard specific colors
        dashboard: {
          sidebar: {
            DEFAULT: "#1a1a1a",
            hover: "#2a2a2a",
            active: "#333333",
          },
          content: {
            DEFAULT: "#121212",
            paper: "#1e1e1e",
          },
          accent: {
            primary: "#FFC857",
            secondary: "#4A90E2",
          }
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          "0%": {
            opacity: "0",
            transform: "translateX(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        scale: {
          "0%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        gradient: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(0)' }
        },
        sidebarExpand: {
          '0%': { width: '4rem' },
          '100%': { width: '16rem' }
        },
        sidebarCollapse: {
          '0%': { width: '16rem' },
          '100%': { width: '4rem' }
        },
        menuSlideDown: {
          '0%': { height: '0', opacity: '0' },
          '100%': { height: 'var(--menu-height)', opacity: '1' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        fadeInUp: "fadeInUp 0.5s ease-out",
        slideIn: "slideIn 0.5s ease-out",
        scale: "scale 20s ease-in-out infinite",
        gradient: "gradient 15s ease infinite",
        shake: "shake 0.5s ease-in-out",
        pulse: "pulse 2s ease-in-out infinite",
        slideInFromLeft: 'slideInFromLeft 0.5s ease-out',
        slideInFromRight: 'slideInFromRight 0.5s ease-out',
        fadeInDown: 'fadeInDown 0.5s ease-out',
        bounce: 'bounce 2s infinite',
        sidebarExpand: 'sidebarExpand 0.3s ease-out forwards',
        sidebarCollapse: 'sidebarCollapse 0.3s ease-out forwards',
        menuSlideDown: 'menuSlideDown 0.3s ease-out forwards'
      },
      height: {
        'screen-navbar': 'calc(100vh - 4rem)',
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addVariant }: PluginAPI) {
      addVariant('sidebar-expanded', '&[data-expanded="true"]')
      addVariant('sidebar-collapsed', '&[data-expanded="false"]')
    }
  ],
} satisfies Config;