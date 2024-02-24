<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { createTeacher, Teacher } from '@/api/teacher';
  // createTeacher({ id: 1, name: 'name', phone: '10086', number: '666', graduation: 3, sex: 1, state: 0 });

  // form
  const form = reactive<Teacher>({
    id: 1,
    name: '',
    phone: '',
    number: '',
    graduation: 0,
    sex: 0,
    state: 1,
  });

  // modal
  const modalVisible = ref(false);

  async function handleClick() {
    try {
      await createTeacher(form);
      return true;
    } catch {
      return false;
    }
  }
</script>

<template>
  <a-button
    type="primary"
    @click="modalVisible = true"
  >
    添加教师
    <template #icon>
      <icon-plus />
    </template>
  </a-button>
  <!-- modal -->

  <a-modal
    v-model:visible="modalVisible"
    fullscreen
    @before-ok="handleClick"
  >
    <template #title> 添加 </template>
    <a-form :model="form">
      <a-form-item
        field="name"
        tooltip="教师姓名"
        label="姓名"
      >
        <a-input
          v-model="form.name"
          placeholder="请输入姓名..."
        />
      </a-form-item>
      <a-form-item
        field="phone"
        tooltip="教师手机号"
        label="手机号"
      >
        <a-input
          v-model="form.phone"
          placeholder="请输入手机号..."
        />
      </a-form-item>
      <a-form-item
        field="sex"
        tooltip="教师姓名"
        label="性别"
      >
        <a-switch v-model="form.sex">
          <template #checked>女</template>
          <template #unchecked>男</template>
        </a-switch>
      </a-form-item>
      <a-form-item
        field="number"
        tooltip="教师教工号"
        label="教工号"
      >
        <a-input
          v-model="form.number"
          placeholder="请输入教工号..."
      /></a-form-item>
    </a-form>
  </a-modal>
</template>
