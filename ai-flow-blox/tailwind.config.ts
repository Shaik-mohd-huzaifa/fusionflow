
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				canvas: {
					DEFAULT: 'hsl(var(--canvas))',
					foreground: 'hsl(var(--canvas-foreground))'
				},
				node: {
					DEFAULT: 'hsl(var(--node))',
					foreground: 'hsl(var(--node-foreground))',
					border: 'hsl(var(--node-border))'
				},
				ai: {
					DEFAULT: 'hsl(var(--ai))',
					foreground: 'hsl(var(--ai-foreground))'
				},
				data: {
					DEFAULT: 'hsl(var(--data))',
					foreground: 'hsl(var(--data-foreground))'
				},
				input: {
					DEFAULT: 'hsl(var(--input-node))',
					foreground: 'hsl(var(--input-node-foreground))'
				},
				output: {
					DEFAULT: 'hsl(var(--output))',
					foreground: 'hsl(var(--output-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.85' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'draw-line': {
					from: { 'stroke-dashoffset': '1000' },
					to: { 'stroke-dashoffset': '0' }
				},
				'node-appear': {
					from: { transform: 'scale(0.8)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'connection-pulse': {
					'0%, 100%': { 'stroke-opacity': '0.8', 'stroke-width': '2px' },
					'50%': { 'stroke-opacity': '1', 'stroke-width': '3px' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'draw-line': 'draw-line 0.8s ease-out forwards',
				'node-appear': 'node-appear 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
				'connection-pulse': 'connection-pulse 2s ease-in-out infinite'
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(20px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
