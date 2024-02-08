<template>
  <a-spin
    :loading="loading"
    style="width: 100%"
  >
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <template #title> 考试类别占比 </template>
      <Chart
        height="310px"
        :option="chartOption"
      />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';

  const props = withDefaults(
    // TODO: 删除 withDefaults，仅测试
    // 亦可直接请求数据
    defineProps<{
      data: Record<string, number>;
    }>(),
    {
      data: () => ({
        语文: 123,
        数学: 456,
        英语: 789,
      }),
    }
  );

  const { loading } = useLoading();
  const { chartOption } = useChartOption((isDark) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    return {
      legend: {
        left: 'center',
        data: Object.keys(props.data),
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: '考试场次',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              // 此处计算总考试场次
              text: Object.values(props.data).reduce((acc, cur) => acc + cur, 0),
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{d}%',
            fontSize: 14,
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: Object.entries(props.data).map(([name, count]) => ({
            name,
            value: [count],
          })),
        },
      ],
    };
  });
</script>

<style scoped lang="less"></style>
