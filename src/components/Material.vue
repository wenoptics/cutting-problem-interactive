<script setup lang="ts">

import {computed, ref} from "vue";
import {CuttingSequence, MaterialState} from "~/components/types";

const props = defineProps<{
  materialState: MaterialState,
}>();

const PX_PER_LENGTH = 6

function cs2Marks(ms: MaterialState): Record<number, string> {
  const cs = ms.assignedSequence
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

  const marks: Record<number, string> = {}

  // Push the first shape
  marks[0] = ms.leftMostEnd.toString()

  let curLength = 0
  for ( const idx in cs) {
    // console.debug(idx, typeof idx)
    const idxInt = parseInt(idx)
    const { length, rightEnd } = cs[idxInt]
    const nextLeftEnd = cs[idxInt + 1]?.leftEnd ?? '?'
    curLength += length
    marks[curLength] = `${rightEnd} [${curLength}] ${nextLeftEnd}`
  }
  return marks

}

// const value = ref()
const marks = ref(
    cs2Marks(props.materialState)
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
)

</script>

<template>

  <el-row type="flex" class="row-bg">
    {{ materialState.id }} (length=={{ materialState.material.length }}, remaining: {{ materialState.remainingLength }})
  </el-row>

  <div class="block" :style="{
    width: PX_PER_LENGTH * materialState.material.length + 'px'
  }">
    <el-slider
        v-model="materialState.assignedLength"
        :show-input-controls="false"
        :marks="marks"
        :max="materialState.material.length"
    ></el-slider>
  </div>
</template>
<style scoped>

</style>

<style>
.ep-slider__button-wrapper {
  display: none;
}
</style>
