import { resolve } from 'node:path';
import { defineConfig } from 'vite';
// import imagemin from 'unplugin-imagemin/vite';
import squooshPlugin from 'vite-plugin-squoosh';
import autoprefixer from 'autoprefixer';
import browserslist from 'browserslist';
import handlebars from 'vite-plugin-handlebars';
import zipPack from 'vite-plugin-zip-pack';
import HandlebarUpdate from './src/js/handlebarUpdate';

const pageData = {
  "/index.html": {
    isHome: true,
  },
  "/src/pages/appart.html": {
    isHome: false,
  },
  "/src/pages/appart-detail.html": {
    isHome: false,
  },
};

// @see https://github.com/vitejs/vite/issues/5815
global.navigator = undefined;

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    hmr: true,
    open: true,
    host: true,
    port: 8888,
  },
  base: '/bart/',
  optimizeDeps: {
    include: ['ymaps'],
  },
  build: {
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        appart: resolve(__dirname, "src", "pages", "appart.html"),
        appartDetail: resolve(__dirname, "src", "pages", "appart-detail.html"),
      },
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2/i.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name][extname]`;
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: browserslist(),
        }),
      ],
    },
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules'],
      },
    },
  },
  plugins: [
    HandlebarUpdate(),
    squooshPlugin({
      codecs: {
        jpg: {
          quality: 99,
        },
        gif: {
          quality: 10,
        },
      },
      exclude: /.(wp2|webp)$/,
      encodeTo: [
        { from: /.png$/, to: 'webp' },
        { from: /.jpeg$/, to: 'webp' },
        { from: /.jpg$/, to: 'webp' },
        { from: /.gif$/, to: 'webp' },
      ],
    }),
    handlebars({
      partialDirectory: resolve(__dirname, 'src', 'partials'),
      context(pagePath) {
        return pageData[pagePath];
      },
      reloadOnPartialChange: true,
    }),
    zipPack({
      outFileName: `choma__project.zip`,
    }),
  ],
});
