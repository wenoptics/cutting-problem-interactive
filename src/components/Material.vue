<script setup lang="ts">

import {computed, ref} from "vue";
import {CuttingSequence} from "~/components/types";

const props = defineProps<{
  name: string
  totalLength: number,
  assignedSequence: CuttingSequence | null
}>();

const PX_PER_LENGTH = 6

function cs2Marks(cs: CuttingSequence): Record<number, string> {
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
  marks[0] = cs[0].leftEnd.toString()

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

const assignedMaxLength = computed(() => {
  if (!props.assignedSequence) return 0
  return props.assignedSequence.reduce((acc: number, cur: CuttingSequence[0]) => acc + cur.length, 0)
})

const remainingLength = computed(() => {
  return props.totalLength - assignedMaxLength.value
})

// const value = ref()
const marks = ref(
    cs2Marks(props.assignedSequence ?? [])
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
  <div class="block" :style="{
    width: PX_PER_LENGTH * totalLength + 'px'
  }">
    {{ name }} (length=={{ totalLength }}, remaining: {{ remainingLength }})
    <el-slider
        v-model="assignedMaxLength"
        :show-input-controls="false"
        :marks="marks"
        :max="totalLength"
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
