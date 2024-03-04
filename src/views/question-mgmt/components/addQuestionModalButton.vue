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

  const visible = ref(false);

  const openModal = () => {
    visible.value = true;
  };

  const form = reactive<{
    title: string;
    content: string;
    subject: number;
    state: number;
    expectedDifficulty: number;
    source: string;
  }>({
    title: '',
    content: '',
    subject: 0,
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
</script>
