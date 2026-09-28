import { createApp } from 'vue'
import App from './App.vue'

// 1. 引入全局样式（也就是你刚才建的那个限制手机宽度的 style.css）
import './style.css'

// 2. 引入 Vant 核心组件库与样式
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

// 3. 将 Vant 挂载到 Vue 应用上
app.use(Vant)

app.mount('#app')