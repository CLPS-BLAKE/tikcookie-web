import { createApp } from 'vue'
import App from './App.vue'

// 引入全局样式
import './style.css'

// 引入 Vant 组件库和样式
import Vant from 'vant'
import 'vant/lib/index.css'

// 1. 引入我们刚建好的路由配置
import router from './router'

const app = createApp(App)

app.use(Vant)
// 2. 挂载路由
app.use(router)

app.mount('#app')