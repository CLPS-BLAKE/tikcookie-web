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

      <button class="search-btn" @click="handleSearch(keyword)">搜低价</button>
    </header>

    <!-- 当有搜索结果时展示商品列表 -->
    <section
      v-if="hasSearched && searchResults.length > 0"
      class="search-results-section"
    >
      <div class="result-count-title">
        搜索结果 ({{ searchResults.length }})
      </div>
      <div class="search-result-list">
        <div
          v-for="item in searchResults"
          :key="item.id"
          class="result-item-card"
          @click="goToProductDetail(item.id)"
        >
          <img :src="item.image" class="result-thumb" />
          <div class="result-info">
            <h4 class="result-name">{{ item.name }}</h4>
            <div class="result-shop-name">{{ item.shopName }}</div>
            <div class="result-price-row">
              <span class="price-txt">¥{{ item.price }}</span>
              <span class="sold-txt">已售{{ item.soldCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <template v-else
      ><!-- 2. 历史记录模块 -->
      <section v-if="historyList.length > 0" class="history-section">
        <div class="section-title-row">
          <span class="section-title">历史记录</span>
          <van-icon
            name="delete-o"
            size="18"
            color="#888"
            class="del-btn"
            @click="handleClearHistory"
          />
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
      <!-- 3. 猜你想搜模块（精准展示 12 个，支持换一换与直达跳转） -->
    <section class="guess-section">
      <div class="section-title-row">
        <span class="section-title">猜你想搜</span>
        <div class="refresh-btn" @click="handleRefreshGuess">
          <van-icon name="replay" size="14" />
          <span>换一换</span>
        </div>
      </div>

      <!-- 双列 12 项网格（两列六行，正好12个） -->
      <div class="guess-grid">
        <div 
          v-for="(item, index) in displayedGuesses" 
          :key="index" 
          class="guess-item"
          @click="handleGuessClick(item)"
        >
          <!-- 文字部分 -->
          <span class="guess-text">{{ item.name }}</span>

          <!-- 标记：店铺打“店”标，热门打“热”标 -->
          <span v-if="item.type === 'shop'" class="shop-badge">店</span>
          <span v-else-if="item.isHot" class="hot-badge">热</span>
        </div>
      </div>
    </section>
</template>

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
import { ref, computed, onMounted } from "vue"; // 👈 引入 computed 计算属性
import { useRouter, useRoute } from "vue-router";
import { showToast, showConfirmDialog } from "vant";
import { searchProductsAPI } from "./api/search";

const router = useRouter();
const route = useRoute();

const keyword = ref(route.query.keyword || "");
const searchResults = ref([]);
const hasSearched = ref(false);

// 历史记录（读取本地缓存）
const historyList = ref(["牛肉面", "汉堡王", "肯德基", "螺蛳粉"]);

// ----------------------------------------------------------------------
// 核心：5 个真实商家 + 30 个真实商品构建的完整 35 条推荐池
// ----------------------------------------------------------------------
const fullSuggestPool = ref([
  // 5 家真实商铺 (type: 'shop')
  {
    name: "德元兰州纯汤牛肉面(天河旗舰店)",
    type: "shop",
    shopId: "1",
    isHot: true,
  },
  {
    name: "肯悦咖啡 KCOFFEE(天河城店)",
    type: "shop",
    shopId: "2",
    isHot: false,
  },
  { name: "肯德基 KFC(体育西路餐厅)", type: "shop", shopId: "3", isHot: true },
  { name: "周成芝螺蛳粉(财富广场店)", type: "shop", shopId: "4", isHot: true },
  { name: "喜茶 HEYTEA(万菱汇店)", type: "shop", shopId: "5", isHot: true },

  // 30 件真实商品 (type: 'product')
  {
    id: "1",
    name: "【招牌实测】纯汤牛肉面豪华套餐",
    type: "product",
    isHot: true,
  },
  { id: "2", name: "大片酱牛肉纯汤面+小菜", type: "product", isHot: false },
  { id: "3", name: "经典兰州拉面+爽口泡菜", type: "product", isHot: false },
  { id: "4", name: "西北特色麻酱凉面单人餐", type: "product", isHot: false },
  { id: "5", name: "双人牛肉面套餐送两听可乐", type: "product", isHot: false },
  { id: "6", name: "秘制五香酱牛肉单人碟", type: "product", isHot: false },
  { id: "7", name: "美式咖啡+法式牛角包随心配", type: "product", isHot: true },
  { id: "8", name: "生椰拿铁超大杯单人券", type: "product", isHot: true },
  { id: "9", name: "燕麦奶拿铁+巴斯克蛋糕", type: "product", isHot: false },
  { id: "10", name: "西柚气泡美式咖啡", type: "product", isHot: false },
  { id: "11", name: "经典拿铁任意双杯兑换券", type: "product", isHot: false },
  { id: "12", name: "提拉米苏风味生酪拿铁", type: "product", isHot: false },
  { id: "13", name: "元气早餐芝士猪柳蛋帕尼尼", type: "product", isHot: true },
  { id: "14", name: "吮指原味鸡2块特惠尝鲜券", type: "product", isHot: true },
  { id: "15", name: "黄金脆皮鸡腿堡+中薯条可乐", type: "product", isHot: true },
  { id: "16", name: "葡式经典蛋挞4只装礼盒", type: "product", isHot: false },
  { id: "17", name: "热辣香骨鸡15块大满足装", type: "product", isHot: false },
  { id: "18", name: "吮指全家桶双人套餐", type: "product", isHot: true },
  { id: "19", name: "首次尝鲜经典原味螺蛳粉", type: "product", isHot: true },
  { id: "20", name: "吸汁腐竹螺蛳粉+卤鸭掌", type: "product", isHot: false },
  { id: "21", name: "干捞麻酱螺蛳粉+炸蛋", type: "product", isHot: false },
  { id: "22", name: "桂林传统木薯糖水单人盅", type: "product", isHot: false },
  { id: "23", name: "招牌螺蛳粉双人豪华6件套", type: "product", isHot: true },
  { id: "24", name: "爆浆豆腐泡+秘制卤猪蹄", type: "product", isHot: false },
  { id: "25", name: "多肉青提特调真果茶(大杯)", type: "product", isHot: true },
  { id: "26", name: "烤黑糖波波真牛乳茶", type: "product", isHot: true },
  { id: "27", name: "芝芝莓莓咸芝士奶盖茶", type: "product", isHot: false },
  { id: "28", name: "纯绿妍轻乳茶轻盈大杯", type: "product", isHot: false },
  { id: "29", name: "多肉葡萄+生打椰椰双人券", type: "product", isHot: true },
  { id: "30", name: "黑糖波波泡芙2只装下午茶", type: "product", isHot: false },
]);

// 当前是第几批（0 = 第1批，1 = 第2批，2 = 第3批）
const batchIndex = ref(0);

// 👈 核心算法：严格保证每次精准截取 12 个条目
const displayedGuesses = computed(() => {
  const total = fullSuggestPool.value.length;
  const start = (batchIndex.value * 12) % total;
  const end = start + 12;

  if (end <= total) {
    return fullSuggestPool.value.slice(start, end);
  } else {
    // 到底时环形回旋拼接，保证永远是 12 个
    return [
      ...fullSuggestPool.value.slice(start),
      ...fullSuggestPool.value.slice(0, end - total),
    ];
  }
});

// 👈 换一换 / 换一批功能
const handleRefreshGuess = () => {
  batchIndex.value++;
  showToast({ message: "已为您换一批", duration: 800 });
};

// 👈 核心点击逻辑：点击直接根据类型分流跳转！
const handleGuessClick = (item) => {
  // 1. 同步存入搜索历史
  historyList.value = [
    item.name,
    ...historyList.value.filter((k) => k !== item.name),
  ];
  localStorage.setItem("searchHistory", JSON.stringify(historyList.value));

  // 2. 如果点击的是【商铺】，直接跳入该店铺主页！
  if (item.type === "shop") {
    router.push({
      path: "/shop",
      query: { shopId: item.shopId },
    });
  }
  // 3. 如果点击的是【商品】，直接跳入该商品详情页！
  else if (item.type === "product") {
    router.push({
      path: "/detail",
      query: { id: item.id },
    });
  }
};

// 顶部输入框手动搜索
const handleSearch = async (word) => {
  const target =
    (typeof word === "string" ? word : keyword.value).trim() || "汉堡王";
  keyword.value = target;

  historyList.value = [
    target,
    ...historyList.value.filter((k) => k !== target),
  ];
  localStorage.setItem("searchHistory", JSON.stringify(historyList.value));

  showToast({
    type: "loading",
    message: `正在搜索：${target}...`,
    forbidClick: true,
  });

  try {
    const res = await searchProductsAPI({
      keyword: target,
      page: 1,
      size: 20,
      sort: "default",
    });
    if (res && res.list) {
      searchResults.value = res.list.map((item) => ({
        id: item.id,
        name: item.name,
        shopName: item.shopName,
        price: (item.price / 100).toFixed(2),
        soldCount: item.soldCount || 0,
        image:
          item.imageUrl ||
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
      }));
      hasSearched.value = true;
    }
  } catch (err) {
    showToast(`正在搜索：${target}`);
  }
};

onMounted(() => {
  const localHistory = localStorage.getItem("searchHistory");
  if (localHistory) {
    try {
      historyList.value = JSON.parse(localHistory);
    } catch (e) {}
  }
  if (route.query.keyword) {
    handleSearch(route.query.keyword);
  }
});

const handleBack = () => router.back();
const handleClearHistory = () => {
  showConfirmDialog({ title: "提示", message: "确认删除所有搜索历史吗？" })
    .then(() => {
      historyList.value = [];
      localStorage.removeItem("searchHistory");
      showToast("历史记录已清空");
    })
    .catch(() => {});
};
const handleExpandHistory = () => showToast("已展开全部历史");
const handleVoiceSearch = () => showToast("正在聆听您的声音...");
const goToProductDetail = (prodId) =>
  router.push({ path: "/detail", query: { id: prodId } });
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
/* 店铺角标：橙色小标 */
.shop-badge {
  background-color: #ff9800;
  color: #fff;
  font-size: 10px;
  padding: 0 3px;
  border-radius: 3px;
  margin-left: 4px;
  line-height: 1.2;
  font-weight: bold;
  flex-shrink: 0;
}

/* 热门商品角标：红色小标 */
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
.search-results-section {
  margin-top: 16px;
}
.result-count-title {
  font-size: 14px;
  color: #888;
  margin-bottom: 12px;
}
.search-result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.result-item-card {
  display: flex;
  gap: 10px;
  background-color: #fff;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  cursor: pointer;
}
.result-thumb {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
}
.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.result-name {
  font-size: 14px;
  font-weight: bold;
  color: #222;
  margin: 0;
}
.result-shop-name {
  font-size: 11.5px;
  color: #888;
}
.result-price-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.price-txt {
  font-size: 16px;
  font-weight: bold;
  color: #ff2346;
}
.sold-txt {
  font-size: 11px;
  color: #999;
}
</style>
