<script setup lang="ts">
  /**
   * TODO：草稿，因此不同题型，例如选择或填空，暂时硬编码
   *
   */
  import { reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import { ExamListItem } from '@/api/exam';
  import { useUserStore } from '@/store';
  import * as api from '@/api/judge';
  import CollapsePanel from '../components/collapsePanel.vue';
  import SingleAnswer from '../components/singleAnswer.vue';

  const route = useRoute();
  const query = route.query as unknown as ExamListItem;
  const user = useUserStore();

  // TODO:
  // api.getPaperDetail({
  //   examId: Number(query.id),
  //   userId: /* user.id */ 2,
  //   current: 0,
  //   pageSize: 100,
  // });

  const testData = reactive([
    { number: 1, aiScore: 2.5, humanScore: undefined, reviewPassed: false, totalScore: 10 },
    { number: 1, aiScore: 2.5, humanScore: undefined, reviewPassed: false, totalScore: 10 },
    { number: 1, aiScore: 2.5, humanScore: undefined, reviewPassed: false, totalScore: 10 },
  ]);
</script>

<template>
  <a-layout class="h-full">
    <a-page-header @back="$router.back()">
      <template #title> {{ query.name }}&nbsp;{{ query.subject }} </template>
      <template #subtitle>
        {{ new Date(Number(query.time)).toISOString().slice(0, 10) }}（{{ (query.timeLimit - query.time) / (1000 * 60) }}分钟）
      </template>

      <template #extra>
        <a-space>
          <a-button type="primary">提交</a-button>
          <a-button type="outline">全部</a-button>
        </a-space>
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

      <a-scrollbar class="flex-1 h-full overflow-auto px-2">
        <!-- TODO: 若实际上题目真的非常多再考虑虚拟列表 -->
        <div>
          <h2 class="px-4 pt-4 pb-12 bg-slate-100 rounded-2xl border-solid b-blue-100 b-1">一、选择题</h2>
          <single-answer
            v-for="(_, index) in testData"
            :key="index"
            v-model="testData[index]"
          />
        </div>
        <div>
          <h2 class="px-4 pt-4 pb-12 bg-slate-100 rounded-2xl border-solid b-blue-100 b-1">二、阅读理解</h2>
          <single-answer
            v-for="(_, index) in testData"
            :key="index"
            v-model="testData[index]"
          />
        </div>
      </a-scrollbar>
    </div>
  </a-layout>
</template>
