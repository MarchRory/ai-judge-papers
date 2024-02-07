/**
 * 防抖
 * @param fn 被防抖的函数
 * @param delay 防抖间隔
 * @param immediate 是否立即执行
 */
export function debounce(callback: (...args: any[]) => any, delay = 300, immediate = false) {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (!immediate) {
      timer = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    } else {
      /* eslint-disable-next-line */
      !timer && callback.apply(this, args);
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
  };
}

/**
 * 节流
 * @param fn 被节流函数
 * @param delay 节流时间
 */
export function throttle(callback: (...args: any[]) => any, delay = 3 * 1000) {
  let start = Date.now();
  /* eslint-disable-next-line */
  return (...args: any[]) => {
    const now = Date.now();
    if (now - start >= delay) {
      start = now;
      return callback.apply(this, args);
    }
  };
}
