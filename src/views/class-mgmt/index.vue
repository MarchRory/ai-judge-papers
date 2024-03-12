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
                    <a-option :value="2021">2021</a-option>
                    <a-option :value="2022">2022</a-option>
                    <a-option :value="2023">2023</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="name"
                  label="班级"
                  label-col-flex="32px"
                >
                  <a-input
                    v-model="form.name"
                    placeholder="请选择班级"
                  ></a-input>
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
            <a-button @click="reset">
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
          <addClassModalButton></addClassModalButton>
          <a-button>批量导入</a-button>
        </header>
        <a-table
          :columns="columns"
          :data="selectedData"
          :loading="loading"
        >
          <!-- <template #state="{ record: { state } }">
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
          </template> -->
          <template #optional="{ record }">
            <a-button type="text">详情</a-button>
            <a-popconfirm
              content="确认要删除？"
              @ok="classDelete(record)"
            >
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
    <addClassModal v-model:visible="visible"></addClassModal>
  </a-layout>
</template>

<script setup lang="ts">
  import { TableColumnData, TableData, Message } from '@arco-design/web-vue';
  import { ref, reactive, watch } from 'vue';
  import addClassModalButton from '@/views/class-mgmt/components/addClassModalButton.vue';
  import { listClass, deleteClass } from '@/api/class';
  import { Paging } from '@/api/types';

  const loading = ref(false);
  const totalAll = ref(0);
  const form = reactive<{
    state: string;
    graduation: string;
    grade: string;
    name: string;
  }>({
    state: '',
    graduation: '',
    grade: '2021',
    name: '',
  });

  const columns: TableColumnData[] = Object.entries({
    id: '序号',
    graduation: '毕业届数',
    name: '班级',
    grade: '当前年级',
    memberCount: '学生人数',
    classType: '班级类型',
    state: '班级状态',
    optional: '操作',
  }).map(([dataIndex, title]) => ({ dataIndex, title, slotName: dataIndex }));

  const rawData: TableData[] = reactive([]);

  const selectedData = ref<TableData[]>();

  const pagination = reactive<Paging<{ key: string; grade: string }>>({
    page: 1,
    pageSize: 10,
    key: '',
    grade: '',
  });

  // 获取班级列表数据
  function LoadList() {
    loading.value = true;
    listClass(pagination)
      .then((res) => {
        // console.log(res);
        const { list, total } = res.data;
        totalAll.value = total;
        selectedData.value = list;
      })
      .finally(() => {
        loading.value = false;
      });
  }
  watch(
    () => pagination,
    (newVal, oldVal) => {
      if (!newVal.key || newVal.page !== oldVal.page || newVal.pageSize !== oldVal.pageSize) {
        LoadList();
      }
    },
    { deep: true }
  );
  // 查询
  function query() {
    loading.value = true;
    pagination.grade = form.grade;
    pagination.key = form.name;
    listClass(pagination)
      .then((res) => {
        const { list, total } = res.data;
        totalAll.value = total;
        selectedData.value = list;
      })
      .finally(() => {
        loading.value = false;
      });
  }
  // 重置
  function reset() {
    pagination.grade = '';
    pagination.key = '';
    form.grade = '';
    form.name = '';
    LoadList();
    Message.success('已重置');
  }
  // 删除
  function classDelete(record) {
    const { id } = record;
    deleteClass(id as number).then((res) => {
      const { message } = res;
      if (message === 'success') {
        Message.success('删除成功');
        LoadList();
      }
    });
  }

  LoadList();
</script>
