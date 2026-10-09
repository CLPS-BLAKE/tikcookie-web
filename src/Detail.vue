<template>
  <div class="detail-container">
    <!-- 1. 顶部悬浮操作栏（返回、搜索、收藏、分享） -->
    <header class="float-header">
      <div class="icon-circle back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="18" />
      </div>
      <div class="right-actions">
        <div class="icon-circle">
          <van-icon name="search" size="18" />
        </div>
         <div class="icon-circle" @click="toggleFavorite">
          <!-- 收藏时变黄实心，未收藏为空心白色 -->
          <van-icon 
            :name="isFavorited ? 'star' : 'star-o'" 
            size="18" 
            :color="isFavorited ? '#ffd21e' : '#ffffff'" 
          />
        </div>
        <div class="icon-circle">
          <van-icon name="share-o" size="18" />
        </div>
      </div>
    </header>

    <!-- 2. 商品主图展示区（动态图与标题） -->
    <div class="goods-hero">
      <img 
        :src="productInfo.image" 
        class="hero-img" 
      />
      <!-- 图片上方的浮动文字标签 -->
      <div class="hero-tag-badge">
        <div class="tag-title">{{ productInfo.shopName }}</div>
        <div class="tag-sub">特惠精选套餐</div>
      </div>
    </div>

    <!-- 3. 价格与优惠券信息卡片（动态价格与标题） -->
    <section class="price-section">
      <div class="price-header-row">
        <div class="price-left">
          <span class="yen">¥</span>
          <span class="main-price">{{ productInfo.price }}</span>
          <span class="discount-badge">特惠折</span>
          <span class="origin-price">¥{{ productInfo.originPrice }}</span>
        </div>
        <div class="sales-text">{{ productInfo.sales }}</div>
      </div>

      <!-- 优惠券提示条 -->
      <div class="coupon-tip-row">
        <span>优惠券立减 · 消费享补贴</span>
        <van-icon name="arrow" size="12" />
      </div>

      <div class="card-divider"></div>

      <!-- 商品动态大标题 -->
      <h1 class="goods-main-title">
        {{ productInfo.name }}
      </h1>

      <!-- 有效期说明 -->
      <div class="valid-date-row">
        <van-icon name="clock-o" size="14" class="clock-icon" />
        <span>购买后30天内有效</span>
        <van-icon name="arrow" size="12" />
      </div>
    </section>

    <!-- 2.1 商家进店卡片（动态店名与地址，点击携带真实 shopId 进店） -->
    <div class="shop-entry-card">
      <img 
        :src="productInfo.image" 
        class="shop-logo" 
      />
      <div class="shop-info">
        <div class="shop-name">{{ productInfo.shopName }}</div>
        <div class="shop-sub">{{ productInfo.shopAddress }}</div>
      </div>
      <button class="enter-shop-btn" @click="goToShop">进店</button>
    </div>

    <!-- 2.2 套餐内容明细卡片（支持后端真实 JSON 内容渲染，没有则展示保底） -->
    <section class="package-card">
      <template v-if="productInfo.contents && productInfo.contents.length > 0">
        <div 
          v-for="(group, gIdx) in productInfo.contents" 
          :key="gIdx" 
          class="package-group"
          :style="{ marginTop: gIdx > 0 ? '14px' : '0' }"
        >
          <h4 class="group-title">{{ group.title }}</h4>
          <div v-for="(it, iIdx) in group.items" :key="iIdx" class="package-item">
            <div class="item-left">
              <span class="dot">•</span>
              <span class="item-name">{{ it.name }}</span>
              <span v-if="iIdx === 0" class="top-tag">推荐 TOP1</span>
            </div>
            <span class="item-qty">{{ it.count }}份</span>
          </div>
        </div>
      </template>

      <!-- 兜底套餐展示 -->
      <template v-else>
        <div class="package-group">
          <h4 class="group-title">精选主餐</h4>
          <div class="package-item">
            <div class="item-left">
              <span class="dot">•</span>
              <span class="item-name">{{ productInfo.name }}</span>
              <span class="top-tag">推荐菜 TOP1</span>
            </div>
            <span class="item-qty">1份</span>
          </div>
        </div>
      </template>
    </section>

    <!-- 3.1 购买须知 -->
    <section class="rules-card">
      <h3 class="card-headline">购买须知</h3>
      <div class="rules-content" :class="{ 'collapsed': !isExpanded }">
        <div class="rule-block">
          <div class="rule-title">
            <van-icon name="calendar-o" size="14" />
            <span>使用规则</span>
          </div>
          <ul class="rule-items">
            <li>• 有效期：购买后30天内有效</li>
            <li>• 商家营业时间可用</li>
            <li>• 堂食或餐前外带均可</li>
            <li>• 到店消费：无需预约，随时可用</li>
          </ul>
        </div>
        <div class="rule-block">
          <div class="rule-title">
            <van-icon name="bag-o" size="14" />
            <span>店内优惠规则</span>
          </div>
          <div class="rule-desc">不与店内其他优惠同享</div>
        </div>
      </div>
      <div class="expand-btn" @click="isExpanded = !isExpanded">
        <span>{{ isExpanded ? '收起全部' : '展开全部' }}</span>
        <van-icon :name="isExpanded ? 'arrow-up' : 'arrow-down'" />
      </div>
    </section>

    <!-- 3.2 适用门店 -->
    <section class="store-section-card">
      <h3 class="card-headline">适用门店</h3>
      <div class="store-main-row">
        <img :src="productInfo.image" class="store-thumb" />
        <div class="store-details">
          <div class="store-name-text">{{ productInfo.shopName }}</div>
          <div class="rating-row">
            <span class="hearts">❤️❤️❤️❤️❤️</span>
            <span class="score-num">4.8</span>
            <span class="score-desc">非常棒</span>
            <span class="comment-count">1000+条评价</span>
          </div>
          <div class="store-sub-info">{{ productInfo.shopAddress }}</div>
          <div class="rank-tag-wrap">
            <span class="douyin-rank-tag">🎵 热门打卡好店</span>
            <span class="people-count">热销推荐</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 底部固定购买双按钮栏（动态价格） -->
    <footer class="bottom-buy-bar">
      <div class="sub-discount-strip">
        <span class="strip-tag">官方直减补贴</span>
        <span class="strip-desc">已享受限时补贴优惠</span>
      </div>

      <div class="action-btn-row">
        <!-- 左按钮：原价立即购买 -->
        <button class="buy-btn btn-white" @click="goToPay">
          <div class="btn-price">¥{{ productInfo.originPrice }}</div>
          <div class="btn-action">立即购买</div>
        </button>

        <!-- 右按钮：特惠购买 -->
        <button class="buy-btn btn-red" @click="goToPay">
          <div class="btn-price">¥{{ productInfo.price }}</div>
          <div class="btn-action">立即下单购买</div>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { addFavoriteAPI, removeFavoriteAPI, getFavoriteStatusAPI } from './api/favorite'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'

import { getProductDetailAPI } from './api/goods'
import { createOrderAPI } from './api/order'
import { formatPrice } from './utils/format'
// 收藏状态
const isFavorited = ref(false)
const router = useRouter()
const route = useRoute()

// 1. 获取从首页传过来的真实商品 ID
const productId = ref(route.query.id || '1')
const isExpanded = ref(false)

// 2. 真实商品对象（有默认兜底）
const productInfo = ref({
  id: '',
  name: '加载中...',
  price: '24.90',
  originPrice: '33.00',
  shopId: '1',
  shopName: '德元兰州纯汤牛肉面(天河旗舰店)',
  shopAddress: '广州市天河区体育东路118号103-1铺',
  sales: '已售666',
  image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
  contents: [],
  useRules: []
})

// 3. 页面加载：向后端查这件具体商品的真实数据
onMounted(async () => {
  if (!productId.value) return

  try {
    const data = await getProductDetailAPI(productId.value)
    if (data) {
      productInfo.value = {
        id: data.id,
        name: data.name,
        price: formatPrice(data.price),
        originPrice: formatPrice(data.price * 1.3),
        shopId: data.shopId || '1', // 👈 真实拿到属于这家店的 shopId！
        shopName: data.shopName || '正宗特色好店',
        shopAddress: data.shopAddress || '天河区体育东路118号',
        sales: `已售${data.soldCount || 0}`,
        image: data.imageUrl || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
        contents: typeof data.contents === 'string' ? JSON.parse(data.contents) : (data.contents || []),
        useRules: typeof data.useRules === 'string' ? JSON.parse(data.useRules) : (data.useRules || [])
      }
    }
  } catch (err) {
    console.warn('详情接口骨架期或离线，展示保底')
  }
  // 👈 新增：向后端查询这件商品的真实收藏状态
  try {
    const favRes = await getFavoriteStatusAPI('PRODUCT', productId.value)
    if (favRes && typeof favRes.favorited === 'boolean') {
      isFavorited.value = favRes.favorited
    }
  } catch (err) {
    // 骨架期或离线时静默处理
  }
})

// 在 Detail.vue 的 toggleFavorite 中：
const toggleFavorite = async () => {
  const previousState = isFavorited.value
  isFavorited.value = !previousState

  // 获取本地已收藏列表
  let localFavs = JSON.parse(localStorage.getItem('my_favorites') || '[]')

  if (isFavorited.value) {
    // 1. 点亮星星：加入收藏
    showToast({ type: 'success', message: '已加入收藏！' })
    const newFavItem = {
      id: productId.value,
      targetType: 'PRODUCT',
      name: productInfo.value.name,
      price: productInfo.value.price,
      originPrice: productInfo.value.originPrice,
      image: productInfo.value.image,
      shopName: productInfo.value.shopName,
      favTime: '刚刚'
    }
    // 去重后加入
    localFavs = [newFavItem, ...localFavs.filter(i => !(i.id == productId.value && i.targetType === 'PRODUCT'))]
    localStorage.setItem('my_favorites', JSON.stringify(localFavs))

    try {
      await addFavoriteAPI('PRODUCT', productId.value)
    } catch (e) {}
  } else {
    // 2. 取消星星：移出收藏
    showToast({ message: '已取消收藏' })
    localFavs = localFavs.filter(i => !(i.id == productId.value && i.targetType === 'PRODUCT'))
    localStorage.setItem('my_favorites', JSON.stringify(localFavs))

    try {
      await removeFavoriteAPI('PRODUCT', productId.value)
    } catch (e) {}
  }
}

const handleBack = () => {
  router.back()
}

// 4. 关键：进店时，把这件商品真实的 shopId 带过去！
const goToShop = () => {
  router.push({
    path: '/shop',
    query: { shopId: productInfo.value.shopId }
  })
}

// 5. 下单购买
// 升级 goToPay：把当前商品的真实信息全部作为参数带给收银台
const goToPay = async () => {
  showToast({ type: 'loading', message: '正在创建订单...', forbidClick: true })
  let targetOrderId = '1'

  try {
    const res = await createOrderAPI(productId.value)
    if (res && res.orderId) {
      targetOrderId = res.orderId
    }
  } catch (err) {}

  // 👈 核心：把真实的单号、商品名、店名、价格、图片全部传给收银台！
  router.push({
    path: '/pay',
    query: { 
      orderId: targetOrderId,
      title: productInfo.value.name,
      shopName: productInfo.value.shopName,
      price: productInfo.value.price,
      image: productInfo.value.image
    }
  })
}
</script>

<style scoped>
.detail-container {
  background-color: #f6f7f9;
  min-height: 100vh;
  padding-bottom: 110px;
  position: relative;
  box-sizing: border-box;
}

.float-header {
  position: fixed;
  top: 12px;
  left: 0;
  right: 0;
  max-width: 430px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 14px;
  z-index: 100;
  pointer-events: none;
}
.icon-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
}
.right-actions {
  display: flex;
  gap: 10px;
}

.goods-hero {
  position: relative;
  width: 100%;
  height: 340px;
  background-color: #2b3a2f;
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-tag-badge {
  position: absolute;
  top: 36px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  width: 80%;
}
.tag-title {
  font-size: 19px;
  font-weight: bold;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-sub {
  font-size: 13px;
  margin-top: 2px;
  color: #ffeaa7;
}

.price-section {
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  margin-top: -16px;
  position: relative;
  padding: 14px 16px;
}
.price-header-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.price-left {
  display: flex;
  align-items: baseline;
}
.price-left .yen {
  font-size: 15px;
  font-weight: 900;
  color: #ff2346;
}
.price-left .main-price {
  font-size: 28px;
  font-weight: 900;
  color: #ff2346;
  margin: 0 4px 0 2px;
  line-height: 1;
}
.discount-badge {
  background-color: #ff2346;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 4px;
  margin-right: 6px;
}
.price-left .origin-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}
.sales-text {
  font-size: 12px;
  color: #888;
}

.coupon-tip-row {
  display: inline-flex;
  align-items: center;
  color: #ff2346;
  font-size: 12px;
  margin-top: 6px;
  gap: 2px;
}

.card-divider {
  height: 1px;
  background-color: #f2f3f5;
  margin: 12px 0;
}

.goods-main-title {
  font-size: 17px;
  font-weight: bold;
  color: #111;
  line-height: 1.4;
  margin: 0;
}

.valid-date-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 12.5px;
  margin-top: 10px;
}

.bottom-buy-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 430px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}
.sub-discount-strip {
  background-color: #fff2f4;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}
.strip-tag {
  color: #ff2346;
  font-weight: bold;
}
.strip-desc {
  color: #666;
}
.action-btn-row {
  display: flex;
  gap: 10px;
  padding: 8px 14px 14px 14px;
}
.buy-btn {
  flex: 1;
  height: 46px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.btn-price {
  font-size: 14px;
  font-weight: 900;
  line-height: 1.1;
}
.btn-action {
  font-size: 11px;
  margin-top: 1px;
}
.btn-white {
  background-color: #fff;
  border: 1px solid #ff4d6a;
  color: #ff2346;
}
.btn-red {
  background: linear-gradient(135deg, #ff2346, #ff4365);
  border: none;
  color: #fff;
}

.shop-entry-card {
  margin: 10px 12px;
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.shop-logo {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.shop-info {
  flex: 1;
  overflow: hidden;
}
.shop-name {
  font-size: 14px;
  font-weight: bold;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.shop-sub {
  font-size: 11.5px;
  color: #888;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.enter-shop-btn {
  background-color: #fff;
  border: 1px solid #ddd;
  color: #333;
  font-size: 12px;
  padding: 4px 14px;
  border-radius: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.package-card {
  margin: 10px 12px;
  background-color: #fff;
  border-radius: 12px;
  padding: 14px;
}
.package-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.group-title {
  font-size: 14px;
  font-weight: bold;
  color: #111;
  margin: 0;
}
.package-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13.5px;
}
.item-left {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
}
.dot {
  color: #666;
  font-size: 14px;
}
.top-tag {
  font-size: 10px;
  color: #ff6b00;
  border: 1px solid #ffd4b2;
  background-color: #fff9f5;
  padding: 1px 4px;
  border-radius: 4px;
  line-height: 1.1;
}
.item-qty {
  font-size: 12.5px;
  color: #888;
}

.rules-card,
.store-section-card,
.reviews-card {
  margin: 10px 12px;
  background-color: #fff;
  border-radius: 12px;
  padding: 14px;
}
.card-headline {
  font-size: 15px;
  font-weight: bold;
  color: #111;
  margin: 0 0 12px 0;
}

.rules-content {
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.rules-content.collapsed {
  max-height: 180px;
  position: relative;
}
.rules-content.collapsed::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 100%);
}
.rule-block {
  margin-bottom: 12px;
}
.rule-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
}
.rule-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.rule-items li,
.rule-desc {
  font-size: 12.5px;
  color: #666;
  line-height: 1.4;
}
.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #888;
  font-size: 12px;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
  cursor: pointer;
}

.store-main-row {
  display: flex;
  gap: 10px;
}
.store-thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.store-details {
  flex: 1;
}
.store-name-text {
  font-size: 14px;
  font-weight: bold;
  color: #111;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 11px;
}
.hearts {
  letter-spacing: -2px;
  font-size: 10px;
}
.score-num {
  font-weight: bold;
  color: #ff2346;
}
.score-desc {
  color: #ff2346;
  font-weight: 500;
}
.comment-count,
.store-sub-info {
  color: #888;
  font-size: 11px;
}
.store-sub-info {
  margin-top: 3px;
}
.rank-tag-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}
.douyin-rank-tag {
  font-size: 10px;
  background-color: #fff2f0;
  color: #ff502f;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: bold;
}
.people-count {
  font-size: 10px;
  color: #e67e22;
  background-color: #fef7ec;
  padding: 1px 6px;
  border-radius: 4px;
}
</style>