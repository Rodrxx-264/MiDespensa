import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bosque: "#2D6A4F",
        menta: "#74C69D",
        naranja: "#F4A261",
        crema: "#FEFAE0",
        tinta: "#2D3436"
      },
      borderRadius: { card: "12px", control: "8px" },
      boxShadow: { suave: "0 16px 40px rgba(45, 52, 54, 0.10)" }
    }
  },
  plugins: []
};

export default config;
