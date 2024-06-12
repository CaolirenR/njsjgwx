<template>
  <view  class="exam-item-container" >
    <view v-for="item in noticeList" class="messages mt-22 mb-22 ml-22 mr-22" @click="handleClickMessage(item)">
      <view>
        <nut-row type="flex" wrap="nowrap">
          <nut-col :span="24" class="exam-item-info">
            <h2 class="card-title">通知：{{item.titile}}</h2>
            <view class="course-item-info-member">
              <text class="card-simple-desc">{{item.createTime}}</text>
            </view>
            <view class="course-detail-btn">
              <nut-button type="primary" size="small" >详情查看</nut-button>
            </view>
          </nut-col>
        </nut-row>
      </view>
<!--      <view class="message-content overflow-hidden-text mt-22 mb-22">-->
<!--        <wxparse :html="item.msgContent"></wxparse>-->
<!--      </view>-->
    </view>
    <nut-empty v-if="loading===false && noticeList?.length === 0"></nut-empty>
  </view>
</template>

<script lang="ts">
import Taro from "@tarojs/taro";
import {hideLoading, showLoading, warnMessage} from "../../../utils/util";
import api from "../../../api/api";

export default {

  data(){
    return{
      noticeList:[],
      loading:false,
      pageNo:1,
      pageSize:10,
      hasNextPageRef:true,
      pageNumRef:1,
      total:1,
    }
  },

  mounted() {
    this.init()
  },


  // 下来刷新
  onPullDownRefresh() {
    try {
      this.init()
    } finally {
      Taro.stopPullDownRefresh();
    }
  },

  onReachBottom() {
    try {
      this.pageNo=this.pageNo+1
      this.fetchNotice(false);
    } finally {
      Taro.stopPullDownRefresh();
    }
  },

  methods:{
    async init() {
      try {
        await showLoading();
        // 初始化所有的数据
        this.initDefaultData()
        // 通知
        await this.fetchNotice( true);
      } finally {
        hideLoading();
      }
    },

    async fetchNotice(append:boolean = true){
      if (this.hasNextPageRef===false){
        return
      }

      if (this.loading===true) {
        return;
      }
      // 将加载设置为true
      this.loading = true
      if (append === true){
        this.noticeList=[];
      }
      try {
        this.loading=true
        const params = {
          "pageNo": this.pageNo,
          "pageSize":  this.pageSize,
        };
        const resultData = await api.getAnnouncement(params)
        console.log("获取的通知数据",resultData)
        if (resultData.code===0){
          for (let i = 0; i < resultData.result.anntMsgList.length; i++) {
            let singleNotice =  resultData.result.anntMsgList[i]
            let item = {
              id:singleNotice.id,
              // msgContent:singleNotice.msgContent,
              titile:singleNotice.titile,
              createTime:singleNotice.createTime,
            }
            this.noticeList.push(item)
          }
          this.total = resultData.result.anntMsgTotal
          this.pageNumRef = Math.floor(this.total/this.pageSize) + 1
          console.log("总页数：",this.pageNumRef)
        }else {
          await warnMessage(resultData.message,3000)
        }
      }finally {
        if (this.pageNo>=this.pageNumRef){
          this.hasNextPageRef=false
        }
        this.loading = false
      }

    },


    handleClickMessage(item) {
      Taro.navigateTo({url: "/pages/user_pages/message_detail/index?id=" + item.id});
    },

    /**
     * 舒适化所有数据
     */
    initDefaultData(){
      Object.assign(
          this.$data,
          {
            noticeList:[],
            loading:false,
            pageNo:1,
            pageSize:10,
            hasNextPageRef:true,
            pageNumRef:1,
            total:1,
          }
      );
    }

  }
}


</script>

<style>

</style>
