<template>
  <div class="home-container">
    <!-- 1. 顶部搜索栏 -->
    <header class="top-search-header">
      <div class="location-btn">
        <span>广州</span>
        <span class="triangle-down"></span>
      </div>

      <div class="search-input-wrap" @click="goToSearch">
        <!-- 扫码/镜头小图标 -->
        <van-icon name="scan" class="scan-icon" />
        <input type="text" placeholder="汉堡王" class="search-input" />
        <button class="search-action-btn">搜低价</button>
      </div>
    </header>

    <!-- 2. 大牌天天省 卡片 -->
    <section class="brand-section">
      <div class="brand-header">
        <div class="brand-badge-title">限时秒杀</div>
        <div class="brand-sub-badge">还剩10件 &gt;</div>
      </div>

      <div class="brand-goods-row">
        <!-- 肯悦咖啡 -->
        <div class="brand-card">
          <div class="brand-name-row">
            <span class="brand-mini-logo red-bg">K</span>
            <span class="brand-name">肯悦咖啡</span>
          </div>
          <div class="brand-product-flex">
            <img 
              src="https://img01.yzcdn.cn/vant/apple-1.jpg" 
              class="brand-goods-img" 
            />
            <div class="brand-goods-info">
              <div class="brand-goods-title">早餐随心配（咖啡等）</div>
              <div class="brand-goods-price">¥11</div>
            </div>
          </div>
        </div>

        <!-- 肯德基 -->
        <div class="brand-card">
          <div class="brand-name-row">
            <span class="brand-mini-logo kfc-logo">KFC</span>
            <span class="brand-name">肯德基</span>
          </div>
          <div class="brand-product-flex">
            <img 
              src="https://img01.yzcdn.cn/vant/apple-2.jpg" 
              class="brand-goods-img" 
            />
            <div class="brand-goods-info">
              <div class="brand-goods-title">3份元气早餐两件套</div>
              <div class="brand-goods-price">¥29.4</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 抢惊喜券 / 膨胀券 专区（1:1 还原截图） -->
    <section class="coupon-section">
      <!-- 左侧固定大红入口卡 -->
      <div class="coupon-lead-card">
        <div class="lead-left-texts">
          <div class="lead-title">
            <span>抢惊喜券</span>
            <span class="arrow">&gt;</span>
          </div>
          <div class="lead-price-wrap">
            <span class="lead-symbol">¥</span>
            <span class="lead-num">50</span>
            <div class="lead-tag-col">
              <span>最</span>
              <span>高</span>
            </div>
          </div>
        </div>
        <!-- 3D 小福袋图案 -->
        <div class="pouch-icon-wrap">
          <div class="pouch-body">
            <div class="pouch-coin"></div>
          </div>
        </div>
      </div>

      <!-- 右侧可左右滑动的卡券列表 -->
      <div class="coupon-scroll-list">
        <!-- 第 1 张券：¥13 惊喜膨胀券 -->
        <div class="ticket-card">
          <!-- 上下打孔凹槽 -->
          <div class="notch notch-top"></div>
          <div class="notch notch-bottom"></div>

          <div class="ticket-left">
            <div class="ticket-amount">
              <span class="yen">¥</span>
              <span class="val">13</span>
              <span class="up-arrow">↑</span>
            </div>
            <div class="ticket-rule">满180可用</div>
          </div>

          <div class="ticket-divider"></div>

          <div class="ticket-right">
            <div class="ticket-name">惊喜膨胀券</div>
            <div class="ticket-countdown">剩余 14:04:37</div>
          </div>
        </div>

        <!-- 第 2 张券：¥4 券 -->
        <div class="ticket-card">
          <div class="notch notch-top"></div>
          <div class="notch notch-bottom"></div>

          <div class="ticket-left">
            <div class="ticket-amount">
              <span class="yen">¥</span>
              <span class="val">4</span>
              <span class="up-arrow">↑</span>
            </div>
            <div class="ticket-rule">满80可用</div>
          </div>

          <div class="ticket-divider"></div>

          <div class="ticket-right">
            <div class="ticket-name">惊喜膨胀券</div>
            <div class="ticket-countdown">剩余 14:04:37</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 滑动分类 Tab -->
    <nav class="category-tabs">
      <div 
        v-for="(tab, index) in tabs" 
        :key="index"
        :class="['tab-item', { active: activeTab === index }]"
        @click="activeTab = index"
      >
        <span>{{ tab }}</span>
        <span v-if="activeTab === index" class="active-indicator"></span>
      </div>
    </nav>

    <!-- 5. 筛选与活动标签栏 -->
    <div class="filter-tags-row">
      <div class="filter-pill gray-pill">
        <span>附近</span>
        <span class="triangle-down-gray"></span>
      </div>
      <div class="filter-pill pink-pill">糖巢超值价</div>
      <div class="filter-pill pink-pill">省省逛吃节</div>
      <div class="filter-pill gray-pill">我常买</div>
      <div class="filter-pill gray-pill">可配送</div>
    </div>

    <!-- 6. 商品瀑布流列表（单列大卡片） -->
    <section class="goods-list">
      <div v-for="item in goodsList" :key="item.id" class="goods-card" @click="goToDetail">
        <!-- 商品大图 -->
        <div class="goods-cover-wrap">
          <img :src="item.image" class="goods-cover" />
          <div v-if="item.imgTag" class="img-badge">{{ item.imgTag }}</div>
        </div>

        <!-- 商品详细信息 -->
        <div class="goods-info">
          <!-- 标题 -->
          <div class="goods-title-line">
            <span class="brand-highlight">{{ item.brand }}</span>
            <span class="divider">|</span>
            <span class="main-title">{{ item.title }}</span>
          </div>

          <!-- 距离与热销 -->
          <div class="meta-row">
            <span class="distance-store">{{ item.distance }} {{ item.store }}</span>
            <span class="sales">{{ item.sales }}</span>
          </div>

          <!-- 价格与抢购按钮行 -->
          <div class="bottom-action-row">
            <div class="price-tags-wrap">
              <div class="price-row">
                <span class="currency">¥</span>
                <span class="price-num">{{ item.price }}</span>
                <span class="origin-price">¥{{ item.originPrice }}</span>
              </div>
              <div class="subsidy-tag">{{ item.subsidy }}</div>
            </div>

            <!-- 右侧红色“抢”按钮 -->
            <button class="grab-btn">抢</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. 悬浮胶囊底部导航栏 -->
    <div class="floating-nav-capsule">
      <div class="capsule-item active">
        <van-icon name="shop" size="20" />
        <span>首页</span>
      </div>
      <div class="capsule-item" @click="goToUser">
        <van-icon name="notes-o" size="20" />
        <span>订单</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// 1. 引入商品接口与金额格式化工具
import { getCategoriesAPI, getProductsAPI } from './api/goods'
import { formatPrice } from './utils/format'

const router = useRouter()

// 路由跳转方法
const goToSearch = () => {
  router.push('/search')
}

// 智能详情页跳转：兼容带参数和不带参数
const goToDetail = (item) => {
  const targetId = item?.id || '1'
  router.push({
    path: '/detail',
    query: { id: targetId }
  })
}

const goToUser = () => {
  router.push('/user')
}

const activeTab = ref(0)
// 分类数据（响应式，支持后续由后端接口更新）
const tabs = ref(['推荐', '甜点饮品', '快餐小吃', '正餐美食', '休闲娱乐', '超市便利'])

// 你的原版商品数据（作为核心保底）
const goodsList = ref([
  {
    id: 1,
    image: 'https://img01.yzcdn.cn/vant/custom-empty-image.png',
    imgTag: '{牛肉面+酱牛肉} 卤蛋/小菜2选1',
    brand: '德元兰州纯汤牛肉面',
    title: '【佳节】【肉蛋双飞】纯汤牛肉面+酱牛肉50g+...',
    distance: '161m',
    store: '广州旗舰店',
    sales: '热销2万+',
    price: '24.9',
    originPrice: '33',
    subsidy: '立减 8.1元 · 消费再返 2元'
  },
  {
    id: 2,
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
    imgTag: '【设计师 洗·剪·吹】',
    brand: '藤野造型',
    title: '[心动美力指南美力搭子] 设计师洗剪吹套餐',
    distance: '<100m',
    store: '万菱汇店',
    sales: '热销100万+',
    price: '28.9',
    originPrice: '88',
    subsidy: '平台补贴1元'
  },
  {
    id: 3,
    image: 'https://img01.yzcdn.cn/vant/apple-1.jpg',
    imgTag: '爆款超大杯饮品15选1',
    brand: '瑞幸咖啡',
    title: '【限定联名杯】超大杯系列15选1',
    distance: '<100m',
    store: '石牌桥店',
    sales: '热销100万+',
    price: '11.5',
    originPrice: '23',
    subsidy: '平台补贴1.4元'
  }
])

// 2. 页面加载完成后触发真实接口
onMounted(async () => {
  // A. 获取真实分类（对应文档 5.3.1）
  try {
    const categories = await getCategoriesAPI()
    if (categories && categories.length > 0) {
      tabs.value = ['推荐', ...categories.map(c => c.name)]
    }
  } catch (err) {
    // 连不上后端时静默处理，保留原有的默认分类
  }

  // B. 获取真实商品流（对应文档 5.4.3）
  try {
    const res = await getProductsAPI({ page: 1, size: 10, sort: 'latest' })
    if (res && res.list && res.list.length > 0) {
      // 成功获取到真实数据时，将后端的分转成元并替换列表
      goodsList.value = res.list.map(item => ({
        id: item.id,
        image: item.imageUrl || 'https://img01.yzcdn.cn/vant/custom-empty-image.png',
        imgTag: item.type === 'FLASH' ? '限时抢购' : '特惠团购',
        brand: item.shopName,
        title: item.name,
        price: formatPrice(item.price), // 统一分转元
        originPrice: formatPrice(item.price * 1.3),
        sales: `已售${item.soldCount || 0}`,
        store: item.shopName,
        distance: '<500m',
        subsidy: '平台立减补贴'
      }))
    }
  } catch (err) {
    // 连不上后端时静默处理，直接继续使用上面写好的3个默认商品
  }
})
</script>

<style scoped>
.home-container {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 90px;
  box-sizing: border-box;
}

/* 1. 顶部搜索 */
.top-search-header {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background-color: #fff;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.location-btn {
  display: flex;
  align-items: center;
  font-size: 17px;
  font-weight: bold;
  color: #111;
  gap: 4px;
}
.triangle-down {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #111;
}
.search-input-wrap {
  flex: 1;
  height: 38px;
  border: 1.5px solid #000000; 
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 3px;
  position: relative;
}
.scan-icon {
  font-size: 18px;
  color: #222;
  margin-right: 8px;
}
.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
}
.search-action-btn {
  background: linear-gradient(135deg, #ff3355, #ff1a40);
  color: #fff;
  border: none;
  border-radius: 18px;
  height: 32px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
}

/* 2. 大牌天天省 */
.brand-section {
  margin: 10px 12px;
  border-radius: 16px;
  border: 2px solid #ff3355;
  background-color: #ff2346;       /* 👈 改为纯红色（或者 #ff2a4b / #ff0033） */
  padding: 6px 8px 10px 8px;
}
.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 6px 4px;
}
.brand-badge-title {
  color: #fff;
  font-size: 20px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.5px;
}
.brand-sub-badge {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
}
.brand-goods-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.brand-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.brand-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}
.brand-mini-logo {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: bold;
}
.brand-mini-logo.red-bg { background-color: #e60012; color: #fff; }
.brand-mini-logo.kfc-logo { border: 1px solid #e60012; color: #e60012; }
.brand-name {
  font-size: 13px;
  font-weight: bold;
  color: #222;
}
.brand-product-flex {
  display: flex;
  gap: 6px;
}
.brand-goods-img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}
.brand-goods-title {
  font-size: 11px;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.brand-goods-price {
  font-size: 14px;
  font-weight: bold;
  color: #111;
  margin-top: 4px;
}

/* 3. 优惠券总区域（横向滑动排版） */
.coupon-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 12px 6px 12px;
  overflow: hidden;
}

/* 左侧大红入口卡 */
.coupon-lead-card {
  width: 104px;
  height: 56px;
  background: linear-gradient(135deg, #ff2346 0%, #ff4d6d 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 0 8px;
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}
.lead-left-texts {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.lead-title {
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 1px;
}
.lead-title .arrow {
  font-size: 10px;
  opacity: 0.85;
}
.lead-price-wrap {
  display: flex;
  align-items: baseline;
  color: #fff;
  margin-top: 2px;
}
.lead-symbol {
  font-size: 11px;
  font-weight: bold;
}
.lead-num {
  font-size: 20px;
  font-weight: 900;
  line-height: 1;
  margin: 0 1px;
}
.lead-tag-col {
  display: flex;
  flex-direction: column;
  font-size: 8px;
  line-height: 1;
  transform: scale(0.85);
  opacity: 0.9;
}

/* 3D 小福袋图案 */
.pouch-icon-wrap {
  position: relative;
  width: 28px;
  height: 34px;
  margin-right: 2px;
}
.pouch-body {
  width: 26px;
  height: 30px;
  background: radial-gradient(circle at 35% 30%, #ff7895 0%, #ff2048 70%);
  border-radius: 6px 6px 12px 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  right: 0;
}
.pouch-coin {
  width: 10px;
  height: 10px;
  background: radial-gradient(circle, #fff3a8 30%, #f5b000 80%);
  border-radius: 50%;
  border: 1px solid #ffe169;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

/* 右侧优惠券横向滑动容器 */
.coupon-scroll-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  flex: 1;
  padding: 2px 0;
}
.coupon-scroll-list::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}

/* 单张优惠券卡片 */
.ticket-card {
  position: relative;
  height: 56px;
  background-color: #fff2f4; /* 浅淡粉色背景 */
  border: 1px solid #ffd3db;   /* 极细浅粉边框 */
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  flex-shrink: 0;
  box-sizing: border-box;
}

/* 核心技巧：卡券上下打孔的圆弧缺口（Notch） */
.notch {
  position: absolute;
  left: 68px; /* 凹槽与分割线对齐位置 */
  width: 8px;
  height: 5px;
  background-color: #f7f8fa; /* 凹槽内部填充页面的底色，形成透明镂空感 */
  border: 1px solid #ffd3db;
  z-index: 2;
}
.notch-top {
  top: -1px;
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.notch-bottom {
  bottom: -1px;
  border-bottom: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

/* 卡券左半部分（金额与门槛） */
.ticket-left {
  width: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ticket-amount {
  display: flex;
  align-items: baseline;
  color: #ff2346;
  font-weight: 900;
}
.ticket-amount .yen {
  font-size: 11px;
}
.ticket-amount .val {
  font-size: 20px;
  line-height: 1;
  margin: 0 1px;
}
.ticket-amount .up-arrow {
  font-size: 13px;
  font-weight: 900;
  transform: translateY(-2px);
}
.ticket-rule {
  font-size: 9.5px;
  color: #d15668;
  margin-top: 2px;
  white-space: nowrap;
}

/* 中间极淡虚线或间距 */
.ticket-divider {
  width: 1px;
  height: 34px;
  margin: 0 6px;
}

/* 卡券右半部分（名称与倒计时） */
.ticket-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 2px;
}
.ticket-name {
  font-size: 12.5px;
  font-weight: bold;
  color: #222;
  white-space: nowrap;
}
.ticket-countdown {
  font-size: 9.5px;
  color: #888;
  margin-top: 3px;
  white-space: nowrap;
}

/* 4. 分类导航 Tab */
.category-tabs {
  display: flex;
  gap: 18px;
  padding: 12px 14px 6px 14px;
  overflow-x: auto;
  white-space: nowrap;
}
.category-tabs::-webkit-scrollbar { display: none; }
.tab-item {
  font-size: 15px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.tab-item.active {
  font-size: 17px;
  font-weight: 900;
  color: #111;
}
.active-indicator {
  width: 18px;
  height: 3px;
  background-color: #ff2346;
  border-radius: 3px;
  margin-top: 3px;
}

/* 5. 过滤标签 */
.filter-tags-row {
  display: flex;
  gap: 8px;
  padding: 8px 14px;
  overflow-x: auto;
}
.filter-tags-row::-webkit-scrollbar { display: none; }
.filter-pill {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 14px;
  white-space: nowrap;
}
.gray-pill {
  background-color: #eeeff1;
  color: #444;
  display: flex;
  align-items: center;
  gap: 4px;
}
.triangle-down-gray {
  width: 0;
  height: 0;
  border-left: 3.5px solid transparent;
  border-right: 3.5px solid transparent;
  border-top: 4px solid #666;
}
.pink-pill {
  background-color: #ffeef1;
  color: #ff2346;
  font-weight: 500;
}

/* 6. 商品单列卡片流 */
.goods-list {
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.goods-card {
  display: flex;
  gap: 10px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  padding: 10px;
}
.goods-cover-wrap {
  width: 100px;
  height: 100px;
  position: relative;
  flex-shrink: 0;
}
.goods-cover {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}
.img-badge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 9px;
  text-align: center;
  padding: 2px 4px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-title-line {
  font-size: 14px;
  font-weight: bold;
  color: #222;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.brand-highlight {
  color: #795548;
}
.divider {
  margin: 0 4px;
  color: #ccc;
}
.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #888;
  margin-top: 4px;
}
.bottom-action-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 6px;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.currency {
  font-size: 13px;
  font-weight: bold;
  color: #111;
}
.price-num {
  font-size: 19px;
  font-weight: 900;
  color: #111;
}
.origin-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
  margin-left: 4px;
}
.subsidy-tag {
  font-size: 10.5px;
  color: #ff2346;
  margin-top: 2px;
}

/* 还原原图高饱和度、带立体描边爆发感的“抢”字按钮 */
.grab-btn {
  width: 36px;
  height: 28px;
  /* 玫粉到亮红的微倾斜渐变 */
  background: linear-gradient(145deg, #ff4e76 0%, #ff1f44 100%);
  border: none;
  border-radius: 8px; /* 柔和圆角矩形 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
  box-shadow: 0 2px 6px rgba(255, 31, 68, 0.35); /* 底部粉红微光投影 */
  position: relative;
  overflow: visible;
}

/* 核心技巧：“抢”字立体描边艺术字效果 */
.grab-btn {
  color: #ffffff;
  font-size: 21px; /* 字体要大，撑满格子 */
  font-weight: 900; /* 最粗字重 */
  font-family: "PingFang SC", "Microsoft YaHei", "Arial Black", sans-serif;
  /* 关键点 1：向前倾斜 8 度，营造抢购紧迫感 */
  transform: skewX(-7deg); 
  letter-spacing: -1px;
  line-height: 1;
  /* 关键点 2：外层深粉红立体描边轮廓（模拟贴纸切边） */
  -webkit-text-stroke: 1.2px #d8002a;
  /* 关键点 3：多重高精度阴影，让白字在红底上极其立体突出 */
  text-shadow: 
    0 1px 0 #cc0029,
    0 -1px 0 #cc0029,
    1px 0 0 #cc0029,
    -1px 0 0 #cc0029,
    1px 1px 0 #cc0029;
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