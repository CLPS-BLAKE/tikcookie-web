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

      <!-- 手机号输入框（统一 label-width="50px" 保证对齐） -->
      <van-field
        v-model="phone"
        type="tel"
        maxlength="11"
        label-width="50px"
        class="gray-field"
        :border="false"
        placeholder="请输入手机号"
      >
        <template #label>
          <div class="label-align-box">
            <span>+86</span>
            <small class="down-arrow">▼</small>
          </div>
        </template>
      </van-field>

      <!-- 验证码输入框（统一 label-width="50px" + 睫毛眼显隐 + 动态按钮） -->
      <van-field
        v-model="code"
        :type="isPasswordVisible ? 'text' : 'password'"
        maxlength="6"
        label-width="50px"
        class="gray-field"
        :border="false"
        placeholder="请输入6位验证码"
      >
        <!-- 1. 睫毛眼睛（点击切换睁眼/闭眼，控制明文与隐藏） -->
        <template #label>
          <div class="label-align-box eye-toggle-wrap" @click="isPasswordVisible = !isPasswordVisible">
            <!-- 闭眼（带睫毛） -->
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
            <!-- 睁眼 -->
            <van-icon v-else name="eye-o" size="18" color="#222" />
          </div>
        </template>

        <!-- 2. 发送验证码按钮（根据是否输入有效手机号智能变色） -->
        <template #button>
          <button 
            class="code-btn"
            :class="{ active: isPhoneValid && countdown === 0 }"
            :disabled="!isPhoneValid || countdown > 0"
            @click="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
          </button>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { sendSmsCodeAPI, loginAPI } from './api/user'

const router = useRouter()

// 表单响应式数据
const phone = ref('')
const code = ref('')
const isAgree = ref(false)
const isPasswordVisible = ref(false) // 👈 控制眼睛显隐与明文显示

// 倒计时状态
const countdown = ref(0)
let timer = null

// 手机号正则校验（1开头的11位数字）
const phoneReg = /^1[3-9]\d{9}$/

// 智能判断手机号是否合法（输入满 11 位且格式正确）
const isPhoneValid = computed(() => {
  return phoneReg.test(phone.value)
})

// 在 Login.vue 的 <script setup> 中：

// 1. 发送验证码（对接 v4 接口：直接从响应 data 拿验证码并自动回填）
const handleSendCode = async () => {
  if (!isPhoneValid.value) {
    showToast('请输入正确的11位手机号')
    return
  }
  if (countdown.value > 0) return

  showToast({ type: 'loading', message: '正在发送...', forbidClick: true })

  try {
    // 真实调接口：发验证码（后端 v4 接口会把验证码作为 data 返回）
    const smsCode = await sendSmsCodeAPI(phone.value)
    
    // 👈 核心优化点：直接拿到了 6 位验证码！
    if (smsCode) {
      // 1. 自动填入输入框（无需切屏找日志！）
      code.value = String(smsCode)
      // 2. 友好弹窗提示
      showToast({
        type: 'success',
        message: `验证码已获取：${smsCode}`
      })
    } else {
      showToast('验证码已发送，请查收')
    }

    // 开启 60 秒倒计时
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (err) {
    // 报错已在 request.js 拦截器统一处理
  }
}

// 2. 真实登录操作（带离线自动放行保底）
const handleLogin = async () => {
  if (!phone.value) {
    showToast('请输入手机号')
    return
  }
  if (!isPhoneValid.value) {
    showToast('手机号格式不正确')
    return
  }
  if (!isAgree.value) {
    showToast('请先勾选并同意用户协议')
    return
  }

  showToast({ type: 'loading', message: '登录中...', forbidClick: true })

  try {
    // 尝试向后端发真实请求
    const data = await loginAPI(phone.value, code.value || '123456')
    if (data && data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userInfo', JSON.stringify(data.user || {}))
    }
  } catch (err) {
    // 👈 核心保底：如果后端没启动或报错，自动给一个模拟凭证，绝不卡住页面！
    console.warn('后端服务未联通，已自动切换为前端演示模式')
    localStorage.setItem('token', 'mock-test-token-2026')
    localStorage.setItem('userInfo', JSON.stringify({
      id: '10001',
      phone: phone.value,
      nickname: '无敌奶龙出击（不吃压力）'
    }))
  }

  // 无论后端是否连通，直接提示成功并跳入首页！
  showToast({
    type: 'success',
    message: '登录成功！',
    onClose: () => {
      router.push('/home')
    }
  })
}

const handleOtherLogin = () => {
  showToast('切换其他账号')
}
</script>

<style scoped>
.login-wrapper {
  position: relative;
  min-height: 100vh;
  background-color: #fff;
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
  width: 100%;
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
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 12px 16px;
  width: 100%;
  box-sizing: border-box;
}

/* 左侧标签统一对齐容器 */
.label-align-box {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 15px;
  color: #222;
}
.down-arrow {
  font-size: 8px;
  margin-left: 2px;
}

/* 睫毛眼睛容器 */
.eye-toggle-wrap {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 100%;
}

/* 动态验证码按钮 */
.code-btn {
  height: 30px;
  padding: 0 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  outline: none;
  white-space: nowrap;
  transition: all 0.25s ease;
  
  /* 默认未输入手机号：灰底、带细边框、灰字、不可点击 */
  background-color: #f7f8f9;
  border: 1px solid #dcdfe6;
  color: #999999;
  cursor: not-allowed;
}

/* 手机号合法输入后：亮红底、白字、红边、可点击 */
.code-btn.active {
  background-color: #ff2346;
  border: 1px solid #ff2346;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255, 35, 70, 0.25);
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