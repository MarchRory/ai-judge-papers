<template>
  <a-layout class="h-full">
    <a-layout-header class="p4">
      <a-card class="px-2">
        <header class="pt-4 pb-8">
          <strong class="text-2xl"> 查询班级 </strong>
        </header>
        <div class="grid grid-cols-[1fr_auto]">
          <a-form :model="form">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  filed="sate"
                  label="状态"
                  label-col-flex="32px"
                >
                  <a-input
                    v-model="form.state"
                    placeholder="请选择班级状态"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="graduation"
                  label="毕业届数"
                  label-col-flex="60px"
                >
                  <a-input
                    v-model="form.graduation"
                    placeholder="请选择毕业年份"
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
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="classes"
                  label="班级"
                  label-col-flex="32px"
                >
                  <a-input
                    v-model="form.classes"
                    placeholder="请选择班级"
                  ></a-input>
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
            <a-button>
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
          <template #state="{ record: { state } }">
            <a-tag
              v-if="state === '在校'"
              checkable
              color="#00b42a"
              >{{ state }}</a-tag
            >
            <a-tag
              v-else-if="state === '已毕业'"
              checkable
              color="#ff5722"
              >{{ state }}</a-tag
            >
            <a-tag
              v-else-if="state === '毕业班'"
              checkable
              color="#ffb400"
              >{{ state }}</a-tag
            >
          </template>
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
  <addClassModal v-model:visible="visible"></addClassModal>
</template>

<script setup lang="ts">
  import { TableColumnData, TableData, Message } from '@arco-design/web-vue';
  import { ref, reactive } from 'vue';
  import addClassModal from '@/views/class-mgmt/components/addClassModal.vue';

  const form = reactive<{
    state: string;
    graduation: string;
    grade: 1 | 2 | 3;
    classes: string;
  }>({
    subject: '',
    title: '',
    grade: 1,
    classes: '',
  });

  const columns: TableColumnData[] = Object.entries({
    id: '序号',
    graduation: '毕业届数',
    classes: '班级',
    grade: '当前年级',
    studentNumber: '学生人数',
    classType: '班级类型',
    state: '班级状态',
    $operation: '操作',
  }).map(([dataIndex, title]) => ({ dataIndex, title, slotName: dataIndex }));

  const rawData: TableData[] = reactive([
    { id: '1', graduation: '2025', classes: '6', grade: '2021', studentNumber: '36', classType: '实验班', state: '在校' },
    { id: '2', graduation: '2021', classes: '6', grade: '2019', studentNumber: '36', classType: '实验班', state: '已毕业' },
    { id: '3', graduation: '2024', classes: '6', grade: '2020', studentNumber: '36', classType: '实验班', state: '毕业班' },
  ]);

  const selectedData = ref<TableData[]>(rawData);

  const visible = ref(false);

  const openModal = () => {
    visible.value = true;
  };
  // 获取班级列表数据
</script>
