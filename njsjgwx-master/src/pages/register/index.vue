<!--<template>-->
<!--  <view class="register-main bg-blue">-->
<!--    <view class="register-info ml-22 mr-22">-->
<!--      <nut-input v-model="tenantCode" placeholder="请输入电话"></nut-input>-->
<!--      <nut-input v-model="username" placeholder="请输入用户名"></nut-input>-->
<!--      <nut-input v-model="name" placeholder="请输入姓名"></nut-input>-->
<!--      <nut-input type="password" v-model="password" placeholder="请输入密码"></nut-input>-->
<!--      <nut-input type="password" v-model="passwordAgain" placeholder="请再次输入密码"></nut-input>-->
<!--      <view class="register-btn mt-22">-->
<!--        <nut-button block type="primary" @click="handleUsernameRegister" :loading="usernameRegisterLoading">-->
<!--          注册-->
<!--        </nut-button>-->
<!--      </view>-->
<!--    </view>-->
<!--  </view>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import {ref} from "vue";-->
<!--import {-->
<!--  warnMessage-->
<!--} from '../../utils/util';-->

<!--export default {-->
<!--  setup() {-->
<!--    const tenantCode = ref<string>('');-->
<!--    const username = ref<string>('');-->
<!--    const name = ref<string>('');-->
<!--    const password = ref<string>('');-->
<!--    const passwordAgain = ref<string>('');-->
<!--    const usernameRegisterLoading = ref<boolean>(false);-->

<!--    /**-->
<!--     * 差注册逻辑对接后端接口-->
<!--     */-->
<!--    async function handleUsernameRegister() {-->

<!--      if (username.value === '') {-->
<!--        await warnMessage('请输入用户名');-->
<!--        return;-->
<!--      }-->
<!--      if (password.value === '') {-->
<!--        await warnMessage('请输入密码');-->
<!--        return;-->
<!--      }-->
<!--      if (password.value !== passwordAgain.value) {-->
<!--        await warnMessage('两次输入的密码不一致');-->
<!--        return;-->
<!--      }-->

<!--    }-->
<!--    return {-->
<!--      tenantCode,-->
<!--      username,-->
<!--      name,-->
<!--      password,-->
<!--      passwordAgain,-->
<!--      usernameRegisterLoading,-->
<!--      handleUsernameRegister-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--.register-main {-->
<!--  padding-top: 60px;-->
<!--}-->

<!--.register-info {-->
<!--  padding: 20px;-->
<!--  background: #fff;-->
<!--  border-radius: 8px;-->
<!--  overflow: hidden;-->
<!--  -moz-box-shadow: 2px 2px 10px #909090;-->
<!--  -webkit-box-shadow: 2px 2px 10px #909090;-->
<!--  box-shadow: 2px 2px 10px #909090;-->
<!--}-->

<!--.register-btn {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  margin-top: 80px;-->
<!--}-->
<!--</style>-->
