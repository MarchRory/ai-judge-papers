<script setup lang="ts">
  import { ref } from 'vue';
  import { useFullscreen } from '@vueuse/core';

  /* 全屏逻辑 */
  const chartContainer = ref<HTMLElement | null>(null);
  const { isFullscreen, enter, exit, toggle: fullScreenToggle } = useFullscreen(chartContainer);
</script>

<template>
  <div
    ref="chartContainer"
    class="main wh-full"
  >
  </div>
</template>

<style scoped lang="less">
  .main {
    background-image: url('../../../assets/images/chartBg.png');
    background-size: cover;
  }
</style>
