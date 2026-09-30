<template>
  <div class="success-container">
    <!-- 1. 顶部 Header -->
    <header class="top-nav-bar">
      <div class="back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="20" />
      </div>
      <div class="nav-title">交易成功</div>
      <div class="service-btn" @click="handleService">
        <van-icon name="service-o" size="20" />
        <span>客服</span>
      </div>
    </header>

    <!-- 2. 商品卡片 -->
    <section class="card product-card">
      <div class="goods-row">
        <img 
          src="https://img01.yzcdn.cn/vant/apple-1.jpg" 
          class="goods-thumb" 
        />
        <div class="goods-info">
          <div class="title-price-line">
            <h3 class="goods-title">【解辣解腻】原味螺蛳粉/大片腐竹螺蛳粉（2选1）+特色糖水</h3>
            <div class="origin-col">
              <span class="origin-price">¥22</span>
              <span class="qty">x1</span>
            </div>
          </div>
          <div class="final-price-row">
            <span class="yen">¥</span>
            <span class="price-num">15.1</span>
            <van-icon name="arrow" size="12" class="arrow-icon" />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 适用门店卡片（休息中 状态） -->
    <section class="card store-card">
      <div class="store-card-header">
        <h4 class="card-subtitle">适用门店(114家)</h4>
        <div class="all-store-btn" @click="handleAllStores">
          <span>全部门店</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <div class="store-item-row">
        <img 
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" 
          class="store-badge-img" 
        />
        <div class="store-main-text">
          <div class="store-title-text">周成芝螺蛳粉(财富广场...</div>
          <div class="store-status-text">休息中 10:00-22:00</div>
          <div class="store-dist-addr">
            <span class="dist-highlight">最近537m</span>
            <span class="addr-text">天河区体育东路118号103-1铺</span>
          </div>
        </div>

        <div class="store-action-icons">
          <div class="action-circle-icon" @click="handleNav">
            <van-icon name="location-o" size="16" />
          </div>
          <div class="action-circle-icon" @click="handleCall">
            <van-icon name="phone-o" size="16" />
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 套餐明细卡片（主食与糖水） -->
    <section class="card combo-card">
      <div class="combo-group">
        <h4 class="group-title">主食 2选1</h4>
        <div class="combo-row">
          <span class="dish-name">• 原味螺蛳粉</span>
          <span class="dish-qty">1份</span>
        </div>
        <div class="combo-row">
          <span class="dish-name">• 大片腐竹螺蛳粉</span>
          <span class="dish-qty">1份</span>
        </div>
      </div>

      <div class="combo-group" style="margin-top: 14px;">
        <h4 class="group-title">糖水 2选1</h4>
        <div class="combo-row">
          <span class="dish-name">• 木薯糖水</span>
          <span class="dish-qty">1份</span>
        </div>
        <div class="combo-row">
          <span class="dish-name">• 红豆水牛奶布丁</span>
          <span class="dish-qty">1份</span>
        </div>
      </div>
    </section>

    <!-- 5. 订单信息卡片（交易快照、使用情况） -->
    <section class="card order-info-card">
      <h4 class="card-subtitle">订单信息</h4>
      
      <div class="meta-item-row" @click="handleSnapshot">
        <span class="meta-label">交易快照</span>
        <div class="meta-val-right">
          <span>可作为交易争执的判断依据</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <div class="meta-item-row" @click="handleUsage">
        <span class="meta-label">使用情况</span>
        <div class="meta-val-right">
          <span>已使用1份</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <div class="meta-item-row">
        <span class="meta-label">订单详情</span>
        <div class="order-no-copy-wrap">
          <span class="order-no-text">订单号:{{ orderId }}</span>
          <span class="dot-split">·</span>
          <span class="copy-btn" @click="copyOrderNumber">复制</span>
        </div>
        <div class="more-link" @click="handleMore">
          <span>更多</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>
    </section>

    <!-- 6. 底部限时优惠券横幅（像素级还原原图） -->
    <section class="card coupon-recall-card">
      <div class="recall-header">
        <span>您还有4张共<span class="red-bold">20</span>元券待使用，仅剩<span class="red-bold timer">14:03:22</span></span>
      </div>

      <!-- 横向滑动优惠券列表 -->
      <div class="recall-coupon-scroll">
        <!-- 第 1 张券：¥13 -->
        <div class="curved-coupon">
          <!-- 左侧：凸出的白底弧形区域 -->
          <div class="coupon-left-arc">
            <div class="amt-line">
              <span class="yen">¥</span>
              <span class="num">13</span>
            </div>
            <div class="limit-line">满180可用</div>
          </div>
          <!-- 右侧：红底区域与去使用胶囊 -->
          <div class="coupon-right-action" @click="handleUseCoupon">
            <span class="coupon-tag-txt">限时券</span>
            <span class="use-pill-btn">去使用</span>
          </div>
        </div>

        <!-- 第 2 张券：¥4 -->
        <div class="curved-coupon">
          <div class="coupon-left-arc">
            <div class="amt-line">
              <span class="yen">¥</span>
              <span class="num">4</span>
            </div>
            <div class="limit-line">满80可用</div>
          </div>
          <div class="coupon-right-action" @click="handleUseCoupon">
            <span class="coupon-tag-txt">限时券</span>
            <span class="use-pill-btn">去使用</span>
          </div>
        </div>

        <!-- 第 3 张券：¥2（右侧露出一半） -->
        <div class="curved-coupon">
          <div class="coupon-left-arc">
            <div class="amt-line">
              <span class="yen">¥</span>
              <span class="num">2</span>
            </div>
            <div class="limit-line">满30可用</div>
          </div>
          <div class="coupon-right-action" @click="handleUseCoupon">
            <span class="coupon-tag-txt">限时券</span>
            <span class="use-pill-btn">去使用</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. 底部固定按钮：再来一单 / 去评价 -->
    <footer class="bottom-action-bar">
      <button class="capsule-btn btn-again" @click="handleOrderAgain">
        再来一单
      </button>
      <button class="capsule-btn btn-evaluate" @click="handleEvaluate">
        去评价
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 1. 返回首页（支付成功后返回一般直接回首页，防止重复支付）
const handleBack = () => {
  router.push('/home')
}

// 2. 去使用/核销团购券
const handleUseCoupon = () => {
  router.push('/voucher')
}

// 3. 去评价
const handleEvaluate = () => {
  router.push('/comment')
}

const orderId = ref('1113784124297331165')


const handleService = () => showToast('联系客服')
const handleAllStores = () => showToast('查看114家门店')
const handleNav = () => showToast('导航')
const handleCall = () => showToast('呼叫门店')
const handleSnapshot = () => showToast('查看交易快照')
const handleUsage = () => showToast('使用情况明细')
const handleMore = () => showToast('更多规则')

const handleOrderAgain = () => showToast('再次加入购物车')


const copyOrderNumber = () => {
  navigator.clipboard.writeText(orderId.value)
  showToast('订单号已复制')
}
</script>

<style scoped>
.success-container {
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
  padding: 12px 14px;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-title {
  font-size: 17px;
  font-weight: bold;
  color: #111;
}
.service-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: #333;
  cursor: pointer;
}

/* 卡片基础样式 */
.card {
  margin: 10px 12px;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px;
}

/* 2. 商品卡片 */
.goods-row {
  display: flex;
  gap: 10px;
}
.goods-thumb {
  width: 78px;
  height: 78px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}
.goods-info {
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
.origin-col {
  text-align: right;
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
}
.origin-price {
  display: block;
  color: #666;
}
.qty {
  display: block;
  margin-top: 2px;
}
.final-price-row {
  align-self: flex-end;
  display: flex;
  align-items: baseline;
  color: #111;
}
.yen {
  font-size: 12px;
  font-weight: bold;
}
.price-num {
  font-size: 18px;
  font-weight: 900;
  margin: 0 2px;
}
.arrow-icon {
  color: #999;
}

/* 3. 适用门店 */
.store-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.card-subtitle {
  font-size: 15px;
  font-weight: bold;
  color: #111;
  margin: 0;
}
.all-store-btn {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}
.store-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.store-badge-img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.store-main-text {
  flex: 1;
  overflow: hidden;
}
.store-title-text {
  font-size: 14px;
  font-weight: bold;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.store-status-text {
  font-size: 11.5px;
  color: #999;
  margin: 3px 0;
}
.store-dist-addr {
  font-size: 11.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dist-highlight {
  color: #ff2346;
  font-weight: 500;
  margin-right: 4px;
}
.addr-text {
  color: #666;
}
.store-action-icons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.action-circle-icon {
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

/* 4. 套餐明细 */
.combo-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.group-title {
  font-size: 14px;
  font-weight: bold;
  color: #111;
  margin: 0;
}
.combo-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13.5px;
}
.dish-name {
  color: #333;
}
.dish-qty {
  color: #888;
  font-size: 13px;
}

/* 5. 订单信息 */
.order-info-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.meta-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}
.meta-label {
  color: #333;
}
.meta-val-right {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #888;
}
.order-no-copy-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
}
.order-no-text {
  color: #333;
}
.dot-split {
  color: #ccc;
}
.copy-btn {
  color: #2a5caa;
  font-weight: 500;
  cursor: pointer;
}
.more-link {
  color: #888;
  display: flex;
  align-items: center;
  font-size: 12.5px;
}

/* 6. 优惠券复购横幅 */
.coupon-recall-card {
  padding: 12px 14px;
  background-color: #fff;
  border-radius: 14px;
}
.recall-header {
  font-size: 13px;
  color: #222;
  margin-bottom: 10px;
}
.red-bold {
  color: #ff2346;
  font-weight: bold;
}
.timer {
  margin-left: 2px;
}

/* 横向滑动轴 */
.recall-coupon-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0;
}
.recall-coupon-scroll::-webkit-scrollbar {
  display: none;
}

/* 核心技巧：外层红色卡券底座 */
.curved-coupon {
  display: flex;
  height: 56px;
  background: linear-gradient(135deg, #ff2346, #ff4365);
  border: 1.5px solid #ff2346;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  box-sizing: border-box;
}

/* 左侧白底区域（带弧形切角，圆润切入右侧红底） */
.coupon-left-arc {
  background-color: #ffffff;
  /* 关键：右边带有 16px 圆弧凸起 */
  border-radius: 0 16px 16px 0; 
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ff2346;
  z-index: 2;
  min-width: 62px;
}
.amt-line {
  display: flex;
  align-items: baseline;
  line-height: 1;
}
.amt-line .yen {
  font-size: 11px;
  font-weight: bold;
}
.amt-line .num {
  font-size: 21px;
  font-weight: 900;
  margin-left: 1px;
}
.limit-line {
  font-size: 10px;
  color: #ff2346;
  font-weight: 500;
  margin-top: 4px;
  white-space: nowrap;
}

/* 右侧红底与白色小药丸按钮 */
.coupon-right-action {
  flex: 1;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.coupon-tag-txt {
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}
.use-pill-btn {
  background-color: #ffffff;
  color: #ff2346;
  font-size: 10.5px;
  font-weight: bold;
  padding: 2.5px 8px;
  border-radius: 12px;
  margin-top: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

/* 7. 底部固定结算条 */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 430px;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end; /* 👈 关键点 1：靠右侧对齐，不再两头撑满 */
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  z-index: 100;
  box-sizing: border-box;
}

/* 胶囊按钮标准样式 */
.capsule-btn {
  /* 👈 关键点 2：去掉 flex: 1，固定精致尺寸 */
  min-width: 92px;
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  box-sizing: border-box;
}

.btn-again {
  background-color: #ffffff;
  border: 1px solid #c8c9cc; /* 纤细浅灰边 */
  color: #333333;
}

.btn-evaluate {
  background: linear-gradient(135deg, #ff2346, #ff385c);
  border: none;
  color: #ffffff;
}
</style>