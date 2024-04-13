<template>
  <div class="pageContainer">
    <Transition name="fade-out">
      <div
        v-if="loading"
        class="loadingMask wh-full flex items-center justify-center flex-col"
      >
        <div
          :style="{
            opacity: botVisible ? 1 : 0,
          }"
          class="transition-all transition-duration-600 ease-in"
        >
          <div>
            <div class="custom-loading-jump loading-bot">
              <icon-robot
                :size="180"
                color="#293145"
              />
            </div>
          </div>
          <div>
            <h1 class="text-#293145 text-center">加载中...</h1>
          </div>
        </div>
      </div>
    </Transition>

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
  import { reactive, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import ParticlesConfig from '@/assets/specialEffect/particlesjs-config';
  import useLoading from '@/hooks/loading';
  import { sleep } from '@/utils/common/performance';
  import { toLength } from 'lodash';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';

  const router = useRouter();
  const { loading, setLoading } = useLoading(true);
  const { loading: botVisible, setLoading: setBotvisible } = useLoading(true);
  const count = ref(0);

  router.afterEach((to, from) => {
    const { name: toName } = to;
    const { name: fromName } = from;
    if (toName === 'login' && typeof fromName === 'undefined') {
      count.value = 2;
    }
  });

  // 放options是为了响应式, 这样方便调试
  const options = reactive(ParticlesConfig);
  const particlesLoaded = async (container: any) => {
    // 避免loading过短, 导致bg的异常布局展示出来
    if (count.value !== 2) {
      count.value = 2;
    } else {
      await sleep(600);
      setBotvisible(false);
      await sleep(300);
      setLoading(false);
      Notification.success(`欢迎使用${APP_TITLE}`);
    }
  };
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
  .loading-bot {
    position: relative;
    top: 0px;
  }
  .loadingMask {
    position: fixed;
    z-index: 9999;
    background-color: #1b1e3439;
    backdrop-filter: blur(1000px);
  }
  .fade-out-enter-active {
    background-color: #1b1e3439;
    backdrop-filter: blur(1000px);
  }
  .fade-out-leave-to {
    background-color: transparent;
    backdrop-filter: blur(0px);
    transition: all 0.8s ease;
  }
</style>
