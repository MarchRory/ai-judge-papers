<script setup lang="ts">
  /**
   * 单个试题
   */

  const props = defineProps<{
    /**
     * 序号，注意要从 1 开始
     */
    number: number;
  }>();

  function handlePassReview() {}

  function handleManualCorrection() {}
</script>

<template>
  <div>
    <div class="flex justify-between gap-4 mb-4">
      <!-- left: the question area -->
      <div class="flex-1">
        <div class="grid grid-cols-[auto_1fr] gap-2 items-center">
          <div class="bg-gray-100 text-sm text-center aspect-1/1 h-1.3rem line-height-1.3rem align-middle rounded-lg select-none">
            {{ number }}
          </div>
          <strong>Maybe title?</strong>
        </div>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis possimus optio modi, sit facilis aliquid sapiente aperiam
          nulla, laboriosam illo iste veniam voluptatem accusantium iure nisi ex, repudiandae consequatur? Magni?
        </p>
      </div>

      <!-- right: the operation panel -->
      <div>
        <div class="py-4 flex justify-around items-center text-3xl">
          <span>2.5</span>
          <span class="text-4xl font-thin">/</span>
          <span>10</span>
        </div>
        <div class="grid">
          <a-button
            status="success"
            @click="handlePassReview"
            >复审通过</a-button
          >
          <a-button
            status="warning"
            @click="handleManualCorrection"
            >人工批改</a-button
          >
        </div>
      </div>
    </div>
    <a-divider></a-divider>
  </div>
</template>
