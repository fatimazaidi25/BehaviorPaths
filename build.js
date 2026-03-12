const esbuild = require("esbuild");
const fs = require("fs");

// ── Lucide icon shim (only icons used in the app) ──────────────────
const ICONS = [
  "Sprout","Camera","Leaf","BarChart2","Search","Home","Brain",
  "ArrowRightCircle","CheckCircle","BookOpen","Users","Star","Shield",
  "Target","FileText","LogOut","Eye","Crosshair","Sparkles","VolumeX","AlertTriangle"
];

const shimSrc = `
import React from "react";
const icon = () => ({ size=24, color="currentColor", strokeWidth=2, ...p }) =>
  React.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:size,height:size,
    viewBox:"0 0 24 24",fill:"none",stroke:color,strokeWidth,
    strokeLinecap:"round",strokeLinejoin:"round",...p},
    React.createElement("rect",{width:16,height:16,x:4,y:4,rx:2}));
${ICONS.map(n => `export const ${n} = icon();`).join("\n")}
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("_lucide_shim.jsx", shimSrc);

// ── HTML shell ─────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>BehaviorPath — BASIL Behavior Lab</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#FDFAF5;font-family:'DM Sans',sans-serif}
    #root{min-height:100vh}
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="./bundle.js"></script>
</body>
</html>`;

fs.writeFileSync("dist/index.html", html);

// ── Entry point ────────────────────────────────────────────────────
const entry = `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./behaviorpath_final.jsx";
createRoot(document.getElementById("root")).render(React.createElement(App));
`;
fs.writeFileSync("_entry.jsx", entry);

// ── esbuild ───────────────────────────────────────────────────────
esbuild.build({
  entryPoints: ["_entry.jsx"],
  bundle: true,
  outfile: "dist/bundle.js",
  platform: "browser",
  format: "iife",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{
    name: "lucide-shim",
    setup(build) {
      const path = require("path");
      build.onResolve({ filter: /^lucide-react$/ }, () => ({
        path: path.resolve("_lucide_shim.jsx"),
      }));
    },
  }],
  loader: { ".jsx": "jsx" },
  jsx: "automatic",
  minify: true,
}).then(() => {
  fs.unlinkSync("_lucide_shim.jsx");
  fs.unlinkSync("_entry.jsx");
  console.log("Build complete → dist/");
}).catch(err => {
  console.error(err);
  process.exit(1);
});
