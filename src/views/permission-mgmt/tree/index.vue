<script setup lang="ts">
  /**
   * @author liushi_21
   * @see https://arco.design/vue/component/tree
   */
  import { ref } from 'vue';
  import { getPermissionTreeAPI } from '@/api/permissions';

  const treeData = ref<any[]>([]);

  function init() {
    getPermissionTreeAPI().then((res) => {
      const { data } = res;
      treeData.value = data.map((node) => {
        return {
          title: node.name,
          key: node.key,
        };
      });
    });
  }
  init();
</script>

<template>
  <a-layout class="h-full">
    <a-layout-sider
      class="p2"
      :width="350"
    >
      <header class="p2">
        <a-input-search placeholder="搜索权限" />
        <a-tree
          :data="treeData"
          :show-line="true"
        />
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
