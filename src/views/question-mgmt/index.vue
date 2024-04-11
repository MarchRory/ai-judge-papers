<template>
  <a-layout class="h-full">
    <a-layout-header class="p4">
      <a-card class="px-2">
        <header class="pt-4 pb-8">
          <strong class="text-2xl"> 试题库 </strong>
        </header>
        <div class="grid grid-cols-[1fr_auto]">
          <a-form :model="form">
            <a-row :gutter="16">
              <a-col :span="10">
                <a-form-item
                  field="title"
                  label="请输入题目关键词"
                >
                  <a-input
                    v-model="form.title"
                    placeholder="请输入题目关键词"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  filed="subject"
                  label="学科"
                  label-col-flex="32px"
                >
                  <a-select
                    v-model="subjectId"
                    :options="subjectOptions"
                    :field-names="{ label: 'name', value: 'id' }"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <a-side class="pl-8 ml-8 mb-[20px] flex flex-col justify-between border-l border-l-solid border-[#E5E6EB]">
            <a-button
              type="primary"
              @click="query"
            >
              <template #icon>
                <icon-search />
              </template>
              <template #default> 查询 </template>
            </a-button>
            <a-button
              class="mt-4"
              @click="reset"
            >
              <template #icon>
                <icon-refresh />
              </template>
              <template #default> 重置 </template>
            </a-button>
          </a-side>
        </div>
      </a-card>
    </a-layout-header>
    <a-layout-content class="px-4">
      <a-card>
        <header class="py-4 flex gap-4">
          <addQuestionModalButton></addQuestionModalButton>
          <UploadBtn @success="loadList" />
        </header>
        <a-table
          :data="tableData"
          stripe
          :loading="loading"
          page-position="br"
          :pagination="pagination"
          sticky-header
          @page-size-change="handleSizeChange"
          @page-change="handlePageChange"
        >
          <template #columns>
            <a-table-column
              data-index="id"
              :width="150"
              title="标识"
            ></a-table-column>
            <a-table-column
              title="科目"
              :width="120"
            >
              <template #cell="{ record }">
                {{ record.subject.title }}
              </template>
            </a-table-column>
            <a-table-column
              title="题目内容"
              :width="900"
            >
              <template #cell="{ record }">
                <DisplayLatex :latex="record.title" />
              </template>
            </a-table-column>
            <a-table-column
              title="难度系数"
              :width="120"
            >
              <template #cell="{ record }">
                <a-tag
                  color="purple"
                  class="infoTag"
                >
                  <i class="i-tabler:brand-snowflake mr-1"></i>
                  难度系数: {{ record.expectedDifficulty }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column
              title="来源"
              :width="180"
            >
              <template #cell="{ record }">
                <a-tag
                  color="arcoblue"
                  class="infoTag"
                >
                  <i class="i-tabler:world-search mr-1"></i>
                  来源: {{ record.source }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column
              title="操作"
              :width="150"
            >
              <template #cell="{ record }">
                <detail-button
                  :data="{
                    ...record,
                    subject: record.subject.title,
                  }"
                  :columns="columns"
                />
                <a-popconfirm
                  content="确认要删除？"
                  @ok="handleDelete(record)"
                >
                  <a-button
                    type="text"
                    status="danger"
                  >
                    删除
                  </a-button>
                </a-popconfirm>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
  import { TableColumnData, Message } from '@arco-design/web-vue';
  import { reactive, ref, provide } from 'vue';
  import DetailButton from '@/components/detail-button/index.vue';
  import { listQuestion, deleteQuestion, type QuestionListItem } from '@/api/question';
  import { getSubjectListAPI } from '@/api/subject';
  import useTable from '@/hooks/table/useTable';
  import DisplayLatex from '@/components/latex/index.vue';
  import UploadBtn from './components/uploadBtn.vue';
  import addQuestionModalButton from './components/addQuestionModalButton.vue';

  const form = reactive<{
    subject: string;
    title: string;
    grade: 1 | 2 | 3;
  }>({
    subject: '',
    title: '',
    grade: 1,
  });

  const columns: TableColumnData[] = Object.entries({
    id: '标识',
    subject: '学科',
    title: '题目',
    expectedDifficulty: '难度系数',
    source: '来源',
    $operation: '操作',
  }).map(([dataIndex, slotName]) => ({ dataIndex, slotName }));

  const otherSearchParams = { key: '', subjectId: 0 };
  const { tableData, pagination, loading, loadList, handlePageChange, handleSizeChange, page, key, subjectId, handleDelete } = useTable<
    QuestionListItem,
    typeof otherSearchParams
  >({
    requestApi: listQuestion,
    otherSearchParams,
    deleteApi: deleteQuestion,
  });
  const subjectOptions = ref<{ name: string; id: number | string }[]>([{ name: '全部', id: 0 }]);

  // 查询
  async function query() {
    page.value = 1;
    await loadList();
  }
  // 重置
  async function reset() {
    key.value = '';
    subjectId.value = 0;
    form.title = '';
    form.subject = '';
    form.grade = 1;
    await loadList();
  }

  function initSelect() {
    getSubjectListAPI({ page: 1, pageSize: 100, key: '' }, { cache: true })
      .then((res) => {
        const { list } = res.data;
        list.forEach((item) => {
          subjectOptions.value.push({
            id: item.id as number,
            name: item.name,
          });
        });
      })
      .catch(() => {
        Message.error('学科信息获取失败, 请刷新页面重试');
      });
  }

  provide('subjectOptions', subjectOptions.value);
  // 初始化页面
  function pageInit() {
    loadList();
    initSelect();
  }

  pageInit();
</script>
