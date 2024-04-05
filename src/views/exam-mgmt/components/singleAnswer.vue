<script setup lang="ts">
  /**
   * 单个试题
   */

  import { ref, onUpdated } from 'vue';
  import { PaperDetail } from '@/api/judge';
  import { Question } from '@/api/question';

  const test = {
    problemId: 257,
    title: '无',
    content: '英语测试题面1',
    state: 0,
    expectedDifficulty: 1,
    source: 'upload',
    type: 0,
    score: 2,
    order: 1,
    id: 57,
    result: '',
    totalScore: 3,
    url: '',
    studentAnswer: 'A',
  };

  const props = defineProps<{
    compositeQuestion: PaperDetail & Question;
    /** 滚动当前元素到视窗顶部 */
    scrollIntoView?: boolean;
  }>();
  const question = props.compositeQuestion;
  console.log({ ...question });

  const eRef = ref<HTMLElement>();
  const fnScrollIntoView = () => {
    eRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  };
  defineExpose({ scrollIntoView: fnScrollIntoView });
  onUpdated(() => {
    if (props.scrollIntoView) {
      fnScrollIntoView();
    }
  });

  /**
   * 目前是弹窗形式，也许可以做成 Popover？
   */
  const visible = ref(false);

  // v-model 值
  const humanScoreModel = ref(0);

  const handleManualCorrection = () => {};
</script>

<template>
  <section
    ref="eRef"
    class="relative"
  >
    <div
      :class="`flex justify-between gap-4 mb-4 transition ${false && 'opacity-25'}`"
      :inert="false"
    >
      <!-- left: the question area -->
      <div class="flex-1 grid">
        <div class="flex gap-2 items-start mb-2">
          <div class="bg-gray-100 text-sm text-center aspect-1/1 h-1.3rem line-height-1.3rem align-middle rounded-lg select-none mt-1">
            {{ question.order }}
          </div>
          <h3 class="my-1">{{ question.title }}</h3>
        </div>

        <div class="px-1">
          <a-image
            v-if="question.url"
            :src="question.url"
          />

          <a-typography-paragraph v-if="question.studentAnswer">
            {{ question.studentAnswer }}
          </a-typography-paragraph>
          <a-typography-paragraph
            v-else
            type="warning"
            >{{ '<未作答>' }}
          </a-typography-paragraph>
        </div>

        <!-- TODO:参考答案后端未给 -->
        <!-- <a-typography>
          <a-typography-paragraph blockquote>
            <strong>参考答案</strong>
            <br />
            <a-typography-paragraph :ellipsis="{ rows: 3, expandable: true }">
              {{ '参考答案'.repeat(99) }}
              <template #expand-node="{ expanded }">
                {{ expanded ? '折叠' : '展开' }}
              </template>
            </a-typography-paragraph>
          </a-typography-paragraph>
        </a-typography> -->
      </div>

      <!-- right: the operation panel -->
      <div>
        <div class="flex items-center gap-2">
          <div class="font-thin text-xl text-gray">{{ 'AI' }}</div>
          <div class="py-4 flex justify-around items-center text-2xl">
            <span>{{ question.score }}</span>
            <span class="text-4xl font-thin">/</span>
            <span>{{ question.totalScore }}</span>
          </div>
        </div>
        <div class="grid">
          <a-button status="success">复审通过</a-button>
          <a-button
            status="warning"
            @click="() => (visible = true)"
            >人工批改</a-button
          >
        </div>
      </div>
    </div>
    <a-divider></a-divider>

    <a-card
      v-if="false"
      class="absolute top-50% left-50% translate-[-50%]"
    >
    </a-card>

    <a-modal
      :visible="visible"
      ok-text="确认"
      cancel-text="取消"
      unmount-on-close
      @ok="handleManualCorrection"
      @cancel="() => (visible = false)"
    >
      <template #title>人工批改</template>
      <a-form :model="{}">
        <a-form-item label="AI 判定分数">
          <a-typography-text>{{ question.score }} / {{ question.totalScore }}</a-typography-text>
        </a-form-item>
        <a-form-item label="人工判定分数">
          <a-input-number
            v-model="humanScoreModel"
            placeholder="请输入..."
            mode="button"
            size="large"
            :min="0"
            :max="question.totalScore"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </section>
</template>

<style scoped>
  :deep(img) {
    max-width: 100%;
  }
</style>
