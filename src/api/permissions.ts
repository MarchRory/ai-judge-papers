import axios from 'axios';
import { PermissionType } from '@/store/modules/user/types';

const schema = 'permissions';
const enum PermissionsApi {
  tree = `${schema}/tree`,
  create = `${schema}/schema`,
  delete = `${schema}/delete`,
  update = `${schema}/update`,
  getById = `${schema}/get`,
  getByRole = `${schema}/getByRole`,
  page = `${schema}/list`,
}

export function createPermissionAPI(data: PermissionType) {
  return axios.post(PermissionsApi.create, data);
}

export function getPermissionTreeAPI() {
  return axios.post(PermissionsApi.tree);
}

export function updatePermissionAPI(data: PermissionType) {
  return axios.post(PermissionsApi.update, data);
}

export function deletePermissionAPI(ids: { id: any }) {
  return axios.post(PermissionsApi.delete, ids);
}
