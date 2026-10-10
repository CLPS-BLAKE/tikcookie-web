import request from '../utils/request'

// 上传图片（文档 5.2.1，需要登录 Token）
export const uploadImageAPI = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  // 必须使用 multipart/form-data 格式上传二进制文件
  return request.post('/files/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}