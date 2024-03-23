<script setup lang="ts">
  /**
   * 此组件是一个按钮，点击后弹出模态窗
   */
  import { ref, reactive } from 'vue';
  import { type FileItem, Message } from '@arco-design/web-vue';
  import { uploadQuestion } from '@/api/question';

  const emit = defineEmits<{
    /**
     * 上传成功，那么就需要重新请求列表
     */
    success: [];
  }>();

  // modal
  const title = '批量导入';
  const modalVisible = ref(false);

  const form = reactive<{ sheet: string }>({ sheet: '' });
  /**
   * 注意我们不使用arco自带的上传，因此只需要获得 File 对象即可
   */
  const file = ref<FileItem>();

  async function handleUpload(): Promise<boolean> {
    if (!file.value?.file) {
      Message.error('请先选择文件！');
      return false;
    }
    try {
      await uploadQuestion(file.value.file, form.sheet);
      Message.info('上传成功');
      emit('success');
      return true;
    } catch {
      return false;
    }
  }

  const onDelete = () => {
    file.value = undefined;
  };

  const onChange = (_: unknown, currentFile: FileItem) => {
    file.value = currentFile;
  };
</script>

<template>
  <a-button @click="modalVisible = true">{{ title }}</a-button>
  <!-- modal -->

  <a-modal
    v-model:visible="modalVisible"
    ok-text="确认导入"
    @before-ok="handleUpload"
  >
    <template #title>{{ title }}</template>

    <a-form
      :model="form"
      layout="vertical"
    >
      <a-form-item
        field="sheet"
        label="Sheet名称（可选）"
        tooltip="Excel表格文件的Sheet名称"
      >
        <a-input
          v-model="form.sheet"
          placeholder="请输入..."
        />
      </a-form-item>
      <a-form-item
        field="file"
        label="Excel文件"
        tooltip="此处上传Excel文件（.xlsx）"
      >
        <a-alert
          v-if="file"
          :show-icon="false"
        >
          <div class="flex justify-between items-center gap-4">
            {{ file.name }}
            <a-button
              size="small"
              type="text"
              status="danger"
              @click="onDelete"
              >重新选择</a-button
            >
          </div>
        </a-alert>

        <a-upload
          v-else
          list-type="text"
          :file-list="file ? [file] : []"
          :show-file-list="false"
          draggable
          :auto-upload="false"
          :limit="1"
          @change="onChange"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
