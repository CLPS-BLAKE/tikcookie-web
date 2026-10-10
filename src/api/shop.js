import request from '../utils/request'

// 1. 获取店铺详情（文档 5.3.2，公开接口）
export const getShopDetailAPI = (shopId) => {
  return request.get(`/shops/${shopId}`)
}

// 2. 获取该店铺的所有上架商品（文档 5.4.1，公开接口）
export const getShopProductsAPI = (shopId) => {
  return request.get(`/shops/${shopId}/products`)
}

// 3. 收藏/关注店铺（文档 5.7.1）
export const addFavoriteShopAPI = (shopId) => {
  return request.post('/favorites', { targetType: 'SHOP', targetId: shopId })
}

// 4. 取消收藏/关注店铺（文档 5.7.2）
export const removeFavoriteShopAPI = (shopId) => {
  return request.delete(`/favorites/SHOP/${shopId}`)
}