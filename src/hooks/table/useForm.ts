import { HttpResponse } from '@/utils/request';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { cloneDeep } from 'lodash';
import Message from '@arco-design/web-vue/es/message';

type formType = 'create' | 'edit';
type commonObj = Record<string, any>;
interface formState<R = commonObj> {
  form: R;
  formType: formType;
  submitLoading: boolean;
}
interface FormBaseMethod<R extends object = commonObj> {
  formCreateApi: (data: R) => Promise<HttpResponse>;
  formUpdateApi?: (data: R) => Promise<HttpResponse>;
  onSuccess?: (...args: any[]) => any;
  onFail?: (...args: any[]) => any;
  visible?: Ref<boolean>;
}

// 设计上感觉有点问题， 没法在页面内很好地让form和page组件解耦， 后面看看改一下
export function useForm<R extends object>(formRef: FormInstance | undefined, config: FormBaseMethod<R>) {
  const { visible, formCreateApi, formUpdateApi, onSuccess, onFail } = config;

  const formState = reactive<formState<R>>({
    form: {} as R,
    formType: 'create',
    submitLoading: false,
  });
  const isFormOpen = visible || ref(false);
  // 打开表单和数据初始化
  const openForm = (type: formType, data?: R) => {
    if (type === 'edit') {
      // @ts-ignore
      tableState.form = cloneDeep(data) as R;
    }
    formState.formType = type;
    isFormOpen.value = true;
  };
  // 关闭表单, 初始化type
  const closeForm = () => {
    isFormOpen.value = false;
    formState.formType = 'create';
  };
  // 数据提交
  const handleSubmit = async () => {
    if (formCreateApi && formUpdateApi) {
      const submitFn = formState.formType === 'create' ? formCreateApi : formUpdateApi;
      const data = toRaw(formState.form);
      formState.submitLoading = true;
      try {
        // @ts-ignore
        const res = await submitFn(data);
        const { success, message } = res;
        if (success) {
          const text = `${formState.formType === 'create' ? '创建' : '修改'}成功`;
          Message.success(text);
          closeForm();
          onSuccess && onSuccess(); // eslint-disable-line
        } else {
          Message.error(message);
        }
      } catch (e) {
        onFail && onFail(); // eslint-disable-line
      } finally {
        formState.submitLoading = false;
      }
    } else {
      throw new Error('表单提交请求方法缺失');
    }
  };

  watch(
    () => isFormOpen.value,
    (newVal) => {
      if (!newVal) {
        setTimeout(() => {
          if (formRef) {
            formRef.resetFields();
            if (Object.prototype.hasOwnProperty.call(formState.form, 'id')) {
              // @ts-ignore
              delete tableState.form.id;
            }
          }
        }, 500);
      }
    },
  );

  return {
    isFormOpen,
    ...toRefs(formState),
    closeForm,
    openForm,
    handleSubmit,
  };
}

// 主要用于封装业务form组件中Props定义
export type useFormReturn = Partial<ReturnType<typeof useForm>>;
