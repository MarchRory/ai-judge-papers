<script setup lang="ts">
  import { cloneDeep } from 'lodash';
  import { reactive, ref, watch } from 'vue';
  import { Paging } from '@/api/types';
  import { SubjectItem, createSubjectAPI, deleteSubjectAPI, getSubjectListAPI, updateSubjectAPI } from '@/api/subject';
  import { Message } from '@arco-design/web-vue';

  const pagination = reactive<Paging<{ key: string }>>({
    page: 1,
    pageSize: 10,
    key: '',
  });

  const tableData = ref<SubjectItem[]>([]);
  const totalAll = ref(0);
  const loading = ref(false);
  function loadList() {
    loading.value = true;
    getSubjectListAPI(pagination)
      .then((res) => {
        const { total, list } = res.data;
        totalAll.value = total;
        tableData.value = list;
      })
      .finally(() => {
        loading.value = false;
      });
  }
  watch(
    () => pagination,
    (newVal, oldVal) => {
      if (!newVal.key || newVal.page !== oldVal.page || newVal.pageSize !== oldVal.pageSize) {
        loadList();
      }
    },
    { deep: true }
  );

  const isFormOpen = ref(false);
  const formRef = ref();
  const okLoading = ref(false);
  const formType = ref<'create' | 'edit'>('create');
  const form = ref<SubjectItem>({
    name: '',
    type: 0,
    state: 0,
    description: '',
    icon: '',
  });
  function handleSubmit() {
    okLoading.value = true;
    const submitFn = formType.value === 'create' ? createSubjectAPI : updateSubjectAPI;
    submitFn(form.value)
      .then((res) => {
        const { code } = res;
        if (code === 200) {
          Message.success('学科创建成功');
          loadList();
        }
      })
      .finally(() => {
        okLoading.value = false;
        isFormOpen.value = false;
      });
  }
  async function openForm(type: 'create' | 'edit', data?: SubjectItem) {
    formType.value = type;
    isFormOpen.value = true;
    if (type === 'edit') {
      Object.keys(data as SubjectItem).forEach((key) => {
        form.value[key] = data![key];
      });
    }
    formType.value = type;
    isFormOpen.value = true;
  }

  function deleteSubject(data: SubjectItem) {
    const { id } = data;
    deleteSubjectAPI(id as number).then((res) => {
      const { code } = res;
      if (code === 200) {
        Message.success('删除成功');
        loadList();
      }
    });
  }
  watch(
    () => isFormOpen.value,
    (newVal) => {
      if (!newVal) {
        setTimeout(() => {
          if (formRef.value) {
            formRef.value.resetFields();
            if (Object.prototype.hasOwnProperty.call(form.value, 'id')) {
              delete form.value.id;
            }
          }
        }, 500);
      }
    }
  );

  function jumpDetail(data: SubjectItem) {}

  loadList();
</script>

<template>
  <div>
    <a-layout h="5xl">
      <a-layout-header>
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 学科管理 </strong>
          </header>
          <section
            w="full"
            p="x-4"
            flex="~ justify-between items-center"
          >
            <div w="1/4">
              <a-input-search
                v-model="pagination.key"
                allow-clear
                placeholder="输入关键字查找学科"
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
                <template #default>创建学科</template>
              </a-button>
            </div>
          </section>
        </a-card>
      </a-layout-header>
      <a-layout-content>
        <a-card h="full">
          <a-table
            h="4xl"
            :data="tableData"
            stripe
            :loading="loading"
            page-position="br"
            :pagination="{
              total: totalAll,
              pageSize: pagination.pageSize,
              showJumper: true,
              showPageSize: true,
            }"
            sticky-header
            @page-size-change="(newSize) => (pagination.pageSize = newSize)"
            @page-change="(newPage) => (pagination.page = newPage)"
          >
            <template #columns>
              <a-table-column
                title="学科"
                data-index="name"
              ></a-table-column>
              <!-- <a-table-column title="类别">
                <template #cell="{ record }">
                  <a-tag
                    v-if="record.type === 0"
                    bordered
                    color="orangered"
                    >文</a-tag
                  >
                  <a-tag
                    v-else-if="record.type === 1"
                    bordered
                    color="arcoblue"
                    >文</a-tag
                  >
                </template>
              </a-table-column> -->
              <a-table-column
                title="其他信息"
                data-index="description"
              ></a-table-column>

              <a-table-column title="操作">
                <template #cell="{ record }">
                  <a-button
                    m="r-2"
                    type="outline"
                    status="success"
                    @click="jumpDetail(record)"
                    >详情</a-button
                  >
                  <a-popconfirm
                    content="确定要删除该学科吗？"
                    type="error"
                    @ok="deleteSubject(record)"
                  >
                    <a-button
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
    <a-modal
      v-model:visible="isFormOpen"
      :title="`${formType === 'create' ? '创建' : '更新'}学科`"
      :mask-closable="false"
      :ok-loading="okLoading"
      @ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="form"
      >
        <a-form-item
          field="name"
          label="学科"
        >
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item
          field="description"
          label="其他信息"
        >
          <a-input v-model="form.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
  :deep(.arco-table-container) {
    height: 90%;
  }
</style>
