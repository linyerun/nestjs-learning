<script setup lang="ts">
import Login from "./views/Login.vue";
import Download from "./views/Download.vue";
import { shallowRef, toRaw } from "vue";

const loginCom = toRaw(Login);
const downloadCom = toRaw(Download);
const curCom = shallowRef(loginCom);
</script>

<template>
  <el-button @click="curCom = loginCom">登录界面</el-button>
  <el-button @click="curCom = downloadCom">下载界面</el-button>
  <hr />
  <Component :is="curCom" />
</template>
