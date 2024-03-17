import { reactive, toRefs } from 'vue';
import { Paging, ListResponse } from '@/api/types';
import { HttpResponse } from '@/utils/request';
import { Message, PaginationProps } from '@arco-design/web-vue';

type commonObj = Record<string, any>;

interface BaseState<R = commonObj> {
  tableData: R[];
  totalAll: number;
  loading: boolean;
}

interface TableBaseMethodsType<R extends object, T extends object> {
  requestApi: (params: Paging<T>) => Promise<HttpResponse<ListResponse<R>>>;
  otherSearchParams?: Omit<T, keyof Paging>;
}

// 版本1-normal: 简单封装，table的常见数据请求和分页交互,
// 接收：表格数据的范型T, 请求方法以及参数
// 抛出以下:
// 1、loading
// 2、pagination
// 3、分页器交互方法
// 4、表格数据
// 5、表格数据请求方法
export default function useTable<R extends object, T extends object>(config: TableBaseMethodsType<R, T>) {
  const { otherSearchParams = {}, requestApi } = config;

  const state = reactive<BaseState<R>>({
    loading: false,
    tableData: [],
    totalAll: 0,
  });

  // 分页参数
  const pageParams = reactive<Paging<T>>({
    page: 1,
    pageSize: 10,
    ...(otherSearchParams as T),
  });

  // 分页器配置项
  const pagination = computed<PaginationProps>(() => {
    return {
      total: state.totalAll,
      current: pageParams.page,
      pageSize: pageParams.pageSize,
      showTotal: true,
      showMore: true,
      showJumper: true,
      showPageSize: true,
      pageSizeOptions: [10, 20, 30, 50],
      size: 'medium',
    };
  });

  // 数据更新方法
  const loadList = async () => {
    const params = toRaw(pageParams);
    state.loading = true;
    try {
      const res = await requestApi(params as Paging<T>);
      if (res.code === 200) {
        const { list, total } = res.data;
        state.tableData = list;
        state.totalAll = total;
      } else {
        Message.error(res.message);
      }
    } catch (e) {
      state.tableData = [];
      state.totalAll = 0;
      Message.error('出现异常, 请求发生失败');
    } finally {
      state.loading = false;
    }
  };

  // table events
  // @page-change="handlePageChange" 绑定
  const handlePageChange = (current: number) => {
    pageParams.page = current;
    loadList();
  };
  // @page-size-change="handleSizeChange" 绑定
  const handleSizeChange = (size: number) => {
    pageParams.page = 1;
    pageParams.pageSize = size;
    loadList();
  };

  return {
    ...toRefs(state),
    ...toRefs(pageParams),
    pagination,
    handlePageChange,
    handleSizeChange,
    loadList,
  };
}
