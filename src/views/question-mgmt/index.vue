<template>
  <a-layout class="h-full">
    <a-layout-header class="p4">
      <a-card class="px-2">
        <header class="pt-4 pb-8">
          <strong class="text-2xl"> 查询试题 </strong>
        </header>
        <div class="grid grid-cols-[1fr_auto]">
          <a-form :model="form">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  filed="subject"
                  label="学科"
                  label-col-flex="32px"
                >
                  <a-input
                    v-model="form.subject"
                    placeholder="请选择学科"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="title"
                  label="题目"
                  label-col-flex="60px"
                >
                  <a-input
                    v-model="form.title"
                    placeholder="请输入题目"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  filed="grade"
                  label="年级"
                  label-col-flex="32px"
                >
                  <a-select placeholder="请选择">
                    <a-option :value="3">2021</a-option>
                    <a-option :value="2">2022</a-option>
                    <a-option :value="1">2023</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <a-side class="pl-8 ml-8 mb-[20px] flex flex-col justify-between border-l border-l-solid border-[#E5E6EB]">
            <a-button type="primary">
              <template #icon>
                <icon-search />
              </template>
              <template #default> 查询 </template>
            </a-button>
            <a-button class="mt-4">
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
          <a-button
            type="primary"
            @click="openModal"
          >
            <template #icon>
              <icon-plus />
            </template>
            <template #default> 添加 </template>
          </a-button>
          <a-button>批量导入</a-button>
        </header>
        <a-table
          :columns="columns"
          :data="selectedData"
        >
          <template #$operation>
            <a-button type="text">详情</a-button>
            <a-popconfirm content="确认要删除？">
              <a-button
                type="text"
                status="danger"
              >
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table>
      </a-card>
    </a-layout-content>
  </a-layout>
  <addQuestionModal v-model:visible="visible"></addQuestionModal>
</template>

<script setup lang="ts">
  import { TableColumnData, TableData, Message } from '@arco-design/web-vue';
  import { ref, reactive } from 'vue';
  import addQuestionModal from './components/addQuestionModal.vue';

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
    id: '序号',
    subject: '学科',
    title: '题目',
    expectedDifficulty: '难易程度',
    source: '来源',
    $operation: '操作',
  }).map(([dataIndex, title]) => ({ dataIndex, title, slotName: dataIndex }));

  const rawData: TableData[] = reactive([
    { id: 1, subject: '语文', title: '古诗词默写', expectedDifficulty: '简单', source: '泸州市高级中学第一次月考' },
    { id: 2, subject: '语文', title: '古诗词默写', expectedDifficulty: '简单', source: '泸州市天立中学第一次月考' },
  ]);

  const selectedData = ref<TableData[]>(rawData);

  const visible = ref(false);

  const openModal = () => {
    visible.value = true;
  };
</script>
