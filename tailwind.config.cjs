const { fontFamily } = require("tailwindcss/defaultTheme")

function hslVar(name) {
  return `hsl(var(--${name}))`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        message: {
          'received': "hsl(var(--received-message-box-color))",
          'received-box-foreground': "hsl(var(--received-message-box-color-foreground))",
          'sent-box': "hsl(var(--sent-message-box-color))",
          'sent-box-foreground': "hsl(var(--sent-message-box-color-foreground))",
          'sent-username': "hsl(var(--sent-message-username))",
          'received-username': "hsl(var(--received-message-username))",
          'sent-reply-box': hslVar('sent-message-reply-box-color'),
          'sent-reply-box-foreground': hslVar('sent-message-reply-box-color-foreground'),
          'received-reply-box': hslVar('received-message-reply-box-color'),
          'received-reply-box-foreground': hslVar('received-message-reply-box-color-foreground'),
        },
        chat: {
          section: {
            label: hslVar('chat-section-label')
          }
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [...fontFamily.sans]
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar')],
  safelist: [
    {
      pattern: /text-(.*)/
    },
    {
      pattern: /bg-(.*)/
    },
    {
      pattern: /top-(.*)/
    },
    {
      pattern: /bottom-(.*)/
    },
    {
      pattern: /left-(.*)/
    },
    {
      pattern: /right-(.*)/
    },
  ]
}