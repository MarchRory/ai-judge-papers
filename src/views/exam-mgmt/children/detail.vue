<script setup lang="ts">
  import { ref, computed, defineAsyncComponent, provide, watch } from 'vue';
  import { ExamListItem, getExamDetailApi, getAnswerSheetListApi } from '@/api/exam';
  import { useRoute, useRouter } from 'vue-router';
  import { DescData, Message } from '@arco-design/web-vue';
  import { StuScoreItem, beginAiJudge, getReview } from '@/api/judge';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { usePolling } from '@/utils/common/polling';
  import { StuExamRank } from '@/api/data';
  import { examStateMap, ExamStateEnum, StuPaperStateEnum } from '../config';

  type PaperCfgType = 'questionPaper' | 'answerPaper';
  const PapaerConfig = defineAsyncComponent(() => import('../components/paperCfg/paperConfig.vue'));
  const PaperListTab = defineAsyncComponent(() => import('../components/detailTab/detailPaperListTab.vue'));
  const StuListTab = defineAsyncComponent(() => import('../components/detailTab/detatilStuListTab.vue'));
  const WordCloudTab = defineAsyncComponent(() => import('../components/detailTab/wordCloudTab.vue'));
  const PassPieChart = defineAsyncComponent(() => import('../charts/passPie.vue'));

  const route = useRoute();
  const router = useRouter();
  const { loading: initLoading, setLoading: setInitLoading } = useLoading(true);
  const query = route.query as unknown as ExamListItem;
  const examDetail = ref({} as ExamListItem);

  const getExamDetail = () => {
    setInitLoading(true);
    getExamDetailApi({ id: +query.id })
      .then((res) => {
        const { data, success } = res;
        examDetail.value = data;
        // examStatus.value = data.state;
        if (!success) {
          Message.error('请刷新页面重试');
        }
      })
      .finally(() => {
        setInitLoading(false);
      });
  };
  const beginAIJudge = () => {
    if (!examDetail.value.number) {
      Message.warning('当前未上传答题卡, 无法开启AI阅卷, 请确认答题卡是否完成上传');
      return;
    }
    beginAiJudge(+query.id).then((res) => {
      const { success } = res;
      if (success) {
        Message.success('AI判卷已启动, 请耐心等待');
        getExamDetail();
      } else {
        const { message } = res;
        Message.warning(message);
      }
    });
  };
  const jumpToJudge = () => {
    // @ts-ignore
    router.push({ path: '/exam-mgmt/judgePlatform', query });
  };
  const jumpToDataAnalysis = () => {
    // @ts-ignore
    router.push({ path: '/exam-mgmt/chartPage', query });
  };
  const getStuAnswerSheet = () => {
    getAnswerSheetListApi({ page: 1, pageSize: 10, examId: +query.id, key: '' }).then((res) => {
      const { list } = res.data;
    });
  };

  // 实际考试状态值
  const currentState = computed<ExamStateEnum>(() => {
    const { state: queryState, timeLimit } = query;
    const { state: reqState } = examDetail.value;
    const now = new Date().getTime();
    // 初始值
    let realState = ExamStateEnum.beforeStart;
    if (now <= timeLimit) {
      realState = ExamStateEnum.beforeStart;
    } else {
      realState = queryState === reqState ? queryState : reqState;
    }
    return realState;
  });

  // 考试进度条
  const steps = Object.values(examStateMap);
  steps.sort((a, b) => a.value - b.value);

  // header信息卡片
  // @ts-ignore
  const baseInfoCard = computed<DescData[]>(() => {
    const { timeLimit, time } = query;
    const start = dayjs
      .unix(time / 1000)
      .format('YYYY-MM-DD HH:mm:ss')
      .slice(0, 16);
    const end = dayjs
      .unix(timeLimit / 1000)
      .format('YYYY-MM-DD HH:mm:ss')
      .slice(0, 16);
    const { number } = examDetail.value;
    const mins = `${parseInt(`${(timeLimit - time) / (60 * 1000)}`, 10)}分钟`;
    const joinNum = number || '答卷信息暂未录入';
    return [
      { label: '所属考试组', value: query.groupName || '暂未分配' },
      { label: '考试科目', value: query.subject },
      { label: '开考时间', value: start },
      { label: '结束时间', value: end },
      { label: '考试时长', value: mins },
      { label: '参考人数', value: joinNum },
    ];
  });

  // 上传相关
  const uploadCompRef = ref();
  const PcfgType = ref<PaperCfgType>('questionPaper');
  const openUploader = (type: PaperCfgType) => {
    PcfgType.value = type;
    uploadCompRef.value.setUploadVisible(true);
  };
  const handlePaperConfigClose = () => {
    getExamDetail();
  };

  // AI阅卷进度
  // 先用map, 以后有可能会借助这个完成其他功能
  const stateStuMap = ref(new Map<StuPaperStateEnum, number[]>());
  const judgedNum = ref(0);
  // 获取指定状态的学生id数组
  const getSpecificStateStu = (state: StuPaperStateEnum) => {
    return new Promise((resolve) => {
      getReview({
        page: 1,
        pageSize: examDetail.value.number || 500,
        examId: +query.id,
        state,
      })
        .then((res) => {
          const { list } = res.data;
          stateStuMap.value.set(state, list);
        })
        .finally(() => {
          resolve(true);
        });
    });
  };
  // AI阅卷进度条, 待测试
  const beginWatchAiJuding = async () => {
    const updateAiJudingProgress = async () => {
      await getSpecificStateStu(StuPaperStateEnum.juding);
      judgedNum.value = (stateStuMap.value.get(StuPaperStateEnum.juding) || []).length;
    };
    usePolling({
      method: updateAiJudingProgress,
      quitWhen: () => {
        return judgedNum.value === examDetail.value.number;
      },
    });
  };
  watch(
    () => currentState.value,
    (newVal) => {
      if (newVal === ExamStateEnum.aiJudging) {
        beginWatchAiJuding();
      }
    },
  );

  // state方法触发器
  const stateFnTrigger = () => {
    switch (+currentState.value) {
      case ExamStateEnum.beforeStart:
        openUploader('questionPaper');
        break;
      case ExamStateEnum.default:
        openUploader('answerPaper');
        break;
      case ExamStateEnum.aiDone:
      case ExamStateEnum.checking:
        jumpToJudge();
        break;
      case ExamStateEnum.complete:
        jumpToDataAnalysis();
        break;
      default:
        break;
    }
  };

  // 主体tab页逻辑
  const chosenTabKey = ref(0);
  const tabs = [
    { key: 0, title: '试题卷', allowState: ExamStateEnum.default },
    { key: 1, title: '作答情况', allowState: ExamStateEnum.aiJudging },
    { key: 2, title: '词云分析', allowState: ExamStateEnum.aiDone },
  ];
  const classId = ref(0);
  const className = ref('');
  const stuList = ref<StuScoreItem[]>([]);
  const handleClassIdChange = (newClassId: number, newClassName: string, newStuList: StuScoreItem[]) => {
    classId.value = newClassId;
    className.value = newClassName;
    stuList.value = newStuList;
  };

  const initPage = () => {
    getExamDetail();
    getStuAnswerSheet();
  };
  initPage();

  provide('examDetail', {
    examDetail,
    currentState,
  });
</script>

<template>
  <div>
    <a-spin
      :loading="initLoading"
      :size="25"
      class="wh-full"
    >
      <a-layout>
        <a-layout-header class="sticky t-0 flex">
          <div class="w-1/1 p-4 rounded-3 shadow-lg flex items-center bg-white">
            <div class="w-3/5 line">
              <div class="w-1/1 min-h-[120px]">
                <div class="w-1/1 h-2/7 flex items-center">
                  <a-button
                    class="backBtn"
                    shape="circle"
                    @click="$router.back()"
                  >
                    <template #icon>
                      <icon-left
                        :size="20"
                        class="text-gray"
                      />
                    </template>
                  </a-button>
                  <span class="text-1.5em font-bold ml-2">{{ query.name }} </span>
                  <a-popover title="附加信息">
                    <icon-info-circle
                      v-if="examDetail.description"
                      :size="20"
                      class="ml-2"
                    />
                    <template #content>
                      {{ examDetail.description }}
                    </template>
                  </a-popover>
                  <a-tag
                    class="ml-8"
                    :color="examStateMap[currentState].iconColor || '#0fc6c2'"
                  >
                    <i
                      class="mr-2"
                      :class="examStateMap[currentState].stepIcon"
                    ></i>
                    {{ examStateMap[currentState].text }}
                  </a-tag>
                  <a-button
                    v-if="currentState !== ExamStateEnum.complete"
                    type="text"
                    @click="getExamDetail"
                  >
                    <template #icon>
                      <icon-sync :spin="initLoading" />
                    </template>
                    状态同步
                  </a-button>
                </div>
                <div class="w-1/1 h-5/7 mt-5">
                  <a-descriptions
                    align="center"
                    :data="baseInfoCard"
                    :column="baseInfoCard.length"
                    layout="inline-vertical"
                  >
                    <template #label="{ label }">
                      <div class="text-1.2em text-gray font-bold">{{ label }}</div>
                    </template>
                    <template #value="{ value }">
                      <div class="mt-4 text-1.3em font-extrabold">{{ value }}</div>
                    </template>
                  </a-descriptions>
                </div>
              </div>
            </div>
            <div class="w-2/5">
              <div class="text-center text-1.3em font-extrabold mb-4">当前进度</div>
              <!--step是从1开始, 与state不同, step = currentState + 2-->
              <a-steps
                class="mb-6"
                :current="currentState + 2"
                small
              >
                <a-step
                  v-for="(step, idx) in steps"
                  :key="idx"
                  :description="step.desc"
                >
                  {{ step.text }}
                  <template #icon>
                    <i
                      v-if="step.value !== ExamStateEnum.aiJudging"
                      class="text-1.3em"
                      :class="step.stepIcon"
                    />
                    <icon-sync
                      v-else
                      :spin="step.value === currentState"
                    />
                  </template>
                </a-step>
              </a-steps>
              <div class="flex justify-center flex-col items-center">
                <!-- <a-button @click="openUploader('questionPaper')">录入题卷</a-button> -->
                <!-- <a-button @click="openUploader('answerPaper')">录入答卷</a-button> -->
                <!-- <a-button @click="jumpToDataAnalysis">可视化大屏</a-button> -->
                <a-progress
                  v-if="currentState === ExamStateEnum.aiJudging && examDetail.number"
                  :percent="+(judgedNum / examDetail.number).toFixed(2)"
                  :status="judgedNum === examDetail.number ? 'normal' : 'success'"
                  type="line"
                  size="large"
                  animation
                  track-color="var(--color-primary-light-1)"
                >
                  <template #text>
                    <div class="text-gray-500 font-700">
                      已完成{{ judgedNum }}份, 进度{{ +(judgedNum / examDetail.number).toFixed(2) * 100 }}%
                    </div>
                  </template>
                </a-progress>
                <span
                  v-if="currentState === ExamStateEnum.aiJudging"
                  class="text-gray text-1.2em mt-2"
                >
                  <i
                    :class="examStateMap[currentState].btnIcon"
                    class="text-1.4em mr-1 text-[#4c5b7ebd]"
                  />
                  {{ examStateMap[currentState].btnText }}
                </span>
                <div
                  v-else
                  class="flex items-center"
                >
                  <a-button
                    type="outline"
                    @click="stateFnTrigger"
                  >
                    <i
                      class="text-1.3em mr-2"
                      :class="examStateMap[currentState].btnIcon"
                    />
                    {{ examStateMap[currentState].btnText }}
                  </a-button>

                  <a-popconfirm
                    v-if="currentState === ExamStateEnum.default && examDetail.number"
                    content="启动AI阅卷后, 将开启大模型自动阅卷模式, 本堂考试将无法继续上传学生答题卡, 在此之前, 请确认答题卡上传完毕"
                    type="warning"
                    ok-text="确认启动"
                    @ok="beginAIJudge"
                  >
                    <a-button
                      class="ml-2"
                      status="success"
                    >
                      启动AI阅卷
                      <template #icon>
                        <icon-robot />
                      </template>
                    </a-button>
                  </a-popconfirm>
                </div>
                <!-- <a-button @click="jumpToJudge">跳转到阅卷平台</a-button> -->
              </div>
            </div>
          </div>
        </a-layout-header>
        <a-layout-content class="flex mt-3">
          <a-card class="w-10/17 rounded-3 shadow-lg flex flex-col">
            <a-tabs
              v-model:active-key="chosenTabKey"
              :default-active-key="0"
              lazy-load
              size="large"
              justify
              animation
            >
              <a-tab-pane
                v-for="item in tabs"
                :key="item.key"
                :title="item.title"
              >
                <div class="min-h-4xl h-auto">
                  <PaperListTab
                    v-if="chosenTabKey === 0"
                    @on-open-question-cfg="openUploader('questionPaper')"
                  />
                  <StuListTab
                    v-else-if="chosenTabKey === 1"
                    @on-open-paper-cfg="openUploader('answerPaper')"
                    @to-judge="jumpToJudge"
                    @on-class-change="handleClassIdChange"
                  />
                  <WordCloudTab v-else-if="chosenTabKey === 2" />
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-card>
          <a-card class="w-7/17 rounded-3 shadow-lg h-60rem">
            这里不知道放什么好
            <!-- <a-card
              :title="`${className}班级数据`"
              class="w-full flex flex-col justify-around items-center h-full"
            >
              <div class="w-full h-11/35">
                <PassPieChart
                  :pass-score="(examDetail.total || 100) * 0.6"
                  :stu-score-list="stuList"
                />
              </div>
              <div class="w-full h-11/35 bg-red"></div>
              <div class="w-full h-11/35 bg-teal"></div>
            </a-card> -->
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-spin>
    <PapaerConfig
      ref="uploadCompRef"
      :type="PcfgType"
      :current-state="currentState"
      @on-close="handlePaperConfigClose"
    />
  </div>
</template>

<style scoped lang="less">
  :deep(.backBtn) {
    display: flex;
    align-items: center;
    justify-content: center;
    .arco-btn-size-medium {
      font-size: 1.5em;
      font-weight: 800;
    }
  }
  :deep(.arco-progress) {
    width: 85%;
  }
  .line {
    &::before {
      display: block;
      content: '';
      height: 90px;
      width: 2px;
      background: rgba(107, 107, 107, 0.03);
      position: absolute;
      border-radius: 5px;
      left: 59%;
      top: 25%;
    }
  }
</style>
