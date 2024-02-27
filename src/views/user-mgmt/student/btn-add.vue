<script setup lang="ts">
  /**
   * TODO: WIP
   * 此组件是一个按钮，点击后弹出全屏模态窗
   */
  import { ref, reactive } from 'vue';
  import { createStudent, Student } from '@/api/student';

  const title = '添加学生';
  // form
  const form = reactive<Omit<Student, 'id'>>({
    classId: 2,
    number: '123',
    name: '',
    sex: 1,
    grade: '123',
    graduation: 1,
    state: 1,
  });

  // modal
  const modalVisible = ref(false);

  async function handleClick() {
    try {
      await createStudent(form);
      // createTeacher({ id: 1, name: 'name', phone: '10086', number: '666', graduation: 3, sex: 1, state: 0 });

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
    {{ title }}
    <template #icon>
      <icon-plus />
    </template>
  </a-button>
  <!-- modal -->

  <a-modal
    v-model:visible="modalVisible"
    fullscreen
    ok-text="确认添加"
    @before-ok="handleClick"
  >
    <template #title> {{ title }} </template>
    <a-alert class="my-4">输入完成后，请点击右下角确认添加</a-alert>
    <!-- TODO: 测试 -->
    <pre>{{ form }}</pre>
    <!-- TODO: 测试 -->
    <a-form
      :model="form"
      layout="vertical"
      ok-text="确认添加"
    >
      <a-form-item
        field="name"
        tooltip="学生姓名"
        label="姓名"
      >
        <a-input
          v-model="form.name"
          placeholder="请输入姓名..."
        />
      </a-form-item>
      <a-form-item
        field="phone"
        tooltip="学生手机号"
        label="手机号"
      >
        <a-input
          v-model="form.phone"
          placeholder="请输入手机号..."
        />
      </a-form-item>
      <a-form-item
        field="sex"
        tooltip="学生性别"
        label="性别"
      >
        <a-switch v-model="form.sex">
          <template #checked>女</template>
          <template #unchecked>男</template>
        </a-switch>
      </a-form-item>
      <a-form-item
        field="number"
        tooltip="学生学号"
        label="学号"
      >
        <a-input
          v-model="form.number"
          placeholder="请输入学号..."
      /></a-form-item>
    </a-form>
  </a-modal>
</template>
