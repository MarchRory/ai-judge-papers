<script setup lang="ts">
  import { ref } from 'vue';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps<{
    onAction?: () => Promise<void>;
    status?: string;
  }>();
  const isLoading = ref(false);
  const handleClick = async () => {
    isLoading.value = true;
    try {
      await props.onAction?.();
      Message.success('成功');
    } catch (e) {
      Message.error(String(e));
    } finally {
      isLoading.value = false;
    }
  };
</script>

<template>
  <a-button
    v-bind="props as any"
    :loading="isLoading"
    @click="handleClick"
  >
    <slot></slot>
  </a-button>
</template>
