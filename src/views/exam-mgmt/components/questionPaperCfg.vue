<script setup lang="ts">
  import { ref, inject, computed, type Ref } from 'vue';
  import { sum } from 'lodash';
  import { type ExamListItem, getProblemList, uploadExamTemplateApi } from '@/api/exam';
  import useLoading from '@/hooks/loading';
  import { Question } from '@/api/question';
  import { DescData } from '@arco-design/web-vue/es/descriptions/interface';
  import dayjs from 'dayjs';
  import { RequestOption } from '@arco-design/web-vue/es/upload';
  import { Message } from '@arco-design/web-vue';
  import DisplayLatex from '@/components/latex/index.vue';
  import { getSpecificValueArr } from '@/utils/arrayHelper';
  import { ExamStateEnum } from '../config';

  const { examDetail, currentState } = inject('examDetail') as { examDetail: Ref<ExamListItem>; currentState: Ref<ExamStateEnum> };

  // 试题列表预览
  const problemList = ref<Question[]>([]);
  const problemTotal = ref(examDetail.value.number);
  const { loading: listLoding, setLoading: setListLoading } = useLoading(false);
  const { loading: uploadLoading, setLoading: setUploadLoading } = useLoading(false);
  const loadQuestionList = () => {
    setListLoading(true);
    getProblemList(+examDetail.value.id)
      .then((res) => {
        const { list, total } = res.data;
        problemList.value = list || [];
        problemTotal.value = total;
      })
      .finally(() => {
        setListLoading(false);
      });
  };

  const paperTotalScore = computed(() => {
    const { total = 0 } = examDetail.value;
    let pTScore = 0;
    if (problemList.value.length) {
      const scoreArr = getSpecificValueArr(problemList.value, 'score');
      pTScore = sum(scoreArr);
    } else {
      pTScore = total;
    }
    return pTScore;
  });

  // @ts-ignore
  const descData = computed<DescData[]>(() => {
    const { subject, time, timeLimit, total } = examDetail.value;
    const start = dayjs
      .unix(time / 1000)
      .format('YYYY-MM-DD HH:mm:ss')
      .slice(0, 16);
    const mins = `${parseInt(`${(timeLimit - time) / (60 * 1000)}`, 10)}分钟`;
    return [
      { label: '科目', value: subject },
      { label: '开考时间', value: start },
      { label: '考试时长', value: mins },
      { label: '试题量', value: problemTotal.value || '暂未上传试题' },
      { label: '试卷满分', value: paperTotalScore.value },
    ];
  });

  // 上传逻辑
  const handleQuestionUplad = (opt: RequestOption): void => {
    setUploadLoading(true);
    const { fileItem } = opt;
    /* eslint-disable */
    fileItem.file &&
      uploadExamTemplateApi({
        examId: +examDetail.value.id,
        sheet: '数学试卷',
        file: fileItem.file,
      })
        .then((res) => {
          const { success } = res;
          if (success) {
            Message.success(`试题${problemTotal.value === 0 ? '录入' : '追加'}成功`);
            loadQuestionList();
          }
        })
        .finally(() => {
          setUploadLoading(false);
        });
    /* eslint-disable */
  };

  //

  const setupComp = () => {
    loadQuestionList();
  };

  setupComp();
</script>

<template>
  <div class="wh-full">
    <section>
      <a-card
        title="题卷上传"
        :loading="uploadLoading"
      >
        <div class="flex justify-between w-1/1 h-auto">
          <div class="w-2/5">
            <a-descriptions
              :data="descData"
              size="large"
              title="题卷信息"
              :column="1"
            />
          </div>
          <div class="w-3/5 p-4">
            <div
              v-if="currentState === ExamStateEnum.beforeStart"
              class="w-1/1"
            >
              <!--@vue-ignore-->
              <a-upload
                draggable
                :tip="problemTotal === 0 ? '录入试题, 文件格式为.xlsx' : '追加录入, 文件格式为.xlsx'"
                accept=".xlsx"
                :custom-request="handleQuestionUplad"
              />
            </div>
            <div v-else>
              <a-result
                status="success"
                title="题卷配置已完成"
              >
                <template #subtitle> 当前周期无法配置试题 </template>
              </a-result>
            </div>
          </div>
        </div>
      </a-card>
    </section>
    <section class="mt-5">
      <a-card
        title="试题预览"
        :loading="listLoding"
      >
        <template #extra>
          <a-button
            type="text"
            @click="loadQuestionList"
          >
            <template #icon>
              <icon-sync :spin="listLoding" />
            </template>
            刷新
          </a-button>
        </template>
        <a-list
          :data="problemList"
          :bordered="false"
          hoverable
        >
          <template #item="{ item, index }">
            <a-list-item :key="index">
              <div class="flex gap-2 items-start mb-2">
                <small class="bg-gray-200 text-center aspect-1/1 h-1.5rem line-height-1.5rem align-middle rounded-lg select-none mt-1">
                  {{ index + 1 }}.
                </small>
                <h3 class="my-1">
                  <display-latex :latex="item.title" />
                </h3>
              </div>
              <div class="flex items-center justify-start pl-1.7em">
                <a-tag
                  :color="item.score < 10 ? 'orangered' : '#0fc6c2'"
                  class="infoTag"
                >
                  <i class="i-tabler-discount-check-filled mr-1"></i>
                  满分: {{ item.score }}分
                </a-tag>
                <a-tag
                  color="arcoblue"
                  class="infoTag"
                >
                  <i class="i-tabler:world-search mr-1"></i>
                  来源: {{ item.source }}
                </a-tag>
                <a-tag
                  color="purple"
                  class="infoTag"
                >
                  <i class="i-tabler:brand-snowflake mr-1"></i>
                  难度系数: {{ item.expectedDifficulty }}
                </a-tag>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </section>
  </div>
</template>

<style scoped>
  .infoTag {
    display: flex;
    align-items: center;
    width: min-content;
    margin-top: 0.25rem;
    font-size: 1.1em;
    font-weight: bold;
    border-radius: 0.4rem;
    margin-right: 6px;
  }
</style>
