<script setup lang="ts">

import {ref} from "vue";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

const elEditorRoot = ref<HTMLElement>()
monaco.create(elEditorRoot.value, {
  value: 'console.log("Hello, world!")',
  language: 'javascript'
})

</script>

<template>
<div ref="elEditorRoot"></div>
</template>

<style scoped>

</style>