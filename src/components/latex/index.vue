<script setup lang="ts">
  /**
   * 此组件用于渲染 latex 字符串
   */
  import { render } from './latex';

  const props = defineProps<{ latex: string }>();

  const ref = (el?: HTMLElement) => {
    if (!el) return;
    el.innerHTML = render(props.latex);
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

  [aria-hidden='true'] {
    display: none;
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
