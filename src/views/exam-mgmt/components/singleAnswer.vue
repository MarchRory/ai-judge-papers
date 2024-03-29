<script setup lang="ts">
  /**
   * 单个试题
   */

  import { ref, computed } from 'vue';

  interface ModelValue {
    /**
     * AI 判定分数，来自服务端
     */
    aiScore: number;
    // TODO: 初始化值将从本地缓存获取，父组件传入之
    /**
     * 人工分数，若为 undefined，则是未判分
     */
    totalScore: number;
    /**
     * 复审通过
     */
    reviewPassed: boolean;
    // 以下值应该是静态的，也就是它们不会被修改
    // 但是为了方便传值，一起加入 modelValue
    humanScore: number | undefined;
    /**
     * 序号，注意要从 1 开始（也许也可以放进 modelValue 里？）
     */
    number: number;
  }

  const props = defineProps<{
    modelValue: ModelValue;
  }>();

  const emit = defineEmits<{ 'update:modelValue': [modelValue: ModelValue] }>();

  /**
   * 目前是弹窗形式，也许可以做成 Popover？
   */
  const visible = ref(false);

  // v-model 值
  const humanScoreModel = ref(0);
  // 表示当前题目已经判定
  const done = computed(() => props.modelValue.reviewPassed || typeof props.modelValue.humanScore !== 'undefined');

  function handlePassReview() {
    emit('update:modelValue', {
      ...props.modelValue,
      reviewPassed: true,
    });
  }

  function handleManualCorrection() {
    emit('update:modelValue', {
      ...props.modelValue,
      reviewPassed: true,
      humanScore: humanScoreModel.value,
    });
    visible.value = false;
  }

  function reset() {
    emit('update:modelValue', {
      ...props.modelValue,
      reviewPassed: false,
      humanScore: undefined,
    });
  }
</script>

<template>
  <section class="relative">
    <div
      :class="`flex justify-between gap-4 mb-4 transition ${done && 'opacity-25'}`"
      :inert="done"
    >
      <!-- left: the question area -->
      <div class="flex-1">
        <div class="grid grid-cols-[auto_1fr] gap-2 items-center mb-2">
          <div class="bg-gray-100 text-sm text-center aspect-1/1 h-1.3rem line-height-1.3rem align-middle rounded-lg select-none">
            {{ props.modelValue.number }}
          </div>
          <strong>Maybe title?</strong>
        </div>

        <a-typography-text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis possimus optio modi, sit facilis aliquid sapiente aperiam
          nulla, laboriosam illo iste veniam voluptatem accusantium iure nisi ex, repudiandae consequatur? Magni?
        </a-typography-text>
      </div>

      <!-- right: the operation panel -->
      <div>
        <div class="flex items-center gap-2">
          <div class="font-thin text-xl text-gray">{{
            props.modelValue.reviewPassed && typeof props.modelValue.humanScore !== 'undefined' ? '人工' : 'AI'
          }}</div>
          <div class="py-4 flex justify-around items-center text-2xl">
            <span>{{
              props.modelValue.reviewPassed && typeof props.modelValue.humanScore !== 'undefined'
                ? props.modelValue.humanScore
                : props.modelValue.aiScore
            }}</span>
            <span class="text-4xl font-thin">/</span>
            <span>{{ props.modelValue.totalScore }}</span>
          </div>
        </div>
        <div class="grid">
          <a-button
            status="success"
            @click="handlePassReview"
            >复审通过</a-button
          >
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
      v-if="done"
      class="absolute top-50% left-50% translate-[-50%]"
    >
      <div class="flex items-center gap-4">
        <a-typography-text v-if="typeof props.modelValue.humanScore !== 'undefined'"
          >已 <a-typography-text type="warning">人工</a-typography-text> 判定为
          <strong>{{ props.modelValue.humanScore }}</strong> 分</a-typography-text
        >
        <a-typography-text v-else
          >已确认 <a-typography-text type="success">AI</a-typography-text> 判定为
          <strong>{{ props.modelValue.aiScore }}</strong> 分</a-typography-text
        >
        <a-link @click="reset">取消</a-link>
      </div>
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
          <a-typography-text>{{ props.modelValue.aiScore }} / {{ props.modelValue.totalScore }}</a-typography-text>
        </a-form-item>
        <a-form-item label="人工判定分数">
          <a-input-number
            v-model="humanScoreModel"
            placeholder="请输入..."
            mode="button"
            size="large"
            :min="0"
            :max="props.modelValue.totalScore"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </section>
</template>
