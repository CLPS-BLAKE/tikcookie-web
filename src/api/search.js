import request from '../utils/request'

// 1. 商品搜索接口（文档 5.5.1，支持关键词、分类、排序和分页）
export const searchProductsAPI = (params = { keyword: '', page: 1, size: 10, sort: 'default' }) => {
  return request.get('/search/products', { params })
}

// 2. 店铺搜索接口（文档 5.5.2）
export const searchShopsAPI = (params = { keyword: '', page: 1, size: 10 }) => {
  return request.get('/search/shops', { params })
}