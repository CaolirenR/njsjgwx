<!--详细消息查看-->
<template>
  <view>
    <view class="no-border-message mt-22 ml-22 mr-22">
      <view class="message-title-container">
        <h3 class="message-title">{{message.titile}}</h3>
      </view>
      <view class="message-detail-title-time mt-22">
        {{message.createTime}}
      </view>
      <view class="message-content mt-22">
        <wxparse :html="message.msgContent"></wxparse>
<!--        <text>{{message.msgContent}}</text>-->
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Taro from "@tarojs/taro";
import {hideLoading, showLoading} from "../../../utils/util";
import api from "../../../api/api";

export default {
  data(){
    return{
      message:{

      },
      id:"",
      pageNo:1,
      pageSize:10,
    }
  },

  mounted() {
    this.init()
  },

  methods:{
    async init(){
      try {
        await showLoading();
        // 通知
        await this.fetchNotice();
      } finally {
        hideLoading();
      }
    },

    async fetchNotice(){
      const params = Taro.getCurrentInstance().router?.params
      console.log(params)
      this.id = params.id;
      const resultData = await api.getSysAnnountCement(this.id)
      if (resultData.code===0){
        this.message= resultData.result.records[0]
      }

    },

  },


}
</script>


<style>

</style>
