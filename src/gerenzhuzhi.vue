<template>
  <div class="user-center-container">
    <!-- 1. 顶部用户头像与昵称 -->
    <header class="user-header">
      <div class="user-info-left">
        <img 
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" 
          class="user-avatar" 
        />
        <span class="user-nickname">不爱刷抖音</span>
      </div>

      <div class="user-header-actions">
        <!-- 客服（带小红点） -->
        <div class="header-icon-wrap" @click="handleService">
          <van-icon name="service-o" size="22" color="#222" />
          <span class="red-dot"></span>
        </div>
        <!-- 设置 -->
        <div class="header-icon-wrap" @click="handleSetting">
          <van-icon name="setting-o" size="22" color="#222" />
        </div>
      </div>
    </header>

    <!-- 2. 四大快捷资产入口（优惠券/收藏/通知/小程序） -->
    <section class="asset-nav-row">
      <div class="asset-item" @click="handleNavAsset('优惠券')">
        <van-icon name="coupon-o" size="26" class="asset-icon" />
        <span class="asset-title">优惠券 (6)</span>
      </div>
      <div class="asset-item" @click="handleNavAsset('收藏')">
        <van-icon name="star-o" size="26" class="asset-icon" />
        <span class="asset-title">收藏</span>
      </div>
      <div class="asset-item" @click="handleNavAsset('通知')">
        <div class="icon-relative">
          <!-- 采用纯净空心线框小铃铛（带小吊钟与线条质感） -->
          <svg 
            class="asset-icon outline-bell" 
            viewBox="0 0 24 24" 
            width="26" 
            height="26" 
            fill="none" 
            stroke="#222" 
            stroke-width="1.8" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <!-- 右上角小红点保持不变 -->
          <span class="red-dot"></span>
        </div>
        <span class="asset-title">通知</span>
      </div>
      <div class="asset-item" @click="handleNavAsset('小程序')">
        <van-icon name="cluster-o" size="26" class="asset-icon" />
        <span class="asset-title">小程序</span>
      </div>
    </section>

    <!-- 3. 订单分类 Tab 栏（带待使用角标与搜索） -->
    <section class="order-tabs-wrapper">
      <div class="tabs-scroll-area">
        <div 
          v-for="(tab, index) in orderTabs" 
          :key="index"
          :class="['tab-btn', { active: currentTab === index }]"
          @click="currentTab = index"
        >
          <span class="tab-label">{{ tab.name }}</span>
          <!-- 待使用 Tab 的红色角标 1 -->
          <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
          <!-- 选中时的红色横线 -->
          <span v-if="currentTab === index" class="tab-active-line"></span>
        </div>
      </div>

      <!-- 右侧搜索订单 -->
      <div class="search-order-entry" @click="handleSearchOrder">
        <span class="split-bar">|</span>
        <van-icon name="search" size="14" />
        <span>搜索</span>
      </div>
    </section>

    <!-- 4. 订单卡片列表 -->
    <section class="order-list-area">
      <div class="order-card">
        <!-- 门店信息与状态 -->
        <div class="order-shop-header">
          <div class="shop-name-row">
            <span class="shop-name">瑞幸咖啡 (石牌桥店)</span>
            <van-icon name="arrow" size="12" color="#666" />
          </div>
          <span class="order-status-tag">待使用</span>
        </div>
        <div class="shop-distance">距你 43m</div>

        <!-- 商品内容 -->
        <div class="order-goods-flex">
          <img 
            src="https://img01.yzcdn.cn/vant/apple-1.jpg" 
            class="order-goods-cover" 
          />
          <div class="order-goods-right">
            <div class="goods-title-price">
              <h4 class="goods-title">【+3元升超大杯】升杯人气爆款...</h4>
              <span class="price">¥9.39</span>
            </div>
            <div class="goods-date-qty">
              <span class="valid-date">有效期 2026-10-09</span>
              <span class="qty">共1件</span>
            </div>
            <div class="rule-pills-row">
              <span class="rule-pill">周一至周日可用</span>
              <span class="rule-pill">免预约</span>
            </div>
          </div>
        </div>

        <!-- 底部操作按钮 -->
        <div class="order-card-actions">
          <button class="card-btn btn-again" @click="handleAgain">再来一单</button>
          <button class="card-btn btn-use" @click="handleUse">去使用</button>
        </div>
      </div>
    </section>

    <!-- 5. AI 自动领券横幅 -->
    <section class="ai-banner-card" @click="handleAIBanner">
      <div class="ai-banner-left">
        <!-- 小兔子/吉祥物卡通图 -->
        <div class="mascot-avatar">🐰</div>
        <span class="ai-text">还在到处找优惠购买？AI 可以自动领券蹲好价</span>
      </div>
      <van-icon name="arrow" size="14" color="#888" />
    </section>

    <!-- 6. 底部帮助指引 -->
    <div class="find-order-tip">
      <span>没找到订单？试试查看</span>
      <span class="blue-link" @click="handleAllOrders">全部订单</span>
    </div>

    <!-- 7. 悬浮胶囊底部 Tabbar（选中订单） -->
    <div class="floating-nav-capsule">
      <div class="capsule-item" @click="handleGoHome">
        <van-icon name="shop-o" size="20" />
        <span>首页</span>
      </div>
      <div class="capsule-item active">
        <van-icon name="notes" size="20" />
        <span>订单</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'


const router = useRouter()

// 点击订单上的“去使用”
const handleUse = () => {
  router.push('/voucher')
}

// 点击底部悬浮胶囊切回首页
const handleGoHome = () => {
  router.push('/home')
}
// 当前选中的订单分类
const currentTab = ref(2) // 默认选第 2 项（待使用）

// Tab 列表
const orderTabs = ref([
  { name: '全部' },
  { name: '待支付' },
  { name: '待使用', badge: '1' },
  { name: '待收货' },
  { name: '待评价' }
])

const handleService = () => showToast('联系客服')
const handleSetting = () => showToast('进入设置')
const handleNavAsset = (name) => showToast(`进入：${name}`)
const handleSearchOrder = () => showToast('搜索全部历史订单')
const handleAgain = () => showToast('已为您再次加入订单')

const handleAIBanner = () => showToast('唤起 AI 智能省钱助手')
const handleAllOrders = () => {
  currentTab.value = 0
  showToast('已切换至全部订单')
}

</script>

<style scoped>
.user-center-container {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 90px;
  box-sizing: border-box;
}

/* 1. 顶部 Header */
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px 10px 14px;
  background-color: #fff;
}
.user-info-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.user-nickname {
  font-size: 18px;
  font-weight: bold;
  color: #111;
}
.user-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-icon-wrap {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.red-dot {
  position: absolute;
  top: -1px;
  right: -2px;
  width: 7px;
  height: 7px;
  background-color: #ff2346;
  border-radius: 50%;
  border: 1.5px solid #fff;
}

/* 2. 四大资产入口 */
.asset-nav-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 18px 6px 16px 6px;
  background-color: #fff;
  text-align: center;
}
.asset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.icon-relative {
  position: relative;
  display: inline-flex;
}
.asset-icon {
  color: #222;
}
.asset-title {
  font-size: 12.5px;
  color: #333;
}

/* 3. 订单分类 Tab 栏 */
.order-tabs-wrapper {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 12px 14px 10px 14px;
  border-top: 1px solid #f5f5f5;
}
.tabs-scroll-area {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 22px;
  overflow-x: auto;
}
.tabs-scroll-area::-webkit-scrollbar {
  display: none;
}
.tab-btn {
  position: relative;
  font-size: 14.5px;
  color: #555;
  cursor: pointer;
  white-space: nowrap;
  padding-bottom: 6px;
  display: flex;
  align-items: center;
}
.tab-btn.active {
  font-size: 15.5px;
  font-weight: bold;
  color: #111;
}
.tab-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  background-color: #ff2346;
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-active-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 3px;
  background-color: #ff2346;
  border-radius: 3px;
}

/* 搜索小入口 */
.search-order-entry {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #333;
  margin-left: 10px;
  cursor: pointer;
}
.split-bar {
  color: #e5e5e5;
  margin-right: 6px;
}

/* 4. 订单卡片 */
.order-list-area {
  padding: 10px 12px;
}
.order-card {
  background-color: #fff;
  border-radius: 14px;
  padding: 14px;
}
.order-shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.shop-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.shop-name {
  font-size: 14.5px;
  font-weight: bold;
  color: #111;
}
.order-status-tag {
  color: #ff4d6a;
  font-size: 13.5px;
  font-weight: 500;
}
.shop-distance {
  font-size: 11.5px;
  color: #888;
  margin-top: 3px;
}
.order-goods-flex {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.order-goods-cover {
  width: 76px;
  height: 76px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.order-goods-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-title-price {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
}
.goods-title {
  font-size: 14px;
  color: #222;
  font-weight: bold;
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.price {
  font-size: 15px;
  font-weight: 900;
  color: #111;
  flex-shrink: 0;
}
.goods-date-qty {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #888;
  margin-top: 2px;
}
.rule-pills-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
.rule-pill {
  font-size: 10.5px;
  color: #666;
  background-color: #f5f6f8;
  padding: 1px 6px;
  border-radius: 4px;
}

/* 订单卡片底部按钮 */
.order-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
.card-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  outline: none;
}
.btn-again {
  background-color: #fff;
  border: 1px solid #d5d7dc;
  color: #333;
}
.btn-use {
  background-color: #fff;
  border: 1px solid #ff2346;
  color: #ff2346;
  font-weight: 500;
}

/* 5. AI 横幅 */
.ai-banner-card {
  margin: 4px 12px;
  background: linear-gradient(135deg, #fff2f4 0%, #ffe9ed 100%);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.ai-banner-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mascot-avatar {
  font-size: 18px;
}
.ai-text {
  font-size: 12px;
  color: #222;
  font-weight: 500;
}

/* 6. 底部提示 */
.find-order-tip {
  text-align: center;
  font-size: 12px;
  color: #888;
  margin-top: 24px;
}
.blue-link {
  color: #2a5caa;
  margin-left: 4px;
  cursor: pointer;
}

/* 7. 悬浮胶囊底部 Tabbar */
.floating-nav-capsule {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border-radius: 30px;
  display: flex;
  padding: 8px 24px;
  gap: 36px;
  z-index: 999;
}
.capsule-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #777;
  cursor: pointer;
}
.capsule-item.active {
  color: #111;
  font-weight: bold;
}
</style>