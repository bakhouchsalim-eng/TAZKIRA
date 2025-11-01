// ✅ Configuration Next.js compatible ESM (.mjs) — version mise à jour
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  reactStrictMode: true,

  // 🧩 Alias @ vers la racine du projet
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },

  // ✅ Nouveau nom correct pour Next.js 15
  serverExternalPackages: ["fs", "path"],

  // 🚀 Autorise les fichiers /uploads/audio
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/uploads/:path*",
      },
    ];
  },

  // 🌍 Autorise le chargement via CORS
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default config;