<template>
  <view class="bg-gray" v-if="userInfo !== undefined">
    <view class="avatar-container flex-row" @click="handleUserInfo">
      <view  class="avatar">
        <img class="showAvatar" :mode="mode" :src="avatar" v-if="hasToken===true"/>
      </view>
      <view class="flex-col user-info" v-if="hasToken===true">
        <text class="userName">{{ userInfo.username }}</text>
        <text class="userDesc">
          {{userInfo.realname}}
        </text>
      </view>

      <view class="flex-col user-info" v-if="hasToken===false">
        <text class="clickLogin">点击登录</text>
      </view>

      <view class="more-btn">
        <IconFont name="rect-right" size="15" color="#CCC"></IconFont>
      </view>
    </view>
    <view class="top-tab-container flex-row">
      <view class="top-tab-item" @click="handleClickTopTab('/pages/exam_pages/favorite/index')">我的考试</view>
      <view class="top-tab-item" @click="handleClickTopTab('/pages/exam_pages/course/index')">我的学习</view>
      <view class="top-tab-item" @click="handleClickTopTab('/pages/user_pages/certificate/index')">我的证书</view>
    </view>
    <view class="container">
      <nut-cell-group>
        <nut-cell title="我的通知" arrow="right" @click="handleMessages">
          <template v-slot:icon>
            <IconFont name="message" color="#ffa200"></IconFont>
          </template>
          <template v-slot:link>
            <IconFont name="rect-right" color="#CCC"></IconFont>
          </template>
        </nut-cell>
        <nut-cell title="帮助" @click="handleHelpClick">
          <template v-slot:icon>
            <IconFont name="ask" color="#F97D81"></IconFont>
          </template>
          <template v-slot:link>
            <IconFont name="rect-right" color="#CCC"></IconFont>
          </template>
        </nut-cell>
        <nut-cell title="联系方式" @click="handleContactClients">
          <template v-slot:icon>
            <IconFont name="link" color="#00a03e"></IconFont>
          </template>
          <template v-slot:link>
            <IconFont name="rect-right" color="#CCC"></IconFont>
          </template>
        </nut-cell>
        <nut-cell title="分享给朋友" @click="handleClickShare">
          <template v-slot:icon>
            <IconFont name="share" color="#35A7FF"></IconFont>
          </template>
          <template v-slot:link>
            <IconFont name="rect-right" color="#CCC"></IconFont>
          </template>
        </nut-cell>
        <nut-cell title="关于" @click="handleClickAbout">
          <template v-slot:icon>
            <IconFont name="my" color="#9881F5"></IconFont>
          </template>
          <template v-slot:link>
            <IconFont name="rect-right" color="#CCC"></IconFont>
          </template>
        </nut-cell>
        <nut-cell title="退出登录" @click="handleLogout" v-if="hasToken===true">
          <template v-slot:icon>
            <IconFont name="tips" color="#2288A5"></IconFont>
          </template>
          <template v-slot:link>
            <IconFont name="rect-right" color="#CCC"></IconFont>
          </template>
        </nut-cell>
      </nut-cell-group>
    </view>
  </view>

  <nut-dialog v-model:visible="isDownloadManual" content="确定要下载操作手册？"
              @cancel="handleClose"
              @ok="handleConfirm"></nut-dialog>

  <nut-dialog v-model:visible="isSignOut" content="确定登出账号？"
              @cancel="handleSignOutClose"
              @ok="handleSignOutConfirm"></nut-dialog>

</template>

<script lang="ts">
import {IconFont} from '@nutui/icons-vue-taro';
import api, {USER_SERVICE} from '../../api/api';
import Taro from "@tarojs/taro";
import {hideLoading, showLoading} from "../../utils/util";

export default {
  components: {IconFont},

  data(){
    return {
      hasToken:false,
      // 头像
      avatar:"",
      // 基础的用户信息，需要从侯丹获取
      userInfo:{
        username:"",
        realname:"",
      },
      OperationManualUrl:"",
      isDownloadManual:false,
      isSignOut:false,
      mode:"aspectFill",
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    if(this.hasToken===true){
      try {
        this.init()
      } finally {
        Taro.stopPullDownRefresh();
      }
    }
  },

  mounted() {
    this.hasToken = api.judgeHaveToken()
    if (this.hasToken===true){
      this.init()
    }
  },

  methods:{
    async fetch(){
      const resultData = await api.getExamineeInfo()
      console.log("个人信息",resultData)
      // 头像这里需要更新一个东西
      this.avatar = USER_SERVICE+"/"+ resultData.result.avatar
      this.userInfo.realname = resultData.result.realname
      this.userInfo.username = resultData.result.username
    },

    handleClickAbout() {
      Taro.navigateTo({url: "/pages/user_pages/about/index"});
    },

    async handleLogout() {
      this.isSignOut=true
    },

    /**
     * 用户详情点击头像部分
     */
    handleUserInfo() {
      this.jumpPage("/pages/user_pages/user_info/index")
    },

    /**
     * 我的消息
     */
    handleMessages() {
      this.jumpPage( "/pages/user_pages/messages/index")
    },

    /**
     * 联系客户界面
     */
    handleContactClients(){
      Taro.navigateTo({url: "/pages/user_pages/contact_clients/index"});
    },


    handleHelpClick() {
      this.isDownloadManual=true
    },


    handleClickShare() {
      Taro.showShareMenu({
        withShareTicket: true
      });
    },

    handleClickTopTab(url) {
      this.jumpPage(url)
    },

    jumpPage(jumpUrl:string){
      if (this.hasToken===false){
        Taro.reLaunch({ url: "/pages/index/index" })
      }else {
        Taro.reLaunch({ url: jumpUrl })
      }
    },

    async init(){
      try {
        await showLoading();
        await this.fetch();
      } finally {
        hideLoading();
      }
    },


    handleClose(){
      this.isDownloadManual=false
    },


    handleConfirm(){
      this.downloadAndOpenFile()
      this.isDownloadManual=false
    },

    /**
     * 登出的方法
     */
    handleSignOutClose(){
      this.isSignOu=false
    },

    /**
     * 确定登出
     */
    async handleSignOutConfirm(){
      await api.userLogout();
      this.isSignOu=false
    },



    downloadAndOpenFile(){
      let fileUrl = this.OperationManualUrl
      console.log("下载url：",fileUrl)
      if (fileUrl!==""){
        Taro.downloadFile({//下载
          url: fileUrl,
          success: function (res) {
            let filePath = res.tempFilePath;
            console.log("文件路径：",filePath)
            let fileType = ''
            let getFileTypeFromUrl = fileUrl.split('.').pop()
            console.log("文件后缀：",getFileTypeFromUrl)
            switch (getFileTypeFromUrl) {
              case 'doc':
                fileType = 'doc'
                break;
              case 'xls':
                fileType = 'xls'
                break;
              case 'ppt':
                fileType = 'ppt'
                break;
              case 'pdf':
                fileType = 'pdf'
                break;
              case 'docx':
                fileType = 'docx'
                break;
              case 'xlsx':
                fileType = 'xlsx'
                break;
              case 'pptx':
                fileType = 'pptx'
                break;
              default:
                fileType = 'else'
                break;
            }

            if(fileType !== 'else'){
              Taro.openDocument({
                filePath: filePath,
                showMenu: true,
                success: function(res) {
                  console.log("文档打开成功：",res);
                  Taro.showToast({
                    title: '文档打开成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail: function (res) {
                  console.log("文档打开失败：",res)
                  Taro.showToast({
                    title: '文档打开失败',
                    icon: 'none',
                    duration: 2000
                  })
                },
              });
            }else{
              Taro.previewImage({
                current: '',
                urls:[res.tempFilePath]
              })
            }
          },
          fail: function (res) {
            console.log("打开失败",res)
          }
        })
      }else {

      }


    },






  },

}




</script>

<style>

.nut-cell__title{
  font-size: 34px;
}


.avatar-container {
  height: 200px;
  color: rgba(80, 80, 80, 1);
  background-color: rgba(255, 255, 255, 1);
  font-size: 20px;
  margin-bottom: 30px;
}

.showAvatar{
  max-height: 150px;
  max-width: 150px;
}

.top-tab-container {
  height: 60px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: rgba(80, 80, 80, 1);
  background-color: rgba(255, 255, 255, 1);
  font-size: 16px;
  text-align: center;
}

.avatar {
    width: 150px;
    height: 150px;
    display: block;
    margin-left: 24px;
}
/* .avatar {
  margin-left: 20px;
} */

.userName {
  margin-left: 20px;
  color: rgba(80, 80, 80, 1);
  font-size: 30px;
  text-align: left;
}

.userDesc {
  margin-left: 20px;
  margin-top: 8px;
  color: rgba(166, 166, 166, 1);
  font-size: 26px;
}

.top-tab-item {
  color: rgba(80, 80, 80, 1);
  font-size: 40px;
  flex: 1;
  border-right: 1px solid rgba(236, 238, 241, 1);
}

.top-tab-item:last-child {
  border-right: none;
}

.share-box {
  margin-top: 10px;
}

.container {
  margin-top: 10px;
}

.user-info {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 20px;
}

.more-btn {
  padding-right: 30px;
}


.clickLogin{
  color: #505050;
  font-size: 50px;
  text-align: left;
  font-weight: bold;
}
</style>
