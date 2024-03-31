interface stateConfig {
  value: number;
  text: string;
  groupState: string;
  iconColor: string;
  btnText: string;
}

export const examStateMap: Record<number, stateConfig> = {
  1: {
    value: 1,
    text: '准备中',
    groupState: '准备中',
    iconColor: '',
    btnText: '启动阅卷',
  },
  2: {
    value: 2,
    text: 'AI判卷中',
    groupState: '阅卷中',
    iconColor: '',
    btnText: '等待AI阅卷结束',
  },
  3: {
    value: 3,
    text: 'AI判卷结束',
    groupState: '阅卷中',
    iconColor: '',
    btnText: '去复审',
  },
  4: {
    value: 4,
    text: '已提交阅卷结果',
    groupState: '已结束',
    iconColor: '',
    btnText: '考试回顾',
  },
};

export const todoConfig = {};
