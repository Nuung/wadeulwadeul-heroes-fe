import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export const API_PREFIX = "/wadeul";
export const BASE_SERVER_URL = "https://goormthon-5.goorm.training";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const buildTimestamp = Date.now();

  return {
    plugins: [react()],
    css: { postcss: "./postcss.config.js" },

    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        [API_PREFIX]: {
          target: BASE_SERVER_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/wadeul/, ""),
          configure: (proxy, _options) => {
            if (isProduction) return;

            proxy.on("proxyReq", (proxyReq, req, _res) => {
              const hostHeader = proxyReq.getHeader("host");
              console.log(
                `[Proxy] ${req.method} ${req.url} -> ${proxyReq.protocol}//${hostHeader}${proxyReq.path}`
              );
            });

            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(`[Proxy] Response ${proxyRes.statusCode} ${req.url}`);
            });

            proxy.on("error", (err) => console.error("[Proxy] Error: ", err));
          },
        },
      },
    },

    resolve: {
      alias: {
        "@": resolve("src"),
        "@assets": resolve("src/assets"),
        "@entities": resolve("src/entities"),
        "@features": resolve("src/features"),
        "@pages": resolve("src/pages"),
        "@shared": resolve("src/shared"),
      },
    },

    build: {
      minify: "esbuild",
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: !isProduction,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router"],
          },
          chunkFileNames: isProduction
            ? `assets/[name]-[hash]-${buildTimestamp}.js`
            : "assets/[name]-[hash].js",
          entryFileNames: isProduction
            ? `assets/[name]-[hash]-${buildTimestamp}.js`
            : "assets/[name]-[hash].js",
          assetFileNames: isProduction
            ? `assets/[name]-[hash]-${buildTimestamp}.[ext]`
            : "assets/[name]-[hash].[ext]",
        },
      },
    },
  };
});
