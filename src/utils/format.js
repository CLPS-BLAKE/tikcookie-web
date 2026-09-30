/**
 * 将后端返回的分转换为元
 * @param {number} cents 金额（单位：分）
 * @returns {string} 保留两位小数的元，如 3990 -> "39.90"
 */
export const formatPrice = (cents) => {
  if (cents === null || cents === undefined) return '0.00'
  return (cents / 100).toFixed(2)
}