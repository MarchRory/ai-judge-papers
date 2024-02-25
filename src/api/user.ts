import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { ListResponse, Paging } from './types';

const schema = 'user';
const enum userApi {
  Login = `${schema}/login`,
  Info = `${schema}/info`,
  Logout = `${schema}/logout`,
  create = `${schema}/create`,
  update = `${schema}/update-admin`,
  delete = `${schema}/delete-admin`,
  page = `${schema}/list`,
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserItem {
  id?: number;
  username: string;
  nickname: string;
  password: string;
  email: string;
  phone: string;
  avatar: string;
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

export function createUserAPI(data: UserItem) {
  return axios.post(userApi.create, data);
}

export function updateUserAPI(data: UserItem) {
  return axios.post(userApi.update, data);
}

export function deleteUserAPI(id: number) {
  return axios.post(userApi.delete, { id });
}

export function getUserListAPI(data: Paging<{ key: string }>) {
  return axios.post<ListResponse<UserItem[]>>(userApi.page, data);
}
