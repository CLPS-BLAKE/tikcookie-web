<template>
  <div class="shop-page-container">
    <!-- 1. 顶部操作栏（返回、搜索、收藏、分享、更多） -->
    <header class="top-nav-bar">
      <div class="nav-icon-btn back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="20" color="#222" />
      </div>
      <div class="right-nav-icons">
        <div class="nav-icon-btn" @click="handleSearch">
          <van-icon name="search" size="20" color="#222" />
        </div>
        <div class="nav-icon-btn" @click="handleFavorite">
          <van-icon :name="isFav ? 'star' : 'star-o'" size="20" :color="isFav ? '#ff2346' : '#222'" />
        </div>
        <div class="nav-icon-btn" @click="handleShare">
          <van-icon name="share-o" size="20" color="#222" />
        </div>
        <div class="nav-icon-btn" @click="handleMore">
          <van-icon name="ellipsis" size="20" color="#222" />
        </div>
      </div>
    </header>

    <!-- 2. 顶部横排相册轮播/横幅 -->
    <div class="gallery-banner-wrap">
      <div class="gallery-scroll-row">
        <!-- 宣传横幅 1：11周年店庆 -->
        <div class="banner-card red-theme">
          <div class="anniversary-title">11周年!</div>
          <div class="anniversary-sub">来和周成芝一起过生日</div>
          <div class="discount-pill">周周有折扣</div>
        </div>
        <!-- 相册图 2 -->
        <div class="banner-card img-card">
          <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" class="banner-img" />
        </div>
        <!-- 相册图 3 -->
        <div class="banner-card img-card">
          <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="banner-img" />
        </div>
      </div>

      <!-- 右下角相册数量标签 -->
      <div class="album-badge">
        <span>封面</span>
        <span class="split">|</span>
        <span>菜品</span>
        <span class="split">|</span>
        <span>环境</span>
        <span class="count-txt">1/82 &gt;</span>
      </div>
    </div>

    <!-- 3. 店铺核心信息卡片 -->
    <section class="card shop-meta-card">
      <!-- 店名与关注按钮 -->
      <div class="shop-name-row">
        <h1 class="shop-title">周成芝螺蛳粉(财富广场店)</h1>
        <button 
          class="follow-btn" 
          :class="{ followed: isFollowed }"
          @click="toggleFollow"
        >
          {{ isFollowed ? '已关注' : '+ 关注' }}
        </button>
      </div>

      <!-- 评分、人均 -->
      <div class="rating-price-row">
        <div class="rating-left">
          <span class="hearts">❤️❤️❤️❤️❤️</span>
          <span class="score-num">4.7</span>
          <span class="score-desc">非常棒</span>
          <span class="comment-count">594条评价 &gt;</span>
        </div>
        <div class="price-type-right">
          <span>¥18/人</span>
          <span class="type-split">|</span>
          <span>螺蛳粉</span>
        </div>
      </div>

      <!-- 荣誉勋章标签栏 -->
      <div class="honor-tags-row">
        <div class="honor-tag orange-bg">
          <span class="badge-icon">🎵</span>
          <span>入围广州市快餐好评榜 &gt;</span>
        </div>
        <div class="honor-tag gold-bg">
          <span class="badge-icon">🏆</span>
          <span>金牌好店</span>
        </div>
        <div class="honor-tag pink-bg">
          <span>回头客3千+</span>
        </div>
      </div>

      <!-- 营业时间 -->
      <div class="business-hours-row" @click="handleHoursDetail">
        <div class="hours-left">
          <span class="status-open">营业中</span>
          <span class="hours-text">10:00-22:00</span>
        </div>
        <div class="detail-link">
          <span>详情</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <!-- 地址与导航电话 -->
      <div class="address-nav-row">
        <div class="address-left">
          <div class="address-text">天河区体育东路118号103-1铺</div>
          <div class="dist-walk">距你 537米，步行10分钟</div>
        </div>
        <div class="nav-call-actions">
          <div class="circle-action-item" @click="handleNavigation">
            <van-icon name="location-o" size="16" />
            <span>导航</span>
          </div>
          <div class="circle-action-item" @click="handleCall">
            <van-icon name="phone-o" size="16" />
            <span>联系商家</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 限时券卡片 -->
    <section class="card coupon-strip-card" @click="handleAllCoupons">
      <div class="strip-left">
        <span class="flash-tag">限时券</span>
        <span class="sub-cut">立减 13</span>
      </div>
      <div class="strip-right">
        <span>全部</span>
        <van-icon name="arrow" size="12" />
      </div>
    </section>

    <!-- 5. 优惠团购列表 -->
    <section class="card groupon-list-card">
      <div class="groupon-header">
        <h3 class="sec-title">优惠团购</h3>
        <div class="live-buyer">
          <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="buyer-mini-avatar" />
          <span>刚刚参与抢购</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="groupon-items">
        <div 
          v-for="item in productList" 
          :key="item.id" 
          class="groupon-item"
          @click="goToDetail"
        >
          <!-- 左侧大图 -->
          <div class="item-cover-wrap">
            <img :src="item.image" class="item-img" />
            <span v-if="item.boughtTag" class="bought-badge">{{ item.boughtTag }}</span>
          </div>

          <!-- 右侧信息 -->
          <div class="item-content-col">
            <h4 class="item-title">{{ item.title }}</h4>

            <!-- 规则标签 -->
            <div class="tag-row">
              <span class="gray-tag">周一至周日可用</span>
              <span class="gray-tag">免预约</span>
              <span class="gray-tag">随时退·过期退</span>
            </div>

            <!-- 销量与价格行 -->
            <div class="sales-count">已售{{ item.sales }}</div>

            <div class="price-buy-bottom">
              <div class="price-discount-wrap">
                <div class="price-num-row">
                  <span class="yen">¥</span>
                  <span class="price-main">{{ item.price }}</span>
                  <span class="origin-price">¥{{ item.originPrice }}</span>
                </div>
                <!-- 补贴标签 -->
                <div class="subsidy-pill">
                  <span class="subsidy-text">专享补贴{{ item.subsidy }}</span>
                  <span class="save-text">共省{{ item.save }}</span>
                </div>
              </div>

              <!-- 红色抢购按钮 -->
              <button class="grab-buy-btn" @click.stop="goToDetail">
                抢购
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 状态
const isFollowed = ref(false)
const isFav = ref(false)

// 团购商品数据
const productList = ref([
  {
    id: 1,
    image: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
    boughtTag: '最近买过',
    title: '【首次尝鲜】螺蛳粉3件套单人餐',
    sales: '60万+',
    price: '14.2',
    originPrice: '21',
    subsidy: '1.7元',
    save: '6.8元'
  },
  {
    id: 2,
    image: 'https://img01.yzcdn.cn/vant/apple-2.jpg',
    boughtTag: '最近买过',
    title: '【解辣解腻】原味螺蛳粉/大片腐竹螺蛳粉...',
    sales: '20万+',
    price: '15.1',
    originPrice: '22',
    subsidy: '1.8元',
    save: '6.9元'
  },
  {
    id: 3,
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    boughtTag: '',
    title: '【周年庆专属】可口可乐',
    sales: '4000+',
    price: '0.99',
    originPrice: '3',
    subsidy: '2.01元',
    save: '2.01元'
  },
  {
    id: 4,
    image: 'https://img01.yzcdn.cn/vant/custom-empty-image.png',
    boughtTag: '',
    title: '【双人餐】招牌螺蛳粉6件套',
    sales: '10万+',
    price: '38.9',
    originPrice: '46',
    subsidy: '3.1元',
    save: '7.1元'
  }
])

// 1. 返回上一页（保证从哪跳进来的就能退回哪）
const handleBack = () => {
  router.back()
}

// 2. 点击进入商品详情页
const goToDetail = () => {
  router.push('/detail')
}

// 关注切换
const toggleFollow = () => {
  isFollowed.value = !isFollowed.value
  showToast(isFollowed.value ? '已成功关注商家' : '已取消关注')
}

// 其它交互
const handleSearch = () => showToast('搜索本店菜品')
const handleFavorite = () => {
  isFav.value = !isFav.value
  showToast(isFav.value ? '已收藏店铺' : '已取消收藏')
}
const handleShare = () => showToast('分享店铺页面')
const handleMore = () => showToast('更多操作')
const handleHoursDetail = () => showToast('查看营业时段详情')
const handleNavigation = () => showToast('正在唤起地图导航...')
const handleCall = () => showToast('正在拨打商家电话')
const handleAllCoupons = () => showToast('查看本店全部优惠券')
</script>

<style scoped>
.shop-page-container {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 30px;
  box-sizing: border-box;
}

/* 1. 顶部 Header */
.top-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-icon-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.right-nav-icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 2. 顶部相册横排 */
.gallery-banner-wrap {
  position: relative;
  background-color: #fff;
  padding-bottom: 12px;
}
.gallery-scroll-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 12px;
}
.gallery-scroll-row::-webkit-scrollbar {
  display: none;
}
.banner-card {
  width: 220px;
  height: 110px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}
.red-theme {
  background: linear-gradient(135deg, #d32f2f, #b71c1c);
  color: #fff;
  padding: 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.anniversary-title {
  font-size: 26px;
  font-weight: 900;
  font-style: italic;
}
.anniversary-sub {
  font-size: 11.5px;
  opacity: 0.9;
  margin-top: 2px;
}
.discount-pill {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 6px;
  align-self: flex-start;
}
.img-card {
  width: 140px;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.album-badge {
  position: absolute;
  right: 18px;
  bottom: 18px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 10.5px;
  padding: 2px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.split {
  opacity: 0.5;
}
.count-txt {
  margin-left: 2px;
}

/* 卡片基类 */
.card {
  margin: 10px 12px;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px;
}

/* 3. 店铺核心信息 */
.shop-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.shop-title {
  font-size: 18px;
  font-weight: bold;
  color: #111;
  margin: 0;
  line-height: 1.3;
}
.follow-btn {
  background: linear-gradient(135deg, #ff4d6a, #ff2346);
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 16px;
  cursor: pointer;
  flex-shrink: 0;
}
.follow-btn.followed {
  background: #f0f0f0;
  color: #666;
}

.rating-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
}
.rating-left {
  display: flex;
  align-items: center;
  gap: 4px;
}
.hearts {
  font-size: 10px;
  letter-spacing: -2px;
}
.score-num {
  font-weight: bold;
  color: #ff2346;
}
.score-desc {
  color: #ff2346;
  font-weight: 500;
}
.comment-count {
  color: #888;
}
.price-type-right {
  color: #333;
  display: flex;
  gap: 4px;
}
.type-split {
  color: #ccc;
}

.honor-tags-row {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  overflow-x: auto;
}
.honor-tags-row::-webkit-scrollbar {
  display: none;
}
.honor-tag {
  font-size: 10.5px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 2px;
}
.orange-bg {
  background-color: #fff3e6;
  color: #d35400;
}
.gold-bg {
  background-color: #fff8e7;
  color: #b78103;
}
.pink-bg {
  background-color: #ffeef1;
  color: #ff2346;
}

.business-hours-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f6f6f6;
  font-size: 12.5px;
  cursor: pointer;
}
.hours-left {
  display: flex;
  gap: 6px;
}
.status-open {
  color: #222;
  font-weight: bold;
}
.hours-text {
  color: #444;
}
.detail-link {
  color: #888;
  display: flex;
  align-items: center;
  gap: 2px;
}

.address-nav-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}
.address-left {
  flex: 1;
  overflow: hidden;
}
.address-text {
  font-size: 13.5px;
  color: #222;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dist-walk {
  font-size: 11.5px;
  color: #888;
  margin-top: 3px;
}
.nav-call-actions {
  display: flex;
  gap: 14px;
  flex-shrink: 0;
  padding-left: 10px;
}
.circle-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: #333;
  cursor: pointer;
}

/* 4. 限时券卡片 */
.coupon-strip-card {
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.strip-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.flash-tag {
  background-color: #ffeef1;
  color: #ff2346;
  font-size: 11px;
  font-weight: bold;
  padding: 1px 6px;
  border-radius: 4px;
}
.sub-cut {
  font-size: 13px;
  font-weight: bold;
  color: #222;
}
.strip-right {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 2px;
}

/* 5. 优惠团购列表 */
.groupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.sec-title {
  font-size: 16px;
  font-weight: 900;
  color: #111;
  margin: 0;
}
.live-buyer {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #888;
}
.buyer-mini-avatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.groupon-items {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.groupon-item {
  display: flex;
  gap: 10px;
  cursor: pointer;
}
.item-cover-wrap {
  width: 86px;
  height: 86px;
  position: relative;
  flex-shrink: 0;
}
.item-img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}
.bought-badge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 9px;
  text-align: center;
  padding: 1px 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.item-content-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.item-title {
  font-size: 14px;
  font-weight: bold;
  color: #111;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-row {
  display: flex;
  gap: 4px;
  margin-top: 3px;
}
.gray-tag {
  font-size: 10px;
  color: #888;
  border: 1px solid #e8e8e8;
  padding: 0 4px;
  border-radius: 3px;
}
.sales-count {
  font-size: 11px;
  color: #999;
  margin-top: 3px;
}

.price-buy-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 4px;
}
.price-num-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.yen {
  font-size: 12px;
  font-weight: bold;
  color: #ff2346;
}
.price-main {
  font-size: 19px;
  font-weight: 900;
  color: #ff2346;
  line-height: 1;
}
.origin-price {
  font-size: 11px;
  color: #aaa;
  text-decoration: line-through;
  margin-left: 4px;
}
.subsidy-pill {
  display: inline-flex;
  font-size: 9.5px;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 3px;
  border: 1px solid #ffd4dc;
}
.subsidy-text {
  background-color: #ff2346;
  color: #fff;
  padding: 1px 4px;
}
.save-text {
  background-color: #fff;
  color: #ff2346;
  padding: 1px 4px;
}

/* 抢购按钮 */
.grab-buy-btn {
  background: linear-gradient(135deg, #ff2346, #ff4365);
  color: #fff;
  border: none;
  font-size: 13.5px;
  font-weight: bold;
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 35, 70, 0.25);
}
</style>