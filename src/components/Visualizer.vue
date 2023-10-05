<script setup lang="ts">
import { computed, ref } from "vue";
import Material from "~/components/Material.vue";
import TargetPool from "~/components/TargetPool.vue";
import { TargetShape } from "~/components/types";

import {
  AdapterCuts,
  AdapterCutsMap,
  isAdapterCut,
} from "~/components/adapter-cuts";
import { sessionData } from "~/components/live-data";
import SolutionStatus from "~/components/SolutionStatus.vue";

const adapterCutMap = AdapterCutsMap;

const usedCuttingTargets = computed<string[]>(() => {
  const used: string[] = [];
  for (const ms of Object.values(sessionData.value.solution.materialStates)) {
    for (const cs of ms.assignedSequence) {
      if (isAdapterCut(cs.id)) {
        continue;
      }
      used.push(cs.id);
    }
  }
  return used;
});

function handleAddTo(materialId: string, shape: TargetShape) {
  console.debug("handleAdd", materialId, shape);
  const ms = sessionData.value.solution.materialStates[materialId];
  if (!ms) {
    console.warn("Material not found", materialId);
    return;
  }
  ms.assignNewCut(shape);
}

function handleRemoveLast(materialId: string) {
  console.debug("handleRemove", materialId);
  const ms = sessionData.value.solution.materialStates[materialId];
  if (!ms) {
    console.warn("Material not found", materialId);
    return;
  }
  ms.unassignLastCut();
}
</script>

<template>
  <solution-status
    :material-map="sessionData.solution.materialMap"
    :cutting-target-map="sessionData.targetPool"
    :solution="sessionData.solution"
    :solved-cutting-targets="usedCuttingTargets"
  ></solution-status>

  <el-card
    v-for="(ms, materialId) in sessionData.solution.materialStates"
    :key="materialId"
    my="6"
  >
    <div slot="header" class="clearfix">
      <span>Material ID: {{ materialId }}</span>
      <!--      <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>-->
    </div>

    <div>
      <material :material-state="ms" />

      <el-collapse>
        <el-collapse-item title="Edit" name="1">
          <el-card class="box-card" mr="6">
            <div>
              <el-button
                v-if="ms.assignedSequence.length !== 0"
                type="warning"
                size="small"
                @click="handleRemoveLast(materialId)"
              >
                Remove last
              </el-button>

              <el-divider></el-divider>

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
                :data="sessionData.targetPool"
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
