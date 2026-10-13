<template>
  <div class="queue-container">
    <van-nav-bar title="秒杀购买进度" left-arrow @click-left="router.push('/home')" />
    <section class="queue-card" aria-live="polite">
      <van-loading v-if="status === 'PROCESSING' || checking" color="#ff2346" />
      <h3>{{ statusTitle }}</h3>
      <p>{{ message }}</p>
      <template v-if="intent">
        <p>购买请求：{{ intent.requestKey }}</p>
        <p v-if="intent.orderId">订单号：{{ intent.orderId }}</p>
        <p v-if="intent.acceptedAt">受理时间：{{ intent.acceptedAt }}（上海时间）</p>
        <p v-if="intent.queueDeadline">自动查询截止：{{ intent.queueDeadline }}（上海时间）</p>
      </template>
      <van-button v-if="intent?.orderId" block round color="#ff2346" :loading="checking" :disabled="checking || !isActive()" @click="manualQuery">手动查询结果</van-button>
      <van-button v-else-if="intent" block round color="#ff2346" :loading="checking" :disabled="checking || !isActive()" @click="retryOriginal">重试本次购买（同一请求键）</van-button>
      <van-button v-if="intent" class="secondary-btn" block round :disabled="checking || !isActive()" @click="buyAgain">主动再买（新请求）</van-button>
      <van-button class="secondary-btn" block round @click="router.push('/user')">查看我的订单</van-button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createFlashOrderAPI, getFlashOrderResultAPI } from './api/flash'
import { createFlashFlow, createFlashPoller } from './utils/flash-flow.js'
import { getAuthSession, matchesAuthSession, entityId } from './utils/identity.js'

const route = useRoute()
const router = useRouter()
const authSession = getAuthSession(localStorage)
const userId = entityId(authSession?.user.id)
const productId = entityId(route.query.productId)
const intent = ref(null)
const status = ref('UNKNOWN')
const checking = ref(false)
const error = ref('')
let alive = true, flow = null, poller = null
const isActive = () => alive && matchesAuthSession(localStorage, authSession)
const statusTitle = computed(() => error.value ? '暂无法恢复购买记录' : status.value === 'WAIT_EXPIRED' ? '已停止自动查询' : status.value === 'UNKNOWN' ? '购买结果尚未确认' : '正在等待建单')
const message = computed(() => error.value || (status.value === 'WAIT_EXPIRED'
  ? '已到自动查询截止时间，不代表订单创建失败或原请求已安全结束。请手动查询或查看我的订单。'
  : status.value === 'UNKNOWN'
    ? '暂未确认建单结果，网络错误不代表购买失败。请继续查询，或使用原请求键重试。'
    : '正在每秒查询一次。暂未查到订单不代表购买失败，请不要重复下单。'))

const beginPolling = () => {
  poller?.dispose()
  poller = createFlashPoller({
    getDeadline: () => intent.value?.queueDeadline,
    isActive,
    query: async () => {
      checking.value = true
      try { return await flow.check() } finally { checking.value = false }
    },
    onUpdate: state => { status.value = state },
    onCreated: result => {
      if (isActive()) router.replace({ path: '/pay', query: { orderId: result.orderId } })
    },
  })
  status.value = 'PROCESSING'
  poller.start()
}

onMounted(() => {
  if (!isActive()) { error.value = '请登录原购买账号后再打开此页面'; return }
  try {
    flow = createFlashFlow({
      storage: localStorage, userId, productId, requestKey: entityId(route.query.requestKey),
      submit: createFlashOrderAPI, query: getFlashOrderResultAPI,
      onChange: record => { intent.value = record },
    })
    intent.value = flow.getIntent()
    if (!intent.value) { error.value = '当前账号没有此购买记录，请返回商品页或查询我的订单'; return }
    if (intent.value.orderId) beginPolling()
  } catch { error.value = '本地购买记录无法读取，请勿重复下单，请查看我的订单' }
})

const manualQuery = async () => { if (isActive()) await poller?.manual() }
const retryOriginal = async () => {
  if (checking.value || !isActive()) return
  checking.value = true
  try {
    intent.value = await flow.submit()
    if (isActive()) beginPolling()
  } catch { status.value = 'UNKNOWN' }
  finally { checking.value = false }
}
const buyAgain = () => router.push({ path: '/detail', query: { id: productId, type: 'FLASH', newPurchase: '1', purchaseAction: crypto.randomUUID() } })
onUnmounted(() => { alive = false; poller?.dispose() })
</script>

<style scoped>
.queue-container { min-height: 100vh; background: #f7f8fa; }
.queue-card { margin: 10px 12px; padding: 20px 16px; border-radius: 14px; background: #fff; }
h3 { color: #111; }
p { font-size: 13px; line-height: 1.7; color: #666; overflow-wrap: anywhere; }
.secondary-btn { margin-top: 12px; }
</style>
