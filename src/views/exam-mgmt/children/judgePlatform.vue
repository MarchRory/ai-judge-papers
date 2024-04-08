<script setup lang="ts">
  /**
   * 阅卷界面
   * 必须query参数：
   * examId
   * userId
   *
   * BUG：
   * 评语的 pop-confirm 定位有问题，属于 arco 的实现问题
   */
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Modal } from '@arco-design/web-vue';
  import { useFullscreen } from '@vueuse/core';
  import { ExamListItem, getProblemList } from '@/api/exam';
  import { PaperDetail, getPaperDetail, getReview, reviewFulfil } from '@/api/judge';
  import { Question } from '@/api/question';
  import SinglePaper from '../components/singlePaper.vue';
  import ActionButton from '../components/actionButton.vue';

  const router = useRouter();
  const route = useRoute();
  const query = route.query as unknown as ExamListItem;
  const userId = 50; // TODO：修改为query传入学生 id
  const examId = 19; // TODO：修改为 Number(query.id);

  const el = ref<HTMLElement | null>(null);
  const { isFullscreen, toggle } = useFullscreen(el);

  /** 需求请求多个接口，请求时展示loading */
  const loadingDataStatus = ref('loading');
  type ComposedData = PaperDetail & Question;
  const compositePaper = ref<ComposedData[]>();
  const errorMessage = ref<string>();
  const reviewIds = ref<number[]>();

  onMounted(async () => {
    try {
      // 页面进入时，加载数据
      reviewIds.value = (await getReview({ state: 2, examId, pageSize: 9999 })).data.list;

      const problems = (await getProblemList(examId)).data.list;
      const thisUserPaperDetail = (
        await getPaperDetail({
          examId,
          userId,
          current: 0,
          pageSize: 9999, // get all questions, do not paging it
        })
      ).data.list;

      const wipComposedData: ComposedData[] = [];
      thisUserPaperDetail.forEach((detail) => {
        //! 重要：注意：如果 problem === undefined 那必然是数据库有一些问题
        // 此处暂未做处理
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const problem = problems.find((p) => p.problemId === detail.problemId)!;

        // console.log({ detail, problem, problems });
        wipComposedData.push(Object.assign(problem, detail));
      });
      compositePaper.value = wipComposedData;
      // done
      loadingDataStatus.value = 'success';
    } catch (e) {
      // for debug
      // eslint-disable-next-line no-console
      console.error(e);
      errorMessage.value = String(e);
      loadingDataStatus.value = 'error';
    }
  });

  const handleModify = (composited: ComposedData[]) => {
    compositePaper.value = composited;
  };

  const back = () => {
    router.push({
      path: '/exam-mgmt/examDetail',
      query: route.query, // 和入口页面相同 query
    });
  };

  const submitModalVisible = ref(false);
  const submitThis = async () => {
    const ok = await reviewFulfil({ userId, examId });
    if (ok) submitModalVisible.value = true;
    reviewIds.value = (await getReview({ state: 2, examId, pageSize: 9999 })).data.list;
  };
  const handleSubmitModal = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ids = reviewIds.value!;
    if (ids.length > 0) {
      const nextUserId = ids[0];
      router.push({
        path: '/exam-mgmt/judgePlatform',
        query: { ...route.query, userId: nextUserId },
      });
    } else {
      back();
    }
  };
</script>

<template>
  <!-- id 确保全屏模式挂载点正确 -->
  <a-layout
    id="id-for-judge-container"
    ref="el"
  >
    <a-page-header @back="back">
      <template #title> {{ query.name }}&nbsp;{{ query.subject }} </template>
      <template #subtitle>
        {{ new Date(Number(query.time)).toISOString().slice(0, 10) }}（{{ (query.timeLimit - query.time) / (1000 * 60) }}分钟）
      </template>

      <template #extra>
        <a-space>
          <!-- TODO 测试用 -->
          <div class="px-8 text-right"> 考试ID={{ examId }} 学生ID={{ userId }}</div>
          <a-button
            type="primary"
            @click="toggle"
            >{{ isFullscreen ? '退出全屏' : '全屏阅卷' }}</a-button
          >
          <action-button
            type="outline"
            @action="submitThis"
            >提交阅卷结果</action-button
          >
          <a-modal
            v-model:visible="submitModalVisible"
            width="auto"
            :on-before-ok="handleSubmitModal"
            @cancel="submitModalVisible = false"
          >
            <template #title>提交成功</template>
            <div v-if="reviewIds && reviewIds.length > 0">提交成功，是否转到下一张试卷？</div>
            <div v-else>已评阅完成所有试卷，是否返回上一级页面？</div>
          </a-modal>
        </a-space>
      </template>
    </a-page-header>

    <div :class="`flex px-2 bg-white rounded-lg relative ${isFullscreen ? 'h-92vh' : 'max-h-72vh'}`">
      <div
        v-if="loadingDataStatus === 'loading'"
        class="w-full h-50vh"
      >
        <a-spin
          tip="试卷正在加载中..."
          class="w-full"
        />
      </div>
      <template v-else-if="loadingDataStatus === 'success'">
        <SinglePaper
          :exam-id="examId"
          :user-id="userId"
          :composite-paper="compositePaper!"
          @modify="handleModify"
        />
      </template>
      <div
        v-else-if="loadingDataStatus === 'error'"
        class="w-full h-80vh px-8"
      >
        <a-typography-text type="warning">
          {{ errorMessage }}
        </a-typography-text>
      </div>
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

  #id-for-judge-container {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
  }
</style>
