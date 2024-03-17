<script setup lang="ts">
  import { ExamListItem } from '@/api/exam';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const query = route.query as unknown as ExamListItem;
</script>

<template>
  <div>
    <a-layout style="height: calc(100vh - 170px)">
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
                  text="2em"
                  font="bold"
                  >{{ query.name }}</li
                ><br />
                <li text="1.4em">
                  {{ new Date(+query.time).toISOString().slice(0, 10) }}
                  | {{ (+query.timeLimit - +query.time) / (1000 * 60) }}分钟 | {{ query.subject }}
                </li>
              </ul>
            </div>
            <div>
              <span
                text="1.6em"
                m="r-6"
                ><strong>得分: 96</strong></span
              >
              <a-button
                m="r-6"
                status="success"
                type="outline"
                >提交</a-button
              >
              <a-button type="primary">全部</a-button>
            </div>
          </div>
        </a-card>
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          m="t-2"
          :width="300"
        >
        </a-layout-sider>
        <a-layout-content
          p="2"
          bg="white"
          m="l-2 t-2"
          shadow="coolgray"
        ></a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
