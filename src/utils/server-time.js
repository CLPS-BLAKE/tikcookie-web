// Backend LocalDateTime values are Asia/Shanghai (UTC+08:00), not the device's zone.
export function parseShanghaiTime(value) {
  if (typeof value !== 'string') return NaN
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?$/.exec(value)
  if (!match) return NaN
  const [, y, m, d, h, minute, s, fraction = '', zone = '+08:00'] = match
  const calendar = new Date(Date.UTC(+y, +m - 1, +d, +h, +minute, +s))
  if (calendar.getUTCFullYear() !== +y || calendar.getUTCMonth() !== +m - 1 || calendar.getUTCDate() !== +d || +h > 23 || +minute > 59 || +s > 59) return NaN
  return Date.parse(`${y}-${m}-${d}T${h}:${minute}:${s}${fraction}${zone}`)
}

export function deadlineSeconds(value, now = Date.now()) {
  const deadline = parseShanghaiTime(value)
  return Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null
}
