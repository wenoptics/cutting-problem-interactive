<script setup lang="ts">

import {ref} from "vue";

import {TargetShape, TargetShapePool} from "~/components/types";

const props = defineProps<{
  data: TargetShapePool,
  used: string[],
  filterFn?: ((shape: TargetShape) => boolean)
}>()


</script>

<template>

  <el-row>
    <el-button
      size="small"
      v-for="shape in Object.values(props.data)"
      :key="shape.id"
      :disabled="props.used.includes(shape.id)"
      v-if="filterFn ? filterFn(shape) : true"
    >
      <span>{{ shape.leftEnd }}</span>
      <el-divider direction="vertical"></el-divider>
      {{ shape.id }} ({{ shape.length }})
      <el-divider direction="vertical"></el-divider>
      <span>{{ shape.rightEnd }}</span>
    </el-button>
  </el-row>

</template>

<style scoped>

</style>