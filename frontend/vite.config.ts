import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

function extractHostname(input?: string): string {
  if (!input) return '';
  try {
    const raw = input.trim();
    const withProto = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `http://${raw}`;
    return new URL(withProto).hostname;
  } catch {
    return input.trim().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
  }
}

export default defineConfig(({ mode }) => {
  // Luôn load đúng thư mục frontend/ bất kể process.cwd() đứng ở đâu
  const envDir = fileURLToPath(new URL('.', import.meta.url));
  const env = loadEnv(mode, envDir, '');

  const port = Number(env.VITE_PORT || 3001);
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:4100';

  const customHost = extractHostname(env.VITE_LINK_URL);

  return {
    plugins: [vue()],
    server: {
      port,
      host: '0.0.0.0',
      // allowedHosts: true cho phép tất cả các domain tunnel (Cloudflare, ngrok, pinggy,...)
      // hoặc dùng danh sách domain cụ thể + wildcard .trycloudflare.com
      allowedHosts: env.VITE_LINK_URL === 'true'
        ? true
        : [
            ...(customHost ? [customHost] : []),
            'griffin-represented-workshops-cell.trycloudflare.com',
            '.trycloudflare.com', // Cho phép tất cả subdomain của Cloudflare Tunnel
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
