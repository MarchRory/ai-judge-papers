<template>
  <!-- 拆分 -->
  <a-button
    type="primary"
    @click="openModal"
  >
    <template #icon>
      <icon-plus />
    </template>
    <template #default> 添加 </template>
  </a-button>
  <a-modal
    v-model:visible="visible"
    :mask-closable="false"
    :esc-to-close="false"
    title="添加题目"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :model="form"
    >
      <a-form-item
        field="title"
        label="题干"
      >
        <a-textarea
          v-model="form.title"
          class="max-h-8em"
        />
      </a-form-item>
      <a-form-item
        field="subject"
        label="科目"
      >
        <a-select
          v-model="form.subject"
          :options="subjectOptions.slice(1, subjectOptions.length)"
          :field-names="{ label: 'name', value: 'id' }"
        />
      </a-form-item>
      <a-form-item
        field="expectedDifficulty"
        label="难易度"
      >
        <a-input-number
          v-model="form.expectedDifficulty"
          :min="1"
          :max="23"
          :precision="0"
          mode="button"
        ></a-input-number>
      </a-form-item>
      <a-form-item
        field="source"
        label="来源"
      >
        <a-input
          v-model="form.source"
          placeholder="题目链接"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive, ref, inject, watch } from 'vue';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { createQuestion } from '@/api/question';

  const subjectOptions = inject('subjectOptions') as any;
  const visible = ref(false);
  const formRef = ref<FormInstance>();
  const openModal = () => {
    visible.value = true;
  };

  const form = reactive<{
    title: string;
    content: string;
    subject: number | null;
    state: number;
    expectedDifficulty: number;
    source: string;
  }>({
    title: '',
    content: '',
    subject: null,
    state: 0,
    expectedDifficulty: 0,
    source: '',
  });

  function addQuestion() {
    createQuestion(form).then((res: { message: string }) => {
      const { message } = res;
      if (message === 'success') {
        Message.success('添加成功');
      }
    });
  }

  const handleCancel = () => {
    visible.value = false;
  };
  const handleOk = async () => {
    addQuestion();
  };

  watch(
    () => visible.value,
    (newVal) => {
      if (!newVal) {
        formRef.value?.resetFields();
      }
    },
  );
</script>
