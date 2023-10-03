<script setup lang="ts">

import {ref} from "vue";
import Material from "~/components/Material.vue";
import TargetPool from "~/components/TargetPool.vue";
import {CuttingSequence, MaterialShape, TargetShape, TargetShapePool} from "~/components/types";

import prefillMaterials from "./prefill_data/material.json";
import prefillCuttingTargets from "./prefill_data/cutting-targets.json";

// Prepare data - material
const prefillMaterialsList: MaterialShape[] = Object.entries(prefillMaterials).map(([id, data]) => ({ id, length: data.length as unknown as number }))
console.debug('prefillMaterials', prefillMaterials, prefillMaterialsList)

// Prepare data - cutting targets
type JSON_CuttingTarget = {
  ID: string
  End1: 0 | 1 | 2 | 3 | 4
  End2: 0 | 1 | 2 | 3 | 4
  Length: number
}
const prefillCuttingTargetsPool: TargetShapePool = Object.fromEntries(
    (prefillCuttingTargets as JSON_CuttingTarget[]).map((target) => {
      const { ID, End1, End2, Length } = target
      const leftEnd = End1
      const rightEnd = End2
      const length = Length
      const shape: TargetShape = { id: ID, leftEnd, rightEnd, length }
      return [ID, shape]
    })
)
console.debug('prefillCuttingTargets', prefillCuttingTargets, prefillCuttingTargetsPool)

const sticks = ref<MaterialShape[]>(prefillMaterialsList);

type MaterialState = {
  id: string
  assignedSequence: CuttingSequence
}

// Temporary data
const currentSolutions = ref<Record<string, MaterialState>>({
  A1: {
    id: 'A1',
    assignedSequence: [
      { leftEnd: 0, rightEnd: 1, length: 10 },
      { leftEnd: 2, rightEnd: 3, length: 12 },
    ]
  },
  A2: {
    id: 'A2',
    assignedSequence: [
      { leftEnd: 0, rightEnd: 1, length: 10 },
      { leftEnd: 2, rightEnd: 3, length: 12 },
    ]
  }
});

</script>

<template>
  <div v-for="stick in sticks" :key="stick" py="2">

    <Material
        :name="stick.id"
        :total-length="stick.length"
        :assigned-sequence="currentSolutions[stick.id].assignedSequence"
    />
    <el-collapse>
      <el-collapse-item title="Choose" name="1">
        <TargetPool :data="prefillCuttingTargetsPool" :used="[]"/>
      </el-collapse-item>
    </el-collapse>
  </div>

</template>
<style scoped>

</style>
