import request from '../utils/request'

// 1. 提交评价（文档 5.7.1，对应 #23）
export const createReviewAPI = (orderId, data) => {
  return request.post(`/orders/${orderId}/review`, data)
}

// 2. 查询我该订单的评价（文档 5.7.2，对应 #24）
export const getMyOrderReviewAPI = (orderId) => {
  return request.get(`/orders/${orderId}/review`)
}

// 3. 获取商品评价列表（文档 5.7.3，对应 #25）
export const getProductReviewsAPI = (productId, params = { page: 1, size: 10 }) => {
  return request.get(`/products/${productId}/reviews`, { params })
}

// 4. 获取商品评价汇总（文档 5.7.4，对应 #26）
export const getProductReviewSummaryAPI = (productId) => {
  return request.get(`/products/${productId}/review-summary`)
}