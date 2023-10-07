<template>
  <el-config-provider namespace="ep">
    <base-header />
    <div class="flex main-container">
      <!--      <BaseSide />-->
      <div w="full" py="4" px="6">
        <el-row my="6" align="middle">
          Phase:
          <el-radio-group v-model="phase" size="default" ml="3">
            <el-radio-button :label="Phase.design" border
              >Design</el-radio-button
            >
            <el-radio-button :label="Phase.make" border>Make</el-radio-button>
          </el-radio-group>
        </el-row>

        <!--        <Logos my="4" />-->
        <visualizer :phase="phase" />
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Phase, AllPhases } from "~/components/phase";
import {
  Edit as IconEdit,
  DocumentChecked as DocumentCheckedIcon,
} from "@element-plus/icons-vue";

// Parse the phase from query params
const phaseStr = new URLSearchParams(window.location.search).get(
  "phase",
) as Phase;
const phase = ref<Phase>(
  AllPhases.includes(phaseStr) ? phaseStr : Phase.design,
);
</script>

<style>
#app {
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}
</style>
