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
        <div class="icon-circle">
          <van-icon name="star-o" size="18" />
        </div>
        <div class="icon-circle">
          <van-icon name="share-o" size="18" />
        </div>
      </div>
    </header>

    <!-- 2. 商品主图展示区 -->
    <div class="goods-hero">
      <img 
        src="https://img01.yzcdn.cn/vant/custom-empty-image.png" 
        class="hero-img" 
      />
      <!-- 图片上方的浮动文字标签 -->
      <div class="hero-tag-badge">
        <div class="tag-title">{牛肉面+酱牛肉}</div>
        <div class="tag-sub">卤鸡蛋/小菜2选1</div>
      </div>
    </div>

    <!-- 3. 价格与优惠券信息卡片 -->
    <section class="price-section">
      <div class="price-header-row">
        <div class="price-left">
          <span class="yen">¥</span>
          <span class="main-price">24.9</span>
          <span class="discount-badge">7.6折</span>
          <span class="origin-price">¥33</span>
        </div>
        <div class="sales-text">已售2万+</div>
      </div>

      <!-- 优惠券提示条 -->
      <div class="coupon-tip-row">
        <span>优惠券减1·共省8.1元</span>
        <van-icon name="arrow" size="12" />
      </div>

      <div class="card-divider"></div>

      <!-- 商品大标题 -->
      <h1 class="goods-main-title">
        【佳节】【肉蛋双飞】纯汤牛肉面+酱牛肉50g+五香卤鸡蛋/精品小菜2选1（免费续面）
      </h1>

      <!-- 有效期说明 -->
      <div class="valid-date-row">
        <van-icon name="clock-o" size="14" class="clock-icon" />
        <span>购买后50天有效</span>
        <van-icon name="arrow" size="12" />
      </div>
    </section>

    <!-- 2.1 商家进店卡片 -->
    <div class="shop-entry-card">
      <img 
        src="https://img01.yzcdn.cn/vant/custom-empty-image.png" 
        class="shop-logo" 
      />
      <div class="shop-info">
        <div class="shop-name">德元兰州纯汤牛肉面(广州旗舰店)</div>
        <div class="shop-sub">最近155米 · 近石牌桥地铁站·广正街(...</div>
      </div>
      <button class="enter-shop-btn">进店</button>
    </div>

    <!-- 2.2 套餐内容明细卡片 -->
    <section class="package-card">
      <!-- 分组 1：经典肉蛋双飞 -->
      <div class="package-group">
        <h4 class="group-title">经典肉蛋双飞</h4>
        
        <div class="package-item">
          <div class="item-left">
            <span class="dot">•</span>
            <span class="item-name">纯汤牛肉面</span>
            <span class="top-tag">推荐菜 TOP1</span>
          </div>
          <span class="item-qty">1份</span>
        </div>

        <div class="package-item">
          <div class="item-left">
            <span class="dot">•</span>
            <span class="item-name">酱牛肉50g</span>
          </div>
          <span class="item-qty">1份</span>
        </div>
      </div>

      <!-- 分组 2：小吃 2选1 -->
      <div class="package-group" style="margin-top: 14px;">
        <h4 class="group-title">小吃 2选1</h4>
        
        <div class="package-item">
          <div class="item-left">
            <span class="dot">•</span>
            <span class="item-name">五香卤蛋</span>
          </div>
          <span class="item-qty">1份</span>
        </div>

        <div class="package-item">
          <div class="item-left">
            <span class="dot">•</span>
            <span class="item-name">精品小菜</span>
            <span class="top-tag">推荐菜 TOP3</span>
          </div>
          <span class="item-qty">1份</span>
        </div>
      </div>
    </section>

<!-- 3.1 购买须知（支持点击展开/收起） -->
    <section class="rules-card">
      <h3 class="card-headline">购买须知</h3>

      <!-- 规则列表容器：根据 isExpanded 控制高度 -->
      <div class="rules-content" :class="{ 'collapsed': !isExpanded }">
        <!-- 规则块 1 -->
        <div class="rule-block">
          <div class="rule-title">
            <van-icon name="calendar-o" size="14" />
            <span>使用规则</span>
          </div>
          <ul class="rule-items">
            <li>• 有效期：购买后50天内有效</li>
            <li>• 商家营业时间可用</li>
            <li>• 堂食或餐前外带均可</li>
            <li>• 到店消费：无需预约，高峰期可能需要排队</li>
          </ul>
        </div>

        <!-- 规则块 2 -->
        <div class="rule-block">
          <div class="rule-title">
            <van-icon name="bag-o" size="14" />
            <span>店内优惠规则</span>
          </div>
          <div class="rule-desc">不与店内优惠同享</div>
        </div>

        <!-- 规则块 3 -->
        <div class="rule-block">
          <div class="rule-title">
            <van-icon name="gift-o" size="14" />
            <span>可赠送好友</span>
          </div>
          <div class="rule-desc">购买后支持赠送给好友使用</div>
        </div>
      </div>

      <!-- 展开/收起按钮 -->
      <div class="expand-btn" @click="isExpanded = !isExpanded">
        <span>{{ isExpanded ? '收起全部' : '展开全部' }}</span>
        <van-icon :name="isExpanded ? 'arrow-up' : 'arrow-down'" />
      </div>
    </section>

    <!-- 3.2 适用门店与更多团购 -->
    <section class="store-section-card">
      <h3 class="card-headline">适用门店</h3>
      
      <!-- 门店核心信息 -->
      <div class="store-main-row">
        <img 
          src="https://img01.yzcdn.cn/vant/custom-empty-image.png" 
          class="store-thumb" 
        />
        <div class="store-details">
          <div class="store-name-text">德元兰州纯汤牛肉面(广州旗舰店)</div>
          <!-- 爱心评分行 -->
          <div class="rating-row">
            <span class="hearts">❤️❤️❤️❤️❤️</span>
            <span class="score-num">4.6</span>
            <span class="score-desc">非常棒</span>
            <span class="comment-count">1009条评价</span>
          </div>
          <div class="store-sub-info">人均¥30 营业时间10:00-22:00</div>
          <!-- 抖音榜单胶囊 -->
          <div class="rank-tag-wrap">
            <span class="douyin-rank-tag">🎵 天河区快餐人气榜第4名</span>
            <span class="people-count">消费人数1万+</span>
          </div>
        </div>
      </div>

      <!-- 更多本店团购横向滑动 -->
      <div class="more-groupon-header">
        <span>更多本店团购(20)</span>
        <van-icon name="arrow" size="12" />
      </div>

      <div class="groupon-scroll-row">
        <div class="mini-groupon-card">
          <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" class="mini-card-img" />
          <div class="mini-card-title">纯汤牛肉面+酱牛肉50g+五...</div>
          <div class="mini-card-price">¥22.9 <del>¥33</del></div>
        </div>
        <div class="mini-groupon-card">
          <img src="https://img01.yzcdn.cn/vant/apple-2.jpg" class="mini-card-img" />
          <div class="mini-card-title">秘制干拌面(冷/热) 2...</div>
          <div class="mini-card-price">¥19.9 <del>¥29</del></div>
        </div>
        <div class="mini-groupon-card">
          <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="mini-card-img" />
          <div class="mini-card-title">单人纯汤牛肉面+椒麻鸡小...</div>
          <div class="mini-card-price">¥21.9 <del>¥26</del></div>
        </div>
      </div>
    </section>

    <!-- 3.3 用户评价模块 -->
    <section class="reviews-card">
      <div class="reviews-header">
        <div class="review-title-left">
          <span class="title-bold">用户评价(1010)</span>
          <span class="watching-text">👥 1人正在看评</span>
        </div>
        <div class="view-all-btn">
          <span>全部</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <!-- 评价内容单项 -->
      <div class="review-item">
        <div class="reviewer-user-row">
          <img src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" class="reviewer-avatar" />
          <div class="reviewer-meta">
            <div class="reviewer-name-row">
              <span class="reviewer-name">听风讲</span>
              <span class="level-badge">Lv.1</span>
            </div>
            <div class="reviewer-hearts-row">
              <span>❤️❤️❤️❤️❤️</span>
              <span class="super-like-tag">超赞</span>
            </div>
          </div>
          <span class="review-date">7-30</span>
        </div>

        <p class="review-text">
          广州也吃到正宗德元纯汤牛肉面！牛骨原汤鲜香醇厚，不会齁咸，面条手工现拉，可以选粗细...
        </p>

        <!-- 评论晒图缩略 -->
        <div class="review-photos-grid">
          <img src="https://img01.yzcdn.cn/vant/custom-empty-image.png" class="review-photo" />
          <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" class="review-photo" />
        </div>
      </div>
    </section>

    <!-- 4. 底部固定购买双按钮栏（像素级还原） -->
    <footer class="bottom-buy-bar">
      <!-- 顶部小粉条提示 -->
      <div class="sub-discount-strip">
        <span class="strip-tag">抖音支付立减</span>
        <span class="strip-desc">使用抖音支付立减1元</span>
      </div>

      <!-- 底部左右双按钮 -->
      <div class="action-btn-row">
        <!-- 左按钮：原价立即购买 -->
        <button class="buy-btn btn-white">
          <div class="btn-price">¥25.9</div>
          <div class="btn-action">立即购买</div>
        </button>

        <!-- 右按钮：抖音支付优惠购买 -->
        <button class="buy-btn btn-red">
          <div class="btn-price">¥24.9</div>
          <div class="btn-action">抖音支付购买</div>
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import { showToast } from 'vant'

// 控制“购买须知”是否展开（默认收起，露出部分）
const isExpanded = ref(false)

const handleBack = () => {
  showToast('返回上一页')
}

</script>

<style scoped>
.detail-container {
  background-color: #f6f7f9;
  min-height: 100vh;
  padding-bottom: 110px; /* 留出底部双层固定栏的高度 */
  position: relative;
  box-sizing: border-box;
}

/* 1. 顶部悬浮透明圆圈按钮 */
.float-header {
  position: fixed;
  top: 12px;
  left: 0;
  right: 0;
  max-width: 430px; /* 适配电脑端的手机壳宽度 */
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 14px;
  z-index: 100;
  pointer-events: none; /* 让空白处可以穿透点击 */
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

/* 2. 商品主图 */
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
}
.tag-title {
  font-size: 19px;
  font-weight: bold;
  letter-spacing: 1px;
}
.tag-sub {
  font-size: 13px;
  margin-top: 2px;
  color: #ffeaa7;
}

/* 3. 价格与标题白底卡片 */
.price-section {
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  margin-top: -16px; /* 稍微盖住一点主图底部，营造重叠圆角质感 */
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

/* 4. 底部固定购买双按钮栏 */
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
/* 左边白底粉边按钮 */
.btn-white {
  background-color: #fff;
  border: 1px solid #ff4d6a;
  color: #ff2346;
}
/* 右边大红粉底白字按钮 */
.btn-red {
  background: linear-gradient(135deg, #ff2346, #ff4365);
  border: none;
  color: #fff;
}
/* 2.1 商家卡片 */
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

/* 2.2 套餐明细卡片 */
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

/* 通用卡片外壳 */
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

/* 3.1 购买须知与展开折叠动画 */
.rules-content {
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.rules-content.collapsed {
  max-height: 180px; /* 收起时的高度，遮住后半部分 */
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

/* 3.2 适用门店卡片 */
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

/* 更多团购横排 */
.more-groupon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  font-size: 13px;
  color: #444;
}
.groupon-scroll-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-top: 8px;
}
.groupon-scroll-row::-webkit-scrollbar {
  display: none;
}
.mini-groupon-card {
  width: 110px;
  flex-shrink: 0;
}
.mini-card-img {
  width: 110px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}
.mini-card-title {
  font-size: 11px;
  color: #333;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mini-card-price {
  font-size: 13px;
  font-weight: bold;
  color: #ff2346;
  margin-top: 2px;
}
.mini-card-price del {
  font-size: 10px;
  color: #aaa;
  margin-left: 2px;
}

/* 3.3 用户评价 */
.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.title-bold {
  font-size: 15px;
  font-weight: bold;
  color: #111;
}
.watching-text {
  font-size: 11px;
  color: #999;
  margin-left: 6px;
}
.view-all-btn {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 2px;
}
.reviewer-user-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.reviewer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.reviewer-meta {
  flex: 1;
}
.reviewer-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.reviewer-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}
.level-badge {
  font-size: 9px;
  background-color: #2ed573;
  color: #fff;
  padding: 0 4px;
  border-radius: 3px;
  font-weight: bold;
}
.reviewer-hearts-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
}
.super-like-tag {
  color: #ff2346;
  font-size: 10px;
  font-weight: bold;
}
.review-date {
  font-size: 11px;
  color: #bbb;
}
.review-text {
  font-size: 13px;
  color: #333;
  line-height: 1.4;
  margin: 8px 0;
}
.review-photos-grid {
  display: flex;
  gap: 6px;
}
.review-photo {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}
</style>