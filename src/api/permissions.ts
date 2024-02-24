import axios from 'axios';
import { PermissionType } from '@/store/modules/user/types';
import { BaseRole, PermissionItem } from '@/types/permissions';
import { ListResponse, NestArr, Paging } from './types';

const schemaPermission = 'permissions';
const enum PermissionsApi {
  tree = `${schemaPermission}/tree`,
  create = `${schemaPermission}/schema`,
  delete = `${schemaPermission}/delete`,
  update = `${schemaPermission}/update`,
  getById = `${schemaPermission}/get`,
  getByRole = `${schemaPermission}/getByRole`,
  page = `${schemaPermission}/list`,
}

const schemaRole = 'role';
const enum RoleApi {
  create = `${schemaRole}/create`,
  delete = `${schemaRole}/delete`,
  page = `${schemaRole}/list`,
  update = `${schemaRole}/update`,
  bind = `${schemaRole}/bindToUser`,
  linkedUser = `${schemaRole}/getByuser`,
}

export function createPermissionAPI(data: PermissionType) {
  return axios.post(PermissionsApi.create, data);
}

export function getPermissionTreeAPI() {
  return axios.post<NestArr<PermissionItem>[]>(PermissionsApi.tree);
}

export function updatePermissionAPI(data: PermissionType) {
  return axios.post(PermissionsApi.update, data);
}

export function deletePermissionAPI(ids: { id: any }) {
  return axios.post(PermissionsApi.delete, ids);
}

export function createRoleAPI(data: BaseRole) {
  return axios.post(RoleApi.create, data);
}

export function deleteRoleAPI(id: number) {
  return axios.post(RoleApi.delete, { id, force: true });
}

export function updateRoleAPI(data: BaseRole) {
  return axios.post(RoleApi.update, data);
}

export function getRoleListAPI(data: Paging<{ key: string }>) {
  return axios.post<ListResponse<Omit<BaseRole, 'auth'>>>(RoleApi.page, data);
}

export function getUserRoleAPI(id: number) {
  return axios.post(RoleApi.linkedUser, { id });
}

export function roleBindUserAPI(data: { userId: number; roleId: number }) {
  return axios.post(RoleApi.bind, data);
}

export function getByRoleAPI(id: number) {
  return axios.post<ListResponse<NestArr<PermissionItem>>>(PermissionsApi.getByRole, { id });
}
