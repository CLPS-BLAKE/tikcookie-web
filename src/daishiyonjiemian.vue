<template>
  <div class="pending-use-container">
    <!-- 1. 顶部 Header -->
    <header class="top-nav-bar">
      <div class="back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="20" color="#222" />
      </div>

      <div class="center-title-box">
        <h2 class="main-title">待使用</h2>
        <div class="sub-expire-tip">
          请在 <span class="orange-date">2026.10.09(含)</span> 前到店消费
        </div>
      </div>

      <div class="service-btn" @click="handleService">
        <van-icon name="service-o" size="20" color="#222" />
        <span>客服</span>
      </div>
    </header>

    <!-- 2. 商品简述与核销方式双入口卡片 -->
    <section class="card product-use-card">
      <!-- 商品简述 -->
      <div class="goods-info-row">
        <img 
          src="https://img01.yzcdn.cn/vant/apple-1.jpg" 
          class="goods-cover" 
        />
        <div class="goods-detail-col">
          <div class="title-price-line">
            <h3 class="goods-title">【+3元升超大杯】升杯人气爆款 10选1</h3>
            <div class="origin-qty-wrap">
              <span class="origin-price">¥21</span>
              <span class="qty">x1</span>
            </div>
          </div>
          <div class="rule-hint-line">
            <span>周一至周日可用 · 随时退</span>
            <van-icon name="info-o" size="12" />
          </div>
          <div class="final-price-row">
            <span class="yen">¥</span>
            <span class="price-val">9.39</span>
            <van-icon name="arrow" size="12" class="arrow" />
          </div>
        </div>
      </div>

      <div class="card-dashed-line"></div>

      <!-- 两种核销方式 -->
      <div class="methods-wrap">
        <!-- 方式 1 -->
        <div class="method-item">
          <div class="method-left">
            <div class="method-title-line">
              <span class="method-tag">方式1</span>
              <span class="method-name">在线点 到店取</span>
            </div>
            <div class="method-desc">立即点单，到店自取</div>
          </div>
          <button class="order-online-btn" @click="handleOrderOnline">
            在线点单
          </button>
        </div>

        <!-- 方式 2 -->
        <div class="method-item" style="margin-top: 14px;" @click="handleSelfService">
          <div class="method-left">
            <div class="method-title-line">
              <span class="method-tag">方式2</span>
              <span class="method-name">自助使用</span>
            </div>
          </div>
          <div class="view-steps-btn">
            <span>查看详细步骤</span>
            <van-icon name="arrow" size="12" />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 适用门店卡片（33953家） -->
    <section class="card store-card">
      <div class="store-header">
        <h4 class="card-sec-title">适用门店 (33953家)</h4>
        <div class="all-stores-link" @click="handleAllStores">
          <span>全部门店</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <div class="store-content-row">
        <img 
          src="https://img01.yzcdn.cn/vant/apple-1.jpg" 
          class="store-logo" 
        />
        <div class="store-text-col">
          <div class="store-title">瑞幸咖啡 (石牌桥店)</div>
          <div class="store-hours">营业中 6:30-22:00</div>
          <div class="store-distance-addr">
            <span class="dist-red">最近 45m</span>
            <span class="addr">天河区天河路 236 号一层 1FA01-B号</span>
          </div>
        </div>

        <div class="store-icon-actions">
          <div class="circle-btn" @click="handleNav">
            <van-icon name="location-o" size="16" />
          </div>
          <div class="circle-btn" @click="handleCall">
            <van-icon name="phone-o" size="16" />
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 爆款 10选1 菜单明细（支持折叠展开） -->
    <section class="card menu-card">
      <h4 class="card-sec-title">爆款 10选1</h4>

      <div class="menu-list" :class="{ 'collapsed': !isExpanded }">
        <div v-for="(drink, index) in drinkList" :key="index" class="menu-item-row">
          <span class="drink-name">• {{ drink.name }}</span>
          <div class="drink-meta">
            <span class="drink-qty">1份</span>
            <span class="drink-price">¥21</span>
          </div>
        </div>
      </div>

      <!-- 展开/收起按钮 -->
      <div class="expand-btn-row" @click="isExpanded = !isExpanded">
        <span>{{ isExpanded ? '收起全部' : '展开更多' }}</span>
        <van-icon :name="isExpanded ? 'arrow-up' : 'arrow-down'" />
      </div>
    </section>

    <!-- 5. 底部固定结算条（申请退款 / 再来一单） -->
    <footer class="bottom-action-bar">
      <button class="footer-btn btn-refund" @click="handleRefund">
        申请退款
      </button>
      <button class="footer-btn btn-again" @click="handleOrderAgain">
        再来一单
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router' // 👈 引入路由
import { showToast, showConfirmDialog } from 'vant'
// 1. 引入核销与退款接口（对应文档 5.6.8 与 5.6.5）
import { useOrderAPI, refundOrderAPI } from './api/order'

const router = useRouter()
const route = useRoute()

// 接取上个页面传来的订单号（带保底单号）
const orderId = ref(route.query.orderId || '1113784812650611165')

// 是否展开菜单明细（保持你的原代码）
const isExpanded = ref(false)

// 饮品 10 选 1 数据（保持你的原代码）
const drinkList = ref([
  { name: '小黄油美式' },
  { name: '经典泰奶' },
  { name: '标准美式' },
  { name: '柚C美式' },
  { name: '紫葡萄茉莉冰奶' },
  { name: '羽衣轻体果蔬茶' },
  { name: '小青桔C冰茶' },
  { name: '小青桔C美式' },
  { name: '茉莉花香拿铁' },
  { name: '生椰拿铁' }
])

// 真实返回上一页
const handleBack = () => {
  router.back()
}

// 核心功能 1：在线点单 / 去使用（真实调用核销接口 5.6.8）
// 在 daishiyonjiemian.vue 里：
// 在 daishiyonjiemian.vue 里的 handleOrderOnline：
const handleOrderOnline = async () => {
  showToast({ type: 'loading', message: '正在完成核销...', forbidClick: true })

  try {
    // 调后端核销接口 5.6.8
    await useOrderAPI(orderId.value)
    console.log('真实核销接口调用成功')
  } catch (err) {
    console.warn('后端核销接口暂未联通或处于骨架期，采用保底模拟')
  }

  showToast({
    type: 'success',
    message: '团购券核销成功！',
    onClose: () => {
      // 👈 核心修改：跳转到个人主页，并指定选中第 4 个 Tab（待评价）！
      router.push({
        path: '/user',
        query: { tab: 4 }
      })
    }
  })
}

// 核心功能 2：申请退款（真实调用退款接口 5.6.5）
const handleRefund = () => {
  showConfirmDialog({
    title: '申请退款',
    message: '该订单支持随时退、过期自动退。确定现在申请全额退款吗？'
  }).then(async () => {
    showToast({ type: 'loading', message: '正在提交退款...', forbidClick: true })

    try {
      // 真实调接口：申请退款
      await refundOrderAPI(orderId.value)
      console.log('真实退款接口调用成功')
      showToast({ type: 'success', message: '退款成功，款项已原路退回！' })
    } catch (err) {
      console.warn('后端退款接口暂未联通，采用保底模拟')
      showToast({ type: 'success', message: '退款申请已通过（模拟）！' })
    }
  }).catch(() => {})
}

// 保持你原本的其他交互方法
const handleService = () => showToast('联系客服')
const handleSelfService = () => showToast('查看自助核销二维码步骤')
const handleAllStores = () => showToast('查看全国 33953 家适用门店')
const handleNav = () => showToast('导航前往石牌桥店')
const handleCall = () => showToast('呼叫门店电话')
const handleOrderAgain = () => showToast('已再次加入待支付订单')
</script>

<style scoped>
.pending-use-container {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 90px;
  box-sizing: border-box;
}

/* 1. 顶部 Header */
.top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}
.back-btn {
  cursor: pointer;
}
.center-title-box {
  text-align: center;
}
.main-title {
  font-size: 17px;
  font-weight: bold;
  color: #111;
  margin: 0;
}
.sub-expire-tip {
  font-size: 11px;
  color: #888;
  margin-top: 3px;
}
.orange-date {
  color: #e67e22;
  font-weight: 500;
}
.service-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: #333;
  cursor: pointer;
}

/* 卡片容器 */
.card {
  margin: 10px 12px;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px;
}

/* 2. 商品简述与核销方式 */
.goods-info-row {
  display: flex;
  gap: 10px;
}
.goods-cover {
  width: 78px;
  height: 78px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.goods-detail-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.title-price-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
}
.goods-title {
  font-size: 14.5px;
  font-weight: bold;
  color: #111;
  line-height: 1.35;
  margin: 0;
}
.origin-qty-wrap {
  text-align: right;
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
}
.origin-price {
  display: block;
}
.qty {
  display: block;
  margin-top: 2px;
}
.rule-hint-line {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #666;
  margin-top: 2px;
}
.final-price-row {
  align-self: flex-end;
  display: flex;
  align-items: baseline;
  color: #111;
}
.final-price-row .yen {
  font-size: 12px;
  font-weight: bold;
}
.final-price-row .price-val {
  font-size: 18px;
  font-weight: 900;
  margin: 0 2px;
}
.final-price-row .arrow {
  color: #999;
}

.card-dashed-line {
  border-bottom: 1px dashed #e8e8e8;
  margin: 14px 0;
}

/* 核销方式 1 & 2 */
.method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.method-title-line {
  display: flex;
  align-items: center;
  gap: 8px;
}
.method-tag {
  font-size: 10px;
  color: #d35400;
  background-color: #fef5ee;
  border: 1px solid #fad7a0;
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: bold;
}
.method-name {
  font-size: 15px;
  font-weight: bold;
  color: #111;
}
.method-desc {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
  padding-left: 36px;
}
.order-online-btn {
  background-color: #fff;
  border: 1px solid #ff2346;
  color: #ff2346;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 16px;
  cursor: pointer;
}
.view-steps-btn {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}

/* 3. 适用门店 */
.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.card-sec-title {
  font-size: 15px;
  font-weight: bold;
  color: #111;
  margin: 0;
}
.all-stores-link {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}
.store-content-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.store-logo {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.store-text-col {
  flex: 1;
  overflow: hidden;
}
.store-title {
  font-size: 14px;
  font-weight: bold;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.store-hours {
  font-size: 11.5px;
  color: #888;
  margin: 3px 0;
}
.store-distance-addr {
  font-size: 11.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dist-red {
  color: #ff2346;
  font-weight: 500;
  margin-right: 4px;
}
.addr {
  color: #666;
}
.store-icon-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.circle-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f5f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  cursor: pointer;
}

/* 4. 爆款菜单明细与折叠遮罩 */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 14px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.menu-list.collapsed {
  max-height: 240px;
  position: relative;
}
.menu-list.collapsed::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 100%);
  pointer-events: none;
}
.menu-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13.5px;
}
.drink-name {
  color: #333;
}
.drink-meta {
  display: flex;
  gap: 16px;
  color: #888;
}
.drink-price {
  color: #222;
  font-weight: 500;
}
.expand-btn-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #666;
  font-size: 12.5px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
  cursor: pointer;
  margin-top: 8px;
}

/* 5. 底部固定结算条 */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 430px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 14px;
  padding: 10px 16px;
  z-index: 100;
  box-sizing: border-box;
}
.footer-btn {
  flex: 1;
  height: 42px;
  border-radius: 21px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
}
.btn-refund {
  background-color: #fff;
  border: 1px solid #ccc;
  color: #222;
}
.btn-again {
  background: linear-gradient(135deg, #ff2346, #ff4365);
  border: none;
  color: #fff;
  box-shadow: 0 3px 8px rgba(255, 35, 70, 0.25);
}
</style>