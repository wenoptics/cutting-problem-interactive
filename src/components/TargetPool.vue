<script setup lang="ts">

import {computed, ref} from "vue";

import {TargetShape, TargetShapePool} from "~/components/types";

const props = defineProps<{
  data: TargetShapePool,
  used: string[],
  maxLength?: number,
  allowedLeftEnds?: number[],
  // filterFn?: (shape: TargetShape) => boolean
}>()

const emit = defineEmits(['select'])

function getColor(shape: TargetShape) {
  if (props.used.includes(shape.id)) {
    return 'info'
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
  const messages = []
  if (props.used.includes(shape.id)) {
    messages.push('Already used')
  }
  if (props.maxLength && shape.length > props.maxLength) {
    messages.push(`Length ${shape.length} exceeds max length ${props.maxLength}`)
  }
  if (props.allowedLeftEnds && !props.allowedLeftEnds.includes(shape.leftEnd)) {
    messages.push(`Left end ${shape.leftEnd} not allowed`)
  }
  return messages.join(';\n')
}

const numAvailable = computed(() => {
  let count = 0
  for (const shape of Object.values(props.data)) {
    // if (props.filterFn && !props.filterFn(shape)) {
    //   continue
    // }
    if (getDisabled(shape)) {
      continue
    }
    count++
  }
  return count
})

function handleSelect (shape: TargetShape) {
  emit('select', shape)
}

</script>

<template>

  <el-row>
    Available ({{ numAvailable }})
  </el-row>

  <el-row :gutter="2" type="flex" justify="start">
    <el-col><div class="grid-content">
      <el-button
          size="small"
          v-for="shape in Object.values(props.data)"
          :key="shape.id"
          :disabled="getDisabled(shape)"
          :type="getColor(shape)"
          :title="getTooltip(shape)"
          plain
          @click="handleSelect(shape)"
      >
        <span>{{ shape.leftEnd }}</span>
        <el-divider direction="vertical"></el-divider>
        {{ shape.id }} ({{ shape.length }})
        <el-divider direction="vertical"></el-divider>
        <span>{{ shape.rightEnd }}</span>
      </el-button>
    </div></el-col>
  </el-row>

</template>

<style scoped>

</style>