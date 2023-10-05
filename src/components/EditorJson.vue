<script lang="ts" setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// monaco.languages.register({ id: 'custom' })
// monaco.languages.setMonarchTokensProvider('custom', customLangMonarch)

const props = defineProps<{
  value: string;
  isReadOnly?: boolean;
}>();

const editor = ref();

let editorInstance: monaco.editor.IStandaloneCodeEditor;

onMounted(() => {
  editorInstance = monaco.editor.create(editor.value, {
    value: props.value,
    language: "javascript",
    readOnly: props.isReadOnly,
  });
  console.log("editorInstance", editorInstance);
});
</script>

<template>
  <div id="editor" ref="editor" />
</template>

<style scoped>
#editor {
  width: 100vw;
  height: 100vh;
}
</style>
