<template>
  <div class="search-page-container">
    <!-- 1. 顶部搜索栏 -->
    <header class="search-header">
      <div class="back-btn" @click="handleBack">
        <van-icon name="arrow-left" size="20" color="#222" />
      </div>

      <div class="input-pill">
        <van-icon name="search" size="18" color="#888" class="search-icon" />
        <input 
          v-model="keyword" 
          type="text" 
          placeholder="汉堡王" 
          class="keyword-input"
          @keyup.enter="handleSearch(keyword)"
        />
      </div>

      <button class="search-btn" @click="handleSearch(keyword)">
        搜低价
      </button>
    </header>

    <!-- 2. 历史记录模块 -->
    <section v-if="historyList.length > 0" class="history-section">
      <div class="section-title-row">
        <span class="section-title">历史记录</span>
        <van-icon name="delete-o" size="18" color="#888" class="del-btn" @click="handleClearHistory" />
      </div>

      <!-- 历史搜索气泡标签 -->
      <div class="history-tags-wrap">
        <div 
          v-for="(item, index) in historyList" 
          :key="index" 
          class="history-tag"
          @click="handleSearch(item)"
        >
          <span>{{ item }}</span>
        </div>
        <!-- 展开小箭头 -->
        <div class="history-tag arrow-tag" @click="handleExpandHistory">
          <span class="triangle-down"></span>
        </div>
      </div>
    </section>

    <!-- 3. 猜你想搜模块 -->
    <section class="guess-section">
      <div class="section-title-row">
        <span class="section-title">猜你想搜</span>
        <div class="refresh-btn" @click="handleRefreshGuess">
          <van-icon name="replay" size="14" />
          <span>换一换</span>
        </div>
      </div>

      <!-- 双列热搜词列表 -->
      <div class="guess-grid">
        <div 
          v-for="(item, index) in guessList" 
          :key="index" 
          class="guess-item"
          @click="handleSearch(item.name)"
        >
          <span class="guess-text">{{ item.name }}</span>
          <span v-if="item.isHot" class="hot-badge">热</span>
        </div>
      </div>
    </section>

    <!-- 4. 底部语音搜索药丸按钮 -->
    <div class="voice-search-wrap">
      <div class="voice-pill-btn" @click="handleVoiceSearch">
        <van-icon name="audio" size="16" color="#222" />
        <span>语音搜索</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast, showConfirmDialog } from 'vant'

// 当前输入的关键词
const keyword = ref('汉堡王')

// 历史记录假数据
const historyList = ref([
  '临榆炸鸡腿',
  '汉堡王',
  '乜料 local 泰式食堂五...',
  '肯德基',
  '螺蛳粉',
  '俄士厨房',
  '杨国福...'
])

// 猜你想搜列表（带“热”标签）
const guessList = ref([
  { name: '汉堡王', isHot: false },
  { name: '十八梯邓凳面', isHot: true },
  { name: '德元兰州纯汤牛肉面团购', isHot: false },
  { name: '章鱼陶陶艺术馆陶艺银...', isHot: false },
  { name: 'kfc 肯德基', isHot: true },
  { name: '临榆炸鸡腿', isHot: true },
  { name: '麦当劳', isHot: false },
  { name: '周成芝螺蛳粉', isHot: true },
  { name: '华莱士', isHot: false },
  { name: '达美乐比萨', isHot: false },
  { name: '一龙拉面', isHot: false },
  { name: '张仔记干蒸排骨饭', isHot: false }
])

// 返回
const handleBack = () => {
  showToast('返回上一页')
}

// 触发搜索
const handleSearch = (word) => {
  const target = word || keyword.value || '汉堡王'
  keyword.value = target
  showToast(`正在搜索：${target}`)
}

// 清空历史记录
const handleClearHistory = () => {
  showConfirmDialog({
    title: '提示',
    message: '确认删除所有搜索历史吗？'
  }).then(() => {
    historyList.value = []
    showToast('历史记录已清空')
  }).catch(() => {})
}

// 展开更多历史
const handleExpandHistory = () => {
  showToast('展开更多历史')
}

// 换一换
const handleRefreshGuess = () => {
  guessList.value.reverse()
  showToast('已更新推荐热搜')
}

// 语音搜索
const handleVoiceSearch = () => {
  showToast('正在聆听您的声音...')
}
</script>

<style scoped>
.search-page-container {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 10px 14px 40px 14px;
  box-sizing: border-box;
}

/* 1. 顶部搜索栏 */
.search-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.back-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.input-pill {
  flex: 1;
  height: 38px;
  background-color: #f4f5f7;
  border-radius: 19px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}
.search-icon {
  margin-right: 6px;
}
.keyword-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: #222;
}
.keyword-input::placeholder {
  color: #999;
}
.search-btn {
  background: linear-gradient(135deg, #ff2346, #ff4365);
  color: #ffffff;
  border: none;
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

/* 2 & 3. 标题与栏目通用 */
.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 14px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #111;
}
.del-btn {
  cursor: pointer;
}

/* 历史气泡 */
.history-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.history-tag {
  background-color: #f4f5f7;
  color: #333;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.arrow-tag {
  padding: 6px 12px;
}
.triangle-down {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #666;
  display: inline-block;
}

/* 3. 猜你想搜 */
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: #666;
  cursor: pointer;
}
.guess-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 16px;
  column-gap: 14px;
}
.guess-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
}
.guess-text {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hot-badge {
  background-color: #ff2346;
  color: #fff;
  font-size: 10px;
  padding: 0 3px;
  border-radius: 3px;
  margin-left: 4px;
  line-height: 1.2;
  font-weight: bold;
  flex-shrink: 0;
}

/* 4. 底部语音搜索胶囊 */
.voice-search-wrap {
  margin-top: 36px;
  display: flex;
  justify-content: center;
}
.voice-pill-btn {
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  padding: 8px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  color: #222;
  cursor: pointer;
}
</style>