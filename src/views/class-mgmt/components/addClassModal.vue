<template>
  <!-- 拆分 -->
  <a-modal
    v-model:visible="isShow"
    title="添加班级"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form :model="form">
      <a-form-item
        field="name"
        label="班级名称"
      >
        <a-input v-model="form.name" />
      </a-form-item>
      <a-form-item
        field="grade"
        label="年级"
      >
        <a-input v-model="form.grade" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive, ref, watch, toRaw } from 'vue';
  import { createClass } from '@/api/class';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps({
    visible: {
      required: true,
      type: Boolean,
    },
  });

  const form = reactive<{
    name: string;
    grade: string;
    teacherId: number;
  }>({
    name: '',
    grade: '',
    teacherId: 0,
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
    console.log(form);
    const { message } = await createClass(toRaw(form));
    console.log(message);
    if (message === 'success') {
      Message.success('添加成功');
      isShow.value = false;
      emit('update:visible', isShow.value);
    } else {
      Message.error('添加失败');
    }
  };
</script>
