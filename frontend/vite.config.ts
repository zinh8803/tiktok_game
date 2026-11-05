import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.VITE_PORT || 3001);
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:4100';

  return {
    plugins: [vue()],
    server: {
      port,
      host: '0.0.0.0',
      allowedHosts: [
        'neural-wing-applies-pension.trycloudflare.com',
      ],
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
        '/socket.io': {
          target: backendUrl,
          ws: true,
          changeOrigin: true,
        },
      },
    },
  };
});
