
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
    		fontFamily: {
    			sans: [
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			],
    			serif: [
    				'Inter',
    				'system-ui',
    				'sans-serif'
    			],
    			mono: [
    				'JetBrains Mono',
    				'monospace'
    			]
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
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
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			},
    			warm: {
    				terracotta: 'hsl(var(--warm-terracotta))',
    				sage: 'hsl(var(--warm-sage))',
    				sand: 'hsl(var(--warm-sand))',
    				rose: 'hsl(var(--warm-rose))',
    				cream: 'hsl(var(--warm-cream))',
    				stone: 'hsl(var(--warm-stone))',
    				earth: 'hsl(var(--warm-earth))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			fadeIn: {
    				'0%': {
    					opacity: '0',
    					transform: 'translateY(10px)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateY(0)'
    				}
    			},
    			slideIn: {
    				'0%': {
    					opacity: '0',
    					transform: 'translateX(-10px)'
    				},
    				'100%': {
    					opacity: '1',
    					transform: 'translateX(0)'
    				}
    			},
    			float: {
    				'0%, 100%': {
    					transform: 'translateY(0px)'
    				},
    				'50%': {
    					transform: 'translateY(-10px)'
    				}
    			},
    			petalFall: {
    				'0%': {
    					transform: 'translateY(-100px) rotate(0deg)',
    					opacity: '0'
    				},
    				'10%': {
    					opacity: '1'
    				},
    				'90%': {
    					opacity: '1'
    				},
    				'100%': {
    					transform: 'translateY(100vh) rotate(360deg)',
    					opacity: '0'
    				}
    			},
    			'background-gradient': {
    				'0%, 100%': {
    					transform: 'translate(0, 0)',
    					animationDelay: 'var(--background-gradient-delay, 0s)'
    				},
    				'20%': {
    					transform: 'translate(calc(100% * var(--tx-1, 1)), calc(100% * var(--ty-1, 1)))'
    				},
    				'40%': {
    					transform: 'translate(calc(100% * var(--tx-2, -1)), calc(100% * var(--ty-2, 1)))'
    				},
    				'60%': {
    					transform: 'translate(calc(100% * var(--tx-3, 1)), calc(100% * var(--ty-3, -1)))'
    				},
    				'80%': {
    					transform: 'translate(calc(100% * var(--tx-4, -1)), calc(100% * var(--ty-4, -1)))'
    				}
    			},
    			meteor: {
    				"0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
    				"70%": { opacity: "1" },
    				"100%": {
    					transform: "rotate(215deg) translateX(-500px)",
    					opacity: "0",
    				},
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-in': 'fadeIn 0.5s ease-out',
    			'slide-in': 'slideIn 0.5s ease-out',
    			float: 'float 3s ease-in-out infinite',
    			'petal-fall': 'petalFall 15s linear infinite',
    			'background-gradient': 'background-gradient var(--background-gradient-speed, 15s) cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite',
    			"meteor-effect": "meteor 5s linear infinite"
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
