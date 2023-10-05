<script setup lang="ts">
import { computed, ref } from "vue";
import { defaultData, sessionData } from "~/components/live-data";

const currentShowingDialog = ref<null | "import" | "export">(null);

const editorDataImport = ref("");
const editorDataExport = ref("");

function handleImport() {
  console.debug("handleImport");
}

function handleLoadDefault() {
  editorDataImport.value = JSON.stringify(defaultData, null, 2);
}

function syncCurrentSessionData() {
  editorDataExport.value = JSON.stringify(sessionData.value, null, 2);
}
</script>

<template>
  <el-row>
    <el-button mb="1" @click="currentShowingDialog = 'import'"
      >Import Material & Solution</el-button
    >
    <el-button
      mb="1"
      type="primary"
      @click="
        syncCurrentSessionData();
        currentShowingDialog = 'export';
      "
    >
      Export Solution
    </el-button>
  </el-row>

  <el-card v-if="currentShowingDialog === 'export'" style="max-height: 50vh">
    <editor-json :value="editorDataExport" :is-read-only="true"></editor-json>
  </el-card>

  <el-card v-if="currentShowingDialog === 'import'" style="max-height: 50vh">
    TODO
    <!--    <el-button type="text" @click="handleLoadDefault"-->
    <!--      >Load default data</el-button-->
    <!--    >-->
    <!--    <editor-json :value="editorDataImport"></editor-json>-->
  </el-card>
</template>

<style scoped></style>
