/**
 * 将后端返回的分转换为元
 * @param {number} cents 金额（单位：分）
 * @returns {string} 保留两位小数的元，如 3990 -> "39.90"
 */
export const formatPrice = (cents) => {
  if (cents === null || cents === undefined) return '0.00'
  return (cents / 100).toFixed(2)
}
// 终极健壮版 cleanUrl
export const cleanUrl = (url) => {
  if (!url) return ''

  let clean = url

  // 1. 如果开头或者中间缺少字母 h（变成了 ttps:// 或 ttps:），统一补齐为 https://
  if (clean.includes('/ttps://')) {
    clean = 'https://' + clean.split('/ttps://')[1]
  } else if (clean.startsWith('ttps://')) {
    clean = 'h' + clean
  } else if (clean.startsWith('ttp://')) {
    clean = 'h' + clean
  }

  // 2. 处理重复拼接的情况（如 .../https://...）
  if (clean.includes('/https://')) {
    clean = 'https://' + clean.split('/https://')[1]
  } else if (clean.includes('/http://')) {
    clean = 'http://' + clean.split('/http://')[1]
  }

  // 3. 通用兜底截取最后一个 http
  const lastHttpIndex = clean.lastIndexOf('http')
  if (lastHttpIndex > 0) {
    clean = clean.substring(lastHttpIndex)
  }

  return clean
}