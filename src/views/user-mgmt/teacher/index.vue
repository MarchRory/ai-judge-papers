<script setup lang="ts">
  /**
   * TODO:当前仅有结构，无js逻辑
   * 此组件需要抽取为公共组件，以便复用
   *
   * @see https://arco.design/vue/component/form
   * @see https://arco.design/vue/component/table
   */
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { reactive } from 'vue';

  // form
  const form = reactive({
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: [],
    value6: '',
  });

  // table
  const columns: TableColumnData[] = Object.entries({
    id: '教工号',
    name: '教师姓名',
    sex: '性别',
    phone: '联系电话',
    state: '账号启用',
    $operation: '操作', // virtual
  }).map(([dataIndex, title]) => ({ dataIndex, title, slotName: dataIndex }));
  const data: TableData[] = reactive([{ id: 123, name: 'Name', sex: '1', phone: '123', state: false }]);
</script>

<template>
  <a-layout class="h-full">
    <a-layout-header class="p4">
      <a-card class="px-2">
        <header class="pt-4 pb-8">
          <strong class="text-2xl"> 查询教师 </strong>
        </header>
        <div class="grid grid-cols-[1fr_auto]">
          <a-form :model="form">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="value1"
                  label="教工号"
                  label-col-flex="42px"
                >
                  <a-input
                    v-model="form.value1"
                    placeholder="请输入教工号"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="value2"
                  label="教师姓名"
                  label-col-flex="56px"
                >
                  <a-input
                    v-model="form.value2"
                    placeholder="请输入教师姓名"
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
                    <a-option value="all">全部</a-option>
                    <a-option value="man">男</a-option>
                    <a-option value="female">女</a-option>
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
                    <a-option value="all">全部</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>

          <aside class="pl-8 ml-8 mb-[20px] flex flex-col justify-between border-l border-l-solid border-[#E5E6EB]">
            <a-button type="primary">
              <template #icon>
                <icon-search />
              </template>
              <template #default>查询</template>
            </a-button>

            <a-button>
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
        <pre>{{ JSON.stringify(form,null,4) }}
          <!-- TODO: 测试 -->
        </pre>
        <header class="py-4 flex gap-4">
          <a-button type="primary">
            添加
            <template #icon>
              <icon-plus />
            </template>
          </a-button>
          <a-button> 批量导入 </a-button>
        </header>
        <a-table
          :columns="columns"
          :data="data"
          size="small"
        >
          <template #state="{ record }">
            <a-switch v-model="record.state" />
          </template>
          <template #$operation>
            <a-button type="text">详情</a-button>
            <a-button
              type="text"
              status="danger"
              >删除</a-button
            >
          </template>
        </a-table>
      </a-card>
    </a-layout-content>
  </a-layout>
</template>
