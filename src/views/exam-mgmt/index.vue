<script setup lang="ts">
  import { ref, defineAsyncComponent } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import useTable from '@/hooks/table/useTable';
  import { deleteExamApi, getExamListApi } from '@/api/exam';
  import type { ExamFormData, ExamListItem } from '@/api/exam';
  import { examStateMap } from './config';

  const FormModal = defineAsyncComponent(() => import('./components/formModal.vue'));
  const now = new Date().getTime();
  const router = useRouter();
  const otherSearchParams = { key: '' };
  const { key, loading, page, tableData, pagination, loadList, handleSizeChange, handlePageChange } = useTable<
    ExamListItem,
    typeof otherSearchParams
  >({
    requestApi: getExamListApi,
    otherSearchParams,
  });

  function reset() {
    key.value = '';
    page.value = 1;
    loadList();
  }

  const isFormOpen = ref(false);
  const formType = ref<'create' | 'edit'>('create');
  const form = ref<ExamFormData>({
    description: '',
    name: '',
    state: undefined,
    subject: undefined,
    time: undefined,
    timeLimit: 0,
    type: undefined,
  });
  async function openForm(type: 'create' | 'edit', data?: ExamFormData) {
    formType.value = type;
    isFormOpen.value = true;
    if (type === 'edit') {
      form.value = data as ExamFormData;
    }
    formType.value = type;
    isFormOpen.value = true;
  }

  function deleteSubject(data: ExamListItem) {
    const { id } = data;
    deleteExamApi(id as number).then((res) => {
      const { code } = res;
      if (code === 200) {
        Message.success('删除成功');
        loadList();
      }
    });
  }

  function jumpDetail(query) {
    router.push({
      path: '/exam-mgmt/examDetail',
      query,
    });
  }

  const handleSubmitSuccess = () => {
    isFormOpen.value = false;
    loadList();
  };

  loadList();
</script>

<template>
  <div>
    <a-layout h="5xl">
      <a-layout-header>
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 考试管理 </strong>
          </header>
          <section
            w="full"
            p="x-4"
            flex="~ justify-between items-center"
          >
            <div
              w="1/4"
              flex="~"
            >
              <a-input-search
                v-model="key"
                allow-clear
                placeholder="输入关键字查找相关考试"
                search-button
                @search="loadList"
              />
              <a-button
                m="l-2"
                @click="reset"
              >
                <template #icon>
                  <icon-refresh />
                </template>
                <template #default> 重置 </template>
              </a-button>
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
                <template #default>创建考试</template>
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
            :pagination="pagination"
            sticky-header
            @page-size-change="handleSizeChange"
            @page-change="handlePageChange"
          >
            <template #columns>
              <a-table-column
                title="考试"
                data-index="name"
              ></a-table-column>
              <a-table-column
                title="学科"
                data-index="subject"
                :width="100"
              >
              </a-table-column>
              <a-table-column title="分类">
                <template #cell="{ record }">
                  <a-tag
                    bordered
                    :color="`${record.type === 0 ? 'orangered' : 'arcoblue'}`"
                    >{{ record.type === 0 ? '文' : '理' }}</a-tag
                  >
                </template>
              </a-table-column>
              <a-table-column
                title="状态"
                data-index="time"
                :width="100"
              >
                <template #cell="{ record }">
                  {{ examStateMap[record.state].text }}
                </template>
              </a-table-column>
              <a-table-column
                title="开考时间"
                data-index="time"
              >
                <template #cell="{ record }">
                  {{ new Date(record.time).toLocaleString() }}
                </template>
              </a-table-column>
              <a-table-column
                title="交卷时间"
                data-index="time"
              >
                <template #cell="{ record }">
                  {{ new Date(record.timeLimit).toLocaleString() }}
                </template>
              </a-table-column>
              <a-table-column
                title="考试时长"
                data-index="timeLimit"
              >
                <template #cell="{ record }"> {{ ((record.timeLimit - record.time) / (1000 * 60)).toFixed() }}分钟 </template>
              </a-table-column>
              <a-table-column
                title="其他信息"
                data-index="description"
              ></a-table-column>

              <a-table-column
                title="操作"
                :width="250"
              >
                <template #cell="{ record }">
                  <a-button
                    m="r-2"
                    type="outline"
                    status="success"
                    @click="jumpDetail(record)"
                    >详情</a-button
                  >
                  <a-button
                    v-if="now < record.time"
                    m="r-2"
                    type="outline"
                    status="warning"
                    @click="openForm('edit', record)"
                    >更新</a-button
                  >
                  <a-popconfirm
                    content="确定要删除该学科吗？"
                    type="error"
                    @ok="deleteSubject(record)"
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
    <FormModal
      :create="formType"
      :visible="isFormOpen"
      :form-data="form"
      @on-cancel="isFormOpen = false"
      @on-succes="handleSubmitSuccess"
    />
  </div>
</template>

<style scoped lang="less">
  :deep(.arco-table-container) {
    height: 90%;
  }
</style>
