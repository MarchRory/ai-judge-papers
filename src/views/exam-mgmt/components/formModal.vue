<script setup lang="ts">
  import { reactive, ref, computed } from 'vue';
  import { createExamApi, updateExamApi } from '@/api/exam';
  import type { ExamFormData } from '@/api/exam';
  import { SubjectItem, getSubjectListAPI } from '@/api/subject';
  import { cloneDeep } from 'lodash';
  import { FormInstance, Message, SelectOptionData } from '@arco-design/web-vue';

  interface Props {
    visible: boolean;
    formData: ExamFormData;
    create: 'create' | 'edit';
  }
  // 组件通信定义
  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    formData: () => {
      return {
        description: '',
        name: '',
        state: undefined,
        subject: undefined,
        time: undefined,
        timeLimit: 0,
        type: undefined,
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
  const initForm: ExamFormData = {
    description: '',
    name: '',
    state: undefined,
    subject: undefined,
    time: undefined,
    timeLimit: 0,
    type: undefined,
  };
  const formInfo = ref<ExamFormData & { examTimeLength?: number }>({ ...props.formData, examTimeLength: 60 });
  const formRef = ref<FormInstance>();
  const okLoading = ref(false);
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        if (props.create === 'edit') {
          const timeLength = ((props.formData.timeLimit - (props.formData.time as number)) / 60000).toFixed();
          formInfo.value = { ...props.formData, examTimeLength: +timeLength };
        } else {
          formInfo.value.examTimeLength = 60;
        }
      } else {
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.resetFields();
            formInfo.value.timeLimit = 0;
            if (Object.prototype.hasOwnProperty.call(formInfo.value, 'id')) {
              delete formInfo.value.id;
            }
          }
        }, 500);
      }
    }
  );

  // select数据
  const subjectList = ref<SelectOptionData[]>([]);
  const requestSelectData = () => {
    getSubjectListAPI({ page: 1, pageSize: 100, key: '' }).then((res) => {
      const { list } = res.data;
      subjectList.value = list.map((item) => {
        return { label: item.name, value: item.id };
      });
    });
  };

  // 时间选择

  // 数据提交
  const submitLoading = ref(false);
  const submit = () => {
    submitLoading.value = true;
    const submitFn = props.create === 'create' ? createExamApi : updateExamApi;
    const timeLimit = (formInfo.value.time as number) + (formInfo.value.examTimeLength as number) * 60 * 1000;
    formInfo.value.timeLimit = timeLimit;
    delete formInfo.value.examTimeLength;
    submitFn({ ...formInfo.value, state: 1 })
      .then((res) => {
        const { code, message } = res;
        if (code === 200) {
          Message.success('考试创建成功');
          submitLoading.value = false;
          emits('onSucces');
        } else {
          Message.error(message);
          emits('onFail');
        }
      })
      .finally(() => {
        submitLoading.value = false;
      });
  };

  // 组件初始化、获取数据
  const setupComp = () => {
    requestSelectData();
  };

  setupComp();
</script>

<template>
  <a-modal
    :visible="props.visible"
    :title="`${create === 'create' ? '创建' : '更新'}考试`"
    :mask-closable="false"
    :ok-loading="okLoading"
    :footer="false"
    @cancel="emits('onCancel')"
  >
    <a-form
      ref="formRef"
      :model="formInfo"
      @submit-success="submit"
    >
      <a-form-item
        field="name"
        label="考试名"
        :rules="[{ required: true, message: '请输入考试名' }]"
      >
        <a-input
          v-model:model-value="formInfo.name"
          placeholder="请输入考试名"
        />
      </a-form-item>
      <a-form-item
        field="type"
        label="科类"
        :rules="[{ required: true, message: '请选择学科类别' }]"
      >
        <a-select
          v-model:model-value="formInfo.type"
          :options="[
            { value: 0, label: '文' },
            { value: 1, label: '理' },
          ]"
          placeholder="请选择学科类别"
        >
          <template #label="{ data }">
            <span>{{ data.label }}</span>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        field="time"
        label="开考时间"
        :rules="[{ required: true, message: '请设置开考时间' }]"
      >
        <a-date-picker
          v-model:model-value="formInfo.time"
          show-time
          :show-now-btn="false"
          size="large"
          :day-start-of-week="1"
          value-format="timestamp"
          placeholder="请选择开考时间"
          format="YYYY-MM-DD HH:mm"
        />
      </a-form-item>
      <a-form-item
        name="examTimeLength"
        label="考试时长"
        :rules="[{ required: true, message: '请安排考试时长' }]"
      >
        <a-input-number
          v-model:model-value="formInfo.examTimeLength"
          placeholder="考试时长"
          allow-clear
          hide-button
          model-event="input"
          :max="300"
        >
          <template #append> 分钟 </template>
        </a-input-number>
      </a-form-item>
      <a-form-item
        field="subject"
        label="学科"
        :rules="[{ required: true, message: '请选择学科' }]"
      >
        <a-select
          v-model:model-value="formInfo.subject"
          :options="subjectList"
          placeholder="请选择学科"
        >
          <template #label="{ data }">
            <span>{{ data.label }}</span>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        field="description"
        label="其他信息"
      >
        <a-textarea
          v-model:model-value="formInfo.description"
          placeholder="考试其他附注信息"
          :max-length="{ length: 300, errorOnly: true }"
          allow-clear
          show-word-limit
          :auto-size="{
            minRows: 3,
            maxRows: 7,
          }"
          :word-slice="(values, maxLength) => values.slice(0, maxLength)"
        />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button
            html-type="submit"
            type="primary"
            :loading="submitLoading"
            >{{ create === 'create' ? '创建' : '更新' }}</a-button
          >
          <a-button @click="emits('onCancel')">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>