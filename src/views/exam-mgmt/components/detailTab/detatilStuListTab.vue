<script setup lang="ts">
  import { getJoinExamClassListApi, type ExamListItem, type JoinExamClassItem } from '@/api/exam';
  import { getScoreList, StuScoreItem } from '@/api/judge';
  import { ref, inject, watch, type Ref } from 'vue';
  import useTable from '@/hooks/table/useTable';
  import { DescData, Message } from '@arco-design/web-vue';
  import { debounce } from 'lodash';
  import { ExamStateEnum } from '../../config';

  const { examDetail, currentState } = inject('examDetail') as { examDetail: Ref<ExamListItem>; currentState: Ref<ExamStateEnum> };
  const emits = defineEmits<{
    (e: 'onOpenPaperCfg'): void;
    (e: 'toJudge'): void;
    (e: 'onClassChange', classId: number, className: string, newStuList: StuScoreItem[]): void;
  }>();

  const otherSearchParams = { key: '', classId: 0, order: true, examId: examDetail.value.id, pageSize: 500 };
  const {
    key,
    classId,
    order,
    loading,
    tableData: stuList,
    loadList: loadStuScoreList,
    setLoading,
  } = useTable<StuScoreItem, typeof otherSearchParams>({
    requestApi: getScoreList,
    otherSearchParams,
  });
  const stuDescDataFormat = (stuScoreItem: StuScoreItem): DescData[] => {
    return [
      { label: '班级', value: stuScoreItem.className },
      { label: '学号', value: stuScoreItem.studentNumber },
      { label: '得分', value: `${stuScoreItem.score}` },
      { label: '排位', value: `${stuScoreItem.order}` },
    ];
  };

  const joinClassList = ref<{ label: string; value: number }[]>([]);
  const joinClassTotal = ref(0);
  const getJoinClass = (isInit = false) => {
    getJoinExamClassListApi(+examDetail.value.id).then((res) => {
      const { list, total } = res.data;
      joinClassList.value = list.map(({ classId, className }) => {
        return {
          label: className,
          value: classId,
        };
      });
      if (isInit && total) {
        classId.value = list[0].classId;
        loadStuScoreList();
      }
      // joinClassList.value.unshift({
      //   label: '全部',
      //   value: 0,
      // });
      joinClassTotal.value = total;
      if (!total) {
        Message.error('本堂考试没有班级参加');
      }
    });
  };

  watch(
    () => stuList.value,
    debounce((newVal) => {
      const className = joinClassList.value.find((item) => item.value === classId.value)?.label || '暂无班级';
      emits('onClassChange', classId.value, className, newVal);
    }),
    { deep: true },
  );

  const setupComp = () => {
    if (currentState.value === ExamStateEnum.complete) {
      getJoinClass(true);
    }
  };

  setupComp();
</script>

<template>
  <div class="w-full relative">
    <a-result
      v-if="currentState < ExamStateEnum.complete"
      class="abs-center"
      status="warning"
      title="提示"
    >
      <template #subtitle>
        {{ currentState < ExamStateEnum.aiJudging ? '请完成考生答卷录入, 以及试卷评阅后, 再进行查看' : '请提交全部阅卷结果后查看' }}
      </template>
      <template #extra>
        <a-space>
          <a-button
            v-if="currentState < ExamStateEnum.aiJudging"
            type="primary"
            @click="emits('onOpenPaperCfg')"
          >
            去导入考生答题卡
          </a-button>
          <a-button
            v-else-if="[ExamStateEnum.aiDone, ExamStateEnum.checking].includes(currentState)"
            type="primary"
            @click="emits('toJudge')"
          >
            去复审
          </a-button>
        </a-space>
      </template>
    </a-result>
    <div
      v-else
      class="h-4xl overflow-auto"
    >
      <a-card
        title="参考学生"
        class="h-full"
      >
        <template #extra>
          <a-select
            v-model:model-value="classId"
            :options="joinClassList"
            @change="loadStuScoreList()"
          >
          </a-select>
        </template>
        <div class="h-[50rem] overflow-auto">
          <a-list
            :loading="loading"
            :data="stuList"
            :grid-props="{ gutter: 8, span: 12 }"
            bordered
          >
            <template #item="{ item }">
              <a-card
                :title="`${item.studentName}`"
                class="mb-4"
              >
                <a-descriptions
                  :column="2"
                  :data="stuDescDataFormat(item)"
                  bordered
                ></a-descriptions>
                <a-image
                  :src="item.url"
                  fit="contain"
                  width="100%"
                ></a-image>
              </a-card>
            </template>
          </a-list>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="less">
  .abs-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 50%);
  }
  :deep(.arco-select-view-single) {
    width: 200px;
  }
</style>
