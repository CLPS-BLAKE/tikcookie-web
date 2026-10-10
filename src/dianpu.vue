<template>
  <div class="shop-page-container">
    <!-- 1. 顶部操作栏 -->
    <header class="top-nav-bar">
      <div class="nav-icon-btn back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="20" color="#222" />
      </div>
      <div class="right-nav-icons">
        <div class="nav-icon-btn" @click="handleSearch">
          <van-icon name="search" size="20" color="#222" />
        </div>
        <div class="nav-icon-btn" @click="handleFavorite">
          <van-icon
            :name="isFav ? 'star' : 'star-o'"
            size="20"
            :color="isFav ? '#ff2346' : '#222'"
          />
        </div>
        <div class="nav-icon-btn" @click="handleShare">
          <van-icon name="share-o" size="20" color="#222" />
        </div>
        <div class="nav-icon-btn" @click="handleMore">
          <van-icon name="ellipsis" size="20" color="#222" />
        </div>
      </div>
    </header>

    <!-- 2. 顶部横排相册 -->
    <div class="gallery-banner-wrap">
      <div class="gallery-scroll-row">
        <div class="banner-card red-theme">
          <div class="anniversary-title">11周年!</div>
          <div class="anniversary-sub">来和我们一起过生日</div>
          <div class="discount-pill">周周有折扣</div>
        </div>
        <div class="banner-card img-card">
          <!-- 👈 加上 cleanUrl 清洗，且给一个必定可访问的高清咖啡/奶茶店保底图 -->
          <img
            :src="
              cleanUrl(shopInfo.images && shopInfo.images[0]) ||
              'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600'
            "
            class="banner-img"
          />
        </div>
      </div>

      <div class="album-badge">
        <span>封面</span>
        <span class="split">|</span>
        <span>菜品</span>
        <span class="split">|</span>
        <span>环境</span>
        <span class="count-txt">1/82 &gt;</span>
      </div>
    </div>

    <!-- 3. 店铺核心信息卡片（全部真动态绑定！） -->
    <section class="card shop-meta-card">
      <div class="shop-name-row">
        <!-- 👈 动态店铺名：点击谁进店，就显示谁的名字！ -->
        <h1 class="shop-title">{{ shopInfo.name }}</h1>
        <button
          class="follow-btn"
          :class="{ followed: isFollowed }"
          @click="toggleFollow"
        >
          {{ isFollowed ? "已关注" : "+ 关注" }}
        </button>
      </div>

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
          <span>特色好味</span>
        </div>
      </div>

      <div class="honor-tags-row">
        <div class="honor-tag orange-bg">
          <span class="badge-icon">🎵</span>
          <span>入围同城美食好评榜 &gt;</span>
        </div>
        <div class="honor-tag gold-bg">
          <span class="badge-icon">🏆</span>
          <span>金牌好店</span>
        </div>
        <div class="honor-tag pink-bg">
          <span>回头客3千+</span>
        </div>
      </div>

      <!-- 动态营业时间 -->
      <div class="business-hours-row" @click="handleHoursDetail">
        <div class="hours-left">
          <span class="status-open">营业中</span>
          <span class="hours-text">{{ shopInfo.businessHours }}</span>
        </div>
        <div class="detail-link">
          <span>详情</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <!-- 动态地址与电话 -->
      <div class="address-nav-row">
        <div class="address-left">
          <div class="address-text">{{ shopInfo.address }}</div>
          <div class="dist-walk">距你约 500 米，步行可达</div>
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

    <!-- 5. 优惠团购列表（动态遍历这家店名下的 6 件商品，彻底告别电脑和猫！） -->
    <section class="card groupon-list-card">
      <div class="groupon-header">
        <h3 class="sec-title">优惠团购</h3>
        <div class="live-buyer">
          <img
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            class="buyer-mini-avatar"
          />
          <span>刚刚参与抢购</span>
        </div>
      </div>

      <!-- 循环展示这家店铺从数据库拉出来的真实商品 -->
      <div class="groupon-items">
        <div
          v-for="item in productList"
          :key="item.id"
          class="groupon-item"
          @click="goToDetail(item)"
        >
          <!-- 商品大图 -->
          <div class="item-cover-wrap">
            <img :src="item.image" class="item-img" />
            <span class="bought-badge">热销爆款</span>
          </div>

          <!-- 右侧信息 -->
          <div class="item-content-col">
            <h4 class="item-title">{{ item.title }}</h4>

            <div class="tag-row">
              <span class="gray-tag">免预约</span>
              <span class="gray-tag">随时退·过期退</span>
            </div>

            <div class="sales-count">{{ item.sales }}</div>

            <div class="price-buy-bottom">
              <div class="price-discount-wrap">
                <div class="price-num-row">
                  <span class="yen">¥</span>
                  <span class="price-main">{{ item.price }}</span>
                  <span class="origin-price">¥{{ item.originPrice }}</span>
                </div>
                <div class="subsidy-pill">
                  <span class="subsidy-text">专享补贴</span>
                  <span class="save-text">超划算</span>
                </div>
              </div>

              <!-- 红色抢购按钮 -->
              <button class="grab-buy-btn" @click.stop="goToDetail(item)">
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
// 修改这行引入，加上 cleanUrl
import { formatPrice, cleanUrl } from "./utils/format";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "vant";

import {
  getShopDetailAPI,
  getShopProductsAPI,
  addFavoriteShopAPI,
  removeFavoriteShopAPI,
} from "./api/shop";

const router = useRouter();
const route = useRoute();

// 1. 核心接收点：读取从详情页传过来的真实 shopId！
const shopId = ref(route.query.shopId || route.query.id || "1");

const isFollowed = ref(false);
const isFav = ref(false);

// 店铺详情对象（带初始保底）
const shopInfo = ref({
  name: "正在加载店铺...",
  address: "广州市天河区",
  businessHours: "10:00-22:00",
  phone: "020-88888888",
  images: [],
});

// 团购商品列表（默认空，由后端接口动态灌入）
const productList = ref([]);

onMounted(async () => {
  // A. 查询这间店铺的真实资料（文档 5.3.2）
  try {
    const shopData = await getShopDetailAPI(shopId.value);
    if (shopData) {
      shopInfo.value = {
        name: shopData.name, // 👈 动态赋予真店名！
        address: shopData.address,
        businessHours: shopData.businessHours || "10:00-22:00",
        phone: shopData.phone || "020-88888888",
        // 找到 shopInfo.value = { ... }，修改 images：
        // 👈 核心修改：优先使用干净的 shopData.images！
        images:
          shopData.images && shopData.images.length > 0
            ? shopData.images.map(cleanUrl)
            : (shopData.imageUrls || []).map(cleanUrl),
      };
    }
  } catch (err) {
    console.warn("获取店铺详情失败");
  }

  // B. 查询这家店铺名下专属的 6 件在售商品（文档 5.4.1）
  try {
    const products = await getShopProductsAPI(shopId.value);
    if (products && products.length > 0) {
      // 👈 把电脑和猫咪彻底换成这家店自己的 6 件商品！
      productList.value = products.map((item) => ({
        id: item.id,
        // 找到 productList.value = products.map(...)，修改 image：
        image:
          cleanUrl(item.imageUrl) ||
          "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600",
        title: item.name,
        sales: `已售${item.soldCount || 0}`,
        price: formatPrice(item.price), // 分转元
        originPrice: formatPrice(item.price * 1.3),
      }));
    }
  } catch (err) {
    console.warn("获取店铺商品失败");
  }
});

// 返回上一页
const handleBack = () => {
  router.back();
};

// 点击某个商品，进入该商品的详情页
const goToDetail = (item) => {
  router.push({
    path: "/detail",
    query: { id: item.id },
  });
};

// 关注操作
const toggleFollow = async () => {
  isFollowed.value = !isFollowed.value;
  showToast(isFollowed.value ? "已成功关注商家" : "已取消关注");
  try {
    if (isFollowed.value) {
      await addFavoriteShopAPI(shopId.value);
    } else {
      await removeFavoriteShopAPI(shopId.value);
    }
  } catch (e) {}
};

const handleSearch = () => showToast("搜索本店菜品");
const handleFavorite = () => {
  isFav.value = !isFav.value;
  showToast(isFav.value ? "已收藏店铺" : "已取消收藏");
};
const handleShare = () => showToast("分享店铺");
const handleMore = () => showToast("更多操作");
const handleHoursDetail = () => showToast("查看营业时段");
const handleNavigation = () => showToast("正在唤起导航...");
const handleCall = () => showToast(`拨打电话: ${shopInfo.value.phone}`);
const handleAllCoupons = () => showToast("查看全部优惠券");
</script>

<style scoped>
.shop-page-container {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 30px;
  box-sizing: border-box;
}

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

.card {
  margin: 10px 12px;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px;
}

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
