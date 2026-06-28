import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bosque: "#12372A",
        menta: "#74C69D",
        naranja: "#B9945D",
        crema: "#F7F4EC",
        tinta: "#111827"
      },
      borderRadius: { card: "12px", control: "8px" },
      boxShadow: { suave: "0 24px 70px rgba(17, 24, 39, 0.08)" }
    }
  },
  plugins: []
};

export default config;
