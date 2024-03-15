<script setup lang="ts">
  /**
   * 此组件是一个按钮，点击后弹出模态窗
   */
  import { ref } from 'vue';
  // modal
  const modalVisible = ref(false);

  async function handleClick() {}
</script>

<template>
  <a-button @click="modalVisible = true"> 批量导入 </a-button>
  <!-- modal -->

  <a-modal
    v-model:visible="modalVisible"
    @before-ok="handleClick"
  >
    <template #title> 批量导入 </template>
    TODO:批量导入
  </a-modal>
</template>
