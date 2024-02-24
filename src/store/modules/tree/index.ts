import { defineStore } from 'pinia';
import { getPermissionTreeAPI } from '@/api/permissions';
import initPermissionTree, { initPermissionSelectTree } from '@/utils/permissions';
import { TreeStateType } from './types';

const useTreeStore = defineStore('tree', {
  state: (): TreeStateType => {
    return {
      originPermissionTree: [],
      permissionTree: [],
      permissionSelectTree: [],
    };
  },
  actions: {
    init() {
      if (this.originPermissionTree.length) return;
      getPermissionTreeAPI().then(({ data }) => {
        this.originPermissionTree = data;
        this.permissionTree = initPermissionTree(data);
        this.permissionSelectTree = initPermissionSelectTree(data);
      });
    },
  },
});

export default useTreeStore;
