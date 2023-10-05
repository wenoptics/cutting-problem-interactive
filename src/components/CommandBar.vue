<script setup lang="ts">
import { computed, ref, UnwrapRef } from "vue";
import {
  defaultData,
  deserSessionData,
  localStorageHelper,
  serSessionData,
  sessionData,
} from "~/components/live-data";

const currentShowingDialog = ref<null | "import" | "export">(null);
function selectOrToggle(val: UnwrapRef<typeof currentShowingDialog>) {
  currentShowingDialog.value = currentShowingDialog.value === val ? null : val;
}

const editorDataImport = ref("");
const editorDataExport = computed(() => {
  return serSessionData(sessionData.value);
});

function handleImport() {
  if (!confirm("This will overwrite your current session data. Continue?")) {
    return;
  }
  try {
    sessionData.value = deserSessionData(editorDataImport.value);
  } catch (e) {
    console.error(e);
    alert("Cannot parse the input data correctly");
  }
}

function handleLoadDefault() {
  const newValue = serSessionData(defaultData);
  if (
    newValue !== editorDataExport.value &&
    !confirm("This will overwrite your current editor text. Continue?")
  ) {
    return;
  }
  editorDataImport.value = newValue;
}

function copyToClipboard() {
  navigator.clipboard.writeText(editorDataExport.value);
}

function saveLocal() {
  localStorageHelper.saveToLocal(serSessionData(sessionData.value));
}
</script>

<template>
  <el-row>
    <el-button mb="1" @click="selectOrToggle('import')"
      >Import Material & Solution</el-button
    >
    <el-button mb="1" type="primary" @click="selectOrToggle('export')">
      Export Solution
    </el-button>
  </el-row>

  <el-card
    v-if="currentShowingDialog === 'export'"
    style="max-height: 30vh"
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
    <el-button
      my="3"
      size="small"
      type="primary"
      :disabled="editorDataImport === ''"
      @click="handleImport"
      >Apply</el-button
    >
    <el-button my="3" type="text" @click="handleLoadDefault"
      >Load default data</el-button
    >
    <editor-json v-model:value="editorDataImport"></editor-json>
  </el-card>
</template>

<style scoped></style>
