<script setup lang="ts">
  /**
   * @see https://arco.design/vue/component/tree
   */
</script>

<template>
  <a-layout class="h-full">
    <a-layout-sider class="p2">
      <header class="p2">
        <a-input-search placeholder="搜索权限" />
      </header>
      <!-- TODO:tree -->
    </a-layout-sider>
    <a-layout-content>
      <a-card class="h-full">
        <header class="flex gap-4">
          <a-button type="primary">关联角色</a-button>
          <a-button>关联用户</a-button>
        </header>
        <!-- TODO:table -->
      </a-card>
    </a-layout-content>
  </a-layout>
</template>
