import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  success: boolean;
  code: number;
  data: T;
  message: string;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // http error response guard
    if (!res.success) {
      Message.error({
        content: res.message || '未知错误',
        duration: 5 * 1000,
      });
      // TODO: 这里可能还需要根据后端修改
      // 401 Token已过期
      // 403 鉴权失败
      if ([401, 403].includes(res.code) && response.config.url !== '/api/user/info') {
        Modal.error({
          title: '确认注销',
          content: '您已经注销，您可以取消并停留在此页面，或者重新登录',
          okText: '重新登陆',
          async onOk() {
            const userStore = useUserStore();

            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.message || '未知错误'));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || '网络错误',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
