import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from '@/views/App.vue';
import router from './router';
import '@/components/editor/worker';
import {setupAssets} from './plugins';

async function setupApp() {
    setupAssets();
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(ElementPlus)

    app.mount('#app')
}

setupApp();
