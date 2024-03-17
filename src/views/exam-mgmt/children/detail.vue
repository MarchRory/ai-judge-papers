<script setup lang="ts">
  import { ExamListItem, uploadExamTemplateApi } from '@/api/exam';
  import { useRoute, useRouter } from 'vue-router';
  import { FileItem, Message, RequestOption } from '@arco-design/web-vue';
  import { examStateMap } from '../config';

  const route = useRoute();
  const router = useRouter();
  const query = route.query as unknown as ExamListItem;

  const uploadPaperTemplate = (fileList: FileItem[]) => {
    const { file } = fileList[0];
    // eslint-disable-next-line
    file &&
      uploadExamTemplateApi({ file, sheet: '', examId: query.id }).then((res) => {
        const { code, success } = res;
        if (success) {
          Message.success('考卷上传成功');
        }
      });
  };

  const jumpToJudge = () => {
    router.push({ path: '/exam-mgmt/judgePlatform', query });
  };
</script>

<template>
  <div>
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
                  >{{ query.name }}</li
                ><br />
                <li text="1.5em">
                  {{ new Date(+query.time).toISOString().slice(0, 10) }}
                  | {{ (+query.timeLimit - +query.time) / (1000 * 60) }}分钟 | {{ query.subject }}
                </li>
              </ul>
            </div>
            <div> <span></span>{{ examStateMap[query.state].text }} </div>
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
              <div w="3/7"
                ><a-upload
                  v-if="query.state == 1"
                  tip="请上传试题卷Excel"
                  :limit="1"
                  accept=".xlsx"
                  draggable
                  :auto-upload="false"
                  @change="uploadPaperTemplate"
              /></div>
              <div w="3/7"
                ><a-upload
                  v-if="query.state == 1"
                  tip="请上传学生答卷压缩包"
                  :limit="1"
                  :auto-upload="false"
                  accept=".zip"
                  draggable
                  @change="uploadPaperTemplate"
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
                :current="query.state"
              >
                <a-step
                  v-for="(item, index) in examStateMap"
                  :key="index"
                  >{{ item.text }}</a-step
                >
              </a-steps>

              <!-- v-if="query.state === 3" -->
              <a-button
                mt="5"
                type="outline"
                long
                @click="jumpToJudge"
                >去阅卷</a-button
              >
            </div>
          </section>
        </a-card>
        <a-card>
          <section>
            <header class="pt-4 pb-8">
              <strong class="text-2xl"> 数据分析 </strong>
            </header>
          </section>
        </a-card>
      </a-layout-content>
      <a-layout-footer>
        <a-card>Footer</a-card>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
