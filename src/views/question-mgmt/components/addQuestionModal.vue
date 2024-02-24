<template>
  <!-- 拆分 -->
  <a-modal
    v-model:visible="isShow"
    title="添加题目"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form :model="form">
      <a-form-item
        field="title"
        label="题目"
      >
        <a-input v-model="form.title" />
      </a-form-item>
      <a-form-item
        field="content"
        label="内容"
      >
        <a-input v-model="form.content" />
      </a-form-item>
      <a-form-item
        field="subject"
        label="科目"
      >
        <a-input v-model="form.subject"></a-input>
      </a-form-item>
      <a-form-item
        field="state"
        label="题目状态"
      >
        <a-input v-model="form.state"></a-input>
      </a-form-item>
      <a-form-item
        field="expectedDifficulty"
        label="难易度"
      >
        <a-input v-model="form.expectedDifficulty"></a-input>
      </a-form-item>
      <a-form-item
        field="source"
        label="来源"
      >
        <a-input v-model="form.source"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive, ref, watch, toRaw } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { createQuestion } from '@/api/question';

  const props = defineProps({
    visible: {
      required: true,
      type: Boolean,
    },
  });

  const form = reactive<{
    title: string;
    content: string;
    subject: string;
    state: string;
    expectedDifficulty: string;
    source: string;
  }>({
    title: '',
    content: '',
    subject: '',
    state: '',
    expectedDifficulty: '',
    source: '',
  });

  const emit = defineEmits(['update:visible']);

  const isShow = ref<any>(props.visible);

  watch(
    () => props.visible,
    (newValue: boolean) => {
      isShow.value = newValue;
    }
  );

  const handleCancel = () => {
    isShow.value = false;
    emit('update:visible', isShow.value);
  };
  const handleOk = async () => {
    isShow.value = false;
    emit('update:visible', isShow.value);
  };
</script>
