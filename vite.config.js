import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    outDir: "assets/js/dist",
    rollupOptions: {
      input: {
        frontend: path.resolve(__dirname, "assets/js/kazana-pay.js"),
        admin: path.resolve(__dirname, "assets/js/kazana-admin.js"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "frontend") return "kazana-pay.bundle.js";
          if (chunkInfo.name === "admin") return "kazana-admin.bundle.js";
          return "[name].bundle.js";
        },
        //format: "iife", switching to ES for now
        format: "es",
        inlineDynamicImports: false, // Force disable

      },
      external: ["ethers", "base-org/account", "nft.storage"],
    },
    
  },
  json: {
  stringify: true,
},

});
