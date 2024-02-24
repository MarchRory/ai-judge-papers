<script setup lang="ts">
  import { Paging } from '@/api/types';
  import { ref, reactive } from 'vue';

  const pagination = reactive<Paging<{ key: string }>>({
    page: 1,
    pageSize: 10,
    key: '',
  });

  function loadList() {}

  function openForm(type: 'create' | 'edit', data?: any) {}
</script>

<template>
  <div>
    <a-layout h="5xl">
      <a-layout-content>
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 用户管理 </strong>
          </header>
          <section
            w="full"
            p="x-4"
            flex="~ justify-between items-center"
          >
            <div w="1/4">
              <a-input-search
                v-model="pagination.key"
                allow-clear
                placeholder="输入关键字查找用户"
                search-button
                @search="loadList"
              />
            </div>
            <div w="1/4">
              <a-button
                type="primary"
                @click="openForm('create')"
              >
                <template #icon>
                  <icon-plus-circle />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>创建用户</template>
              </a-button>
            </div>
          </section>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped lang="less">
  :deep(.arco-table-container) {
    height: 90%;
  }
</style>
