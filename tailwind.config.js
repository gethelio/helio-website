import { grays, palettes } from '@tailus/themer-plugins'
import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'selector',
    theme: {
        extend: {
            keyframes: {
                "logo-marquee": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
            },
            animation: {
                "logo-marquee": "logo-marquee 42s linear infinite",
            },
            colors: {
                ...palettes.trust,
                gray: grays.zinc,
                main: {
                    50: '#FFF4ED',
                    100: '#FFE6D5',
                    200: '#FECCAA',
                    300: '#FDAB74',
                    400: '#FB7E3C',
                    500: '#FF4D00',
                    600: '#E04300',
                    700: '#B93500',
                    800: '#932C00',
                    900: '#7A2600',
                    950: '#421200',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
            },
        },
    },
    plugins: [typography, animate],
}
