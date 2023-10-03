<script setup lang="ts">

import {ref} from "vue";
import Material from "~/components/Material.vue";
import TargetPool from "~/components/TargetPool.vue";
import {MaterialShape, MaterialState, TargetShape, TargetShapePool} from "~/components/types";

import prefillMaterials from "./prefill_data/material.json";
import prefillCuttingTargets from "./prefill_data/cutting-targets.json";

// Prepare data - material
const prefillMaterialsList: MaterialShape[] = Object.entries(prefillMaterials).map(([id, data]) => ({
  id,
  length: data.length as unknown as number,
  leftEnd: data.leftEnd ?? 0,
  rightEnd: data.rightEnd ?? 0,
}))
const prefillMaterialsPool: Record<string, MaterialShape> = Object.fromEntries(
    prefillMaterialsList.map((material) => [material.id, material])
)
console.debug('prefillMaterials', prefillMaterials, prefillMaterialsPool)

// Prepare data - cutting targets
type JSON_CuttingTarget = {
  ID: string
  End1: 0 | 1 | 2 | 3 | 4
  End2: 0 | 1 | 2 | 3 | 4
  Length: number | "" | undefined
}
const prefillCuttingTargetsPool: TargetShapePool = Object.fromEntries(
    (prefillCuttingTargets as JSON_CuttingTarget[])
        .filter(target => typeof target.Length === 'number')
        .map(target => {
          const {ID, End1, End2, Length} = target
          const shape = new TargetShape(ID, End1, End2, Length)
          return [ID, shape]
        })
)
console.debug('prefillCuttingTargets', prefillCuttingTargets, prefillCuttingTargetsPool)

// const sticks = ref<MaterialShape[]>(prefillMaterialsList);

// Temporary data
const currentSolutions = ref<Record<string, MaterialState>>({
  A1: new MaterialState(prefillMaterialsPool['A1']),
  A2: new MaterialState(prefillMaterialsPool['A2']),
});

</script>

<template>
  <div v-for="(ms, materialId) in currentSolutions" :key="materialId" py="2">

    <Material :material-state="ms"/>
    <el-collapse>
      <el-collapse-item title="Choose" name="1">

        <el-row type="flex" class="row-bg">
          Constrain conditions:
        </el-row>
        <el-row type="flex" class="row-bg bg-warning">
          Target length &lt= remaining length ({{ ms.remainingLength }})
        </el-row>
        <el-row type="flex" class="row-bg bg-warning">
          Left End: []
        </el-row>

        <el-divider></el-divider>

        <TargetPool
            :data="prefillCuttingTargetsPool"
            :used="[]"
            :max-length="ms.remainingLength"
            :allowed-left-ends="[0,4]"
        />
      </el-collapse-item>
    </el-collapse>
  </div>

</template>
<style scoped>

</style>
