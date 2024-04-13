import 'virtual:uno.css';
import { createApp } from 'vue';
import ArcoVue, { Message } from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import globalComponents from '@/components';
// import Particles from 'particles.vue3';
import Particles from '@tsparticles/vue3';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import router from './router';
import store from './store';
import directive from './directive';
import App from './App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/assets/style/global.less';
import '@/utils/echarts';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);
app.use(router);
app.use(store);

app.use(globalComponents);
app.use(directive);
app.use(Particles, {
  init: async (engine: Engine) => {
    await loadFull(engine);
  },
});
/* eslint-disable-next-line */
Message._context = app._context;

app.mount('#app');
