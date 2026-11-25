import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载对应 mode 的 .env 文件
  // .env.development
  // .env.production
  // .env
  // 只有以 VITE_ 为前缀的变量才会被 Vite 暴露
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path: string) => path,
        },
      },
    },
  };
});
