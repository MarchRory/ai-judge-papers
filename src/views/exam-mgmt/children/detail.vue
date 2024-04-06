<script setup lang="ts">
  import { ref } from 'vue';
  import { ExamListItem, uploadExamTemplateApi, getExamDetailApi, uploadAnswerSheetApi } from '@/api/exam';
  import { useRoute, useRouter } from 'vue-router';
  import { FileItem, Message } from '@arco-design/web-vue';
  import { beginAiJudge } from '@/api/judge';
  import useLoading from '@/hooks/loading';
  import { examStateMap } from '../config';

  const route = useRoute();
  const router = useRouter();
  const { loading: initLoading, setLoading: setInitLoading } = useLoading(true);
  const query = route.query as unknown as ExamListItem;
  const examStatus = ref(+query.state);
  const examDetail = ref({} as ExamListItem);

  const getExamDetail = () => {
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
  // @ts-ignore
  const uploadPaperTemplate = (_, fileItem: FileItem) => {
    const { file } = fileItem;
    /* eslint-disable */
    file &&
      uploadExamTemplateApi({
        file,
        sheet: '',
        examId: query.id,
      }).then(() => {
        Message.success('题卷上传成功');
      });
    /* eslint-enable */
  };
  // @ts-ignore
  const uploadAnswerSheetZip = (_, fileItem: FileItem) => {
    const { file } = fileItem;
    /* eslint-disable */
    file &&
      uploadAnswerSheetApi({
        file,
        examId: query.id,
      }).then(() => {
        Message.success('答题卡上传成功');
      });
    /* eslint-enable */
  };
  const beginAIJudge = () => {
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
  const stateFnTrigger = () => {
    switch (+examStatus.value) {
      case 1:
        beginAIJudge();
        break;
      case 3:
        jumpToJudge();
        break;
      case 4:
        jumpToDataAnalysis();
        break;
      default:
        break;
    }
  };

  const initPage = () => {
    getExamDetail();
  };
  initPage();
</script>

<template>
  <div>
    <a-spin
      :loading="initLoading"
      :size="25"
      class="wh-full"
    >
      <a-layout>
        <a-layout-header>
          <a-card>
            <div
              w-full
              flex="~ items-center justify-between row"
            >
              <a-button
                type="text"
                size="large"
                @click="() => router.back()"
              >
                <template #icon>
                  <icon-left />
                </template>
                返回
              </a-button>
              <div>
                <ul
                  m="0"
                  list="none"
                  text="center"
                >
                  <li
                    text="3em"
                    font="bold"
                    >{{ query.name }}
                  </li>
                  <br />
                  <li text="1.5em">
                    {{ new Date(+query.time).toISOString().slice(0, 10) }} |
                    {{ parseInt((query.timeLimit - query.time) / (1000 * 60) + '', 10) }}分钟
                    {{ query.subject ? ' | ' + query.subject : '' }} | 满分:{{ examDetail.total }}
                  </li>
                </ul>
              </div>
              <div> <span />{{ examStateMap[examStatus].text }} </div>
            </div>
          </a-card>
        </a-layout-header>
        <a-layout-content>
          <a-card>
            <section>
              <header class="pt-4 pb-8">
                <strong class="text-2xl"> 考卷信息 </strong>
              </header>
              <div flex="~ items-center justify-around">
                <div w="3/7">
                  <a-upload
                    v-if="examDetail.state !== 4"
                    action="/"
                    tip="请上传试题卷Excel"
                    :limit="1"
                    accept=".xlsx"
                    draggable
                    :auto-upload="false"
                    @change="uploadPaperTemplate"
                  />
                </div>
                <div w="3/7">
                  <a-upload
                    v-if="examDetail.state !== 4"
                    :limit="1"
                    :auto-upload="false"
                    tip="请上传学生答卷压缩包(.zip)"
                    accept=".zip"
                    draggable
                    action="/"
                    @change="uploadAnswerSheetZip"
                  />
                </div>
              </div>
            </section>
            <section>
              <header class="pt-4 pb-8">
                <strong class="text-2xl"> 考试进度 </strong>
              </header>

              <div w="1/1">
                <a-steps
                  type="arrow"
                  :current="+examStatus"
                >
                  <a-step
                    v-for="(item, index) in examStateMap"
                    :key="index"
                    >{{ item.text }}</a-step
                  >
                </a-steps>

                <a-button
                  class="status-trigger mt-5"
                  type="outline"
                  long
                  :disabled="examStatus === 2"
                  @click="stateFnTrigger"
                >
                  {{ examStateMap[examStatus].btnText }}
                </a-button>
                <div>
                  <mark>TODO:完成后删除</mark>
                  <button @click="jumpToJudge">TEST:jumpToJudge </button>
                  <button @click="jumpToDataAnalysis">TEST:jumpToDataAnalysis</button>
                </div>
              </div>
            </section>
            <section>
              <header class="pt-4 pb-8 mt-10">
                <strong class="text-2xl"> 数据分析 </strong>
              </header>
              <div flex="~ items-center justify-around">
                <a-empty>
                  <template #image>
                    <icon-bar-chart />
                  </template>
                  <div v-if="examDetail.state !== 4">提交全部阅卷结果后, 可查看分析报表</div>
                </a-empty>
              </div>
            </section>
          </a-card>
        </a-layout-content>
        <a-layout-footer>
          <a-card>Footer</a-card>
        </a-layout-footer>
      </a-layout>
    </a-spin>
  </div>
</template>

<style scoped lang="less">
  :deep(.arco-btn-size-medium) {
    padding: 25px 0;
    font-size: 1.5em;
    font-weight: 800;
  }
</style>
