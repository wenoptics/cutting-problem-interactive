<template>
  <el-config-provider namespace="ep">
    <base-header />
    <div class="flex main-container">
      <!--      <BaseSide />-->
      <div w="full" py="4" px="6">
        <!--        <Logos my="4" />-->
        <visualizer />
      </div>
    </div>
  </el-config-provider>
</template>

<style>
#app {
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}
</style>
