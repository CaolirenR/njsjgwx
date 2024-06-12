<template>
  <view class="exam-view">
    <view class="exam-item box-show-item flex-col" v-for="(item, index) in itemList" :key="index">
      <exam-item :item="item" @handleExam="handleExam(item,index)"></exam-item>
    </view>
    <nut-empty v-if="!loading && itemList.length === 0" ></nut-empty>
  </view>
</template>

<script lang="ts">
import {IconFont} from '@nutui/icons-vue-taro';
import Taro from "@tarojs/taro";
import {showLoading, hideLoading} from '../../utils/util';
import api from "../../api/api";
import {ExamItem} from "../../components/exam-item";

export default {
  components: {
    'exam-item': ExamItem,
    IconFont
  },

  data(){
    return{
      hasToken:false,
      loading:false,
      itemList:[],
      examspageNo:1,
      pageSize:10,
    }
  },




  mounted() {
    this.hasToken = api.judgeHaveToken()
    if (this.hasToken===true){
      this.init()
    }
  },

  methods:{
    async init() {
      try {
          await showLoading();
          // 考试
          await this.fetchExams();
      } finally {
        hideLoading();
      }
    },

    async fetchExams(){
      const requestParams = {
        "pageNo": this.examspageNo,
        "pageSize":  this.pageSize,
      };
      const resultData = await api.getExamProjectByUser(requestParams)
      console.log("获取的考试列表：",resultData)
      this.itemList = [];
      const resultRecords = resultData.result.records
      for (let i = 0; i < resultRecords.length; i++) {
        this.itemList.push(resultRecords[i])
      }
    },

    handleExam(item,index){
      // console.log(item,index)
      // 这里拼装跳转参数
      let queryParameters = Object.entries(item).map(([k, v]) => `${k}=${v}`).join('&');
      Taro.navigateTo({url: "/pages/exam_pages/exam_detail/index?"+queryParameters})
    }

  },


  onPullDownRefresh() {
    try {
      if (this.hasToken===true){
        this.init()
      }
    } finally {
      Taro.stopPullDownRefresh();
    }
  },

  onReachBottom() {
    try {
    //   如果超过了10条还有做更多的处理
    } finally {
      Taro.stopPullDownRefresh();
    }
  },


}
</script>

<style>
.exam-view{
  background-color: #EEEEEE;
  height: 100%;
  padding-top: 20px;
  overflow: auto;
}



</style>
