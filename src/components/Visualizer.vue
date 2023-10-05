<script setup lang="ts">
import { computed, ref } from "vue";
import Material from "~/components/Material.vue";
import TargetPool from "~/components/TargetPool.vue";
import { TargetShape, TargetShapePool } from "~/components/types";

import prefillMaterials from "./prefill_data/material.json";
import prefillCuttingTargets from "./prefill_data/cutting-targets.json";
import {
  AdapterCuts,
  AdapterCutsMap,
  isAdapterCut,
} from "~/components/adapter-cuts";
import { MaterialShape, MaterialState } from "~/components/material";

// Prepare data - material
const prefillMaterialsList: MaterialShape[] = Object.entries(
  prefillMaterials,
).map(
  ([id, data]) =>
    new MaterialShape(
      id,
      data.leftEnd ?? 0,
      data.rightEnd ?? 0,
      data.length as unknown as number,
    ),
);
const prefillMaterialsPool: Record<string, MaterialShape> = Object.fromEntries(
  prefillMaterialsList.map((material) => [material.id, material]),
);
console.debug("prefillMaterials", prefillMaterials, prefillMaterialsPool);

// Prepare data - cutting targets
type JSON_CuttingTarget = {
  ID: string;
  End1: 0 | 1 | 2 | 3 | 4;
  End2: 0 | 1 | 2 | 3 | 4;
  Length: number | "" | undefined;
};
const prefillCuttingTargetsPool: TargetShapePool = Object.fromEntries(
  (prefillCuttingTargets as JSON_CuttingTarget[])
    .filter((target) => typeof target.Length === "number")
    .map((target) => {
      const { ID, End1, End2, Length } = target;
      const shape = new TargetShape(ID, End1, End2, Length);
      return [ID, shape];
    }),
);
console.debug(
  "prefillCuttingTargets",
  prefillCuttingTargets,
  prefillCuttingTargetsPool,
);

const adapterCutMap = AdapterCutsMap;

// Temporary data
const currentSolutions = ref<Record<string, MaterialState>>(
  Object.fromEntries(
    prefillMaterialsList.map((material) => [
      material.id,
      new MaterialState(material),
    ]),
  ),
);

const usedCuttingTargets = computed<string[]>(() => {
  const used: string[] = [];
  for (const ms of Object.values(currentSolutions.value)) {
    for (const cs of ms.assignedSequence) {
      if (isAdapterCut(cs.id)) {
        continue;
      }
      used.push(cs.id);
    }
  }
  return used;
});

const totalWaste = computed(() => {
  let total = 0;
  for (const ms of Object.values(currentSolutions.value)) {
    total += ms.currentWasteFromAdapterCuts;
  }
  return total;
});

function handleAddTo(materialId: string, shape: TargetShape) {
  console.debug("handleAdd", materialId, shape);
  const ms = currentSolutions.value[materialId];
  if (!ms) {
    console.warn("Material not found", materialId);
    return;
  }
  ms.assignNewCut(shape);
}

function handleRemoveLast(materialId: string) {
  console.debug("handleRemove", materialId);
  const ms = currentSolutions.value[materialId];
  if (!ms) {
    console.warn("Material not found", materialId);
    return;
  }
  ms.unassignLastCut();
}
</script>

<template>
  <el-card
    v-for="(ms, materialId) in currentSolutions"
    :key="materialId"
    my="6"
  >
    <div slot="header" class="clearfix">
      <span>Material ID: {{ materialId }}</span>
      <!--      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>-->
    </div>

    <div>
      <material :material-state="ms" />

      <el-row pt="2" align="middle">
        <el-tag
          v-for="(c, idx) in ms.assignedSequence"
          :key="c.id"
          size="small"
          :type="isAdapterCut(c.id) ? 'success' : 'info'"
        >
          {{ c.leftEnd }}
          <el-divider direction="vertical" />
          {{ c.id }} ({{ c.length }})
          <el-divider direction="vertical" />
          {{ c.rightEnd }}
        </el-tag>

        <el-button
          v-if="ms.assignedSequence.length !== 0"
          type="warning"
          size="small"
          @click="handleRemoveLast(materialId)"
        >
          Remove last
        </el-button>
      </el-row>

      <el-collapse>
        <el-collapse-item title="Edit" name="1">
          <el-card class="box-card" mr="6">
            <div>
              <el-row type="flex" class="row-bg">
                Constrain conditions:
              </el-row>
              <el-row type="flex" class="row-bg">
                <el-button plain type="warning" size="small" disabled>
                  Length must be &lt;= remaining length ({{
                    ms.remainingLength
                  }})
                </el-button>
                <el-button plain type="danger" size="small" disabled>
                  Left end == {{ ms.nextAllowedLeftEnd }}
                </el-button>
              </el-row>

              <target-pool
                :data="prefillCuttingTargetsPool"
                :used="usedCuttingTargets"
                :max-length="ms.remainingLength"
                :allowed-left-ends="[ms.nextAllowedLeftEnd]"
                @select="handleAddTo(materialId, $event)"
              />

              <el-divider />
              <el-row type="flex" class="row-bg">
                Adapter cuts:
                <p class="el-text--small">
                  Use only when necessary, since it will increase material
                  wastes and the number of cuts
                </p>
              </el-row>
              <target-pool
                :data="adapterCutMap"
                :used="[]"
                :max-length="ms.remainingLength"
                :allowed-left-ends="[ms.nextAllowedLeftEnd]"
                @select="handleAddTo(materialId, $event)"
              />
            </div>
          </el-card>

          <el-col px="4" class="" />
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>
<style scoped></style>
