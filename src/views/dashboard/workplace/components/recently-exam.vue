<template>
  <a-spin
    :loading="loading"
    style="width: 100%"
  >
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title> 近期考试 </template>
      <template #extra>
        <a-link>查看更多</a-link>
      </template>
      <a-space
        direction="vertical"
        :size="10"
        fill
      >
        <a-radio-group
          v-model:model-value="type"
          type="button"
          @change="typeChange as any"
        >
          <a-radio :value="1"> 语文 </a-radio>
          <a-radio :value="2"> 数学 </a-radio>
          <a-radio :value="3"> 英语 </a-radio>
        </a-radio-group>
        <a-table
          :data="renderList!!"
          :pagination="false"
          :bordered="false"
          :scroll="{ x: '100%', y: '264px' }"
        >
          <template #columns>
            <a-table-column
              title="时间"
              data-index="time"
            >
              <template #cell="{ record }">
                {{ dateFormat(record.time) }}
              </template>
            </a-table-column>
            <a-table-column
              title="考试名称"
              data-index="name"
            >
              <template #cell="{ record }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1,
                  }"
                >
                  {{ record.name }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column
              title="说明"
              data-index="description"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
              }"
            >
              <!--              <template #cell="{ record }">-->
              <!--                <div class="increases-cell">-->
              <!--                  <span>{{ record.increases }}%</span>-->
              <!--                  <icon-caret-up-->
              <!--                    v-if="record.increases !== 0"-->
              <!--                    style="color: #f53f3f; font-size: 8px"-->
              <!--                  />-->
              <!--                </div>-->
              <!--              </template>-->
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { getExamListApi } from '@/api/exam';
  import useLoading from '@/hooks/loading';
  import type { TableData } from '@arco-design/web-vue/es/table/interface';
  import dayjs from 'dayjs';
  import { ref } from 'vue';

  const type = ref(1);
  const { loading, setLoading } = useLoading();
  const renderList = ref<TableData[]>();
  const fetchData = async (contentType: number) => {
    try {
      setLoading(true);
      const { data } = await getExamListApi({ page: 1, pageSize: 5, subjectId: contentType });
      renderList.value = data.list;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  const typeChange = (contentType: number) => {
    fetchData(contentType);
  };
  fetchData(1);
  const dateFormat = (timestamp: number) => {
    return dayjs.unix(timestamp).format('YYYY年MM月DD日');
  };
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
