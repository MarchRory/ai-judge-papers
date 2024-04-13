<template>
  <div class="pageContainer">
    <vue-particles
      id="tsparticles"
      :options="options"
      @particles-loaded="particlesLoaded"
    />
    <div class="content">
      <div class="content-inner">
        <LoginForm />
      </div>
      <div class="footer">
        <!-- <Footer /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import APP_TITLE from '@/assets/globalVariable';
  import { Notification } from '@arco-design/web-vue';
  import { reactive, onMounted } from 'vue';
  import ParticlesConfig from '@/assets/specialEffect/particlesjs-config';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';

  // 放options是为了响应式, 这样方便调试
  const options = reactive(ParticlesConfig);
  const particlesLoaded = async (container: any) => {
    Notification.success(`欢迎使用${APP_TITLE}`);
  };

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .pageContainer {
    display: flex;
    height: 100vh;
    width: 100vw;

    .banner {
      width: 550px;
      background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;

    &-text {
      margin-right: 4px;
      margin-left: 4px;
      color: var(--color-fill-1);
      font-size: 20px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
