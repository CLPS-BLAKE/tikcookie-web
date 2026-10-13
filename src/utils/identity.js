// Keep snowflake IDs as strings; an unsafe number has already lost precision.
export function entityId(value) {
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' && Number.isSafeInteger(value)) return String(value)
  return ''
}

const sessionKey = 'tikcookie:auth:v1'
// Storage cleanup can itself throw. Revocation must take effect before any disk operation.
const runtime = new WeakMap()
const stateFor = storage => {
  if (!runtime.has(storage)) runtime.set(storage, { invalid: false, revision: 0 })
  return runtime.get(storage)
}

export function getAuthSession(storage) {
  if (stateFor(storage).invalid) return null
  try {
    const session = JSON.parse(storage.getItem(sessionKey) || 'null')
    if (typeof session?.token !== 'string' || !session.token.trim() || !entityId(session.user?.id)) return null
    return { token: session.token, user: { ...session.user, id: entityId(session.user.id) } }
  } catch { return null }
}

// Never fall back to the unpaired legacy token/userInfo keys, even during migration.
export const currentUserId = storage => getAuthSession(storage)?.user.id || ''
export const currentToken = storage => getAuthSession(storage)?.token || ''
export function matchesAuthSession(storage, snapshot) {
  const current = getAuthSession(storage)
  return !!current && !!snapshot && current.token === snapshot.token && current.user.id === snapshot.user.id
}

export function clearAuthSession(storage, expectedToken) {
  // A response/logout from old account A cannot revoke a later account B.
  if (expectedToken !== undefined && currentToken(storage) !== expectedToken) return false
  const state = stateFor(storage)
  state.invalid = true
  state.revision++
  try { storage.setItem(sessionKey, 'null') } catch {}
  for (const key of [sessionKey, 'token', 'userInfo']) {
    try { storage.removeItem(key) } catch {}
  }
  return true
}

export function beginAuthAttempt(storage) {
  clearAuthSession(storage)
  return stateFor(storage).revision
}

export function saveAuthSession(storage, data, attempt) {
  const state = stateFor(storage)
  if (attempt !== undefined && attempt !== state.revision) throw new Error('登录已被退出或新的认证操作取代')
  state.invalid = true
  try {
    const id = entityId(data?.user?.id)
    if (!id || typeof data?.token !== 'string' || !data.token.trim()) throw new Error('登录响应缺少配对身份')
    const raw = JSON.stringify({ token: data.token, user: { ...data.user, id } })
    storage.setItem(sessionKey, raw)
    if (storage.getItem(sessionKey) !== raw) throw new Error('认证记录未成功保存')
    state.invalid = false
    const session = getAuthSession(storage)
    if (!session || session.token !== data.token || session.user.id !== id) throw new Error('认证记录无法确认')
    state.revision++
    return session
  } catch (error) {
    clearAuthSession(storage)
    throw error
  }
}

export function updateAuthProfile(storage, changes, snapshot) {
  if (!matchesAuthSession(storage, snapshot)) throw new Error('账号认证已变更，不能保存旧账号资料')
  const session = getAuthSession(storage)
  const profile = {}
  // Profile edits must never supply/replace credential identity fields.
  for (const field of ['nickname', 'avatarUrl']) {
    if (typeof changes[field] === 'string') profile[field] = changes[field]
  }
  return saveAuthSession(storage, { token: session.token, user: { ...session.user, ...profile } })
}
