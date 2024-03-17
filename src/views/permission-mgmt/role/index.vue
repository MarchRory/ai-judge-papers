<script setup lang="ts">
  import { clone } from 'lodash';
  import { reactive, ref, watch } from 'vue';
  import { Paging } from '@/api/types';
  import { createRoleAPI, deleteRoleAPI, getByRoleAPI, getRoleListAPI, updateRoleAPI } from '@/api/permissions';
  import { BaseRole, PermissionTreeNode } from '@/types/permissions';
  import useTreeStore from '@/store/modules/tree';
  import { Message, TreeNodeData } from '@arco-design/web-vue';
  import { getSpecificValueArr } from '@/utils/arrayHelper';
  import { initPermissionTree } from '@/utils/permissions';
  import getConnectedKidPermissions from '@/filter/permissions';

  const pagination = reactive<Paging<{ key: string }>>({
    page: 1,
    pageSize: 10,
    key: '',
  });

  const tableData = ref<Omit<BaseRole, 'auth'>[]>([]);
  const totalAll = ref(0);
  const loading = ref(false);
  function loadList() {
    loading.value = true;
    getRoleListAPI(pagination)
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
  const { permissionSelectTree } = useTreeStore();
  const form = ref<BaseRole>({
    key: '',
    name: '',
    desc: '',
    auth: [],
  });
  function handleSubmit() {
    form.value.auth = getConnectedKidPermissions(form.value.auth);
    okLoading.value = true;
    const submitFn = formType.value === 'create' ? createRoleAPI : updateRoleAPI;
    submitFn(form.value)
      .then((res) => {
        const { code } = res;
        if (code === 200) {
          Message.success(`角色${formType.value === 'create' ? '创建' : '更新'}成功`);
          loadList();
        }
      })
      .finally(() => {
        okLoading.value = false;
        isFormOpen.value = false;
      });
  }
  function filterTreeNode(searchValue: string, nodeData: TreeNodeData) {
    return (nodeData.title as string).includes(searchValue);
  }

  function getAuth(id: number): Promise<number[]> {
    return new Promise((resolve) => {
      getByRoleAPI(id).then(({ data }) => {
        const { list } = data;
        const auth = getSpecificValueArr(list, 'id');
        resolve(auth);
      });
    });
  }
  async function openForm(type: 'create' | 'edit', data?: BaseRole) {
    if (type === 'edit') {
      const { id, key, name, desc } = data as BaseRole;
      form.value.id = id;
      form.value.key = key;
      form.value.name = name;
      form.value.desc = desc;
      const auth = await getAuth(id as number);
      form.value.auth = auth;
    }
    formType.value = type;
    isFormOpen.value = true;
  }

  function deleteRole(data: BaseRole) {
    const { id } = data;
    deleteRoleAPI(id as number).then((res) => {
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
  const detailAuthVisible = ref(false);
  const deatailAuthModalInfo = reactive<{ roleName: string; auth: PermissionTreeNode[] }>({
    roleName: '',
    auth: [],
  });
  function showAuth(data: BaseRole) {
    const { id, name } = data;
    getByRoleAPI(id as number).then(({ data }) => {
      const { list } = data;
      deatailAuthModalInfo.auth = initPermissionTree(list);
      deatailAuthModalInfo.roleName = name;
      detailAuthVisible.value = true;
    });
  }
  watch(
    () => detailAuthVisible.value,
    (newVal) => {
      if (!newVal) {
        setTimeout(() => {
          deatailAuthModalInfo.auth = [];
          deatailAuthModalInfo.roleName = '';
        }, 1000);
      }
    }
  );

  loadList();
</script>

<template>
  <div>
    <a-layout h="5xl">
      <a-layout-header>
        <a-card>
          <header class="pt-4 pb-8">
            <strong class="text-2xl"> 权限角色 </strong>
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
                placeholder="输入关键字查找角色"
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
                <template #default>创建角色</template>
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
                title="角色名"
                data-index="name"
              ></a-table-column>
              <a-table-column
                title="唯一标识"
                data-index="key"
              ></a-table-column>
              <a-table-column
                title="角色描述"
                data-index="desc"
              ></a-table-column>
              <a-table-column title="操作">
                <template #cell="{ record }">
                  <a-button
                    m="r-2"
                    type="outline"
                    status="success"
                    @click="showAuth(record)"
                    >查看</a-button
                  >
                  <a-button
                    v-if="record.id !== 1"
                    m="r-2"
                    type="outline"
                    status="warning"
                    @click="openForm('edit', record)"
                    >编辑</a-button
                  >
                  <a-popconfirm
                    v-if="record.id !== 1"
                    content="确定要删除该角色吗？"
                    type="error"
                    @ok="deleteRole(record)"
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
      :title="`${formType === 'create' ? '创建' : '更新'}角色`"
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
          label="角色名"
        >
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item
          field="key"
          label="唯一标识"
        >
          <a-input v-model="form.key" />
        </a-form-item>
        <a-form-item
          field="desc"
          label="角色描述"
        >
          <a-input v-model="form.desc" />
        </a-form-item>
        <a-form-item
          field="auth"
          label="权限配置"
        >
          <a-tree-select
            v-model="form.auth"
            size="large"
            :allow-search="true"
            :multiple="true"
            :allow-clear="true"
            :tree-checkable="true"
            :filter-tree-node="filterTreeNode"
            :tree-check-strictly="false"
            tree-checked-strategy="parent"
            :data="permissionSelectTree"
            placeholder="请配置权限"
            style="width: 100%"
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="detailAuthVisible"
      :mask-closable="false"
      :title="`${deatailAuthModalInfo.roleName}角色权限`"
      hide-cancel
    >
      <a-card
        h="2xl"
        overflow="auto"
      >
        <a-tree
          :data="deatailAuthModalInfo.auth"
          :show-line="true"
          size="large"
        />
      </a-card>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
  :deep(.arco-table-container) {
    height: 90%;
  }
</style>
