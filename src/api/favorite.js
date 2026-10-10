import request from '../utils/request'

// 1. 添加收藏（文档 5.7.1）
export const addFavoriteAPI = (targetType, targetId) => {
  return request.post('/favorites', { targetType, targetId })
}

// 2. 取消收藏（文档 5.7.2）
export const removeFavoriteAPI = (targetType, targetId) => {
  return request.delete(`/favorites/${targetType}/${targetId}`)
}

// 3. 查询是否已收藏（文档 5.7.4）
export const getFavoriteStatusAPI = (targetType, targetId) => {
  return request.get('/favorites/status', {
    params: { targetType, targetId }
  })
}

// 4. 获取我的收藏列表（文档 5.7.3）
export const getFavoriteListAPI = (params = { targetType: 'PRODUCT', page: 1, size: 20 }) => {
  return request.get('/favorites', { params })
}