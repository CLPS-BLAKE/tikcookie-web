<template>
  <div class="review-page-container">
    <!-- 1. 顶部 Header -->
    <header class="top-nav-bar">
      <div class="back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="20" color="#222" />
      </div>
      <h2 class="shop-name-title">望村里·湘菜(星元汇店)</h2>
      <div class="placeholder-right"></div>
    </header>

    <!-- 2. 五星爱心评分区 -->
    <section class="rating-heart-section">
      <div class="hearts-row">
        <div 
          v-for="(item, index) in ratingLevels" 
          :key="index"
          class="heart-col"
          @click="selectRating(index + 1)"
        >
          <!-- 3D 质感爱心图标（选中为饱满粉红，未选中为淡浅灰） -->
          <svg 
            class="heart-svg" 
            :class="{ active: currentRating >= (index + 1) }"
            viewBox="0 0 24 24" 
            width="38" 
            height="38"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span 
            class="level-text"
            :class="{ active: currentRating >= (index + 1) }"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </section>

    <!-- 3. 评价输入主体卡片 -->
    <section class="card input-main-card">
      <!-- 多行输入框 -->
      <textarea 
        v-model="commentText" 
        class="custom-textarea" 
        placeholder="口味、服务、环境如何？有哪些超赞的美食？"
        rows="5"
      ></textarea>

      <!-- 优质评价激励横条 -->
      <div class="incentive-strip">
        <span>写1图15字，有机会评为 <b class="red-highlight">优质评价并优先展示</b></span>
        <van-icon name="arrow" size="12" color="#ff2346" />
      </div>

      <!-- 上传图片/视频 -->
      <div class="media-upload-area">
        <!-- 已选中的预览图 -->
        <div v-for="(img, idx) in uploadedImages" :key="idx" class="uploaded-img-box">
          <img :src="img" class="thumb-img" />
          <van-icon name="clear" class="del-icon" @click="delImage(idx)" />
        </div>

        <!-- 上传按钮框 -->
        <div v-if="uploadedImages.length < 3" class="upload-btn-box" @click="mockUpload">
          <div class="camera-icon-wrap">
            <van-icon name="photograph" size="24" color="#333" />
            <span class="plus-dot">+</span>
          </div>
          <span class="upload-label">上传图片/视频</span>
        </div>
      </div>

      <!-- 匿名勾选 -->
      <div class="anonymous-row" @click="isAnonymous = !isAnonymous">
        <div class="circle-check" :class="{ checked: isAnonymous }">
          <span v-if="isAnonymous" class="inner-dot"></span>
        </div>
        <span class="anon-text">匿名评价</span>
      </div>
    </section>

    <!-- 4. 推荐菜卡片 -->
    <section class="card dishes-card">
      <div class="dishes-header">
        <h3 class="dishes-title">推荐菜</h3>
        <div class="view-all-dishes" @click="handleViewAllDishes">
          <span>查看全部24道菜</span>
          <van-icon name="arrow" size="12" />
        </div>
      </div>

      <!-- 菜品点赞标签列表 -->
      <div class="dishes-tags-wrap">
        <div 
          v-for="(dish, index) in dishList" 
          :key="index"
          class="dish-pill"
          :class="{ selected: selectedDishes.includes(dish) }"
          @click="toggleDish(dish)"
        >
          <span class="thumb-icon">👍</span>
          <span class="dish-name">{{ dish }}</span>
        </div>
      </div>
    </section>

    <!-- 5. 底部固定提交按钮 -->
    <footer class="bottom-submit-bar">
      <button 
        class="submit-pill-btn" 
        :class="{ ready: currentRating > 0 || commentText.trim() }"
        @click="submitReview"
      >
        提 交
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 状态管理
const currentRating = ref(0) // 选中的评分等级（1-5）
const ratingLevels = ['非常差', '较差', '一般', '推荐', '超赞']
const commentText = ref('')
const isAnonymous = ref(false)
const uploadedImages = ref([])
const selectedDishes = ref([])

// 推荐菜列表
const dishList = [
  '村里带汁黄牛肉',
  '干锅手撕包菜',
  '渔家虾饼',
  '农家小炒肉',
  '五常大米',
  '香煎大黄鱼'
]

// 1. 返回上一页
const handleBack = () => {
  router.back()
}

// 2. 打分切换
const selectRating = (score) => {
  currentRating.value = score
}

// 3. 模拟上传图片
const mockUpload = () => {
  uploadedImages.value.push('https://img01.yzcdn.cn/vant/apple-1.jpg')
  showToast('已添加1张美食图片')
}

// 删除上传的图片
const delImage = (idx) => {
  uploadedImages.value.splice(idx, 1)
}

// 4. 推荐菜点赞切换
const toggleDish = (dish) => {
  const i = selectedDishes.value.indexOf(dish)
  if (i > -1) {
    selectedDishes.value.splice(i, 1)
  } else {
    selectedDishes.value.push(dish)
  }
}

const handleViewAllDishes = () => {
  showToast('查看全部24道推荐菜品')
}

// 5. 提交评价并在成功后跳转回首页
const submitReview = () => {
  showToast({
    type: 'success',
    message: '评价提交成功！',
    duration: 1500,
    onClose: () => {
      // 👈 核心：提示结束后，自动跳回首页！
      router.push('/home')
    }
  })
}
</script>

<style scoped>
.review-page-container {
  min-height: 100vh;
  /* 顶部优雅的马卡龙粉红渐变 */
  background: linear-gradient(180deg, #fff2f5 0%, #f7f8fa 320px, #f7f8fa 100%);
  padding-bottom: 90px;
  box-sizing: border-box;
}

/* 1. 顶部 Header */
.top-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
}
.back-btn {
  cursor: pointer;
}
.shop-name-title {
  font-size: 16.5px;
  font-weight: bold;
  color: #111;
  margin: 0;
}
.placeholder-right {
  width: 20px;
}

/* 2. 爱心评分区 */
.rating-heart-section {
  padding: 14px 20px 18px 20px;
}
.hearts-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.heart-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.heart-svg {
  fill: #e8e8ea; /* 默认未点亮时极其柔和的浅灰色 */
  transition: all 0.2s ease;
}
.heart-svg.active {
  fill: #ff2346; /* 点亮时高饱和度的热粉红 */
  transform: scale(1.08);
}
.level-text {
  font-size: 12px;
  color: #999;
}
.level-text.active {
  color: #ff2346;
  font-weight: bold;
}

/* 卡片通用 */
.card {
  margin: 0 12px 12px 12px;
  background-color: #ffffff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

/* 3. 输入内容卡片 */
.custom-textarea {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14.5px;
  color: #222;
  line-height: 1.5;
  resize: none;
  box-sizing: border-box;
}
.custom-textarea::placeholder {
  color: #b5b5b5;
  font-size: 14.5px;
}

.incentive-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
  margin-top: 14px;
  padding-bottom: 12px;
}
.red-highlight {
  color: #ff2346;
}

/* 媒体上传 */
.media-upload-area {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  margin-bottom: 16px;
}
.upload-btn-box {
  width: 100px;
  height: 100px;
  background-color: #f7f8fa;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}
.camera-icon-wrap {
  position: relative;
  display: inline-flex;
}
.plus-dot {
  position: absolute;
  bottom: -2px;
  right: -6px;
  width: 14px;
  height: 14px;
  background-color: #ff2346;
  color: #fff;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.upload-label {
  font-size: 11.5px;
  color: #222;
}

.uploaded-img-box {
  position: relative;
  width: 100px;
  height: 100px;
}
.thumb-img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}
.del-icon {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 18px;
  color: #ff2346;
  background-color: #fff;
  border-radius: 50%;
  cursor: pointer;
}

/* 匿名评价 */
.anonymous-row {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding-top: 4px;
}
.circle-check {
  width: 15px;
  height: 15px;
  border: 1.5px solid #c0c0c0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.circle-check.checked {
  border-color: #ff2346;
}
.inner-dot {
  width: 7px;
  height: 7px;
  background-color: #ff2346;
  border-radius: 50%;
}
.anon-text {
  font-size: 13.5px;
  color: #222;
}

/* 4. 推荐菜卡片 */
.dishes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.dishes-title {
  font-size: 15px;
  font-weight: bold;
  color: #111;
  margin: 0;
}
.view-all-dishes {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
}
.dishes-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.dish-pill {
  background-color: #f7f8fa;
  border: 1px solid transparent;
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}
.dish-pill.selected {
  background-color: #fff2f5;
  border-color: #ffd6df;
  color: #ff2346;
  font-weight: 500;
}
.thumb-icon {
  font-size: 11px;
}

/* 5. 底部固定提交按钮 */
.bottom-submit-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 430px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 10px 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04);
  z-index: 100;
  box-sizing: border-box;
}
.submit-pill-btn {
  width: 100%;
  height: 44px;
  background-color: #ffb8c6; /* 默认未打分时的柔和粉色 */
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 22px;
  cursor: pointer;
  outline: none;
  transition: background 0.3s ease;
}
.submit-pill-btn.ready {
  background: linear-gradient(135deg, #ff2346, #ff4365); /* 打分或输入后变为明亮热粉红 */
  box-shadow: 0 4px 12px rgba(255, 35, 70, 0.25);
}
</style>