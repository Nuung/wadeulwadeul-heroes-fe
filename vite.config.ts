import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // 설정 파일이 올바르게 실행되는지, 어떤 모드인지 확인하기 위한 로그
  console.log(`[vite.config.ts] Vite가 '${mode}' 모드로 실행 중입니다.`);
  const isProduction = mode === "production-in" || mode === "production-out";

  // 빌드 타임스탬프 생성
  const buildTimestamp = Date.now();

  return {
    plugins: [react()],
    css: {
      postcss: "./postcss.config.js",
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        [process.env.VITE_BASE_URL!]: {
          target: process.env.VITE_BASE_SERVER_URL,
          changeOrigin: true,
          // 프록시 동작을 실시간으로 터미널에 로깅합니다.
          rewrite: (path: any) =>
            path.replace(new RegExp(`^${process.env.VITE_BASE_URL}`), ""),
          configure: (proxy, _options) => {
            if (isProduction) return;
            proxy.on("proxyReq", (proxyReq, req, _res) => {
              const hostHeader = proxyReq.getHeader("host"); // host:port 형식으로 나옵니다.
              console.log(
                `[Vite Proxy] Request: ${req.method} ${req.headers.host}${req.url} -> ${proxyReq.protocol}//${hostHeader}${proxyReq.path}`
              );
            });
            proxy.on("proxyRes", (proxyRes, req, _res) => {
              console.log(
                `[Vite Proxy] Response: ${proxyRes.statusCode} ${req.url}`
              );
            });
            proxy.on("error", (err, _req, _res) => {
              console.error("[Vite Proxy] Error: ", err);
            });
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
      sourcemap: isProduction ? false : true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router"],
            //TODO: 사용하는 라이브러리만 남기고 제거
            // utils: ["date-fns", "lodash", "axios"],
            // i18n: ["react-i18next", "i18next"],
            // query: ["@tanstack/react-query"],
          },
          // 타임스탬프를 포함한 파일명으로 캐시 무효화 강화
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
        treeshake: {
          preset: "recommended",
          moduleSideEffects: false,
        },
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: true,
      target: "es2020",
      cssTarget: "chrome80",
    },
    esbuild: {
      logOverride: { "this-is-undefined-in-esm": "silent" },
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router",
        "react-is",
        "prop-types",
        "@mui/material",
        "@mui/icons-material",
        "@emotion/react",
        "@emotion/styled",
        "date-fns",
        "lodash",
        "axios",
        "react-i18next",
        "i18next",
        "@tanstack/react-query",
        "@tabler/icons-react",
      ],
      exclude: ["@mui/material/colors", "@mui/material/styles"],
      esbuildOptions: {
        target: "es2020",
        supported: {
          "top-level-await": true,
        },
        treeShaking: true,
        minify: true,
        legalComments: "none",
      },
    },
  };
});
