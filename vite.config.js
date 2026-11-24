import { defineConfig } from 'vite';

export default defineConfig({
  build: { chunkSizeWarningLimit: 1500 },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js']
  }
});
