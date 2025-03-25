import type { Config } from "tailwindcss";
const tailwindAnimate = require("tailwindcss-animate");
const svgToDataUri = require("mini-svg-data-uri");

const {
	default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
// const flattenColorPalette = require( 'tailwindcss/lib/util/flattenColorPalette' )

const storyPaths = [
	"./src/**/*.mdx",
	"./src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	"./src/**/**/*.stories.@(js|jsx|mjs|ts|tsx)",
];

function addVariablesForColors({ addBase, theme }: any) {
	const allColors = flattenColorPalette(theme("colors"));
	const newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
	);

	addBase({
		":root": newVars,
	});
}

const config = {
	darkMode: ["class"],
	content: [
		"./src/components/**/*.{ts,tsx}",
		"./src/app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./src/stories/*.{ts,tsx}",
		"./src/stories/**/*.stories.{ts,tsx}",
		...storyPaths,
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				neueHaas: ["var(--font-neue-haas)"],
				monument: ["var(--font-monument)"],
				monumentMono: ["var(--font-monument-mono)"],
				lukasSans: ["var(--font-lukas-sans})"],
			},
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
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			animation: {
				spin: "spin 1s linear infinite",
				"radar-spin": "radar-spin 10s linear infinite",
				shine: "shine 2s linear infinite",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				spotlight: "spotlight 2s ease .75s 1 forwards",
				"meteor-effect": "meteor 5s linear infinite",
				"text-reveal": "text-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s",
				"border-flip": "flip 6s infinite steps(2, end)",
				"border-rotate": "rotate 3s linear infinite both",
				"border-width": "border-width 3s infinite alternate",
				"zoom-in": "zoom-in",
				moveUp: "moveUp 1.4s ease forwards",
				appear: "appear 1s 1s forwards",
				"show-hide": "show-hide 12s ease 0s infinite",
				shadow: "shadow 12s ease 0s infinite",
				"up-2-8": "go-up-2-8 12s ease 0s infinite",
				"up-3-7": "go-up-3-7 12s ease 0s infinite",
				"up-4-6": "go-up-4-6 12s ease 0s infinite",
				"up-5": "go-up-5 12s ease 0s infinite",
				"down-2-8": "go-down-2-8 12s ease 0s infinite",
				"down-3-7": "go-down-3-7 12s ease 0s infinite",
				"down-4-6": "go-down-4-6 12s ease 0s infinite",
				"down-5": "go-down-5 12s ease 0s infinite",
			},
			keyframes: {
				"show-hide": {
					"0%, 100%": {
						opacity: "0",
						transform: "scale(0.8)",
					},
					"20%, 80%": {
						opacity: "1",
						transform: "scale(1)",
					},
				},
				shadow: {
					"0%, 10%, 90%, 100%": {
						opacity: "0",
					},
					"45%, 55%": {
						opacity: "0.25",
						height: "0.25vmin",
					},
				},
				"go-up-2-8": {
					"0%, 10%, 90%, 100%": {
						top: "0",
					},
					"40%, 60%": {
						top: "-0.6vmin",
					},
				},
				moveUp: {
					"0%": {
						transform: "translateY(5%)",
						opacity: "0",
					},
					"100%": {
						transform: "translateY(0%)",
						opacity: "1",
					},
				},
				appear: {
					from: {
						opacity: "0",
					},
					to: {
						opacity: "1",
					},
				},
				"zoom-in": {
					"0%": {
						transform: "translateZ(-1000px)",
						opacity: "0",
						filter: "blur(5px)",
					},
					"50%": {
						transform: "translateZ(0px)",
						opacity: "1",
						filter: "blur(0px)",
					},
					"100%": {
						transform: "translateZ(1000px)",
						opacity: "0",
						filter: "blur(5px)",
					},
				},
				shine: {
					from: {
						backgroundPosition: "0 0",
					},
					to: {
						backgroundPosition: "-200% 0",
					},
				},
				"radar-spin": {
					from: {
						transform: "rotate(20deg)",
					},
					to: {
						transform: "rotate(380deg)",
					},
				},
				"border-width": {
					from: {
						width: "10px",
						opacity: "0",
					},
					to: {
						width: "100px",
						opacity: "1",
					},
				},
				flip: {
					to: {
						transform: "rotate(360deg)",
					},
				},
				rotate: {
					to: {
						transform: "rotate(90deg)",
					},
				},
				"text-reveal": {
					"0%": {
						transform: "translate(0, 100%)",
					},
					"100%": {
						transform: "translate(0, 0)",
					},
				},
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				spotlight: {
					"0%": {
						opacity: "0",
						transform: "translate(-72%, -62%) scale(0.5)",
					},
					"100%": {
						opacity: "1",
						transform: "translate(-50%,-40%) scale(1)",
					},
				},
				meteor: {
					"0%": {
						transform: "rotate(215deg) translateX(0)",
						opacity: "1",
					},
					"70%": {
						opacity: "1",
					},
					"100%": {
						transform: "rotate(215deg) translateX(-500px)",
						opacity: "0",
					},
				},
			},
			dropShadow: {
				glow: "0 0 1px rgba(255, 255, 255, 1)",
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(ellipse at center, var(--tw-gradient-stops))",
				"dots-pattern": "radial-gradient(transparent 1px, white 1px)",
				"dots-pattern-dark": "radial-gradient(transparent 1px, rgb(0 0 0) 1px)",
			},
		},
	},
	plugins: [
		tailwindAnimate,
		addVariablesForColors,
		({ matchUtilities, theme }: any) => {
			matchUtilities(
				{
					"bg-grid": (value: any) => ({
						backgroundImage: `url("${svgToDataUri(
							`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
						)}")`,
					}),
					"bg-grid-small": (value: any) => ({
						backgroundImage: `url("${svgToDataUri(
							`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
						)}")`,
					}),
					"bg-dot": (value: any) => ({
						backgroundImage: `url("${svgToDataUri(
							`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
						)}")`,
					}),
				},
				{
					values: flattenColorPalette(theme("backgroundColor")),
					type: "color",
				},
			);
		},
		require("tailwindcss-motion"),
	],
} satisfies Config;

export default config;
