<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <!--    <el-sub-menu index="1">-->
    <!--      <template #title>-->
    <!--        <el-icon><location /></el-icon>-->
    <!--        <span>Navigator One</span>-->
    <!--      </template>-->
    <!--      <el-menu-item-group>-->
    <!--        <template #title><span>Group One</span></template>-->
    <!--        <el-menu-item index="1-1">item one</el-menu-item>-->
    <!--        <el-menu-item index="1-2">item two</el-menu-item>-->
    <!--      </el-menu-item-group>-->
    <!--      <el-menu-item-group title="Group Two">-->
    <!--        <el-menu-item index="1-3">item three</el-menu-item>-->
    <!--      </el-menu-item-group>-->
    <!--      <el-sub-menu index="1-4">-->
    <!--        <template #title><span>item four</span></template>-->
    <!--        <el-menu-item index="1-4-1">item one</el-menu-item>-->
    <!--      </el-sub-menu>-->
    <!--    </el-sub-menu>-->
    <el-menu-item index="4" @click="showEditorMaterial = true">
      <el-icon><setting /></el-icon>
      <template #title>
        Material Editor
      </template>
    </el-menu-item>

    <el-menu-item index="3" @click="handleExport">
      <el-icon><document /></el-icon>
      <template #title>
        Export
      </template>
    </el-menu-item>
  </el-menu>
  <el-dialog
    v-model:visible="showEditorMaterial"
    title="Tips"
    width="30%"
  >
    <span>This is a message</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showEditorMaterial = false">Cancel</el-button>
      <el-button type="primary" @click="showEditorMaterial = false">Confirm</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Location,
  Document,
  Menu as IconMenu,
  Setting,
} from "@element-plus/icons-vue";

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const showEditorMaterial = ref(false);

function handleExport() {
  console.debug("handleExport")
}
</script>
