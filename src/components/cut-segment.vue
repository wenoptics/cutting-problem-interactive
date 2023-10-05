<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { EndType, MATERIAL_WIDTH_PHYS, TargetShape } from "~/components/types";
import {
  AdapterCutsMap,
  isAdapterCut,
  keyFromEnds,
} from "~/components/adapter-cuts";

const props = defineProps({
  shape: {
    type: Object as PropType<TargetShape>,
    required: true,
  },
});

const height = ref(16);
const px_per_length = computed(() => height.value / MATERIAL_WIDTH_PHYS);
const color = ref(isAdapterCut(props.shape) ? "#ff3f3f" : "#3f9fff");

const commonStyleTriangle = {
  width: 0,
  height: 0,
  "border-style": "solid",
};

const textDescription = computed(() => {
  const { leftEnd, rightEnd, length, id } = props.shape!;
  return `${id} \n${leftEnd} (${length}) ${rightEnd}`;
});

function getMiterEndLength(left: EndType, right: EndType) {
  if (left === EndType.T0 && right === EndType.T0) {
    return 0;
  }
  const key = keyFromEnds(left, right);
  const ad = AdapterCutsMap[key];
  if (!ad) {
    throw new Error(`Not valid endType: ${left}, ${right}`);
  }
  return ad.length;
}

// Calculate the length of the rectangle.
//   This will the total length of the cut target - the length of the two triangles
const rectLength = computed(() => {
  const l = getMiterEndLength(props.shape!.leftEnd, EndType.T0);
  const r = getMiterEndLength(EndType.T0, props.shape!.rightEnd);

  const lenPhys = props.shape!.length - l - r;
  console.debug("Calc length (phys)", lenPhys, l, r);
  return lenPhys * px_per_length.value;
});

const styleLeftT2 = {
  "border-width": `0 0 ${height.value}px ${height.value}px`,
  "border-color": `transparent transparent ${color.value} transparent`,
};

const styleLeftT4 = {
  "border-width": `0 ${height.value}px ${height.value}px 0`,
  "border-color": `transparent ${color.value} transparent transparent`,
};

const styleRightT1 = {
  "border-width": `${height.value}px ${height.value}px 0 0`,
  "border-color": `${color.value} transparent transparent transparent`,
};

const styleRightT3 = {
  "border-width": `${height.value}px 0 0 ${height.value}px`,
  "border-color": `transparent transparent transparent ${color.value}`,
};

const styleRect = {
  width: `${rectLength.value}px`,
  height: `${height.value}px`,
  "background-color": `${color.value}`,
};
</script>

<template>
  <div class="relative seg" :title="textDescription">
    <span
      v-if="shape.leftEnd === EndType.T2"
      class="seg-triangle left"
      :style="{
        ...commonStyleTriangle,
        ...styleLeftT2,
      }"
    ></span>
    <span
      v-if="shape.leftEnd === EndType.T4"
      class="seg-triangle left"
      :style="{
        ...commonStyleTriangle,
        ...styleLeftT4,
      }"
    ></span>

    <!--    FIXME Deal with a rect length lt 0 -->
    <span v-if="rectLength > 0" class="seg-rect" :style="styleRect"></span>

    <span
      v-if="shape.rightEnd === EndType.T1"
      class="seg-triangle right"
      :style="{
        ...commonStyleTriangle,
        ...styleRightT1,
      }"
    ></span>
    <span
      v-if="shape.rightEnd === EndType.T3"
      class="seg-triangle right"
      :style="{
        ...commonStyleTriangle,
        ...styleRightT3,
      }"
    ></span>
  </div>
</template>

<style scoped lang="scss">
.relative {
  position: relative;
}

.seg {
  display: inline-flex;
  align-items: center;
  //justify-content: center;
  height: 100%;

  &:hover {
    filter: drop-shadow(0 0 0.25rem rgba(0, 0, 0, 0.45));
  }
}
</style>
