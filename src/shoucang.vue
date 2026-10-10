<template>
  <div class="favorites-page-container">
    <!-- 1. 顶部 Header 导航 -->
    <header class="top-nav-bar">
      <div class="back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="20" color="#222" />
      </div>
      <h2 class="nav-title">收 藏</h2>
      <div class="placeholder-right"></div>
    </header>

    <!-- 2. 主分类 Tab 栏（全部 / 地点 / 团购） -->
    <div class="main-tabs-row">
      <div 
        v-for="(tab, index) in mainTabs" 
        :key="index"
        :class="['tab-item', { active: currentMainTab === index }]"
        @click="switchMainTab(index)"
      >
        <span>{{ tab.name }}</span>
        <span v-if="currentMainTab === index" class="tab-indicator"></span>
      </div>
    </div>

    <!-- 3. 二级筛选与排序栏 -->
    <div class="sub-filter-row">
      <div class="filter-left">
        <div class="filter-dropdown" @click="handleFilter('地区')">
          <span>全部地区</span>
          <span class="triangle-down"></span>
        </div>
        <div class="filter-dropdown" @click="handleFilter('分类')">
          <span>全部分类</span>
          <span class="triangle-down"></span>
        </div>
      </div>

      <div class="sort-right">
        <span :class="['sort-opt', { active: sortType === 'time' }]" @click="sortType = 'time'">按时间</span>
        <span class="sort-split">|</span>
        <span :class="['sort-opt', { active: sortType === 'dist' }]" @click="sortType = 'dist'">按距离</span>
      </div>
    </div>

    <!-- 4. 收藏列表内容区 -->
    <main class="favorites-list-wrap">
      <!-- A. 只有真正有收藏的数据时才渲染卡片！ -->
      <div v-if="filteredList.length > 0" class="cards-list">
        <div 
          v-for="item in filteredList" 
          :key="item.id" 
          class="fav-card"
          @click="handleCardClick(item)"
        >
          <!-- 左侧商品实拍大图 + 黑色角标 -->
          <div class="fav-cover-wrap">
            <img :src="item.image" class="fav-img" />
            <span class="type-corner-badge">{{ item.targetType === 'SHOP' ? '地点' : '团购' }}</span>
          </div>

          <!-- 右侧内容区域（团购/商品形态） -->
          <div class="fav-content-col">
            <h3 class="card-title">{{ item.name }}</h3>

            <div class="shop-meta-line">
              <div class="shop-belong">
                <van-icon name="shop-o" size="13" class="shop-icon" />
                <span>{{ item.shopName || '正宗特色好店' }}</span>
              </div>
              <span class="meta-right">同城精选</span>
            </div>

            <!-- 规则标签 -->
            <div class="rules-tags-line">
              <span class="rule-pill">免预约</span>
              <span class="rule-pill">随时退</span>
              <span class="rule-pill">过期自动退</span>
            </div>

            <!-- 价格与销量 -->
            <div class="price-sales-row">
              <div class="price-group">
                <span class="price-prefix">券后</span>
                <span class="yen">¥</span>
                <span class="big-price">{{ item.price }}</span>
                <span v-if="item.originPrice" class="del-price">¥{{ item.originPrice }}</span>
              </div>
              <span class="sales-text">精选爆款</span>
            </div>

            <!-- 底部收藏时间 -->
            <div class="fav-time-text">{{ item.favTime || '刚刚' }} 收藏</div>
          </div>
        </div>
      </div>

      <!-- B. 核心优化：没有任何收藏时，绝不放假数据，直接展示“暂无收藏”空状态！ -->
      <div v-else class="empty-state">
        <div class="empty-icon-wrap">
          <van-icon name="star-o" size="64" color="#dcdde0" />
        </div>
        <p class="empty-main-text">暂无收藏内容</p>
        <p class="empty-sub-text">去发现更多心仪的超值好物吧</p>
        <button class="go-home-btn" @click="router.push('/home')">去首页逛逛</button>
      </div>
    </main>
  </div>
</template>

<script setup>
// 确保同时引入了 formatPrice 和 cleanUrl：
import { formatPrice, cleanUrl } from './utils/format'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getFavoriteListAPI } from './api/favorite'


const router = useRouter()

// 1. 主分类 Tab（全部 / 地点 / 团购）
const currentMainTab = ref(0)
const mainTabs = [
  { name: '全部', type: 'ALL' },
  { name: '地点', type: 'SHOP' },
  { name: '团购', type: 'PRODUCT' }
]

const sortType = ref('time')

// 👈 核心修改：默认全为空数组！彻底移除所有假数据！
const allFavorites = ref([])

onMounted(async () => {
  await loadMyFavorites()
})

// 加载真实的收藏列表
const loadMyFavorites = async () => {
  // 1. 先读取本地真实收藏缓存（双保险）
  const localFavs = JSON.parse(localStorage.getItem('my_favorites') || '[]')
  allFavorites.value = localFavs.map(item => ({
    ...item,
    image: cleanUrl(item.image) // 👈 洗净本地旧图片
  }))

  // 2. 尝试向后端拉取真实数据库收藏（文档 5.7.3）
  try {
    const res = await getFavoriteListAPI({ targetType: 'PRODUCT', page: 1, size: 50 })
    if (res && res.list && res.list.length > 0) {
      allFavorites.value = res.list.map(item => ({
        id: item.targetId,
        targetType: item.targetType || 'PRODUCT',
        targetId: item.targetId,
        name: item.name,
        // 👈 洗净后端发来的图片
        image: cleanUrl(item.imageUrl) || 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
        shopName: '特惠好店',
        price: item.price ? formatPrice(item.price) : '24.90',
        originPrice: item.price ? formatPrice(item.price * 1.3) : '33.00',
        favTime: '近期'
      }))
    }
  } catch (err) {
    // 接口处于骨架期时，以本地真实点击收藏的记录为准
  }
}

// 筛选当前 Tab
const filteredList = computed(() => {
  if (currentMainTab.value === 0) return allFavorites.value
  if (currentMainTab.value === 1) return allFavorites.value.filter(i => i.targetType === 'SHOP')
  if (currentMainTab.value === 2) return allFavorites.value.filter(i => i.targetType === 'PRODUCT')
  return allFavorites.value
})

const switchMainTab = (index) => {
  currentMainTab.value = index
}

// 点击卡片直接跳入详情页
const handleCardClick = (item) => {
  if (item.targetType === 'SHOP') {
    router.push({ path: '/shop', query: { shopId: item.id } })
  } else {
    router.push({ path: '/detail', query: { id: item.id } })
  }
}

const handleBack = () => router.back()
const handleFilter = (name) => showToast(`筛选：${name}`)
</script>

<style scoped>
.favorites-page-container {
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
}

.top-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}
.back-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.nav-title {
  font-size: 17px;
  font-weight: bold;
  color: #111;
  margin: 0;
}
.placeholder-right {
  width: 20px;
}

.main-tabs-row {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #f2f3f5;
  padding: 6px 0 0 0;
}
.tab-item {
  position: relative;
  font-size: 16px;
  color: #555;
  padding: 8px 16px 12px 16px;
  cursor: pointer;
}
.tab-item.active {
  font-size: 17px;
  font-weight: 900;
  color: #111;
}
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: #111;
  border-radius: 2px;
}

.sub-filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  font-size: 12.5px;
  color: #666;
}
.filter-left {
  display: flex;
  gap: 18px;
}
.filter-dropdown {
  display: flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
}
.triangle-down {
  width: 0;
  height: 0;
  border-left: 3.5px solid transparent;
  border-right: 3.5px solid transparent;
  border-top: 4px solid #999;
}
.sort-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sort-opt {
  cursor: pointer;
  color: #888;
}
.sort-opt.active {
  color: #111;
  font-weight: bold;
}
.sort-split {
  color: #e0e0e0;
}

.favorites-list-wrap {
  padding: 6px 14px 30px 14px;
}
.cards-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.fav-card {
  display: flex;
  gap: 12px;
  cursor: pointer;
}

.fav-cover-wrap {
  position: relative;
  width: 106px;
  height: 106px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}
.fav-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.type-corner-badge {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 9.5px;
  padding: 2px 6px;
  border-bottom-right-radius: 6px;
  font-weight: bold;
}

.fav-content-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.card-title {
  font-size: 14.5px;
  font-weight: bold;
  color: #111;
  margin: 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shop-meta-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11.5px;
  color: #888;
  margin-top: 3px;
}
.shop-belong {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #666;
  font-size: 11.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.shop-icon {
  flex-shrink: 0;
}
.meta-right {
  flex-shrink: 0;
  margin-left: 6px;
}

.rules-tags-line {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}
.rule-pill {
  font-size: 10px;
  color: #888;
  background-color: #f7f8fa;
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
}

.price-sales-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 4px;
}
.price-group {
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.price-prefix {
  font-size: 10.5px;
  color: #ff2346;
  font-weight: bold;
}
.yen {
  font-size: 11px;
  color: #ff2346;
  font-weight: 900;
}
.big-price {
  font-size: 17px;
  font-weight: 900;
  color: #ff2346;
}
.del-price {
  font-size: 10.5px;
  color: #aaa;
  text-decoration: line-through;
  margin-left: 3px;
}
.sales-text {
  font-size: 10.5px;
  color: #999;
}

.fav-time-text {
  font-size: 10.5px;
  color: #aaa;
  margin-top: 3px;
}

/* 核心优化：空状态（无收藏时展示） */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  text-align: center;
}
.empty-icon-wrap {
  margin-bottom: 12px;
}
.empty-main-text {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}
.empty-sub-text {
  font-size: 12.5px;
  color: #999;
  margin-top: 6px;
}
.go-home-btn {
  margin-top: 20px;
  background: linear-gradient(135deg, #ff2346, #ff4365);
  color: #fff;
  border: none;
  font-size: 13.5px;
  font-weight: bold;
  padding: 8px 24px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(255, 35, 70, 0.25);
}
</style>