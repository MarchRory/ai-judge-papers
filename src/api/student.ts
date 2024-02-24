import axios from 'axios';
import { TableData } from '@arco-design/web-vue';
import { withPaging } from './utils';

export interface Student extends TableData {
  id: number;
  number: string;
  name: string;
  sex: number;
  classId: number;
  grade: string;
  graduation: number;
  state: number;
}

export const fieldsDescription: { [field in keyof Student]: string } = {
  id: 'id',
  number: 'number',
  name: 'name',
  sex: 'sex',
  classId: 'classId',
  grade: 'grade',
  graduation: 'graduation',
  state: 'state',
};
