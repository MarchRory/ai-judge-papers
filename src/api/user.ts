import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

const schema = 'user';
const enum userApi {
  Login = `${schema}/login`,
  Info = `${schema}/info`,
  Logout = `${schema}/logout`,
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>(userApi.Login, data);
}

export function logout() {
  return axios.post<LoginRes>(userApi.Logout);
}

export function getUserInfo() {
  return axios.post<UserState>(userApi.Info);
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
