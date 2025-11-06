//TO BUNDLE UP THIS FILE SEPARATELY, RUN:
// ENTRY=pay npx vite build
// ENTRY=admin npx vite build


import { defineConfig } from "vite";
import path from "path";

const entry = process.env.ENTRY || "pay"; // default = kazana-pay.js

export default defineConfig({
  build: {
    outDir: "assets/js/dist",
    target: "es2018",
    rollupOptions: {
      input: path.resolve(__dirname, `assets/js/kazana-${entry}.js`),
      output: {
        entryFileNames: `kazana-${entry}.bundle.js`,
        format: "iife",
        name: entry === "pay" ? "KazanaPay" : "KazanaAdmin",
        inlineDynamicImports: true,
      },
    },
    emptyOutDir: false,
  },
});





// // vite.config.js
// import { defineConfig } from "vite";
// import path from "path";

// export default defineConfig({
//   build: {
//     outDir: "assets/js/dist",
//     target: "es2018",
//     rollupOptions: {
//       input: {
//         frontend: path.resolve(__dirname, "assets/js/kazana-pay.js"),
//         admin: path.resolve(__dirname, "assets/js/kazana-admin.js"),
//       },
//       output: {
//         entryFileNames: (chunkInfo) => {
//           if (chunkInfo.name === "frontend") return "kazana-pay.bundle.js";
//           if (chunkInfo.name === "admin") return "kazana-admin.bundle.js";
//           return "[name].bundle.js";
//         },
//         format: "iife", // ✅ self-contained script
//         name: "KazanaPay", // global variable
//         inlineDynamicImports: false, // ✅ force single file
//       },
//     },
//     commonjsOptions: {
//       transformMixedEsModules: true,
//     },
//     emptyOutDir: false,
//   },
//   optimizeDeps: {
//     include: ["ethers", "lighthouse-web3/sdk"],
//   },
// });


// import { defineConfig } from "vite";
// import path from "path";

// export default defineConfig({
//   build: {
//     outDir: "assets/js/dist",
//     rollupOptions: {
//       input: {
//         frontend: path.resolve(__dirname, "assets/js/kazana-pay.js"),
//         admin: path.resolve(__dirname, "assets/js/kazana-admin.js"),
//       },
//       output: {
//         entryFileNames: (chunkInfo) => {
//           if (chunkInfo.name === "frontend") return "kazana-pay.bundle.js";
//           if (chunkInfo.name === "admin") return "kazana-admin.bundle.js";
//           return "[name].bundle.js";
//         },
//         //format: "iife", switching to ES for now
//         format: "es",
//         inlineDynamicImports: false, // Force disable

//       },
//       external: ["ethers", "base-org/account", "nft.storage"],
//     },
    
//   },
//   json: {
//   stringify: true,
// },

// });
