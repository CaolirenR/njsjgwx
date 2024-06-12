<template>
  <view class="index-main">
    <view class="index-login-third">
      <image :src="logo" class="showLogo" />
      <!--      <IconFont font-class-name="iconfont" class-prefix="icon" name="weixin" size="30px" color="white" @click="handleWxLogin"></IconFont>-->
    </view>
    <view class="index-main-title">
      <h2>{{sysConfig.title}}</h2>
    </view>
    <view class="index-login-divider">
      <nut-divider :style="{ color: 'white', borderColor: 'white', fontWeight: 'bold', padding: '0 13px' }">

      </nut-divider>
    </view>
    <view class="index-login">
      <nut-tabs :background="'#fff'">
        <nut-tab-pane title="账号登录">
          <view class='tab-content'>
            <nut-input v-model="username" placeholder="请输入用户名"></nut-input>
            <nut-input type="password" v-model="password" placeholder="请输入密码"></nut-input>
            <nut-cell>
              <nut-checkbox v-model="isSeePolicy" icon-size="20">
                <view class="checkboxRight">阅读并同意<view class="showPolicy" @click="toUserServicesAgreement" >用户服务协议</view>、<view class="showPolicy"  @click="toPrivacyPolicyPage" >隐私政策</view></view>
              </nut-checkbox>
            </nut-cell>
<!--            <nut-input v-model="phone" placeholder="请输入验证码" clearable>-->
<!--              <template #right>-->
<!--                <div  @click="handleCaptcha" style="height: 50px;width: 100px;display: inline-flex">-->
<!--                  <image :src="captchaPath" alt="" :mode="mode" v-if="captchaPath!==''" style="height: 100%">-->

<!--                  </image>-->
<!--                </div>-->
<!--              </template>-->
<!--            </nut-input>-->
            <view class="login-btn">
              <nut-button block type="primary" @click="handleUsernameLogin" :loading="usernameLoginLoading">
                登录
              </nut-button>
            </view>
          </view>
        </nut-tab-pane>
<!--        <nut-tab-pane title="手机号登录">-->
<!--          <view class='tab-content'>-->
<!--            <nut-input v-model="phone" placeholder="请输入手机号" clearable>-->
<!--              <template #right>-->
<!--                <nut-button type="primary" size="small" v-if="countDownNum === 60" @click="handleSendSms">-->
<!--                  发送验证码-->
<!--                </nut-button>-->
<!--                <nut-button type="primary" size="small" v-else :disabled="true">-->
<!--                  {{ countDownNum }}s 后重新获取-->
<!--                </nut-button>-->
<!--              </template>-->
<!--            </nut-input>-->
<!--            <view>-->
<!--              <nut-input v-model="sms" placeholder="请输入短信验证码"></nut-input>-->
<!--            </view>-->
<!--            <view class="login-btn">-->
<!--              <nut-button block type="primary" @click="handlePhoneLogin" :loading="phoneLoginLoading">-->
<!--                登录-->
<!--              </nut-button>-->
<!--            </view>-->
<!--          </view>-->
<!--        </nut-tab-pane>-->
      </nut-tabs>
    </view>

<!--    <view class="index-register">-->
<!--      <view @click="handleRegister">注册账号</view>-->
<!--      <view class="index-register-divider ml-22 mr-22">|</view>-->
<!--      <view @click="handleForgotPassword">忘记密码？</view>-->
<!--    </view>-->

  </view>
</template>

<script lang="ts">
import Taro from "@tarojs/taro";
import { hideLoading, showLoading, warnMessage } from "../../utils/util";
import { IconFont } from '@nutui/icons-vue-taro';
import api from "../../api/api";
import logo from '../../assert/logo.png';


export default {
  components: { IconFont },
  data() {
    return {
      sysConfig: {
        title: "市州建筑业联合线上教育平台"
      },
      countDownNum: 60,

      username: "",
      password: "",

      // 多选框
      isSeePolicy:false,
      // logo必须引入后再返回才有数据
      logo,
      sms: null,
      phone: null,
      usernameLoginLoading: false,
      phoneLoginLoading: false,

      captchaPath:"",
      mode:"aspectFit",
    };
  },

  mounted() {
    this.init()
  },

  methods: {
    async init(){
      try {
        await showLoading();

        // setTimeout(async () => {
        //   // 在这里执行你想要延迟执行的函数或代码
        //   await this.handleCaptcha();
        // }, 3000);

        setTimeout(async () => {
          // 在这里执行你想要延迟执行的函数或代码
          await this.getTokenFromLocal()

        }, 1000);



      } finally {
        hideLoading();
      }
    },


    async handleUsernameLogin() {
      if (this.username === '') {
        await warnMessage('请输入用户名');
        return;
      }
      if (this.username === '') {
        await warnMessage('请输入密码');
        return;
      }

      if (this.isSeePolicy === false){
        await warnMessage('请阅读协议');
        return;
      }
      const params = {
        "captcha": "",
        "checkKey": "",
        "password": this.password,
        "username": this.username,
      };
      await showLoading('登录中');
      const loginResult = await api.setToken(params)
      if (loginResult.code===500){
        await warnMessage(loginResult.message);
      }else if (loginResult.code=== 200) {
        this.usernameLoginLoading = true; // Example: Update loading state
        Taro.reLaunch({ url: "/pages/home/index" });
      }
    },

    handlePhoneLogin() {
      this.phoneLoginLoading = true; // Example: Update loading state
      Taro.reLaunch({ url: "/pages/home/index" });
    },


    async handleCaptcha(){
      const resultData = await api.getInputCode()
      if (resultData.code===0){
        let captchaName = new Date().getTime()+".jpg"
        this.setFile(captchaName,resultData.result)
      }else {

      }
    },

    setFile(fileName,fileData){
      let  filePath = `${Taro.env.USER_DATA_PATH}/${fileName}`;//写入本地文件
      const imageData = fileData.replace(/^data:image\/\w+;base64,/, "");
      console.log('filePath:',filePath);
      Taro.getFileSystemManager().writeFileSync(filePath,imageData,"base64")
      this.captchaPath = filePath
    },


    handleRegister() {
      Taro.navigateTo({ url: "/pages/register/index" });
    },
    handleForgotPassword() {
      Taro.navigateTo({ url: "/pages/forgot/index" });
    },

    async handleWxLogin() {
      Taro.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          console.log(res)
          showLoading('登录中');
          Taro.login({
            success: async (data) => {
              console.log(data)
              // 这里做验证，开始完善资料，如果没有就完善。有就直接跳转
              if (data) {
                await Taro.navigateTo({url: "/pages/user_pages/phone_info/index"});
              } else {
                await Taro.reLaunch({url: "/pages/home/index"});
              }
              hideLoading();
            },
            fail: async () => {
              await warnMessage('登录失败');
            }
          })
        },
        fail: async () => {
          await warnMessage('授权失败');
        }
      })
    },


    async getTokenFromLocal(){
      const token = Taro.getStorageSync('token')
      console.log(token)
      if (token!==null&&token!==""){
        const resultData = await api.frontPageJumpSet()
        console.log(resultData)
        if (resultData.code===200){
          Taro.reLaunch({ url: "/pages/home/index" });
        }else {
          Taro.clearStorageSync();
          await warnMessage('验证失败，重新登录');
        }
      }else {

      }
    },


    toPrivacyPolicyPage(){
      Taro.navigateTo({url: "/pages/user_pages/privacy_policy/index"});

    },

    toUserServicesAgreement(){
      Taro.navigateTo({url: "/pages/user_pages/user_services_agreement/index"});

    },



  },







  created() {
    console.log(this.sysConfig);
  }
};
</script>

<style>
.index-main {
  background-color: #6190e8;
  height: 100%;
  padding-top: 110px;
}

.index-main-title {
  text-align: center;
  font-size: 45px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 30px;
}

.index-login {
  margin-left: 22px;
  margin-right: 22px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  -moz-box-shadow: 2px 2px 10px #909090;
  -webkit-box-shadow: 2px 2px 10px #909090;
  box-shadow: 2px 2px 10px #909090;
}

.login-btn {
  margin-top: 80px;
}

.index-login-divider {

}

.index-login-third {
  text-align: center;
}

.index-register {
  display: flex;
  justify-content: center;
  color: white;
  margin-top: 30px;
}

.showLogo{
  width: 270px;
  height: 270px;
  border: solid 1px blue;
  border-radius: 50%;
  margin-bottom: 1.5rem;
}

.showPolicy{
  color: blue;
  font-weight: bold;
  text-decoration: underline;
}

.checkboxRight{
  width: 100%;
  display: flex;
  text-align: left;
  font-size: 26px;
  padding: 0;
  border: 0;
  margin: 0;
}
</style>
