import chroma from "chroma-js";

export { chroma };

export function hexToRgba(hex: string, alpha: number): string {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const ICON_GREEN = `#adf0dd`;
export const ICON_BLUE = `#27F1FF`;

export const paletteTwo = {
	green: `#6FB08C`,
	darkBlue: `#000100`,
	cambridge: `#407663`,
	richBlack: `#000102`,
	black: `#030304`,
};

export const paletteAltTwo = {
	khaki: `#B2A581`,
	black: `#000001`,
	gray: `#4E5969`,
	smoke: `#130F0E`,
	silver: `#C5CBCC`,
};
export const EVENTS_GREEN = `#79FFE1`;
export const SME_BLUE = `#27F1FF`;
export const TESTIMONIES_RED = `#FA1E4E`;
export const TOPICS_PINK = `#E393E6`;
export const ORGANIZATIONS_PURPLE = `#7c89b9`;

export const NEONS = {
	pink: `#E393E6`,
	green: `#79FFE1`,
	blue: `#27F1FF`,
	orange: `#F7A072`,
	yellow: `#FEED72`,
};

export const DOMAIN_MODEL_COLORS: any = {
	topics: "#E393E6",
	events: "#79FFE1",
	personnel: "#27F1FF",
	organizations: "#7c89b9",
	testimonies: "#FA1E4E",
	root: "#27F1FF",
};

export const paletteBlue = {
	Nocturnal: "#74797f",
	Skyscraper: "#d1d9e2",
	"Cotton Boll": "#e5effa",
	"First Snow": "#e5effb",
	"Freeze Up": "#e0ebf9",
	"Cold Shoulder": "#cddbeb",
};

export const palette: Record<string, string> = {
	forest: `#407663`,
	darkBlue: `#09101D`,
	cambridge: `#6FB08C`,
	richBlack: `#030513`,
	black: `#060404`,
	silver: `#C5CBCC`,

	gray: `#4e5969`,
	brown: `#28180B`,
	smoke: `#130F0E`,
	khaki: `#B2A581`,
	...NEONS,
};
export const dataVizPaletteTwo = {
	indigoBlue: "#464782",
	steelBlue: "#516c8f",
	darkLavender: "#8e6fcf",
	boringBlue: "#3ea8f7",
	electricBlue: "#33c9fb",
	cyan: "#42f4fe",
};
export const DATA_VIZ_COLOR_PALETTE = {
	violet: "#803583",
	slate: "#58768d",
	blurple: "#7c89b9",
	lavender: "#b391dd",
	lilac: "#cba6fa",
	skyBlue: "#7ae0fb",
	aquaMint: "#79ffe1",
	...dataVizPaletteTwo,
};

export const ENTITY_DATA_VIZ_COLOR_PALETTE: any = {
	topics: DATA_VIZ_COLOR_PALETTE.blurple,
	events: DATA_VIZ_COLOR_PALETTE.skyBlue,
	personnel: DATA_VIZ_COLOR_PALETTE.lavender,
	organizations: DATA_VIZ_COLOR_PALETTE.violet,
	testimonies: DATA_VIZ_COLOR_PALETTE.slate,
	artifacts: DATA_VIZ_COLOR_PALETTE.lilac,
};

const maybe = {
	1: {
		"Majorelle Gardens": "#387468",
		Spearmint: "#55cfba",
		Treetop: "#66dcc7",
		Mauvelous: "#72d2c0",
		"Electric Blue": "#7fcab8",
		"Aqua Mint": "#97c9af",
	},
	2: {
		"Majorelle Gardens": "#3e7a67",
		Spearmint: "#55bc9d",
		Treetop: "#97baae",
		Mauvelous: "#cab0bc",
		"Elastic Pink": "#f2a3c9",
		"Roseate Spoonbill": "#d8a8be",
	},
	3: {
		"Sea Lion": "#858e9b",
		"Puffy Cloud": "#d4e1f7",
		"Foundation White": "#e4e7fd",
		"Minute Mauve": "#f0e7fc",
		"Strawberry Bonbon": "#f9e7fb",
		"Delicate Cloud": "#d9dee9",
	},
	4: {
		"Night Owl": "#607e89",
		Wavelet: "#89c7d4",
		"Water Nymph": "#80cfde",
		"Summer of '82": "#72d2e3",
		"Splashing Wave": "#67d5e8",
		"Gentle Sky": "#99c4d9",
	},
	5: {
		"Muted Berry": "#967884",
		"Cherry Blossom": "#f0bcd1",
		"LA Vibes": "#eccfe1",
		"Velvet Scarf": "#e1deed",
		"Freezing Vapor": "#d4ebf7",
		"Cold Wave": "#c1e0e2",
	},
};
// 1px solid rgb(121, 255, 225)
// Dark palette option
/*
$black: #010000ff;
$silver: #a8a3a4ff;
$davys-gray: #524f50ff;
$black-2: #09080bff;
$raisin-black: #2f2826ff;


$gradient-top: linear-gradient(0deg, #010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);
$gradient-right: linear-gradient(90deg, #010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);
$gradient-bottom: linear-gradient(180deg, #010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);
$gradient-left: linear-gradient(270deg, #010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);
$gradient-top-right: linear-gradient(45deg, #010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);
$gradient-bottom-right: linear-gradient(135deg, #010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);
$gradient-top-left: linear-gradient(225deg, #010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);
$gradient-bottom-left: linear-gradient(315deg, #010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);
$gradient-radial: radial-gradient(#010000ff, #a8a3a4ff, #524f50ff, #09080bff, #2f2826ff);

*/

const blackAlter = {
	"Charcoal Gray ": "#121212",
	"Dark Slate Gray ": " #191919",
	"Outer Space ": " #252525",
	"Rich Black ": " #0A0A0A",
	"Coffee Bean ": " #1B1B1B",
	"Dark Gray ": " #212427",
	"Oil Black ": " #0C0C0C",
	"Obsidian ": " #0B1215",
	"Ebony ": " #222428",
	"Black Chocolate ": "#100D08",
	"Gunmetal ": "#1D1F21",
	"Smoky Black ": "#101720",
	"Oxford Blue ": "#212A37",
	"Eerie Black ": "#232023",
	"Jet Black ": "#161618",
	"Iridium ": "#181818",
	Arsenic: "#11181C",
	"Charleston Green": "#212124",
	"Dark Gunmetal": "#222428",
	Jet: "#2A2A2A",
	"Black Olive": "#242526",
	"Midnight Blue": "#212121",
};

const gorgeous = [
	"#1a1b1a",
	"#222422",
	"#5b555c",
	"#ab98ac",
	"#e9cfeb",
	"#d1c7d2",
	"#202024",
	"#1e1e22",
	"#395157",
	"#5b9da7",
	"#7fdce7",
	"#a1d2d9",
	"#080a08",
	"#0c0e0b",
	"#24403b",
	"#3a867d",
	"#58c5b7",
	"#90cfbe",
];

const hueAestheticPAlette = [
	"#2c1a25",
	"#2a1823",
	"#62382b",
	"#af6633",
	"#f09144",
	"#eba47e",
	"#0d0705",
	"#0c0605",
	"#493b37",
	"#a1827a",
	"#edc1b6",
	"#ebccc3",
	//
	"#B26646",
	"#D3A592",
	"#DFBBAC",
	"#B4816C",
	"#CC8F76",
];
const caseFilePalette = {
	dark: "#06030D",
	red: "#FA1E4E",
	gradient:
		"background: linear-gradient(270deg, #06030D 28.65%, rgba(6, 3, 13, 0.00) 100%)",
};

//--------------------------------------------------------------------------------------//
//                                   Advanced Borders                                   //
//--------------------------------------------------------------------------------------//

/* 
.gradient-border {
  border: 10px solid;
  border-image: linear-gradient(45deg, #FA1E4E, rgba(0,0,0,0.5)) 1;
}

.image-border {card
  border: 10px solid transparent;
  border-image: url('border-image.png') 30 round;
}

*/

// - Tailwind

// { 'raisin_black': { DEFAULT: '#231D1D', 100: '#070606', 200: '#0e0c0c', 300: '#161212', 400: '#1d1818', 500: '#231d1d', 600: '#544747', 700: '#856f6f', 800: '#ae9e9e', 900: '#d7cfcf' }, 'licorice': { DEFAULT: '#120C11', 100: '#040203', 200: '#070507', 300: '#0b070a', 400: '#0f0a0e', 500: '#120c11', 600: '#4c3348', 700: '#85597e', 800: '#b28cac', 900: '#d9c5d5' }, 'raisin_black': { DEFAULT: '#28282E', 100: '#080809', 200: '#101013', 300: '#18181c', 400: '#202025', 500: '#28282e', 600: '#50505c', 700: '#777789', 800: '#a4a4b0', 900: '#d2d2d8' }, 'taupe_gray': { DEFAULT: '#A29EA0', 100: '#211f20', 200: '#423f40', 300: '#625e60', 400: '#837e81', 500: '#a29ea0', 600: '#b5b2b4', 700: '#c8c5c6', 800: '#dad9d9', 900: '#edecec' }, 'black': { DEFAULT: '#07070C', 100: '#020203', 200: '#030305', 300: '#050508', 400: '#06060a', 500: '#07070c', 600: '#2c2c4b', 700: '#505088', 800: '#8484b7', 900: '#c1c1db' } }

// [
//   "#2e676d",
//   "#43bac6",
//   "#4cd6e5",
//   "#51e1f1",
//   "#6ae9f9",
//   "#a8e5ee"
// ]

// [
//   "hsl(305,11.11%,78.82%)",
//   "hsl(338.18,32.04%,79.8%)",
//   "hsl(343.33,54%,80.39%)",
//   "hsl(346.23,46.56%,74.31%)",
//   "hsl(343.08,16.18%,52.75%)",
//   "hsl(337.89,11.38%,32.75%)",
//   "hsl(270,5.26%,14.9%)",
//   "hsl(210,11.11%,10.59%)",
//   "hsl(210,10.71%,10.98%)",
//   "hsl(214.29,11.86%,11.57%)"
// ]

// [
//   "rgb(193,200,216)",
//   "rgb(196,204,224)",
//   "rgb(200,209,232)",
//   "rgb(186,195,219)",
//   "rgb(132,140,159)",
//   "rgb(83,89,102)",
//   "rgb(38,43,51)",
//   "rgb(23,27,33)",
//   "rgb(19,22,27)",
//   "rgb(14,16,21)"
// ]

// [
//   "rgb(8,10,14)",
//   "rgb(16,18,23)",
//   "rgb(21,24,30)",
//   "rgb(26,30,37)",
//   "rgb(78,84,97)",
//   "rgb(138,145,165)",
//   "rgb(202,212,238)",
//   "rgb(198,207,228)",
//   "rgb(194,201,219)",
//   "rgb(190,196,209)"
// ]

// [

// ]

// [
//   "rgb(10,16,18)",
//   "rgb(42,53,58)",
//   "rgb(74,94,102)",
//   "rgb(108,138,151)",
//   "rgb(145,185,202)"
// ]

// [
//   "#dad9e1",
//   "#b4b7c5",
//   "#8b8f9a",
//   "#535962",
//   "#323b45",
//   "#19232d"
// ]

// $onyx: #000
// $white: #fff
// $ketchup - mayo: rgb( 145, 185, 202 )
// $leather: #4f4c4d
// $light - azur: #C7E3F9
// $tomato: #d64444

// Inspired by https://www.awwwards.com/sites/space-safari-to-erikte-planet
const ULTRATERRESTRIAL_COLORS = {
	black: "#101918",
	blue: "#9BFFF5",
};
