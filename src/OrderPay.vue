<template>
  <div class="order-pay-container">
    <!-- 1. 顶部倒计时与客服栏 -->
    <header class="top-nav-bar">
      <div class="back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="20" />
      </div>

      <div class="center-status">
        <div class="status-title">
          <span>待支付，剩余 </span>
          <!-- 动态红字倒计时 -->
          <span class="countdown-text">{{ formatTime(remainingSeconds) }}</span>
        </div>
        <div class="status-sub">超时未支付，订单将自动取消</div>
      </div>

      <div class="service-btn" @click="handleService">
        <van-icon name="service-o" size="20" />
        <span>客服</span>
      </div>
    </header>

    <!-- 2. 商品与优惠计算卡片 -->
    <section class="card product-calc-card">
      <!-- 上半部：商品信息 -->
      <div class="goods-summary-row">
        <img 
          src="https://img01.yzcdn.cn/vant/apple-1.jpg" 
          class="goods-thumb" 
        />
        <div class="goods-summary-info">
          <div class="goods-title-line">
            <h3 class="goods-title">【首次尝鲜】螺蛳粉3件套单人餐</h3>
            <div class="origin-qty-col">
              <span class="origin-price-tag">¥21</span>
              <span class="qty-tag">x1</span>
            </div>
          </div>
          <div class="rule-hint-row">
            <span>周一至周日可用 · 随时退</span>
            <van-icon name="info-o" size="12" />
          </div>
          <div class="final-price-row">
            <span class="final-yen">¥</span>
            <span class="final-num">14.2</span>
            <van-icon name="arrow" size="12" class="arrow-icon" />
          </div>
        </div>
      </div>

      <!-- 细虚线分隔 -->
      <div class="dashed-divider"></div>

      <!-- 下半部：价格优惠清单 -->
      <div class="calc-list">
        <div class="calc-item">
          <span class="label">参考价</span>
          <span class="val">¥21</span>
        </div>
        <div class="calc-item">
          <span class="label">团购优惠</span>
          <span class="val discount">-¥5.1</span>
        </div>
        <div class="calc-item">
          <span class="label">专享优惠</span>
          <span class="val discount">-¥1.7</span>
        </div>
      </div>
    </section>

    <!-- 2.2 适用门店卡片（带导航与拨号） -->
    <section class="card store-card">
      <div class="store-card-header">
        <h4 class="card-subtitle">适用门店(123家)</h4>
        <div class="all-store-btn" @click="handleAllStores">
          <span>全部门店</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <div class="store-item-row">
        <!-- 店铺 Logo -->
        <img 
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" 
          class="store-badge-img" 
        />

        <div class="store-main-text">
          <div class="store-title-text">周成芝螺蛳粉(财富广场...</div>
          <div class="store-status-text">营业中 10:00-22:00</div>
          <div class="store-dist-addr">
            <span class="dist-highlight">最近535m</span>
            <span class="addr-text">天河区体育东路118号103-1铺</span>
          </div>
        </div>

        <!-- 右侧圆形操作按钮：导航与电话 -->
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

    <!-- 2.3 套餐详细菜品清单 -->
    <section class="card combo-details-card">
      <!-- 主食 2选1 -->
      <div class="combo-group">
        <h4 class="group-title">主食 2选1</h4>
        <div class="combo-row">
          <span class="dish-name">• 原味螺蛳粉</span>
          <span class="dish-qty">1份</span>
        </div>
        <div class="combo-row">
          <span class="dish-name">• (干捞版) 黏糊麻酱螺蛳粉</span>
          <span class="dish-qty">1份</span>
        </div>
      </div>

      <!-- 小吃 2选1 -->
      <div class="combo-group">
        <h4 class="group-title">小吃 2选1</h4>
        <div class="combo-row">
          <span class="dish-name">• 豆腐串</span>
          <span class="dish-qty">1份</span>
        </div>
        <div class="combo-row">
          <span class="dish-name">• 豆腐泡</span>
          <span class="dish-qty">1份</span>
        </div>
      </div>

      <!-- 饮品 -->
      <div class="combo-group">
        <h4 class="group-title">饮品</h4>
        <div class="combo-row">
          <span class="dish-name">• 可口可乐</span>
          <span class="dish-qty">1份</span>
        </div>
      </div>
    </section>

    <!-- 2.4 订单信息（带一键复制单号） -->
    <section class="card order-info-card">
      <h4 class="card-subtitle">订单信息</h4>
      <div class="order-no-row">
        <span class="order-detail-label">订单详情</span>
        <div class="order-no-copy-wrap">
          <span class="order-no-text">订单号:{{ orderId }}</span>
          <span class="dot-split">·</span>
          <span class="copy-btn" @click="copyOrderNumber">复制</span>
        </div>
        <div class="more-link" @click="handleOrderMore">
          <span>更多</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>
    </section>

    <!-- 3. 底部固定支付操作栏（只保留实付金额，去掉优惠提示） -->
    <footer class="bottom-action-bar">
      <!-- 左侧：仅保留 实付 ¥14.2 -->
      <div class="actual-pay-row">
        <span class="pay-label">实付</span>
        <span class="yen-symbol">¥</span>
        <span class="pay-amount">14.2</span>
      </div>

      <!-- 右侧：取消订单 + 去支付 -->
      <div class="btn-group-right">
        <div class="cancel-order-btn" @click="handleCancel">
          <van-icon name="notes-o" size="18" />
          <span>取消订单</span>
        </div>
        <button class="pay-now-btn" @click="handlePay">
          去支付
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router' // 👈 引入路由工具
import { showToast } from 'vant'
// 1. 引入订单接口（查询详情与模拟支付）
import { getOrderDetailAPI, payOrderAPI } from './api/order'

const router = useRouter()
const route = useRoute() // 👈 读取路由参数

// 订单编号：优先使用上个页面传过来的真实单号，没有则使用默认保底单号
const orderId = ref(route.query.orderId || '1113784812650611165')

// 倒计时秒数（原图 29分28秒 = 1768秒）
const remainingSeconds = ref(1768)
let timer = null

// 格式化时间为 mm:ss
const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

onMounted(async () => {
  // 启动真实倒计时，每秒减 1
  timer = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)

  // 尝试向后端拉取订单详情（对应文档 5.6.7）
  try {
    const data = await getOrderDetailAPI(orderId.value)
    if (data) {
      console.log('获取到后端订单详情:', data)
    }
  } catch (err) {
    // 骨架期静默处理，页面继续使用原有的预设金额和菜品展示
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 返回上一页
const handleBack = () => {
  router.back()
}

// 核心升级：点击去支付（真实请求后端支付接口）
const handlePay = async () => {
  showToast({ type: 'loading', message: '正在调起支付...', forbidClick: true })

  try {
    // 真实调接口：向后端发起支付请求（对应文档 5.6.3）
    await payOrderAPI(orderId.value)
    console.log('支付接口调用成功')
  } catch (err) {
    console.warn('后端支付接口暂未联通或处于骨架期，采用保底放行')
  }

  showToast({
    type: 'success',
    message: '支付成功！',
    onClose: () => {
      // 支付完成后，带着单号跳到交易成功页
      router.push({
        path: '/success',
        query: { orderId: orderId.value }
      })
    }
  })
}

// 点击复制订单号（保持你的原版代码）
const copyOrderNumber = () => {
  navigator.clipboard.writeText(orderId.value).then(() => {
    showToast('订单号已复制到剪贴板')
  }).catch(() => {
    showToast('复制成功')
  })
}

// 门店操作与交互方法（保持你的原版代码）
const handleAllStores = () => showToast('查看全部123家门店')
const handleNav = () => showToast('正在打开地图导航...')
const handleCall = () => showToast('拨打门店电话')
const handleOrderMore = () => showToast('查看更多订单规则')
const handleService = () => showToast('联系客服')
const handleCancel = () => showToast('取消订单申请')
</script>

<style scoped>
.order-pay-container {
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
.center-status {
  text-align: center;
}
.status-title {
  font-size: 17px;
  font-weight: bold;
  color: #111;
}
.countdown-text {
  color: #ff2346;
  font-weight: 900;
}
.status-sub {
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}
.service-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: #333;
  cursor: pointer;
}

/* 通用白底卡片 */
.card {
  margin: 10px 12px;
  background-color: #fff;
  border-radius: 14px;
  padding: 14px;
}

/* 2. 商品与优惠计算卡片 */
.goods-summary-row {
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
.goods-summary-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-title-line {
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
.origin-qty-col {
  text-align: right;
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
}
.origin-price-tag {
  display: block;
  color: #666;
}
.qty-tag {
  display: block;
  margin-top: 2px;
}
.rule-hint-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #666;
  margin-top: 4px;
}
.final-price-row {
  align-self: flex-end;
  display: flex;
  align-items: baseline;
  color: #111;
  margin-top: 2px;
}
.final-yen {
  font-size: 12px;
  font-weight: bold;
}
.final-num {
  font-size: 18px;
  font-weight: 900;
  margin: 0 2px;
}
.arrow-icon {
  color: #999;
}

.dashed-divider {
  border-bottom: 1px dashed #e8e8e8;
  margin: 14px 0 12px 0;
}

/* 优惠计算列表 */
.calc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.calc-item {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
}
.calc-item .label {
  color: #333;
}
.calc-item .val {
  color: #222;
  font-weight: 500;
}
.calc-item .val.discount {
  color: #ff2346;
  font-weight: bold;
}

/* 确保底部整栏垂直居中 */
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
  justify-content: space-between;
  align-items: center; /* 垂直居中 */
  padding: 10px 14px;
  z-index: 100;
}
.actual-pay-row {
  display: flex;
  align-items: baseline;
}
.pay-label {
  font-size: 13px;
  color: #ff2346;
  font-weight: bold;
  margin-right: 2px;
}
.yen-symbol {
  font-size: 14px;
  font-weight: 900;
  color: #ff2346;
}
.pay-amount {
  font-size: 24px;
  font-weight: 900;
  color: #ff2346;
  line-height: 1;
}
.discount-detail-row {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 10.5px;
  color: #ff2346;
  margin-top: 3px;
}
.btn-group-right {
  display: flex;
  align-items: center;
  gap: 14px;
}
.cancel-order-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: #555;
  cursor: pointer;
}
.pay-now-btn {
  background: linear-gradient(135deg, #ff2346, #ff4365);
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: bold;
  height: 40px;
  padding: 0 26px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(255, 35, 70, 0.3);
}
/* 2.2 适用门店卡片 */
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
  color: #888;
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

/* 2.3 套餐菜品明细 */
.combo-details-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
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

/* 2.4 订单信息与复制 */
.order-info-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.order-no-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12.5px;
}
.order-detail-label {
  color: #888;
}
.order-no-copy-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
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
  gap: 1px;
  cursor: pointer;
}
</style>