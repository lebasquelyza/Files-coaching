
import type { Config } from "tailwindcss"
// @ts-ignore
import preset from "../../packages/config/tailwind-preset"
const config: Config = {
  presets: [preset],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../../packages/ui/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
export default config
