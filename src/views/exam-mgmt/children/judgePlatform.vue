<script setup lang="ts">
  /**
   * TODO：草稿，因此不同题型，例如选择或填空，暂时硬编码
   *
   */
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useFullscreen } from '@vueuse/core';
  import { ExamListItem, getProblemList } from '@/api/exam';
  import { PaperDetail, getPaperDetail } from '@/api/judge';
  import { Question } from '@/api/question';
  import SinglePaper from '../components/singlePaper.vue';

  const route = useRoute();
  const query = route.query as unknown as ExamListItem;
  const userId = 2; // TODO：需要传入学生 id
  const examId = 17; // Number(query.id);

  const el = ref<HTMLElement | null>(null);
  const { isFullscreen, toggle } = useFullscreen(el);

  /** 需求请求多个接口，请求时展示loading */
  const loadingDataStatus = ref('loading');
  type ComposedData = PaperDetail & Question;
  const compositePaper = ref<ComposedData[]>();

  onMounted(async () => {
    try {
      const problems = (await getProblemList(Number(query.id))).data.list;
      const thisUserPaperDetail = (
        await getPaperDetail({
          examId,
          userId,
          current: 0,
          pageSize: 999,
        })
      ).data.list;
      const wipComposedData: ComposedData[] = [];
      thisUserPaperDetail.forEach((detail) => {
        //! 重要：注意：如果 problem === undefined 那必然是数据库有一些问题
        // 此处暂未做处理
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const problem = problems.find((p) => p.problemId === detail.problemId)!;
        // console.log({ detail, problem });
        wipComposedData.push(Object.assign(problem, detail));
      });
      compositePaper.value = wipComposedData;
      // done
      loadingDataStatus.value = 'success';
    } catch {
      loadingDataStatus.value = 'error';
    }
  });
</script>

<template>
  <a-layout
    ref="el"
    class="h-full"
  >
    <a-page-header @back="$router.back()">
      <template #title> {{ query.name }}&nbsp;{{ query.subject }} </template>
      <template #subtitle>
        {{ new Date(Number(query.time)).toISOString().slice(0, 10) }}（{{ (query.timeLimit - query.time) / (1000 * 60) }}分钟）
      </template>

      <template #extra>
        <a-space>
          <a-button
            type="primary"
            @click="toggle"
            >{{ isFullscreen ? '退出全屏' : '全屏阅卷' }}</a-button
          >
          <a-button type="outline">提交阅卷结果</a-button>
        </a-space>
      </template>
    </a-page-header>

    <div :class="`flex pt-4 pb-2 px-2 bg-white rounded-lg relative ${isFullscreen ? 'h-full' : 'max-h-78vh'}`">
      <div
        v-if="loadingDataStatus === 'loading'"
        class="w-full py-20"
      >
        <a-spin
          tip="试卷正在加载中..."
          class="w-full"
        />
      </div>
      <template v-if="loadingDataStatus === 'success'">
        <SinglePaper
          :exam-id="examId"
          :user-id="userId"
          :composite-paper="compositePaper!"
        />
      </template>
    </div>
  </a-layout>
</template>

<style scoped>
  :deep(.arco-scrollbar) {
    flex: 1;
  }
  /* 确保全屏模式下背景颜色正确 */
  * {
    background: Canvas;
  }
</style>
