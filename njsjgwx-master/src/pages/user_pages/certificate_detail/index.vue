<template>
  <view class="showCertificateContainer" >
    <img  class="showImage" :src="imagePath" :mode="mode"  alt="" @click="showPreview"/>
  </view>

  <view class="showCanvas">
    <canvas  canvas-id="myCertificate" style="width: 100%; height: 100%;" />
  </view>

  <view :user-select="true" @click="setClipboard" >
    {{urlSet}}
  </view>

  <nut-button block plain  type="info" @click="openLink">保存证书</nut-button>
</template>

<script lang="ts">

import Taro from "@tarojs/taro";
import api from "../../../api/api";
import {hideLoading, showLoading} from "../../../utils/util";

export default {
  data(){
    return{
      id:"",
      imagePath:"",
      mode:"aspectFill",
      imageWidth:0,
      imageHeight:0,
      screenWidthSet:0,
      reSetHeight:0,
      urlSet:"",
    }
  },

  mounted() {
    this.init()
  },

  methods:{

    async init(){
      try {
        await showLoading();
        // 获取证书图片
        await this.fetchCertificate();

      } finally {
        hideLoading();
      }

    },


    async fetchCertificate(){
      const params = Taro.getCurrentInstance().router?.params
      console.log(params)

      this.id = params.id;

      const urlSet = api.getShowCertUrl(this.id)
      //
      console.log("打开的图片连接",urlSet)

      if ( this.id!==""&& this.id!==null){
        const requestParams = {
          "cid":this.id
        };

        const resultData = await api.showCert(requestParams)


        this.setFile(resultData.fileName,resultData.data)

        const ctx = Taro.createCanvasContext('myCertificate')

        Taro.getImageInfo({
          src: this.imagePath,
          success: function (res) {
            console.log(res.width)
            console.log(res.height)
            this.imageWidth = res.width
            this.imageHeight = res.height

            // 获取屏幕宽度和 图片宽度然后 重新计算比例进行缩放
            const windowInfo = Taro.getWindowInfo()

            console.log(windowInfo.screenWidth)
            this.screenWidthSet = windowInfo.screenWidth


            let ratioSet = this.screenWidthSet/this.imageWidth
            let heightSet = this.imageHeight * ratioSet
            console.log(heightSet)
            this.reSetHeight = heightSet
            ctx.drawImage(res.path, 0, 0,this.screenWidthSet ,this.reSetHeight)
            ctx.draw()
          }
        })
      }
    },

    setFile(fileName,fileData){
      let  filePath = `${Taro.env.USER_DATA_PATH}/${fileName}`;//写入本地文件
      console.log('filePath:',filePath);
      Taro.getFileSystemManager().writeFileSync(filePath,fileData)
      this.imagePath = filePath
    },



    showPreview(){
      if (this.imagePath!==""){
        Taro.previewImage({
          current: '',
          urls:[this.imagePath]
        })
      }
    },


    openLink(){
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.screenWidthSet,
        height: this.reSetHeight,
        destWidth: this.imageWidth,
        destHeight: this.imageHeight,
        canvasId: 'myCertificate',
        success: function (res) {
          console.log(res)
          const tempFilePath = res.tempFilePath;
          //保存二维码
          Taro.getSetting({
            success: function (res) {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                Taro.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success: function () {
                    // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
                    Taro.saveImageToPhotosAlbum({
                      filePath: tempFilePath,
                      success: function (res) {
                        console.log(res)
                        Taro.showToast({
                          title: '保存图片成功，请在系统目录中查看',
                        })
                      },
                      fail: function (err) {
                        console.log(err)
                        Taro.showToast({
                          title: '保存图片失败' ,
                        })
                      }
                    })
                  }
                })
              }else {
                Taro.saveImageToPhotosAlbum({
                  filePath: tempFilePath,
                  success: function (res) {
                    console.log(res)
                    Taro.showToast({
                      title: '保存图片成功，请在系统目录中查看',
                    })
                  },
                  fail: function (err) {
                    console.log(err)
                    Taro.showToast({
                      title: '保存图片失败' ,
                    })
                  }
                })

              }
            }
          })

        }
      })
    },

    setClipboard(){
      Taro.setClipboardData({
        data: this.urlSet,
        success (res) {
          console.log(res)
          Taro.getClipboardData({
            success (res) {
              console.log(res.data) // data
              Taro.showToast({
                title: '链接保存到剪贴板',
              })
            }
          })
        }
      })
    }




  },




}

</script>

<style>

.showCertificateContainer{
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center;    /* Center vertically */
  width: 100%;            /* Adjust as needed */
  height: 90%;           /* Adjust as needed */
  position: relative;     /* Required for absolute positioning */
  overflow: hidden;
  display: none;
}

.showImage{
  width: 100%;
  height: inherit;
}

.showCanvas{
  width: 100%;
  height: 100%;
  overflow: auto;
}

</style>


