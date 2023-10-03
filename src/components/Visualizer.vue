<script setup lang="ts">

import {computed, ref} from "vue";
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
  A3: new MaterialState(prefillMaterialsPool['A3']),
  A4: new MaterialState(prefillMaterialsPool['A4']),
});

const usedCuttingTargets = computed<string[]>(() => {
  const used: string[] = []
  for (const ms of Object.values(currentSolutions.value)) {
    for (const cs of ms.assignedSequence) {
      used.push(cs.id)
    }
  }
  return used
});

function handleAddTo (materialId: string, shape: TargetShape) {
  console.debug('handleAdd', materialId, shape)
  const ms = currentSolutions.value[materialId]
  if (!ms) {
    console.warn('Material not found', materialId)
    return
  }
  ms.assignNewCut(shape)
}

function handleRemoveLast (materialId: string) {
  console.debug('handleRemove', materialId)
  const ms = currentSolutions.value[materialId]
  if (!ms) {
    console.warn('Material not found', materialId)
    return
  }
  ms.unassignLastCut()
}

</script>

<template>
  <div v-for="(ms, materialId) in currentSolutions" :key="materialId" py="2">

    <Material :material-state="ms"/>
    <el-collapse>
      <el-collapse-item title="Edit" name="1">

        <el-card class="box-card" mr="6">
          <div>
            <el-row type="flex" class="row-bg">
              Constrain conditions:
            </el-row>
            <el-row type="flex" class="row-bg">
              <el-button plain type="danger" size="small" disabled>
                Length must be &lt= remaining length ({{ ms.remainingLength }})
              </el-button>
              <el-button plain type="warning" size="small" disabled>
                Left end == {{ ms.nextAllowedLeftEnd }}
              </el-button>
            </el-row>

            <TargetPool
                :data="prefillCuttingTargetsPool"
                :used="usedCuttingTargets"
                :max-length="ms.remainingLength"
                :allowed-left-ends="[ms.nextAllowedLeftEnd]"
                @select="handleAddTo(materialId, $event)"
            />

            <el-row pt="4">
              <el-button
                  type="warning"
                  @click="handleRemoveLast(materialId)"
                  :disabled="ms.assignedSequence.length === 0"
                  size="small"
              >Remove last</el-button>
            </el-row>
          </div>
        </el-card>

        <el-col px="4" class="">


        </el-col>

      </el-collapse-item>
    </el-collapse>

  </div>

</template>
<style scoped>

</style>
