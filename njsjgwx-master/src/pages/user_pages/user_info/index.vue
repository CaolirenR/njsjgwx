
<!--详细信息-->
<template>
  <view class="user-info">
    <nut-form>

<!--      <nut-form-item label="ID">-->
<!--        <nut-input class="nut-input-text" type="text" v-model="userInfo.id" disabled ></nut-input>-->
<!--      </nut-form-item>-->
<!--      <nut-form-item label="头像">-->
<!--        <img class="avatar"  size="large" :src="userInfo.avatar" alt=""/>-->
<!--      </nut-form-item>-->

      <nut-form-item label="证件照">
        <view class="showImageSet">
          <image  class="show-full-avatar" :mode="mode" :src="userInfo.avatar" alt=""/>
        </view>
      </nut-form-item>


      <nut-form-item label="上传证件照">
        <nut-uploader :url="uploadUrl"
                      :source-type="['album','camera']"
                      :camera="cameraSet"
                      :media-type="['image']"
                      :size-type="['compressed']"
                      :headers="uploadHeadersSet"
                      :method="'POST'"
                      :maximum="1"
                      :success="onFileUploadSuccess"
                      :failure="onFileUploadFail"
                      ></nut-uploader>
      </nut-form-item>


      <nut-form-item label="用户名">
        <nut-input class="nut-input-text" type="text" v-model="userInfo.username" placeholder="请输入用户名"></nut-input>
      </nut-form-item>
      <nut-form-item label="真实姓名">
        <nut-input class="nut-input-text" type="text" title="真实姓名" v-model="userInfo.realname" placeholder="请输入真实姓名"></nut-input>
      </nut-form-item>
      <nut-form-item label="性别">
        <nut-radio-group v-model="userInfo.sex" text-position="left" direction="horizontal">
          <nut-radio class="gender_checkbox" color="#6190E8" shape="button" :label="0">男</nut-radio>
          <nut-radio class="gender_checkbox" color="#6190E8" shape="button" :label="1">女</nut-radio>
        </nut-radio-group>
      </nut-form-item>
      <nut-form-item label="手机">
        <nut-input class="nut-input-text" type="text" title="手机" v-model="userInfo.phone" placeholder="请输入手机号"></nut-input>
      </nut-form-item>
    </nut-form>
<!--    <view class="user-info-save-btn">-->
<!--      <nut-button type="primary" @click="handleSave">保存</nut-button>-->
<!--    </view>-->
  </view>
</template>

<script lang="ts">
import Taro from "@tarojs/taro";
import api, {USER_SERVICE} from "../../../api/api";
import {
  hideLoading,
  showLoading,
  warnMessage,
  validateEmail,
  validatePhoneValue,
  successMessage,
} from "../../../utils/util";


export default {
  data(){
    return{
      userInfo:{
        id: 0,
        username:"",
        realname:"",
        phone:"",
        sex:1,
        avatar:"",
      },
      uploadUrl:"",
      cameraSet:"front",
      uploadHeadersSet:{},
      mode:"aspectFill",
    }
  },


  onPullDownRefresh() {
    try {
      this.init();
    } finally {
      Taro.stopPullDownRefresh();
    }
  },

  mounted() {
    this.init();
  },

  methods:{
    async fetch(){
      const resultData = await api.getExamineeInfo()
      const setUploadUrl = api.uploadAvatar()
      console.log("上传头像地址",setUploadUrl)
      this.uploadUrl = setUploadUrl
      console.log("个人信息",resultData)
      this.uploadHeadersSet = api.headerGet()

      this.userInfo.id=resultData.result.id
      this.userInfo.username=resultData.result.username
      this.userInfo.realname=resultData.result.realname
      this.userInfo.phone=resultData.result.phone
      this.userInfo.sex=resultData.result.sex
      this.userInfo.avatar= USER_SERVICE+"/"+resultData.result.avatar
    },

    async init() {
      try {
        await showLoading();
        await this.fetch();
      } finally {
        hideLoading();
      }
    },

    async handleSave() {
      console.log(this.userInfo)
      if (this.userInfo.phone !== '' && !await validatePhoneValue(this.userInfo.phone)) {
        await warnMessage('手机号格式不正确');
        return;
      }
      if (this.userInfo.email !== '' && !await validateEmail(this.userInfo.email)) {
        await warnMessage('邮箱格式不正确');
        return;
      }
      try {
        await showLoading();
        await successMessage('保存成功');

      } finally {
        hideLoading();
      }
    },

    onFileUploadSuccess(data,option,fileItem){
      console.log(data,option,fileItem)
    },

    onFileUploadFail(data,option,fileItem){
      console.log(data,option,fileItem)
    },

  },

}


</script>

<style>
.avatar {
    width: 150px;
    height: 150px;
    //border-radius: 50%;
    display: block;
}

.show-full-avatar{
  width: 100%;
  border-radius: 8px;
  padding: 20px;
  object-fit:cover;
}


.showImageSet{
  width: 400px;
}

.user-info-avatar {
  margin-right: 10px;
}

.user-info-save-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}

.gender_checkbox {
  margin-right: 18px;
}

.nut-input {
  border-bottom: none;
}


</style>
