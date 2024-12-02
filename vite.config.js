import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/content.jsx',
      output: {
        entryFileNames: 'content.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'styles.css'; // Rename CSS files predictably
          }
          return 'assets/[name][extname]'; // Default naming for other assets
        },
        dir: 'dist',
      },
    },
  },
});
