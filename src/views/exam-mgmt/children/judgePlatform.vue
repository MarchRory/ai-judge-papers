<script setup lang="ts">
  /**
   * TODO：草稿
   */
  import collapsePanel from '../components/collapsePanel.vue';
</script>

<template>
  <a-layout class="h-full">
    <a-page-header
      title="语文"
      subtitle="xxx考试"
    >
      <template #extra>
        <a-button-group>
          <a-button type="primary">提交</a-button>
          <a-button type="outline">全部</a-button>
        </a-button-group>
      </template>
    </a-page-header>

    <div class="flex pt-4 pb-2 px-2 bg-white rounded-lg relative max-h-72vh">
      <!-- 导航区域 -->
      <aside>
        <collapse-panel class="h-full">
          <a-anchor>
            <a-anchor-link>
              一、选择题
              <template #sublist>
                <a-anchor-link>1</a-anchor-link>
                <a-anchor-link>2</a-anchor-link>
              </template>
            </a-anchor-link>
            <a-anchor-link>二、阅读理解</a-anchor-link>
          </a-anchor>
        </collapse-panel>
      </aside>

      <!-- 题目区域 -->
      <aside class="flex-1 overflow-auto">
        <!-- 测试 -->
        <div
          v-for="i in new Array(100)"
          :key="i"
          class="flex justify-between gap-4 mx-2 mb-4"
        >
          <div class="flex-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis possimus optio modi, sit facilis aliquid sapiente aperiam
            nulla, laboriosam illo iste veniam voluptatem accusantium iure nisi ex, repudiandae consequatur? Magni?
          </div>

          <div>
            <a-button>复审通过</a-button>
            <a-button>人工批改</a-button>
            <div></div>
          </div>
        </div>
      </aside>
    </div>
  </a-layout>
</template>
