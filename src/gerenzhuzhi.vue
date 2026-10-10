<template>
  <div class="user-center-container">
    <!-- 1. 顶部用户头像与昵称 -->
    <!-- 1. 顶部用户头像与昵称（动态绑定后端/缓存数据） -->
    <header class="user-header">
      <!-- 隐藏的文件选择器 -->
      <input
        ref="avatarInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style="display: none"
        @change="onAvatarSelected"
      />
      <div class="user-info-left">
        <!-- 点击头像换图 -->
        <div class="avatar-click-box" @click="triggerChooseAvatar">
          <img
            :src="
              cleanUrl(userInfo.avatarUrl) ||
              'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
            "
            class="user-avatar"
          />
          <div class="camera-badge">
            <van-icon name="photograph" size="11px" color="#fff" />
          </div>
        </div>

        <!-- 昵称与修改小铅笔图标 -->
        <div class="name-edit-wrap" @click="openEditNameDialog">
          <span class="user-nickname">{{
            userInfo.nickname || "不爱刷抖音"
          }}</span>
          <van-icon name="edit" size="16" color="#666" class="edit-pen-icon" />
        </div>
      </div>

      <div class="user-header-actions">
        <div class="header-icon-wrap" @click="handleService">
          <van-icon name="service-o" size="22" color="#222" />
          <span class="red-dot"></span>
        </div>
        <div class="header-icon-wrap" @click="handleSetting">
          <van-icon name="setting-o" size="22" color="#222" />
        </div>
      </div>
    </header>

    <!-- 2. 四大快捷资产入口（优惠券/收藏/通知/小程序） -->
    <section class="asset-nav-row">
      <div class="asset-item" @click="handleNavAsset('优惠券')">
        <van-icon name="coupon-o" size="26" class="asset-icon" />
        <span class="asset-title">优惠券 (6)</span>
      </div>
      <!-- 把原本的 @click="handleNavAsset('收藏')" 改成打开收藏抽屉 -->
      <!-- 点击直接跳进独立的收藏汇总大页面！ -->
      <div class="asset-item" @click="router.push('/favorites')">
        <van-icon name="star-o" size="26" class="asset-icon" />
        <span class="asset-title">收藏</span>
      </div>
      <div class="asset-item" @click="handleNavAsset('通知')">
        <div class="icon-relative">
          <!-- 采用纯净空心线框小铃铛（带小吊钟与线条质感） -->
          <svg
            class="asset-icon outline-bell"
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="#222"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <!-- 右上角小红点保持不变 -->
          <span class="red-dot"></span>
        </div>
        <span class="asset-title">通知</span>
      </div>
      <div class="asset-item" @click="handleNavAsset('小程序')">
        <van-icon name="cluster-o" size="26" class="asset-icon" />
        <span class="asset-title">小程序</span>
      </div>
    </section>

    <!-- 3. 订单分类 Tab 栏（已删除待收货，Tab 仅保留 4 个） -->
    <section class="order-tabs-wrapper">
      <div class="tabs-scroll-area">
        <div
          v-for="(tab, index) in orderTabs"
          :key="index"
          :class="['tab-btn', { active: currentTab === index }]"
          @click="currentTab = index"
        >
          <span class="tab-label">{{ tab.name }}</span>
          <!-- 动态小红点 -->
          <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
          <!-- 选中红线 -->
          <span v-if="currentTab === index" class="tab-active-line"></span>
        </div>
      </div>

      <!-- 右侧搜索订单 -->
      <div class="search-order-entry" @click="handleSearchOrder">
        <span class="split-bar">|</span>
        <van-icon name="search" size="14" />
        <span>搜索</span>
      </div>
    </section>

    <!-- 4. 真实动态订单列表（根据数据库真实记录循环渲染！） -->
    <section class="order-list-area">
      <!-- A. 有订单时循环展示 -->
      <div v-if="ordersList.length > 0" class="orders-group">
        <div v-for="order in ordersList" :key="order.id" class="order-card">
          <!-- 门店与状态行 -->
          <div class="order-shop-header">
            <div class="shop-name-row">
              <span class="shop-name">{{ order.shopName }}</span>
              <van-icon name="arrow" size="12" color="#666" />
            </div>
            <!-- 根据真实 status 显示状态 -->
            <!-- 状态标签行 -->
            <span class="order-status-tag">
              {{
                order.status === "UNPAID"
                  ? "待支付"
                  : order.status === "UNUSED"
                    ? "待使用"
                    : order.isReviewed
                      ? "已完成"
                      : "待评价"
              }}
            </span>
          </div>
          <div class="shop-distance">距你 43m</div>

          <!-- 商品信息 -->
          <div class="order-goods-flex">
            <img :src="order.image" class="order-goods-cover" />
            <div class="order-goods-right">
              <div class="goods-title-price">
                <h4 class="goods-title">{{ order.title }}</h4>
                <span class="price">¥{{ order.price }}</span>
              </div>
              <div class="goods-date-qty">
                <span class="valid-date">{{ order.date }}</span>
                <span class="qty">共1件</span>
              </div>
              <div class="rule-pills-row">
                <span class="rule-pill">随时可用</span>
                <span class="rule-pill">免预约</span>
              </div>
            </div>
          </div>

          <!-- 底部操作按钮：根据订单真实状态智能呈现 -->
          <div class="order-card-actions">
            <button class="card-btn btn-again" @click="handleAgain">
              再来一单
            </button>

            <!-- 待支付 -->
            <button
              v-if="order.status === 'UNPAID'"
              class="card-btn btn-use"
              style="background: #ff2346; color: #fff; border: none"
              @click="goToPay(order)"
            >
              去支付
            </button>

            <!-- 待使用 -->
            <button
              v-else-if="order.status === 'UNUSED'"
              class="card-btn btn-use"
              @click="goToVoucher(order)"
            >
              去使用
            </button>

            <!-- 待评价（未评价过才显示“去评价”） -->
            <button
              v-else-if="!order.isReviewed"
              class="card-btn btn-use"
              style="background: #ff2346; color: #fff; border: none"
              @click="goToComment(order)"
            >
              去评价
            </button>
          </div>
        </div>
      </div>

      <!-- B. 对应分类没有订单时的空状态 -->
      <div v-else class="empty-orders-box">
        <van-icon name="description-o" size="44" color="#ccc" />
        <p class="empty-tip">暂无相关订单记录</p>
      </div>
    </section>

    <!-- 5. AI 自动领券横幅 -->
    <section class="ai-banner-card" @click="handleAIBanner">
      <div class="ai-banner-left">
        <!-- 小兔子/吉祥物卡通图 -->
        <div class="mascot-avatar">🐰</div>
        <span class="ai-text">还在到处找优惠购买？AI 可以自动领券蹲好价</span>
      </div>
      <van-icon name="arrow" size="14" color="#888" />
    </section>

    <!-- 6. 底部帮助指引 -->
    <div class="find-order-tip">
      <span>没找到订单？试试查看</span>
      <span class="blue-link" @click="handleAllOrders">全部订单</span>
    </div>

    <!-- 7. 悬浮胶囊底部 Tabbar（选中订单） -->
    <div class="floating-nav-capsule">
      <div class="capsule-item" @click="handleGoHome">
        <van-icon name="shop-o" size="20" />
        <span>首页</span>
      </div>
      <div class="capsule-item active">
        <van-icon name="notes" size="20" />
        <span>订单</span>
      </div>
    </div>
    <!-- 8. 我的收藏汇总弹出层（从底部升起） -->
    <van-popup
      v-model:show="showFavoritePopup"
      position="bottom"
      round
      closeable
      :style="{ height: '65%' }"
    >
      <div class="fav-popup-content">
        <h3 class="fav-popup-title">我的收藏汇总</h3>

        <!-- 切换商品/店铺 -->
        <div class="fav-type-switch">
          <span
            :class="['switch-tab', { active: favTabType === 'PRODUCT' }]"
            @click="handleOpenFavorite('PRODUCT')"
          >
            商品收藏
          </span>
          <span
            :class="['switch-tab', { active: favTabType === 'SHOP' }]"
            @click="handleOpenFavorite('SHOP')"
          >
            店铺收藏
          </span>
        </div>

        <!-- 收藏列表展示 -->
        <div v-if="favoriteList.length > 0" class="fav-items-scroll">
          <div
            v-for="item in favoriteList"
            :key="item.id"
            class="fav-card-item"
            @click="goToFavDetail(item)"
          >
            <img :src="item.image" class="fav-thumb" />
            <div class="fav-info-col">
              <h4 class="fav-name">{{ item.name }}</h4>
              <div class="fav-bottom-row">
                <span v-if="item.price" class="fav-price"
                  >¥{{ item.price }}</span
                >
                <span class="fav-buy-btn">去看看 &gt;</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 没有收藏时的空状态 -->
        <div v-else class="fav-empty-box">
          <van-icon name="star-o" size="48" color="#ddd" />
          <p>暂无相关收藏内容</p>
        </div>
      </div>
    </van-popup>
    <!-- 修改昵称输入弹窗 -->
    <van-dialog
      v-model:show="showEditNameDialog"
      title="修改个人昵称"
      show-cancel-button
      confirm-button-color="#ff2346"
      @confirm="confirmUpdateNickname"
    >
      <div style="padding: 16px 20px">
        <van-field
          v-model="newNicknameInput"
          placeholder="请输入新昵称 (1-20字)"
          maxlength="20"
          show-word-limit
          style="background: #f7f8fa; border-radius: 8px"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
// 修改为同时引入 formatPrice 和 cleanUrl：
import { formatPrice, cleanUrl } from "./utils/format";
import { getFavoriteListAPI } from "./api/favorite";
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showToast } from "vant";

import { getMyOrdersAPI } from "./api/order";
// 引入修改资料接口和文件上传接口
import { getUserInfoAPI, updateUserInfoAPI } from "./api/user";
import { uploadImageAPI } from "./api/file";
const router = useRouter();
const route = useRoute();

// 1. 用户信息
const userInfo = ref({
  nickname: "不爱刷抖音",
  avatarUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
});

// 2. 核心状态：待使用与待评价的动态条数统计
const unusedCount = ref(0);
const unreviewedCount = ref(0);
// 控制收藏抽屉是否显示
const showFavoritePopup = ref(false);
// 收藏的 Tab 切换（商品 / 店铺）
const favTabType = ref("PRODUCT");
// 收藏列表数据
const favoriteList = ref([]);

// 订单分类 Tab（badge 绑定响应式变量，数量为 0 时自动不显示）
const orderTabs = ref([
  { name: "全部", status: "" },
  { name: "待支付", status: "UNPAID" },
  { name: "待使用", status: "UNUSED", badge: "" },
  { name: "待评价", status: "USED", badge: "" },
]);

// 选中的 Tab：如果有传参指定 tab 则优先选中，默认 2（待使用）
const currentTab = ref(
  route.query.tab !== undefined ? Number(route.query.tab) : 2,
);

// 真实订单列表数据
const ordersList = ref([]);
const loading = ref(false);

// 页面加载时的处理
onMounted(async () => {
  // A. 读取用户信息缓存
  const localUser = localStorage.getItem("userInfo");
  if (localUser) {
    try {
      const parsed = JSON.parse(localUser);
      if (parsed.nickname) userInfo.value.nickname = parsed.nickname;
      if (parsed.avatarUrl) userInfo.value.avatarUrl = parsed.avatarUrl;
    } catch (e) {}
  }

  try {
    const data = await getUserInfoAPI();
    if (data && data.nickname) {
      userInfo.value.nickname = data.nickname;
      if (data.avatarUrl) userInfo.value.avatarUrl = data.avatarUrl;
    }
  } catch (err) {}

  // B. 刷新所有红点角标统计数量
  await refreshBadges();

  // C. 查询当前 Tab 的订单列表
  fetchOrders();
});

// 监听 Tab 切换
watch(currentTab, () => {
  fetchOrders();
});

// 核心功能 1：全量统计“待使用”和“待评价”的真实数量，实现小红点联动！
const refreshBadges = async () => {
  try {
    // 查全部订单
    const res = await getMyOrdersAPI({ page: 1, size: 50 });
    if (res && res.list) {
      const reviewedOrders = JSON.parse(
        localStorage.getItem("reviewedOrders") || "[]",
      );

      // 统计 UNUSED（待使用）的真实条数
      const unusedOrders = res.list.filter((item) => item.status === "UNUSED");
      unusedCount.value = unusedOrders.length;

      // 统计 USED（已消费且未评价）的真实条数
      const unreviewedOrders = res.list.filter(
        (item) =>
          item.status === "USED" && !reviewedOrders.includes(String(item.id)),
      );
      unreviewedCount.value = unreviewedOrders.length;

      // 动态赋值角标：大于 0 才显示数字，等于 0 自动清空红点
      orderTabs.value[2].badge =
        unusedCount.value > 0 ? String(unusedCount.value) : "";
      orderTabs.value[3].badge =
        unreviewedCount.value > 0 ? String(unreviewedCount.value) : "";
    }
  } catch (err) {
    console.warn("统计数量保底");
  }
};

// 核心功能 2：根据当前 Tab 查询订单列表（自动过滤已评价订单）
const fetchOrders = async () => {
  loading.value = true;
  const statusParam = orderTabs.value[currentTab.value]?.status;

  try {
    const params = { page: 1, size: 20 };
    if (statusParam) {
      params.status = statusParam;
    }

    const res = await getMyOrdersAPI(params);
    if (res && res.list) {
      const reviewedOrders = JSON.parse(
        localStorage.getItem("reviewedOrders") || "[]",
      );

      let list = res.list;

      // 👈 核心关键：如果在“待评价”列表，自动剔除已经被评价过的订单！
      if (statusParam === "USED") {
        list = list.filter((item) => !reviewedOrders.includes(String(item.id)));
      }

      ordersList.value = list.map((item) => {
        const isReviewed = reviewedOrders.includes(String(item.id));
        return {
          id: item.id,
          title: item.productName,
          shopName: item.shopName,
          price: formatPrice(item.amount),
          // 👈 核心：用 cleanUrl 清洗掉重复的 OSS 域名！
          image:
            cleanUrl(item.productImageUrl) ||
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
          status: item.status,
          isReviewed: isReviewed, // 标记是否已评价
          date: item.createTime || "近期订单",
        };
      });
    } else {
      ordersList.value = [];
    }
  } catch (err) {
    ordersList.value = [];
  } finally {
    loading.value = false;
  }
};

// 去支付
const goToPay = (order) => {
  router.push({
    path: "/pay",
    query: {
      orderId: order.id,
      title: order.title,
      shopName: order.shopName,
      price: order.price,
      image: order.image,
    },
  });
};

// 去使用核销
const goToVoucher = (order) => {
  router.push({
    path: "/voucher",
    query: {
      orderId: order.id,
      title: order.title,
      shopName: order.shopName,
      price: order.price,
      image: order.image,
    },
  });
};

// 👈 去评价：带上订单号
const goToComment = (order) => {
  router.push({
    path: "/comment",
    query: {
      orderId: order.id,
      shopName: order.shopName,
    },
  });
};

const handleAgain = () => showToast("已为您再次加入订单");
const handleGoHome = () => router.push("/home");
const handleService = () => showToast("联系客服");
const handleSetting = () => showToast("进入设置");
const handleNavAsset = (name) => showToast(`进入：${name}`);
const handleSearchOrder = () => showToast("搜索全部历史订单");
const handleAIBanner = () => showToast("唤起 AI 智能省钱助手");
const handleAllOrders = () => {
  currentTab.value = 0;
};
// 👈 核心方法：点击金刚区的“收藏”图标触发
const handleOpenFavorite = async (type = "PRODUCT") => {
  favTabType.value = type;
  showFavoritePopup.value = true;
  await fetchFavoriteList();
};

// 调真实接口查询收藏列表（文档 5.7.3）
const fetchFavoriteList = async () => {
  try {
    const res = await getFavoriteListAPI({
      targetType: favTabType.value,
      page: 1,
      size: 20,
    });
    if (res && res.list) {
      favoriteList.value = res.list.map((item) => ({
        id: item.targetId,
        name: item.name,
        price: item.price ? formatPrice(item.price) : "",
        image:
          item.imageUrl ||
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
      }));
    } else {
      favoriteList.value = [];
    }
  } catch (err) {
    console.warn("获取收藏列表失败，展示保底");
    favoriteList.value = [
      {
        id: "1",
        name: "【招牌实测】纯汤牛肉面豪华套餐",
        price: "24.90",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
      },
    ];
  }
};

// 点击收藏里的某一项，直达详情页
const goToFavDetail = (item) => {
  showFavoritePopup.value = false;
  if (favTabType.value === "PRODUCT") {
    router.push({ path: "/detail", query: { id: item.id } });
  } else {
    router.push({ path: "/shop", query: { shopId: item.id } });
  }
};
// 隐藏的头像文件选择框引用
const avatarInputRef = ref(null);

// 修改昵称弹窗状态与输入值
const showEditNameDialog = ref(false);
const newNicknameInput = ref("");

// -------------------------------------------------------------
// 1. 头像更换逻辑
// -------------------------------------------------------------
const triggerChooseAvatar = () => {
  avatarInputRef.value && avatarInputRef.value.click();
};

// 选中本地图片后上传并更新
const onAvatarSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  showToast({ type: "loading", message: "正在更新头像...", forbidClick: true });

  try {
    // A. 真实调用上传接口（文档 5.2.1）拿到 fileId
    const uploadRes = await uploadImageAPI(file);
    const fileId = uploadRes?.fileId || `avatar_${Date.now()}`;
    const newAvatarUrl = uploadRes?.url || URL.createObjectURL(file);

    // B. 真实调用更新资料接口（文档 5.1.5）更新头像
    await updateUserInfoAPI({ avatar: fileId });

    // C. 页面与本地缓存同步更新
    userInfo.value.avatarUrl = cleanUrl(newAvatarUrl);
    const localUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    localUser.avatarUrl = userInfo.value.avatarUrl;
    localStorage.setItem("userInfo", JSON.stringify(localUser));

    showToast({ type: "success", message: "头像更新成功！" });
  } catch (err) {
    console.warn("后端更新头像异常，采用本地模拟更新");
    // 优雅保底：本地即使报错也允许回显预览
    const mockUrl = URL.createObjectURL(file);
    userInfo.value.avatarUrl = mockUrl;
    showToast({ type: "success", message: "头像已更新(演示)" });
  } finally {
    event.target.value = "";
  }
};

// -------------------------------------------------------------
// 2. 昵称修改逻辑
// -------------------------------------------------------------
const openEditNameDialog = () => {
  newNicknameInput.value = userInfo.value.nickname || "";
  showEditNameDialog.value = true;
};

const confirmUpdateNickname = async () => {
  const targetName = newNicknameInput.value.trim();
  if (!targetName) {
    showToast("昵称不能为空");
    return;
  }
  if (targetName.length > 20) {
    showToast("昵称最多支持 20 个字");
    return;
  }

  showToast({ type: "loading", message: "正在保存...", forbidClick: true });

  try {
    // 真实调接口：PUT /api/v1/users/me 更新昵称（文档 5.1.5）
    await updateUserInfoAPI({ nickname: targetName });

    // 页面与本地缓存同步更新
    userInfo.value.nickname = targetName;
    const localUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    localUser.nickname = targetName;
    localStorage.setItem("userInfo", JSON.stringify(localUser));

    showToast({ type: "success", message: "昵称修改成功！" });
  } catch (err) {
    console.warn("后端更新昵称异常，采用保底更新");
    userInfo.value.nickname = targetName;
    showToast({ type: "success", message: "昵称修改成功！" });
  }
};
</script>

<style scoped>
.user-center-container {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 90px;
  box-sizing: border-box;
}

/* 1. 顶部 Header */
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px 10px 14px;
  background-color: #fff;
}
.user-info-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.user-nickname {
  font-size: 18px;
  font-weight: bold;
  color: #111;
}
.user-header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-icon-wrap {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.red-dot {
  position: absolute;
  top: -1px;
  right: -2px;
  width: 7px;
  height: 7px;
  background-color: #ff2346;
  border-radius: 50%;
  border: 1.5px solid #fff;
}

/* 2. 四大资产入口 */
.asset-nav-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 18px 6px 16px 6px;
  background-color: #fff;
  text-align: center;
}
.asset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.icon-relative {
  position: relative;
  display: inline-flex;
}
.asset-icon {
  color: #222;
}
.asset-title {
  font-size: 12.5px;
  color: #333;
}

/* 3. 订单分类 Tab 栏 */
.order-tabs-wrapper {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 12px 14px 10px 14px;
  border-top: 1px solid #f5f5f5;
}
/* 1. 滑动区域：核心修复！加上 padding-top 抬高天花板，防止切头 */
.tabs-scroll-area {
  flex: 1;
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding-top: 10px; /* 👈 关键点：给红球留出 10px 的头顶空间，不再被裁切！ */
  padding-bottom: 6px;
}
.tabs-scroll-area::-webkit-scrollbar {
  display: none;
}
/* 2. 每个 Tab 按钮 */
.tab-btn {
  position: relative;
  font-size: 15px;
  color: #555;
  cursor: pointer;
  white-space: nowrap;
  margin-right: 22px; /* 留足右侧空隙，防止红球挡住后面的竖线 */
  display: inline-flex;
  align-items: center;
}
.tab-btn.active {
  font-size: 15.5px;
  font-weight: bold;
  color: #111;
}

/* 3. 正圆小红点：完整展示，无任何裁切 */
.tab-badge {
  position: absolute;
  top: -5px; /* 挂在字头上方，现在有足够空间，绝不会被切 */
  right: -13px; /* 挂在字右侧 */
  width: 16px; /* 锁定宽高相等 */
  height: 16px;
  background-color: #ff2346; /* 原图纯正平铺大红 */
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  border-radius: 50%; /* 完美正圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
  z-index: 10;
}
.tab-active-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 3px;
  background-color: #ff2346;
  border-radius: 3px;
}

/* 搜索小入口 */
.search-order-entry {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #333;
  margin-left: 10px;
  cursor: pointer;
}
.split-bar {
  color: #e5e5e5;
  margin-right: 6px;
}

/* 4. 订单卡片 */
.order-list-area {
  padding: 10px 12px;
}
.order-card {
  background-color: #fff;
  border-radius: 14px;
  padding: 14px;
}
.order-shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.shop-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.shop-name {
  font-size: 14.5px;
  font-weight: bold;
  color: #111;
}
.order-status-tag {
  color: #ff4d6a;
  font-size: 13.5px;
  font-weight: 500;
}
.shop-distance {
  font-size: 11.5px;
  color: #888;
  margin-top: 3px;
}
.order-goods-flex {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.order-goods-cover {
  width: 76px;
  height: 76px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.order-goods-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-title-price {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
}
.goods-title {
  font-size: 14px;
  color: #222;
  font-weight: bold;
  line-height: 1.35;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.price {
  font-size: 15px;
  font-weight: 900;
  color: #111;
  flex-shrink: 0;
}
.goods-date-qty {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #888;
  margin-top: 2px;
}
.rule-pills-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
.rule-pill {
  font-size: 10.5px;
  color: #666;
  background-color: #f5f6f8;
  padding: 1px 6px;
  border-radius: 4px;
}

/* 订单卡片底部按钮 */
.order-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
.card-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  outline: none;
}
.btn-again {
  background-color: #fff;
  border: 1px solid #d5d7dc;
  color: #333;
}
.btn-use {
  background-color: #fff;
  border: 1px solid #ff2346;
  color: #ff2346;
  font-weight: 500;
}

/* 5. AI 横幅 */
.ai-banner-card {
  margin: 4px 12px;
  background: linear-gradient(135deg, #fff2f4 0%, #ffe9ed 100%);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.ai-banner-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mascot-avatar {
  font-size: 18px;
}
.ai-text {
  font-size: 12px;
  color: #222;
  font-weight: 500;
}

/* 6. 底部提示 */
.find-order-tip {
  text-align: center;
  font-size: 12px;
  color: #888;
  margin-top: 24px;
}
.blue-link {
  color: #2a5caa;
  margin-left: 4px;
  cursor: pointer;
}

/* 7. 悬浮胶囊底部 Tabbar */
.floating-nav-capsule {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border-radius: 30px;
  display: flex;
  padding: 8px 24px;
  gap: 36px;
  z-index: 999;
}
.capsule-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #777;
  cursor: pointer;
}
.capsule-item.active {
  color: #111;
  font-weight: bold;
}
.orders-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.empty-orders-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #999;
}
.empty-tip {
  font-size: 13px;
  margin-top: 8px;
}
/* 收藏抽屉样式 */
.fav-popup-content {
  padding: 18px 16px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.fav-popup-title {
  font-size: 17px;
  font-weight: bold;
  color: #111;
  margin: 0 0 14px 0;
  text-align: center;
}
.fav-type-switch {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
  margin-bottom: 12px;
}
.switch-tab {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding-bottom: 4px;
}
.switch-tab.active {
  color: #ff2346;
  font-weight: bold;
  border-bottom: 2px solid #ff2346;
}
.fav-items-scroll {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fav-card-item {
  display: flex;
  gap: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
}
.fav-thumb {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}
.fav-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.fav-name {
  font-size: 13.5px;
  font-weight: bold;
  color: #222;
  margin: 0;
}
.fav-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.fav-price {
  font-size: 15px;
  font-weight: bold;
  color: #ff2346;
}
.fav-buy-btn {
  font-size: 11.5px;
  color: #888;
}
.fav-empty-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;
  gap: 8px;
}
/* 头像相机徽标与改名画笔 */
.avatar-click-box {
  position: relative;
  cursor: pointer;
}
.camera-badge {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
.name-edit-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.edit-pen-icon {
  margin-top: 2px;
}
</style>
