// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';
// import process from 'process'; // Import process module

// // Use process.cwd() for predictable path resolution
// const root = process.cwd();

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist', // Build output directory
//     rollupOptions: {
//       input: {
//         main: path.resolve(root, 'src/main.jsx'),
//         background: path.resolve(root, 'src/scripts/background.js'),
//         content: path.resolve(root, 'src/scripts/content.js'),
//         popup: path.resolve(root, 'public/popup.html'), // This points to popup.html in the public directory
//       },
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import process from 'process';

const root = process.cwd();

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Build output directory
    rollupOptions: {
      input: {
        main: path.resolve(root, 'src/main.jsx'),
        background: path.resolve(root, 'src/scripts/background.js'),
        content: path.resolve(root, 'src/scripts/content.js'),
        popup: path.resolve(root, 'public/popup.html'), // This points to popup.html in the public directory
      },
      output: {
        assetFileNames: '[name].[hash].js', // Ensures content.js gets hashed and matches the build output
        chunkFileNames: '[name].[hash].js',
      },
    },
  },
});
