<script setup lang="ts">
  /**
   * 此组件用于渲染 latex 字符串
   *
   * ！！务必注意 katex.css 的样式问题！！！
   */
  import { render } from './latex';
  /**
   * katex 会自动加载当前网页路径下的 css，但没有选项禁止
   * 所以忽略控制台的 404 信息
   * 这里需要手动导入
   */
  import 'katex/dist/katex.css';

  const props = defineProps<{ latex: string }>();

  const ref = (el?: HTMLElement) => {
    if (!el) return;
    const renderText = props.latex.replace(/\\n/g, '\n');
    el.innerHTML = render(renderText);
  };
</script>

<template>
  <!-- 此处ref没问题，可能是类型定义的问题 -->
  <div
    :ref="ref"
    class="ai-judge-papers-latex"
  ></div>
</template>

<style>
  .ai-judge-papers-latex * {
    padding: 0;
    margin: 0;
  }

  .katex .katex-mathml {
    position: unset !important;
  }

  .katex-display {
    overflow: auto hidden;
  }

  .katex-display > .katex {
    white-space: normal;
  }
  /* Add space between broken lines: */
  .katex-display > .base {
    margin: 0.25em 0;
  }
  /* Compensate by reducing space around display math */
  .katex-display {
    margin: 0.5em 0;
  }
</style>
