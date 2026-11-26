<script setup lang="ts">
import client from "../api/client.ts";
const download = async () => {
  const resp = await client.get("download/1795628872907.html/stream", {
    responseType: "blob",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([resp.data]));
  a.download = "1795628872907.html.zip";
  a.click();
  a.remove();
};
</script>

<template>
  <div class="my-wrapper"><el-button @click="download">下载</el-button></div>
</template>

<style scoped>
.my-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
