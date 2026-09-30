import request from '../utils/request'

// 1. 普通商品下单（文档 5.6.1，生成真实订单号）
export const createOrderAPI = (productId) => {
  return request.post('/orders', { productId })
}

// 2. 模拟支付（文档 5.6.3，留给支付页用）
export const payOrderAPI = (orderId) => {
  return request.post(`/orders/${orderId}/pay`)
}

// 3. 查询订单详情（文档 5.6.7）
export const getOrderDetailAPI = (orderId) => {
  return request.get(`/orders/${orderId}`)
}

// 4. 去使用 / 核销团购券（文档 5.6.8，调用立即完成教学模拟核销）
export const useOrderAPI = (orderId) => {
  return request.post(`/orders/${orderId}/use`)
}

// 5. 申请退款（文档 5.6.5，随时退款）
export const refundOrderAPI = (orderId) => {
  return request.post(`/orders/${orderId}/refund`)
}

// 6. 获取我的订单列表（文档 5.6.6，支持状态筛选和分页）
export const getMyOrdersAPI = (params = { page: 1, size: 10 }) => {
  return request.get('/orders', { params })
}