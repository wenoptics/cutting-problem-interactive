<script setup lang="ts">
import { computed, ref } from "vue";
import { MaterialState } from "~/components/material";
import { isAdapterCut } from "~/components/adapter-cuts";

const props = defineProps<{
  materialState: MaterialState;
}>();

const MAX_LENGTH = 130;
const px_per_length = ref(6);

function handleViewPortSizeChanged() {
  const windowWidth = window.innerWidth;
  px_per_length.value = Math.min(Math.floor(windowWidth / MAX_LENGTH), 6);
  // console.debug("handleViewPortSizeChanged", windowWidth, px_per_length.value);
}

// window.onresize = handleViewPortSizeChanged
handleViewPortSizeChanged();

function cs2Marks(ms: MaterialState): Record<number, string> {
  const cs = ms.assignedSequence;
  /*Example of cs:
    [
      { leftEnd: 0, rightEnd: 1, length: 10 },
      { leftEnd: 2, rightEnd: 3, length: 12 },
    ]
   Output of marks:
    {
      0: "0",
      10: "1/2",
      12: "2",
    }
  */

  const marks: Record<number, string> = {};

  // Push the first shape
  marks[0] = ms.nextAllowedLeftEnd.toString();

  let curLength = 0;
  for (const idx in cs) {
    // console.debug(idx, typeof idx)
    const idxInt = parseInt(idx);
    const { length, rightEnd } = cs[idxInt];
    const nextLeftEnd = cs[idxInt + 1]?.leftEnd ?? "?";
    curLength += length;
    marks[curLength] = `${rightEnd} [${curLength}] ${nextLeftEnd}`;
  }
  return marks;
}

// const value = ref()
const marks = computed(
  () => cs2Marks(props.materialState),
  // {
  //   0: '0°C',
  //   8: '8°C',
  //   37: '37°C',
  //   50: {
  //     style: {
  //       color: '#f50',
  //     },
  //     label: "50",
  //   },
  // }
);

const currentHighlight = ref(-1);
</script>

<template>
  <!--  <el-row type="flex" class="row-bg">-->
  <!--    Material ID: {{ materialState.material.id }}-->
  <!--  </el-row>-->
  <el-row type="flex" class="row-bg">
    Material length: {{ materialState.material.length }}
  </el-row>
  <el-row type="flex" class="row-bg">
    Assigned length: {{ materialState.assignedLength.toFixed(4) }}
  </el-row>
  <el-row type="flex" class="row-bg">
    Remaining length: {{ materialState.remainingLength }}
  </el-row>
  <el-row type="flex" class="row-bg">
    Current waste: {{ materialState.currentWasteFromAdapterCuts }}
  </el-row>

  <div
    class="block"
    :style="{
      width: px_per_length * materialState.material.length + 'px',
    }"
  >
    <!--    <el-slider-->
    <!--      :value="materialState.assignedLength"-->
    <!--      :show-input-controls="false"-->
    <!--      :marks="marks"-->
    <!--      :max="materialState.material.length"-->
    <!--    />-->
    <el-progress
      :percentage="
        (materialState.assignedLength / materialState.material.length) * 100
      "
      :show-text="false"
    ></el-progress>

    <div style="opacity: 0.75" class="py-2">
      <cut-segment
        v-for="(assigned, idx) in materialState.assignedSequence"
        :key="idx"
        :shape="assigned"
        class="mr-1"
        :highlight="currentHighlight === idx"
        @mouseenter="currentHighlight = idx"
        @mouseleave="currentHighlight = -1"
      ></cut-segment>
    </div>

    <el-row pt="2" align="middle">
      <el-tag
        v-for="(c, idx) in materialState.assignedSequence"
        :key="c.id"
        size="small"
        :type="isAdapterCut(c.id) ? 'warning' : 'info'"
        :hit="currentHighlight === idx"
        @mouseenter="currentHighlight = idx"
        @mouseleave="currentHighlight = -1"
      >
        {{ c.leftEnd }}
        <el-divider direction="vertical" />
        {{ c.id }} ({{ c.length }})
        <el-divider direction="vertical" />
        {{ c.rightEnd }}
      </el-tag>
    </el-row>
  </div>
</template>
<style scoped></style>

<style>
.ep-slider__button-wrapper {
  display: none;
}
</style>
