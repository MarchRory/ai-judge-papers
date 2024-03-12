interface stateConfig {
  text: string;
  iconColor: string;
}
type typeConfig = stateConfig;

export const examStateMap: Record<number, stateConfig> = {
  1: {
    text: '未开始',
    iconColor: '',
  },
  2: {
    text: '进行中',
    iconColor: '',
  },
  3: {
    text: '阅卷中',
    iconColor: '',
  },
  4: {
    text: '已结束',
    iconColor: '',
  },
};

export const examTypeMap: Record<number, typeConfig> = {
  1: {
    text: '',
    iconColor: '',
  },
};
