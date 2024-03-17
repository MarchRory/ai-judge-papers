<script setup lang="ts">
  /**
   * @see https://arco.design/vue/component/form
   * @see https://arco.design/vue/component/table
   */
  import { TableColumnData, TableData, Message, PaginationProps } from '@arco-design/web-vue';
  import { reactive, ref, computed, onMounted } from 'vue';
  import { Student, deleteStudent, fieldsDescription, listStudent, updateStudent } from '@/api/student';
  import DetailButton from '@/components/detail-button/index.vue';
  import ButtonAdd from './btn-add.vue';
  import ButtonImport from './btn-import.vue';

  // form

  const form = reactive<{
    value1: string;
    value2: string;
    value3: -1 | 0 | 1;
    value4: string;
    value5: string[];
    value6: -1 | 0 | 1;
  }>({
    value1: '',
    value2: '',
    value3: -1,
    value4: '',
    value5: [],
    value6: -1,
  });

  // table
  const isLoading = ref(true);
  const page = ref(1);
  const pagination = ref<PaginationProps>({});

  const rawData: TableData[] = reactive<Student[]>([]);

  const loadData = async (p?: number) => {
    isLoading.value = true;

    const res = await listStudent({}, p || page.value);
    rawData.splice(0, rawData.length, ...res.data.list);
    pagination.value = res.data.pagination;

    isLoading.value = false;
  };

  onMounted(loadData);

  const columns: TableColumnData[] = Object.entries({
    ...fieldsDescription,
    $operation: '操作', // virtual
  }).map(([dataIndex, title]) => ({ dataIndex, title, slotName: dataIndex }));

  const selectedData = ref<TableData[]>(rawData);

  const displayData = computed(() =>
    selectedData.value.map(
      // 转换为可读形式
      ({ sex, state, ...props }) => ({ ...props, sex: ['男', '女'][sex], state: Boolean(state) })
    )
  );

  // actions

  function reset() {
    selectedData.value = rawData;
    Message.success('已重置');
  }

  function query() {
    selectedData.value = rawData.filter(({ name, sex, state }) => {
      if (form.value2 && !name.startsWith(form.value2)) {
        return false;
      }
      if (form.value3 >= 0) {
        return form.value3 === sex;
      }
      if (form.value6 >= 0) {
        return form.value6 === state;
      }
      return true;
    });
    if (selectedData.value.length > 0) {
      Message.success('查询成功');
    } else {
      Message.info('暂无数据');
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteStudent(id);
      Message.success('已删除');
      loadData();
      return true;
    } catch {
      return false;
    }
  }
</script>

<template>
  <a-layout class="h-full">
    <a-layout-header class="p4">
      <a-card class="px-2">
        <header class="pt-4 pb-8">
          <strong class="text-2xl"> 查询学生 </strong>
        </header>
        <div class="grid grid-cols-[1fr_auto]">
          <a-form :model="form">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="value1"
                  label="学号"
                  label-col-flex="42px"
                >
                  <a-input
                    v-model="form.value1"
                    placeholder="请输入学号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="value2"
                  label="学生姓名"
                  label-col-flex="56px"
                >
                  <a-input
                    v-model="form.value2"
                    placeholder="请输入姓名"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="value3"
                  label="性别"
                  label-col-flex="28px"
                >
                  <a-select v-model="form.value3">
                    <a-option :value="-1">全部</a-option>
                    <a-option :value="0">男</a-option>
                    <a-option :value="1">女</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="value4"
                  label="科目"
                  label-col-flex="42px"
                >
                  <a-select
                    v-model="form.value4"
                    placeholder="请选择"
                  >
                    <a-option value="all">全部</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="value5"
                  label="创建时间"
                  label-col-flex="56px"
                >
                  <a-range-picker
                    v-model="form.value5"
                    show-time
                    :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
                    format="YYYY-MM-DD HH:mm"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="value6"
                  label="账号启用"
                  label-col-flex="56px"
                >
                  <a-select
                    v-model="form.value6"
                    placeholder="请选择"
                  >
                    <a-option :value="-1">全部</a-option>
                    <a-option :value="0">禁用</a-option>
                    <a-option :value="1">启用</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <aside class="pl-8 ml-8 mb-[20px] flex flex-col justify-between border-l border-l-solid border-[#E5E6EB]">
            <a-button
              type="primary"
              @click="query"
            >
              <template #icon>
                <icon-search />
              </template>
              <template #default>查询</template>
            </a-button>

            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              <template #default>重置</template>
            </a-button>
          </aside>
        </div>
      </a-card>
    </a-layout-header>
    <a-layout-content class="px-4">
      <a-card>
        <header class="py-4 flex gap-4">
          <button-add />
          <button-import />
        </header>
        <a-table
          :columns="columns"
          :data="displayData"
          :loading="isLoading"
          size="small"
          :page="page"
          :pagination="pagination"
          @page-change="loadData"
        >
          <template #state="{ record }">
            <a-switch
              :model-value="record.state"
              @change="
                async () => {
                  const data = rawData.find((data) => data.id === record.id)!;
                  await updateStudent({ ...data, state: Number(!data.state) });
                  await loadData();
                }
              "
            />
          </template>
          <!-- TODO -->
          <template #$operation="{ record }">
            <detail-button
              :data="record"
              :columns="columns"
            />
            <a-popconfirm
              content="确认要删除？"
              @before-ok="handleDelete(record.id)"
            >
              <a-button
                type="text"
                status="danger"
                >删除</a-button
              >
            </a-popconfirm>
          </template>
        </a-table>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>
