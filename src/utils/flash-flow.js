import { getAuthSession, matchesAuthSession, entityId } from './identity.js'
import { parseShanghaiTime } from './server-time.js'

export function createFlashFlow({ storage, userId, productId, requestKey, createKey = () => crypto.randomUUID(), submit, query, onChange = () => {} }) {
  userId = entityId(userId)
  productId = entityId(productId)
  if (!userId || !productId) throw new Error('需要真实账号和商品 ID')
  const authSession = getAuthSession(storage)
  const storageKey = `tikcookie:flash:v1:${encodeURIComponent(userId)}:${encodeURIComponent(productId)}`
  const records = () => {
    const raw = storage.getItem(storageKey)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data) || data.some(item => item.userId !== userId || item.productId !== productId || !entityId(item.requestKey))) throw new Error('本地购买记录损坏，请勿重复下单')
    return data
  }
  const saved = records()
  let intent = requestKey ? saved.find(item => item.requestKey === requestKey) || null : saved.at(-1) || null
  let inFlight = null
  const assertOwner = () => {
    if (authSession?.user.id !== userId || !matchesAuthSession(storage, authSession)) throw new Error('账号已变更，请重新打开商品')
  }
  const persist = next => {
    const list = records()
    const index = list.findIndex(item => item.requestKey === next.requestKey)
    if (index === -1) list.push(next)
    else list[index] = next
    // Write first: if storage is unavailable, never issue POST or lose the old key.
    storage.setItem(storageKey, JSON.stringify(list))
    intent = next
    onChange({ ...next })
    return { ...next }
  }
  return {
    getIntent: () => intent ? { ...intent } : null,
    hasPurchaseAction: action => !!action && records().some(item => item.purchaseAction === action),
    submit({ newPurchase = false, purchaseAction } = {}) {
      if (inFlight) return inFlight
      // Start synchronously so even a second click sees the persisted original key.
      const run = async () => {
        assertOwner()
        // Other already-open pages may have persisted/accepted an intent since initialization.
        // Ordinary submission resumes the latest shared intent, while explicit keys stay pinned.
        const latest = records()
        if (requestKey) {
          intent = latest.find(item => item.requestKey === requestKey) || null
          if (!intent) throw new Error('指定购买请求键没有对应记录')
          if (newPurchase) throw new Error('指定请求键只能重试原购买记录')
          if (purchaseAction && purchaseAction !== intent.purchaseAction) throw new Error('购买动作与指定请求键记录不匹配')
        } else {
          intent = latest.at(-1) || null
        }
        if (intent) onChange({ ...intent })
        // A buy-again URL is an action, not permission to create a new key on every refresh.
        // Consume that action in the same durable record as the key, before POST.
        if (purchaseAction) {
          const consumed = records().find(item => item.purchaseAction === purchaseAction)
          if (consumed) { intent = consumed; newPurchase = false; onChange({ ...intent }) }
        }
        if (!intent || newPurchase) {
          const key = entityId(createKey())
          if (!key || records().some(item => item.requestKey === key)) throw new Error('无法生成新的购买请求键')
          persist({ userId, productId, requestKey: key, phase: 'PENDING', ...(purchaseAction ? { purchaseAction } : {}) })
        }
        if (intent.orderId) return { ...intent }
        const result = await submit({ productId, requestKey: intent.requestKey })
        assertOwner()
        const accepted = parseShanghaiTime(result?.acceptedAt)
        const deadline = parseShanghaiTime(result?.queueDeadline)
        if (result?.state !== 'PROCESSING' || !entityId(result.orderId) || !Number.isFinite(accepted) || !Number.isFinite(deadline) || deadline < accepted) throw new Error('排队响应无法确认，请使用原请求重试')
        return persist({ ...intent, phase: 'PROCESSING', orderId: entityId(result.orderId), acceptedAt: result.acceptedAt, queueDeadline: result.queueDeadline })
      }
      inFlight = run().finally(() => { inFlight = null })
      return inFlight
    },
    async check() {
      assertOwner()
      if (!intent?.orderId) throw new Error('尚未取得订单号，请重试原购买请求')
      const result = await query(intent.orderId)
      assertOwner()
      if (result?.state === 'CREATED') {
        if (entityId(result.orderId) !== intent.orderId || !result.orderStatus) throw new Error('建单响应无法确认')
        persist({ ...intent, phase: 'CREATED', orderStatus: result.orderStatus })
      } else if (result?.state !== 'NOT_CREATED') {
        throw new Error('建单响应无法确认')
      }
      // NOT_CREATED is only a snapshot, not a terminal failure or release of this intent.
      return result
    },
  }
}

export function createFlashPoller({ getDeadline, query, onCreated = () => {}, onUpdate = () => {}, now = Date.now, setTimer = setTimeout, clearTimer = clearTimeout, isActive = () => true }) {
  let timer = null, busy = false, disposed = false, created = false, started = false
  const active = () => !disposed && !created && isActive()
  const stop = () => { if (timer !== null) clearTimer(timer); timer = null }
  const expired = () => {
    const deadline = parseShanghaiTime(getDeadline())
    return !Number.isFinite(deadline) || now() >= deadline
  }
  const check = async () => {
    if (!active() || busy) return null
    busy = true
    try {
      const result = await query()
      if (!active()) return null
      if (result?.state === 'CREATED') {
        created = true
        stop()
        onCreated(result)
      } else {
        onUpdate(expired() ? 'WAIT_EXPIRED' : 'PROCESSING')
      }
      return result
    } catch {
      if (active()) onUpdate(expired() ? 'WAIT_EXPIRED' : 'UNKNOWN')
      return null
    } finally {
      busy = false
    }
  }
  const tick = () => {
    timer = null
    if (!active()) return
    if (expired()) { onUpdate('WAIT_EXPIRED'); return }
    // Keep one-second ticks even during a slow request; check() prevents overlap.
    const wait = Math.min(1000, parseShanghaiTime(getDeadline()) - now())
    timer = setTimer(tick, wait)
    void check()
  }
  return {
    start() { if (!started && active()) { started = true; tick() } },
    manual: check,
    dispose() { disposed = true; stop() },
  }
}
