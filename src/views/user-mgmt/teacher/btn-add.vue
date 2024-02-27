<script setup lang="ts">
  /**
   * TODO: WIP
   * 此组件是一个按钮，点击后弹出全屏模态窗
   */
  import { ref, reactive } from 'vue';
  import { createTeacher, Teacher } from '@/api/teacher';

  const title = '添加教师';
  // form
  const form = reactive<Omit<Teacher, 'id'>>({
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
    >
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
        tooltip="教师性别"
        label="性别"
      >
        <a-switch @change="(v) => (form.sex = Number(v))">
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
      <a-form-item
        field="state"
        tooltip="状态"
        label="状态"
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
