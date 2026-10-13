import { entityId } from './identity.js'
import { deadlineSeconds } from './server-time.js'

export function createPaymentFlow({ orderId, fetchOrder, payOrder, cancelOrder, now = Date.now, isActive = () => true, onPaid = () => {}, onChange = () => {} }) {
  orderId = entityId(orderId)
  if (!orderId) throw new Error('缺少真实订单号')
  let detail = null, busy = false
  const assertActive = () => { if (!isActive()) throw new Error('页面或账号已变更') }
  const publish = next => { detail = next; onChange(next ? { ...next } : null) }
  const canPay = () => {
    const seconds = deadlineSeconds(detail?.payDeadline, now())
    return isActive() && !busy && detail?.status === 'UNPAID' && seconds !== null && seconds > 0
  }
  return {
    getDetail: () => detail ? { ...detail } : null,
    canPay,
    async refresh() {
      assertActive()
      if (busy) throw new Error('订单处理中')
      busy = true
      try {
        const result = await fetchOrder(orderId)
        assertActive()
        if (entityId(result?.id) !== orderId) throw new Error('订单详情无法确认')
        publish(result)
        return { ...detail }
      } catch (error) {
        publish(null)
        throw error
      } finally { busy = false }
    },
    async pay() {
      assertActive()
      if (busy) throw new Error('订单处理中')
      if (!canPay()) throw new Error('订单当前不可支付，请刷新订单状态')
      busy = true
      try {
        const result = await payOrder(orderId)
        assertActive()
        publish({ ...detail, ...result, id: orderId, status: result?.status || 'UNUSED' })
        // The only success transition is AFTER a resolved pay API.
        onPaid({ ...detail })
        return { ...detail }
      } finally { busy = false }
    },
    async cancel() {
      assertActive()
      if (busy) throw new Error('订单处理中')
      if (detail?.status !== 'UNPAID') throw new Error('订单当前不可取消，请刷新订单状态')
      busy = true
      try {
        const result = await cancelOrder(orderId)
        assertActive()
        publish({ ...detail, ...result, id: orderId, status: result?.status || 'CANCELLED' })
        return { ...detail }
      } finally { busy = false }
    },
  }
}
