import { createRouter, createWebHashHistory } from 'vue-router'

// 引入你们写好的所有页面组件
import Login from '../Login.vue'
import Home from '../Home.vue'
import Shousuo from '../shousuo.vue'
import Detail from '../Detail.vue'
import Dianpu from '../dianpu.vue'
import OrderPay from '../OrderPay.vue'
import Success from '../Success.vue'
import Daishiyong from '../daishiyonjiemian.vue'
import Gerenzhuzhi from '../gerenzhuzhi.vue'
import Pingjiayemian from '../pingjiayemian.vue'

// 路由规则清单
const routes = [
  // 默认根路径重定向到登录页
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/search', component: Shousuo },
  { path: '/detail', component: Detail },
  { path: '/shop', component: Dianpu },
  { path: '/pay', component: OrderPay },
  { path: '/success', component: Success },
  { path: '/voucher', component: Daishiyong },
  { path: '/user', component: Gerenzhuzhi },
  { path: '/comment', component: Pingjiayemian }
]

const router = createRouter({
  // 使用 Hash 模式（路径带 #，最不容易出现刷新404问题，适合演示）
  history: createWebHashHistory(),
  routes
})

export default router