import { mergeConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
import configArcoResolverPlugin from './plugin/arcoResolver'; // 这个插件会导致build失败，暂不使用
import configImageminPlugin from './plugin/imagemin';
import getViteEnv from '../src/utils/common/title';

const mode = 'production';
export default mergeConfig(
  {
    mode,
    plugins: [
      configCompressPlugin('gzip'),
      configVisualizerPlugin(),
      // configArcoResolverPlugin(),
      configImageminPlugin(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_APP_TITLE: getViteEnv(mode, 'VITE_APP_TITLE'),
          },
        },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            arco: ['@arco-design/web-vue'],
            chart: ['echarts', 'vue-echarts'],
            vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
  },
  baseConfig,
);
