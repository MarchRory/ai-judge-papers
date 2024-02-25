<script setup lang="ts">
  import { SubjectItem } from '@/api/subject';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import tempImg1 from '@/assets/images/temp_paper1.jpg';
  import tempImg2 from '@/assets/images/temp_paper2.jpg';
  import { FileItem, RequestOption, UploadRequest } from '@arco-design/web-vue';

  const queryData = useRoute().query as SubjectItem;
  const router = useRouter();
  const tempPapers = ref([
    { name: '语文答题卡样卷1', src: tempImg1, isPreview: false },
    { name: '语文答题卡样卷2', src: tempImg2, isPreview: false },
  ]);

  function loadAnswerSheet() {}
  function handleUploadSuccess(file: FileItem) {}
</script>

<template>
  <div>
    <a-layout>
      <a-layout-header>
        <a-card>
          <header text="center">
            <strong text="3xl">{{ queryData.name }}</strong
            ><br />
          </header>
        </a-card>
      </a-layout-header>
      <br />
      <a-layout-content>
        <a-card class="py-5">
          <header flex="~ justify-between">
            <strong text="2xl">答题卡预设</strong><br />
            <a-upload
              w="fit"
              action="/"
              accept="image/*"
              @success="handleUploadSuccess"
            />
          </header>
          <span
            block
            w="full"
            h="0.6"
            bg="gray-200"
            m="t-4 b-4"
          />
          <section flex="~ row wrap justify-around">
            <div
              v-for="(item, index) in tempPapers"
              :key="index"
              class="w-3xl aspect-ratio-[4/3]"
              p="x-3 y-4"
              border="~ solid 3 gray-300 rounded-3"
              text="center"
            >
              <a-image
                :src="item.src"
                :title="item.name"
                description="答题卡样卷"
                width="600"
                footer-position="outer"
                :preview="item.isPreview"
                :preview-visible="item.isPreview"
                @preview-visible-change="
                  () => {
                    item.isPreview = false;
                  }
                "
              >
                <template #extra>
                  <div>
                    <span
                      class="block cursor-pointer p-1"
                      hover="bg-gray-100"
                      @click="
                        () => {
                          item.isPreview = true;
                        }
                      "
                      ><icon-eye size="30"
                    /></span>
                  </div>
                </template>
              </a-image>
            </div>
          </section>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>
