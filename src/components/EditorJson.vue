<script lang="ts" setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
// import "monaco-editor/esm/vs/language/json/monaco.contribution";

// monaco.languages.register({ id: 'custom' })
// monaco.languages.setMonarchTokensProvider('custom', customLangMonarch)

const props = defineProps<{
  value: string;
  isReadOnly?: boolean;
  showLineNumbers?: boolean;
}>();

const emit = defineEmits(["update:value"]);

const editor = ref();

let editorInstance: monaco.editor.IStandaloneCodeEditor;

watch(
  () => props.value,
  (v) => {
    editorInstance.setValue(v);
  },
);

onMounted(() => {
  editorInstance = monaco.editor.create(editor.value, {
    value: props.value,
    language: "json",
    readOnly: props.isReadOnly,
    automaticLayout: true,
    lineNumbers: props.showLineNumbers ? "on" : "off",
    folding: true,
  });
  // console.debug("editorInstance", editorInstance);

  editorInstance.onDidChangeModelContent(() => {
    console.debug("onDidChangeModelContent");
    emit("update:value", editorInstance.getValue());
  });
});
</script>

<template>
  <div id="editor" ref="editor" class="flex" />
</template>

<style scoped>
#editor {
  width: 95vw;
  height: 95vh;
}
</style>
