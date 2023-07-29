import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { currency } from './utils/currency'

const app = createApp(App)

app.use(store)

app.mount('#app')
