<script setup lang="ts">
import { computed, ref, UnwrapRef } from "vue";
import {
  defaultData,
  saveSessionData,
  sessionData,
} from "~/components/live-data";

const currentShowingDialog = ref<null | "import" | "export">(null);
function selectOrToggle(val: UnwrapRef<typeof currentShowingDialog>) {
  currentShowingDialog.value = currentShowingDialog.value === val ? null : val;
}

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

function copyToClipboard() {
  navigator.clipboard.writeText(editorDataExport.value);
}

function saveLocal() {
  saveSessionData(sessionData.value);
}
</script>

<template>
  <el-row>
    <el-button mb="1" @click="selectOrToggle('import')"
      >Import Material & Solution</el-button
    >
    <el-button
      mb="1"
      type="primary"
      @click="
        syncCurrentSessionData();
        selectOrToggle('export');
      "
    >
      Export Solution
    </el-button>
  </el-row>

  <el-card
    v-if="currentShowingDialog === 'export'"
    style="max-height: 50vh"
    body-class="pa-1"
  >
    <el-button my="3" size="small" type="primary" @click="saveLocal"
      >Save locally</el-button
    >
    <el-button my="3" size="small" type="text" @click="copyToClipboard"
      >Copy to clipboard</el-button
    >
    <editor-json
      :value="editorDataExport"
      :is-read-only="true"
      :show-line-numbers="false"
    ></editor-json>
  </el-card>

  <el-card
    v-if="currentShowingDialog === 'import'"
    style="max-height: 50vh"
    body-class="pa-1"
  >
    TODO
    <!--    <el-button type="text" @click="handleLoadDefault"-->
    <!--      >Load default data</el-button-->
    <!--    >-->
    <!--    <editor-json :value="editorDataImport"></editor-json>-->
  </el-card>
</template>

<style scoped></style>
