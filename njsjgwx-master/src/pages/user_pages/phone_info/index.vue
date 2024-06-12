<!--改变-->
<template>
  <view class="phone-info">
    <nut-form>
      <nut-form-item label="电话">
        <nut-input type='text' v-model="phone" placeholder='请输入手机号'>
          <template #right>
            <nut-button type="primary" size="small" v-if="countDownNum === 60" @click="handleSendSms">
              发送验证码
            </nut-button>
            <nut-button type="primary" size="small" v-else :disabled="true">
              {{ countDownNum }}s后重新获取
            </nut-button>
          </template>
        </nut-input>
      </nut-form-item>
      <nut-form-item label="验证码">
        <nut-input type='text' v-model="sms" placeholder="请输入短信验证码"></nut-input>
      </nut-form-item>
      <nut-form-item label="邮箱">
        <nut-input type='text' placeholder='请输入邮箱' v-model="email"/>
      </nut-form-item>
      <nut-form-item label="性别">
        <nut-radio-group v-model="gender" text-position="left" direction="horizontal">
          <nut-radio class="gender_checkbox" color="#6190E8" shape="button" :label="0">男</nut-radio>
          <nut-radio class="gender_checkbox" color="#6190E8" shape="button" :label="1">女</nut-radio>
        </nut-radio-group>
      </nut-form-item>
    </nut-form>
    <view class="phone-info-btn-view">
      <nut-button type="primary" class="phone-info-btn" block :loading="isLoading" @click="handleSubmit">保存</nut-button>
      <nut-button type="default" class="phone-info-btn" block @click="handleSkip">跳过</nut-button>
    </view>
  </view>
</template>

<script lang="ts">

import Taro from "@tarojs/taro";
import {
  validateSmsValue,
  validateEmail,
  validatePhoneValue,
  successMessage,
} from "../../../utils/util";


export default {
  data(){
    return{
      phone:"",
      countDownNum:60,
      handleSendSms,
      sms:"",
      email:"",
      gender:0,
      isLoading:false,
      handleSubmit,
      handleSkip,
    }
  }

}


async function handleSendSms() {
  if (await validatePhoneValue(this.phone)) {
    countDown();
    await successMessage('发送成功');
  }
}

function countDown() {
  const timer = setInterval(function () {
    this.countDownNum.value = this.countDownNum.value - 1;
    if (this.countDownNum.value <= -1) {
      clearInterval(timer);
      this.countDownNum.value = 60;
    }
  }, 1000)
}



async function handleSubmit() {
  if (!await validatePhoneValue(this.phone)) {
    return;
  }
  if (!await validateSmsValue(this.sms)) {
    return;
  }
  const emailValue = this.email.value;
  if (emailValue !== '' && !await validateEmail(this.email)) {
    return;
  }
  Taro.reLaunch({url: "/pages/home/index"});
}

async function handleSkip() {
  await Taro.reLaunch({url: "/pages/home/index"});
}

</script>

<style>
.phone-info {
  margin-top: 20px;
  margin-left: 8px;
  margin-right: 8px;
  text-align: left;
}

.phone-info .nut-input {
  border-bottom: none;
}


.phone-info-btn-view {
  padding-top: 20px;
}

.phone-info-btn {
  margin-top: 16px;
}

.gender_checkbox {
  margin-right: 18px;
}
</style>
