import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router);

import { vuetify } from './plugins/vuetify';
app.use(vuetify);

app.mount('#app')
