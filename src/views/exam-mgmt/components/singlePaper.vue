<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { PaperDetail } from '@/api/judge';
  import { Question } from '@/api/question';
  import SingleAnswer from './singleAnswer.vue';
  import collapsePanel from './collapsePanel.vue';

  const props = defineProps<{
    userId: number;
    examId: number;
    /**
     * 给定学生给定试卷，合成的试题信息和评分信息合成数组
     */
    compositePaper: Array<PaperDetail & Question>;
  }>();

  /** 题目类型(0,简答,1选择,2填空,3判断) */
  const types = ['简答题', '选择题', '填空题', '判断题'].map(
    (name, type) => [name, props.compositePaper.filter((p) => p.type === type)] as const,
  );
  // [题目类型，题目][]

  const shouldScrollIntoViewInfo = ref({ type: -1, index: -1 });
  const onScrollIntoView = (e: { type: number; index: number }) => {
    shouldScrollIntoViewInfo.value = e;
    // reset
    return nextTick(() => {
      shouldScrollIntoViewInfo.value = { type: -1, index: -1 };
    });
  };

  const handleModifyQuestion = (e: { id: number; score: number; result: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const problem = props.compositePaper.find(({ id }) => id === e.id)!;
    problem.score = e.score;
    problem.result = e.result;
  };
</script>

<template>
  <!-- 导航区域 -->
  <aside>
    <collapse-panel class="h-full">
      <a-anchor line-less>
        <template
          v-for="([name, problems], type) in types"
          :key="name"
        >
          <a-anchor-link
            v-if="problems.length > 0"
            @click="onScrollIntoView({ type, index: 1 })"
          >
            {{ name }}
            <template #sublist>
              <a-anchor-link
                v-for="({ order }, index) in problems"
                :key="index"
                class="inline-block"
                @click="onScrollIntoView({ type, index: order })"
              >
                {{ order }}
              </a-anchor-link>
            </template>
          </a-anchor-link>
        </template>
      </a-anchor>
    </collapse-panel>
  </aside>

  <!-- 题目区域 -->

  <a-scrollbar class="h-full overflow-auto px-6">
    <!-- TODO: 若实际上题目真的非常多再考虑虚拟列表 -->
    <template
      v-for="([name, questions], type) in types"
      :key="name"
    >
      <div v-if="questions.length > 0">
        <div class="px-4 pb-6 mb-8 bg-slate-100 rounded-2xl border-solid b-blue-100 b-1">
          <h1 class="font-normal">{{ name }}</h1>
          <a-typography class="flex gap-4">
            <a-tag
              bordered
              size="small"
              color="arcoblue"
              >题目数：{{ questions.length }}</a-tag
            >
            <a-tag
              bordered
              size="small"
              color="arcoblue"
              >得分：{{ questions.reduce((acc, cur) => acc + cur.score, 0) }}</a-tag
            >
            <a-tag
              bordered
              size="small"
              color="arcoblue"
              >总分：{{ questions.reduce((acc, cur) => acc + cur.totalScore, 0) }}</a-tag
            >
          </a-typography>
        </div>
        <single-answer
          v-for="question in questions"
          :key="question.problemId"
          :composite-question="question"
          :scroll-into-view="shouldScrollIntoViewInfo.index === question.order && shouldScrollIntoViewInfo.type === type"
          @modify="handleModifyQuestion"
        />
      </div>
    </template>
  </a-scrollbar>
</template>
