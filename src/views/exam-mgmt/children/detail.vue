<script setup lang="ts">
  import { ExamListItem, uploadExamTemplateApi } from '@/api/exam';
  import { useRoute, useRouter } from 'vue-router';
  import { RequestOption, UploadRequest } from '@arco-design/web-vue';
  import { examStateMap } from '../config';

  const route = useRoute();
  const router = useRouter();
  const query = route.query as unknown as ExamListItem;

  const uploadPaperTemplate = (options: RequestOption) => {
    uploadExamTemplateApi({ file: options.fileItem, sheet: undefined, examId: query.id }).then((res) => {
      // 等后端开发结束
      console.log('res', res);
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
                <!--这里 /1000 是因为数据有问题, 到时候去除/1000就行-->
                <li text="1.5em"
                  >{{ new Date(query.time / 1000).toISOString().slice(0, 10) }} |
                  {{ (query.timeLimit - query.time / 1000) / (1000 * 60) }}分钟
                </li>
              </ul>
            </div>
            <div> <span></span>{{ examStateMap[query.state].text }} </div>
          </div>
        </a-card>
      </a-layout-header>
      <a-layout-content>
        <a-card title="上传接口有问题, 待毛修复">
          <section>
            <header class="pt-4 pb-8">
              <strong class="text-2xl"> 考卷信息 </strong>
            </header>
            <div flex="~ items-center justify-around">
              <div w="3/7"
                ><a-upload
                  tip="请上传试题卷Excel"
                  :limit="1"
                  accept=".xlsx"
                  draggable
                  :custom-request="uploadPaperTemplate"
              /></div>
              <div w="3/7"
                ><a-upload
                  tip="请上传学生答卷压缩包"
                  accept=".zip"
                  draggable
                  action="/"
              /></div>
            </div>
          </section>
          <section>
            <header class="pt-4 pb-8">
              <strong class="text-2xl"> 考试进度 </strong>
            </header>

            <div w="1/1">
              <a-steps
                type="arrow"
                :current="3"
              >
                <a-step v-for="item in examStateMap">{{ item.text }}</a-step>
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
      </a-layout-content>
      <a-layout-footer>
        <a-card>Footer</a-card>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
