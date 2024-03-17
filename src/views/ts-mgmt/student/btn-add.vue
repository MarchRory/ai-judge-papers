<script setup lang="ts">
  /**
   * TODO: WIP
   * 此组件是一个按钮，点击后弹出全屏模态窗
   */
  import { ref, reactive } from 'vue';
  import { createStudent, Student, fieldsDescription } from '@/api/student';

  const title = '添加学生';
  // form
  const form = reactive<Omit<Student, 'id'>>({
    class: '',
    number: '',
    name: '',
    sex: 1,
    grade: '',
    graduation: 1,
    state: 1,
  });

  // modal
  const modalVisible = ref(false);

  async function handleClick() {
    try {
      await createStudent(form);
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
    <!-- <pre>{{ form }}</pre> -->
    <!-- TODO: 测试 -->
    <a-form
      :model="form"
      layout="vertical"
      ok-text="确认添加"
    >
      <a-form-item
        field="name"
        :label="fieldsDescription.name"
        tooltip="学生姓名"
      >
        <a-input
          v-model="form.name"
          placeholder="请输入姓名..."
        />
      </a-form-item>
      <a-form-item
        field="number"
        :label="fieldsDescription.number"
        tooltip="学生学号"
      >
        <a-input
          v-model="form.number"
          placeholder="请输入学号..."
        />
      </a-form-item>
      <a-form-item
        field="sex"
        :label="fieldsDescription.sex"
        tooltip="学生性别"
      >
        <a-switch
          :model-value="Boolean(form.sex)"
          @change="(v) => (form.sex = Number(v))"
        >
          <template #checked>女</template>
          <template #unchecked>男</template>
        </a-switch>
      </a-form-item>
      <a-form-item
        field="class"
        :label="fieldsDescription.class"
        tooltip="学生班级"
      >
        <a-input
          v-model="form.class"
          placeholder="请输入班级..."
      /></a-form-item>
      <a-form-item
        field="grade"
        tooltip="学生年级"
        label="年级"
      >
        <a-input
          v-model="form.grade"
          placeholder="请输入年级..."
      /></a-form-item>
      <!-- TODO -->
      <a-form-item
        field="graduation"
        :label="fieldsDescription.graduation"
        tooltip="graduation"
      >
        <a-input-number
          v-model="form.graduation"
          placeholder="请输入graduation..."
          mode="button"
        />
      </a-form-item>
      <a-form-item
        field="state"
        :label="fieldsDescription.state"
        tooltip="状态"
      >
        <a-select
          v-model="form.state"
          placeholder="请选择"
        >
          <a-option :value="0">禁用</a-option>
          <a-option :value="1">启用</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
