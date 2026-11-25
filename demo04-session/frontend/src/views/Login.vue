<script setup lang="ts">
import { reactive, ref } from "vue";
import { create } from "../api/user.ts";

const codeUrl = ref<string>("/api/user/code");

const resetCode = () => (codeUrl.value = codeUrl.value + "?" + Math.random());

const labelPosition = ref<string>("right");

const formLabelAlign = reactive({
  name: "",
  password: "",
  code: "",
});

const submit = async () => {
  const res = await create(
    formLabelAlign.name,
    formLabelAlign.password,
    formLabelAlign.code,
  );
  alert(res.data.message);
};
</script>

<template>
  <div class="wraps">
    <el-form
      :label-position="labelPosition"
      label-width="100px"
      :model="formLabelAlign"
      style="max-width: 460px"
    >
      <el-form-item label="账号">
        <el-input v-model="formLabelAlign.name" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formLabelAlign.password" />
      </el-form-item>
      <el-form-item label="验证码">
        <div style="display: flex">
          <el-input v-model="formLabelAlign.code" />
          <img @click="resetCode" :src="codeUrl" alt="" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

.wraps {
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
}

.wraps .el-form {
  transform: translateY(-8vh);
}

.wraps .el-form-item:last-child .el-button {
  width: 100%;
}

html,
body,
#app {
  height: 100%;
}
</style>
