import request from '../utils/request'

// 1. 获取分类列表（文档 5.3.1）
export const getCategoriesAPI = () => {
  return request.get('/categories')
}

// 2. 获取抢购专区商品（文档 5.4.4，用于大牌天天省/秒杀）
export const getFlashProductsAPI = () => {
  return request.get('/products/flash')
}

// 3. 获取首页商品瀑布流（文档 5.4.3，支持分页与排序）
export const getProductsAPI = (params = { page: 1, size: 10, sort: 'latest' }) => {
  return request.get('/products', { params })
}

// 4. 获取单个商品详情（文档 5.4.2，留给详情页用）
export const getProductDetailAPI = (productId) => {
  return request.get(`/products/${productId}`)
}