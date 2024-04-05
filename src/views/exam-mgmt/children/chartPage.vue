<script setup lang="ts">
  import { ref, provide, defineAsyncComponent } from 'vue';
  import { useRoute } from 'vue-router';
  import { useFullscreen } from '@vueuse/core';
  import { type ExamListItem } from '@/api/exam';
  import { stuExamRankList, StuExamRank } from '@/api/data';
  import { Message } from '@arco-design/web-vue';
  import PassPieChart from '../charts/passPie.vue';
  import ScoreDistriChart from '../charts/scoredistri.vue';
  import DegreeChart from '../charts/degree.vue';
  import ClassScoreChart from '../charts/classScore.vue';

  // 传值
  const route = useRoute();
  const query = route.query as unknown as ExamListItem;
  /* 全屏逻辑 */
  const chartContainer = ref<HTMLElement | null>(null);
  const { isFullscreen, enter, exit, toggle: fullScreenToggle } = useFullscreen(chartContainer);

  fullScreenToggle();

  /* 数据请求和处理 */
  // 学生成绩细则
  const stuScoreDetail = ref<StuExamRank[]>([]);
  const loadStuScoreList = () => {
    stuExamRankList({ page: 1, pageSize: 1000, id: +query.id }).then((res) => {
      const { list, total } = res.data;
      if (!total) {
        Message.warning('数据异常, 学生成绩缺失');
      }
      stuScoreDetail.value = list;
    });
  };

  const initPage = () => {
    loadStuScoreList();
  };
  initPage();
  provide('examInfo', query);
</script>

<template>
  <div
    ref="chartContainer"
    class="main wh-full"
  >
    <a-layout h="full">
      <a-layout-header
        flex="~ items-center justify-around"
        w="full"
        h="10%"
        text-white
        bg="#1b2a5775"
      >
        <div
          flex="~ col items-center justify-center"
          w="3/10"
        >
          <div m="b-2">
            <i
              i-tabler:book
              text="20px blue-5"
            />
            考试名称
          </div>
          <div
            text="18px"
            font="bold"
          >
            {{ query.name }} - {{ query.subject }}
          </div>
        </div>
        <div
          w="4/10"
          text="3xl center"
          font="bold"
        >
          考试数据分析平台
        </div>
        <div
          flex="~ col items-center justify-center"
          w="3/10"
        >
          <div m="b-2">
            <i
              i-tabler:clock
              text="20px blue-5"
            />
            考试时间
          </div>
          <div
            font="500"
            text="18px"
          >
            {{ new Date(+query.time).toISOString().slice(0, 10) }}
          </div>
        </div>
      </a-layout-header>
      <a-layout-content
        w="full"
        h="full"
        p="y-1.5"
        flex="~ row justify-around"
      >
        <section
          w="11/40"
          flex="~ col items-center justify-around"
        >
          <div class="chartBox h-5/16">
            <PassPieChart :stu-score-list="stuScoreDetail" />
          </div>
          <div class="chartBox h-5/16">
            <ScoreDistriChart />
          </div>
          <div class="chartBox h-5/16"></div>
        </section>
        <section
          w="16/40"
          flex="~ col items-center justify-around"
        >
          <div class="chartBox h-11/25">
            <DegreeChart :stu-score-list="stuScoreDetail" />
          </div>
          <div class="chartBox h-13/25">
            <ClassScoreChart />
          </div>
        </section>
        <section
          w="11/40"
          flex="~ col items-center justify-around"
        >
          <div class="chartBox h-5/16"></div>
          <div class="chartBox h-5/16"></div>
          <div class="chartBox h-5/16"></div>
        </section>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped lang="less">
  .main {
    background-image: url('../../../assets/images/chartBg.png');
    background-size: cover;
  }
  .chartBox {
    border: 2px solid #9ab2eb41;
    width: 100%;
    background-color: rgba(67, 135, 238, 0.068);
  }
</style>
