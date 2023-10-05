<script setup lang="ts">
import { computed, PropType } from "vue";

import { MaterialShape } from "~/components/material";
import { TargetShape } from "~/components/types";
import { Solution } from "~/components/solution";

const props = defineProps({
  solution: {
    type: Object as PropType<Solution>,
    required: true,
  },
  materialMap: {
    type: Object as PropType<Record<string, MaterialShape>>,
    required: true,
  },
  cuttingTargetMap: {
    type: Object as PropType<Record<string, TargetShape>>,
    required: true,
  },
  solvedCuttingTargets: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const materialTotalLength = computed(() => {
  return Object.values(props.materialMap).reduce(
    (acc, cur) => acc + cur.length,
    0,
  );
});

const targetTotalLength = computed(() => {
  return Object.values(props.cuttingTargetMap).reduce(
    (acc, cur) => acc + cur.length,
    0,
  );
});

const numCuttingTargets = computed(() => {
  return Object.keys(props.cuttingTargetMap).length;
});

const totalWaste = computed(() => {
  let total = 0;
  for (const ms of Object.values(props.solution!.materialStates)) {
    total += ms.currentWasteFromAdapterCuts;
  }
  return total;
});
</script>

<template>
  <el-card>
    <div slot="header" class="mb-4">
      <span>Stats</span>
      <!--      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>-->
    </div>

    <el-row>
      <span class="label">Total Material:</span>
      {{ Object.keys(props.materialMap).length }} ({{
        materialTotalLength
      }})</el-row
    >
    <el-row>
      <span class="label">Total Cutting Targets:</span>
      {{ numCuttingTargets }} ({{ targetTotalLength }})
    </el-row>
    <el-row>
      <span class="label">Targets Solved / Unsolved:</span>
      <span class="text-green">{{ solvedCuttingTargets.length }}</span> /
      <span class="text-red">{{
        numCuttingTargets - solvedCuttingTargets.length
      }}</span></el-row
    >
    <el-row>
      <span class="label">Total Waste:</span>
      {{ totalWaste }}</el-row
    >
  </el-card>
</template>

<style scoped>
.label {
  font-weight: bold;
  margin-right: 10px;
}
</style>
