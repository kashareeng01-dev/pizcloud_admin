import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // const proxyTarget = env.PUBLIC_PIZCLOUD_SERVER_API_URL || 'http://localhost:8080/papi';

  return {
    plugins: [sveltekit()],
    // server: {
    //   proxy: {
    //     // Proxy API calls so cookies work on same-origin during dev
    //     '/auth': proxyTarget,
    //     '/referral': proxyTarget
    //   }
    // }
  };
});
