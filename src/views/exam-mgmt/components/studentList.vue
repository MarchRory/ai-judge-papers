<script setup lang="ts">
  import { getReview } from '@/api/judge';
  import { onMounted, ref } from 'vue';

  const props = defineProps<{
    examId: number;
  }>();

  const ids = ref<number[]>();

  onMounted(async () => {
    const { data } = await getReview({
      examId: props.examId,
      state: 2,
      pageSize: 9999, // get all
    });
    ids.value = data.list;
  });
</script>

<template>
  <a-spin
    :loading="!ids"
    tip="加载中，请稍候..."
  >
    <a-list
      :max-height="240"
      scrollbar
    >
      <template #header>待判题列表</template>

      <a-list-item
        v-for="id of ids"
        :key="id"
      >
        <div class="flex gap-2">
          <span>
            {{ id }}
          </span>
          <a-button>阅卷</a-button>
          <a-button>提交阅卷</a-button>
        </div>
      </a-list-item>
    </a-list>
  </a-spin>
</template>
