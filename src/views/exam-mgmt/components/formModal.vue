<script setup lang="ts">
  import { reactive, ref, computed } from 'vue';
  import { createExamApi, updateExamApi } from '@/api/exam';
  import type { ExamFormData } from '@/api/exam';
  import { cloneDeep } from 'lodash';
  import { Message } from '@arco-design/web-vue';

  interface Props {
    visible: boolean;
    FormData: ExamFormData;
    create: 'create' | 'edit';
  }
  // 组件通信定义
  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    FormData: () => {
      return {
        description: '',
        name: '',
        state: 0,
        subject: 0,
        time: 0,
        timeLimit: 0,
        type: 0,
      };
    },
    create: 'create',
  });
  const emits = defineEmits<{
    (e: 'onSucces'): void;
    (e: 'onCancel'): void;
    (e: 'onFail'): void;
  }>();

  // 接收表单
  const formInfo = ref<ExamFormData>({
    description: '',
    name: '',
    state: 0,
    subject: 0,
    time: 0,
    timeLimit: 0,
    type: 0,
  });
  const formRef = ref();
  const okLoading = ref(false);
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        formInfo.value = cloneDeep(props.FormData);
      } else {
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.resetFields();
            if (Object.prototype.hasOwnProperty.call(formInfo.value, 'id')) {
              delete formInfo.value.id;
            }
          }
        }, 500);
      }
    }
  );
  // select数据

  // 数据提交
  const submit = () => {
    const submitFn = props.create === 'create' ? createExamApi : updateExamApi;
    submitFn(formInfo.value)
      .then((res) => {
        const { code, message } = res;
        if (code === 200) {
          Message.success('考试创建成功');
          emits('onSucces');
        } else {
          Message.error(message);
          emits('onFail');
        }
      })
      .catch(() => {
        Message.error(message);
        emits('onFail');
      });
  };
</script>

<template>
  <a-modal
    :visible="props.visible"
    :title="`${create === 'create' ? '创建' : '更新'}考试`"
    :mask-closable="false"
    :ok-loading="okLoading"
    @ok="submit"
    @cancel="emits('onCancel')"
  >
    <a-form
      ref="formRef"
      :model="FormData"
    >
      <a-form-item
        field="name"
        label="学科"
      >
        <a-input v-model="FormData.name" />
      </a-form-item>
      <a-form-item
        field="description"
        label="其他信息"
      >
        <a-input v-model="FormData.description" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
