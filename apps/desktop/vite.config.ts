import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'src/main.ts',
      },
      preload: {
        input: {
          preload: 'src/preload.ts',
        },
      },
    }),
  ],
});
