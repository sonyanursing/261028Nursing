// 이 파일이 하는 일: Vite(빌드 도구) 설정입니다. 보통은 고칠 필요가 없습니다.
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Firebase 라이브러리가 커서 기본 경고 기준(500kB)을 넘습니다. 동작에는 문제가 없어 기준만 올립니다.
    chunkSizeWarningLimit: 1000,
  },
});
