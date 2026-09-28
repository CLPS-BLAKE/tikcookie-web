<template>
  <div class="login-wrapper">
    <!-- 1. 顶部 Header 区 -->
    <header class="header-nav">
      <van-icon name="cross" size="20" class="icon-close" />
      <span class="sub-title">抖音旗下产品</span>
      <span class="help-btn">帮助</span>
    </header>

    <!-- 2. 顶部大标题与背景装饰 -->
    <div class="banner-box">
      <div class="banner-badge">单单超便宜！</div>
      <div class="banner-title">
        <span>登录享优惠</span>
        <!-- 这里用一个红包小图标做示意 -->
        <span class="red-packet">🧧</span>
      </div>
    </div>

    <!-- 3. 主体内容卡片 -->
    <div class="content-box">
      <h3 class="rights-tips">登录后解锁全部权益</h3>

      <!-- 头像 -->
      <div class="avatar-wrap">
        <van-image
          round
          width="130"
          height="130"
          fit="cover"
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
      </div>

      <!-- 用户名 -->
      <div class="user-name">无敌奶龙出击（不吃压力）</div>

      <!-- 输入手机号，调起手机号键盘 -->
      <van-field
        v-model="tel"
        type="tel"
        label-width="55px"
        class="gray-field"
        :border="false"
        placeholder="请输入手机号"
      >
        <!-- 自定义左侧 label 插槽 -->
        <template #label>
          <span>+86 <small style="font-size: 8px">▼</small></span>
        </template>
      </van-field>

      <!-- 密码 / 隐藏输入框 -->
      <van-field
        v-model="password"
        :type="isPasswordVisible ? 'text' : 'password'"
        label-width="45px"
        class="gray-field"
        :border="false"
        placeholder="   请输入密码"
      >
        <!-- 用自定义 label 插槽放睫毛眼睛，并绑定点击切换事件 -->
        <template #label>
          <div
            class="eye-toggle-wrap"
            @click="isPasswordVisible = !isPasswordVisible"
          >
            <!-- 闭眼状态：带睫毛的可爱闭眼 -->
            <svg
              v-if="!isPasswordVisible"
              class="lash-eye-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="#222"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M4 10c2.5 4 6 6 8 6s5.5-2 8-6" />
              <line x1="6" y1="13" x2="4.5" y2="16.5" />
              <line x1="9" y1="15" x2="8.5" y2="19" />
              <line x1="12" y1="16" x2="12" y2="20" />
              <line x1="15" y1="15" x2="15.5" y2="19" />
              <line x1="18" y1="13" x2="19.5" y2="16.5" />
            </svg>

            <!-- 睁眼状态：切换为睁眼图标 -->
            <van-icon v-else name="eye-o" size="18" color="#222" />
          </div>
        </template>
      </van-field>
      <!-- 一键登录按钮 -->
      <van-button
        type="primary"
        round
        block
        class="login-btn"
        @click="handleLogin"
      >
        一键登录
      </van-button>

      <!-- 协议勾选 -->
      <div class="protocol-box">
        <van-checkbox
          v-model="isAgree"
          icon-size="14px"
          checked-color="#ff2c55"
        >
          <span class="protocol-text">
            已阅读并同意 <a href="javascript:;">用户协议</a> 和
            <a href="javascript:;">隐私政策</a>
          </span>
        </van-checkbox>
      </div>
    </div>

    <!-- 4. 底部其他登录方式 -->
    <footer class="footer-box">
      <span class="other-login" @click="handleOtherLogin">登录其他账号</span>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "vant";

// 手机号（你原有的）
const tel = ref("");
// 1. 新增：密码输入值
const password = ref("");
// 2. 新增：控制是否显示明文（false 为隐藏，true 为显示）
const isPasswordVisible = ref(false);

// 是否勾选协议
const isAgree = ref(false);

// 登录点击事件
const handleLogin = () => {
  if (!isAgree.value) {
    showToast("请先勾选并同意用户协议");
    return;
  }
  showToast({
    type: "success",
    message: "登录成功！",
  });
};

// 切换其他账号
const handleOtherLogin = () => {
  showToast("切换其他账号");
};
</script>

<style scoped>
.login-wrapper {
  position: relative;
  min-height: 100vh;
  background-color: #fff;
  /* 顶部粉色到白色的渐变背景 */
  background-image: radial-gradient(
    circle at 50% 10%,
    #ff4d79 0%,
    #ff85a1 40%,
    #ffffff 85%
  );
  background-repeat: no-repeat;
  background-size: 100% 360px;
  display: flex;
  flex-direction: column;
  padding: 12px 20px;
  box-sizing: border-box;
}

/* 顶部导航 */
.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  padding-top: 10px;
  font-size: 14px;
}

.header-nav .sub-title {
  font-size: 12px;
  opacity: 0.85;
}

.header-nav .help-btn {
  font-size: 14px;
  font-weight: 500;
}

/* 顶部大横幅 */
.banner-box {
  margin-top: 74px;
  text-align: center;
  position: relative;
}

.banner-badge {
  display: inline-block;
  background-color: #ff2c55;
  color: #fff;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 20px 20px 20px 4px;
  font-weight: bold;
  transform: rotate(-3deg);
  margin-bottom: 2px;
}

.banner-title {
  font-size: 32px;
  font-weight: 900;
  color: #161823;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.red-packet {
  font-size: 36px;
  transform: rotate(15deg);
}

/* 主体区域 */
.content-box {
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rights-tips {
  font-size: 17px;
  color: #161823;
  font-weight: 600;
  margin-bottom: 30px;
}

.avatar-wrap {
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.user-name {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #161823;
  margin-bottom: 28px;
}

/* 自定义浅灰背景输入框 */
.gray-field {
  background-color: #f7f8f9 !important;
  /* 淡灰色背景（也可以用 #f2f3f5） */
  border-radius: 12px;
  /* 加上圆角更贴合手机端设计 */
  margin-bottom: 12px;
  /* 下方留一点间距 */
  padding: 14px 16px;
  /* 上下内边距，让输入框饱满一点 */
}
/* 让睫毛眼睛居中、可点击 */
.eye-toggle-wrap {
  display: flex;
  align-items: center;
  height: 100%;
  cursor: pointer;
  margin-left: 5px; /* 向右移动 3 个像素 */
}
/* 登录大按钮（抖音红粉渐变色） */
.login-btn {
  margin-top: 10px;
  height: 48px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  background: linear-gradient(135deg, #ff2c55, #fe2c55);
  box-shadow: 0 6px 16px rgba(254, 44, 85, 0.35);
}

/* 协议文本 */
.protocol-box {
  margin-top: 16px;
}

.protocol-text {
  font-size: 12px;
  color: #86909c;
}

.protocol-text a {
  color: #161823;
  font-weight: 500;
  text-decoration: none;
}

/* 底部其他账号 */
.footer-box {
  margin-top: auto;
  padding-bottom: 24px;
  text-align: center;
}

.other-login {
  color: #2a5caa;
  font-size: 13px;
  cursor: pointer;
}
</style>
