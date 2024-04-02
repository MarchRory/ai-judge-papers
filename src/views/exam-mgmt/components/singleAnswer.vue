<script setup lang="ts">
  /**
   * 单个试题
   */

  import { ref, onUpdated } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { PaperDetail, updateJudge } from '@/api/judge';
  import { Question } from '@/api/question';
  import ActionButton from './actionButton.vue';

  const props = defineProps<{
    compositeQuestion: PaperDetail & Question;
    /** 滚动当前元素到视窗顶部 */
    scrollIntoView?: boolean;
  }>();
  const question = props.compositeQuestion;

  const emit = defineEmits<{
    modify: [{ id: number; score: number; result: string }];
  }>();

  const el = ref<HTMLElement>();
  const fnScrollIntoView = () => {
    el.value?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  };
  defineExpose({ scrollIntoView: fnScrollIntoView });
  onUpdated(() => {
    if (props.scrollIntoView) {
      fnScrollIntoView();
    }
  });

  const modifiedResult = ref(question.result);
  const modifiedScore = ref(question.score);
  const emitModify = () =>
    emit('modify', {
      id: question.id,
      score: modifiedScore.value,
      result: modifiedResult.value,
    });
  const handleModifyResult = async () => {
    const res = await updateJudge({ id: question.id, result: modifiedResult.value });
    if (res.success) {
      Message.success('修改成功');
      emitModify();
    } else {
      Message.error('修改失败');
    }
  };
  const handleModifyScore = async () => {
    const res = await updateJudge({ id: question.id, score: modifiedScore.value });
    if (!res.success) throw new Error('失败');
    emitModify();
  };
</script>

<template>
  <section
    ref="el"
    class="relative"
  >
    <div class="flex justify-between gap-4 mb-4">
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

        <a-typography class="relative group">
          <a-typography-paragraph
            blockquote
            class="transition group-hover:bg-stone-50 cursor-pointer"
          >
            <div class="my-1">
              <strong>评语</strong>
            </div>
            <a-typography-paragraph
              :type="question.result ? '' : 'warning'"
              :ellipsis="{ rows: 3, expandable: true }"
            >
              <template #default> {{ question.result || '<无>' }}</template>
              <template #expand-node="{ expanded }">
                {{ expanded ? '折叠' : '展开' }}
              </template>
            </a-typography-paragraph>
          </a-typography-paragraph>
          <a-popconfirm
            position="lt"
            @before-ok="handleModifyResult"
          >
            <template #icon>
              <div class="flex flex-col translate-y-10">
                <small
                  v-for="(char, i) in `修改评语`"
                  :key="i"
                  >{{ char }}</small
                >
              </div>
            </template>

            <template #content>
              <a-textarea
                v-model="modifiedResult"
                :placeholder="`修改第${question.order}题的评语`"
                allow-clear
                :auto-size="{ minRows: 5 }"
                class="min-w-40vw"
              />
            </template>
            <a-button
              type="text"
              class="absolute inset-[4px_0_auto_auto] transition opacity-0 group-hover:opacity-100"
              @click="handleModifyScore"
              >修改评语
            </a-button>
          </a-popconfirm>
        </a-typography>
      </div>

      <!-- right: the operation panel -->
      <div>
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="font-thin text-xl text-gray">当前得分</div>
          <div class="flex justify-around items-center text-2xl">
            <span>{{ question.score }}</span>
            <span class="text-4xl font-thin">/</span>
            <span>{{ question.totalScore }}</span>
          </div>
        </div>
        <div class="grid mt-4">
          <a-input-number
            v-model="modifiedScore"
            class="max-w-108px"
            placeholder="请输入..."
            mode="button"
            :min="0"
            :max="question.totalScore"
          />
          <action-button
            status="warning"
            :disabled="modifiedScore === question.score"
            @action="handleModifyScore"
          >
            修改得分
          </action-button>
        </div>
      </div>
    </div>
    <a-divider></a-divider>
  </section>
</template>

<style scoped>
  :deep(img) {
    max-width: 100%;
  }
</style>
