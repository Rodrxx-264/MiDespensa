import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bosque: "#0D3B32",
        menta: "#1B7F65",
        naranja: "#D6A531",
        crema: "#EEF1EA",
        tinta: "#18201D"
      },
      borderRadius: { card: "12px", control: "8px" },
      boxShadow: { suave: "0 24px 70px rgba(24, 32, 29, 0.10)" }
    }
  },
  plugins: []
};

export default config;
