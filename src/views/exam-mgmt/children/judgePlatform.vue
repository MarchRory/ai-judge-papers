<script setup lang="ts">
  /**
   * TODO：草稿
   */

  import { useRoute } from 'vue-router';
  import CollapsePanel from '../components/collapsePanel.vue';
  import SingleAnswer from '../components/singleAnswer.vue';
  import { ExamListItem } from '../../../api/exam';

  const route = useRoute();
  const query = route.query as unknown as ExamListItem;
</script>

<template>
  <a-layout class="h-full">
    <a-page-header @back="$router.back()">
      <template #title> {{ query.name }}&nbsp;{{ query.subject }} </template>
      <template #subtitle>
        <span>
          {{ new Date(Number(query.time)).toISOString().slice(0, 10) }}（{{ (query.timeLimit - query.time) / (1000 * 60) }}分钟）
        </span>
      </template>

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
      <aside class="flex-1 overflow-auto px-3">
        <!-- TODO: 若实际上题目真的非常多再考虑虚拟列表 -->
        <div>
          <h2 class="px-4 pt-4 pb-12 bg-slate-100 rounded-2xl">一、选择题</h2>
          <single-answer
            v-for="(_, index) in new Array(10)"
            :key="index"
            :number="index"
          />
        </div>
        <div>
          <h2 class="px-4 pt-4 pb-12 bg-slate-100 rounded-2xl">二、阅读理解</h2>
          <single-answer
            v-for="(_, index) in new Array(10)"
            :key="index"
            :number="index"
          />
        </div>
      </aside>
    </div>
  </a-layout>
</template>
