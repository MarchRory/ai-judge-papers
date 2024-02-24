import { NestArr } from '@/api/types';

/**
 * @description 抽取一个嵌套的对象数组里指定key的值, 组成新数组返回
 * @param target
 * @param key
 */
export function getSpecificValueArr(target: NestArr<any>[], key: string): any[] {
  const res = [];
  target.forEach((item) => {
    res.push(item[key]);
    if (Array.isArray(item.children)) {
      res.push(...getSpecificValueArr(item.children, key));
    }
  });
  return res;
}

export function todo() {}
