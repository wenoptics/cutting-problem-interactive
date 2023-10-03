<script setup lang="ts">

import {ref} from "vue";

import {TargetShape, TargetShapePool} from "~/components/types";

const props = defineProps<{
  data: TargetShapePool,
  used: string[],
  maxLength?: number,
  allowedLeftEnds?: number[],
  filterFn?: ((shape: TargetShape) => boolean)
}>()

function getColor(shape: TargetShape) {
  if (props.used.includes(shape.id)) {
    return 'danger'
  }
  if (props.maxLength && shape.length > props.maxLength) {
    return 'warning'
  }
  if (props.allowedLeftEnds && !props.allowedLeftEnds.includes(shape.leftEnd)) {
    return 'danger'
  }
  return ''
}

function getDisabled(shape: TargetShape) {
  if (props.maxLength && shape.length > props.maxLength) {
    return true
  }
  if (props.allowedLeftEnds && !props.allowedLeftEnds.includes(shape.leftEnd)) {
    return true
  }
  return props.used.includes(shape.id)
}

function getTooltip(shape: TargetShape) {
  if (props.maxLength && shape.length > props.maxLength) {
    return `Length ${shape.length} exceeds max length ${props.maxLength}`
  }
  if (props.allowedLeftEnds && !props.allowedLeftEnds.includes(shape.leftEnd)) {
    return `Left end ${shape.leftEnd} not allowed`
  }
  return ''
}

</script>

<template>

  <el-row>
    <el-button
      size="small"
      v-for="shape in Object.values(props.data)"
      :key="shape.id"
      v-if="filterFn ? filterFn(shape) : true"
      :disabled="getDisabled(shape)"
      :type="getColor(shape)"
      :title="getTooltip(shape)"
      plain
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