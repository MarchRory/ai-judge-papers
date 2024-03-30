<script setup lang="ts">
  /**
   *@description 考试组crud
   */
  import { ref } from 'vue';
  import useTable from '@/hooks/table/useTable';
  import { useForm } from '@/hooks/table/useForm';
  import { getGroupList, createGroupApi, updateGroupApi, type Group, deleteGroupApi } from '@/api/exam';
  import { type FormInstance } from '@arco-design/web-vue';
  import { examStateMap } from '../config';

  const now = new Date().getTime();
  const formRef = ref<FormInstance>();
  const otherSearchParams = { key: '', order: 1 };
  const { key, order, tableData, page, loading, pagination, loadList, handlePageChange, handleSizeChange, handleDelete } = useTable<
    Group,
    typeof otherSearchParams
  >({
    requestApi: getGroupList,
    deleteApi: deleteGroupApi,
    otherSearchParams,
  });
  const { isFormOpen, formType, form, submitLoading, handleSubmit, openForm, closeForm } = useForm<Group>(formRef.value, {
    formCreateApi: createGroupApi,
    formUpdateApi: updateGroupApi,
    onSuccess: () => {
      page.value = 1;
      loadList();
    },
  });
  const setupComp = () => {
    loadList();
  };

  setupComp();
</script>

<template>
  <div>
    <a-layout h="1/1">
      <a-layout-header>
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 考试组配置 </strong>
          </header>
          <section
            w="full"
            p="x-4"
            flex="~ justify-between items-center"
          >
            <div w="1/4">
              <a-input-search
                v-model="key"
                allow-clear
                placeholder="输入关键字查询"
                search-button
                @search="loadList"
              />
            </div>
            <div w="1/4">
              <a-button
                type="primary"
                @click="openForm('create')"
              >
                <template #icon>
                  <icon-plus-circle />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>新建</template>
              </a-button>
            </div>
          </section>
        </a-card>
      </a-layout-header>
      <a-layout-content>
        <a-card h="full">
          <a-table
            h="full"
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
                title="考试组"
                data-index="name"
              ></a-table-column>
              <a-table-column
                title="状态"
                data-index="state"
              >
                <template #cell="{ record }"> {{ examStateMap[record.state].text }}</template>
              </a-table-column>
              <a-table-column
                title="开考日期"
                data-index="time"
              >
                <template #cell="{ record }">
                  {{ new Date(record.time).toLocaleString() }}
                </template>
              </a-table-column>
              <a-table-column
                title="结束日期"
                data-index="timeLimit"
              >
                <template #cell="{ record }">
                  {{ new Date(record.timeLimit).toLocaleString() }}
                </template>
              </a-table-column>
              <a-table-column
                title="其他信息"
                data-index="description"
              ></a-table-column>
              <a-table-column title="操作">
                <template #cell="{ record }">
                  <a-button
                    v-if="now < record.time"
                    m="r-2"
                    type="outline"
                    status="warning"
                    @click="openForm('edit', record)"
                    >更新</a-button
                  >
                  <a-popconfirm
                    :content="`确定删除该考试组${record.name}吗？`"
                    type="error"
                    @ok="handleDelete(record)"
                  >
                    <a-button
                      v-if="now < record.time"
                      type="primary"
                      status="danger"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
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
    <a-model> </a-model>
  </div>
</template>
