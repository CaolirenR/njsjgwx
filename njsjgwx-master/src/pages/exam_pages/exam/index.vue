<template>
  <view>
<!--    <view>-->
<!--      <nut-searchbar v-model="searchValue" @search="handleSearch" placeholder="搜索"/>-->
<!--    </view>-->
    <view class="exam-view">
      <nut-tabs v-model="current" @click="handleTabClick" swipeable >
        <nut-tab-pane title="考试">
          <view class="exam-item box-show-item flex-col" v-for="(item, index) in itemList" :key="index">
            <exam-item :item="item" @handleExam="handleExam(item,index)"></exam-item>
          </view>
          <nut-empty v-if="!loading && itemList.length === 0"></nut-empty>
        </nut-tab-pane>
        <nut-tab-pane title="专业">
          <view class="exam-item box-show-item flex-col"  v-for="(item, index) in professionList" :key="index">
            <profession-item :item="item" @handProfession="handProfession(item,index)"  @handleRefresh="handleRefresh(item,index)" @handleToCourse="handleToCourse(item,index)"></profession-item>
          </view>
          <nut-empty v-if="!loading && professionList.length === 0"></nut-empty>
        </nut-tab-pane>
        <nut-tab-pane title="证书">
          <view class="exam-item box-show-item flex-col" v-for="item in certificateItems">
            <certificate-item :item="item" @handleCertificate="handleCertificate(item)"></certificate-item>
          </view>
          <nut-empty v-if="!loading && certificateItems.length === 0"></nut-empty>
        </nut-tab-pane>
      </nut-tabs>
    </view>
  </view>
</template>
<script lang="ts">
import Taro from "@tarojs/taro";
import {examTypeTagList, shardMessage} from '../../../constant/constant';
import {ExamItem} from "../../../components/exam-item";
import {CertificateItem} from "../../../components/certificate-item";
import {ProfessionItem} from "../../../components/profession-item";
import {
  getProfessionListFromStorage,
  hideLoading,
  showCertificateMessage,
  showLoading,
  successMessage,
  warnMessage
} from "../../../utils/util";
import api from "../../../api/api";

export default {
  components: {
    'exam-item': ExamItem,
    'certificate-item':CertificateItem,
    'profession-item':ProfessionItem,
  },
  data(){
    const params =  Taro.getCurrentInstance().router.params;
    let active = 0;
    if (params.active !== undefined) {
      active = Number(params.active);
      Taro.setNavigationBarTitle({title: this.getTitleName(active)})
    }
    return{
      params,
      current:active,
      // 考试
      itemList:[{}],
      // 证书
      certificateItems:[{}],
      // 证书
      professionList:[{}],
      searchValue:'',
      hasNextPageRef:true,
      nextPageRef:1,
      loading:false,
      pageNumRef:1,
      tagsList: examTypeTagList,

      examspageNo:1,

      prosPageNo:1,
      prospageSize:1,


      pageSize:10,

    }
  },

  onPullDownRefresh() {
    try {
      // this.resetPage();

    } finally {
      Taro.stopPullDownRefresh();
    }
  },

  onReachBottom() {
    try {

    } finally {
      Taro.stopPullDownRefresh();
    }
  },
  onShareAppMessage() {
    return shardMessage;
  },
  async onShareTimeline() {
    return shardMessage;
  },

  mounted() {
    this.init()
  },

  methods:{

    async fetchProfessionList(){
      // 在取数据之前尝试在内存中取
      let professionListStorage = getProfessionListFromStorage()
      // 如果没有取出来
      if (professionListStorage!==null){
        this.professionList =professionListStorage
      }else {
        // 没有数据了就请求
        await this.fetchProfession()
      }

    },


    /**
     * 如果内存没有的情况
     */
    async fetchProfession(){
      const requestParams = {
        "pageNo": this.prosPageNo,
        "pageSize":  this.prospageSize,
      };
      let resultData = await api.getCurUserPro(requestParams)
      this.professionList= []
      if (resultData.code===200){
        let total = resultData.result.total
        this.prospageSize = total
        const reRequestParams = {
          "pageNo": this.prosPageNo,
          "pageSize":  this.prospageSize,
        }
        resultData = await api.getCurUserPro(reRequestParams)
        const resultRecords = resultData.result.records
        console.log("获取的专业列表：",resultData)
        for (let i = 0; i < resultRecords.length; i++) {
          let item = resultRecords[i]
          // 设置展示的内容
          let showMessage = showCertificateMessage(item)
          // 重新分配进去
          let showSinglePro = {}
          Object.assign(showSinglePro, item, { showMessage: showMessage,});
          // console.log("获取的专业科目",showSinglePro)
          this.professionList.push(showSinglePro)
        }
      }else {
        await warnMessage(resultData.message,3000)
      }
    },



    async fetchCertificateList(){
      const resultData = await api.queryCert()
      this.certificateItems=[]
      if (resultData.code ===200){
        let certificateList = resultData.result
        for (let i = 0; i < certificateList.length; i++) {
          let item = certificateList[i]
          let showCertificateItem = {
            id:item.id,
            createTime:item.createTime,
            professional:item.professional,
            certificateName:"证书"+(i+1).toString(),
          }
          this.certificateItems.push(showCertificateItem)
        }

      }else {

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
      if (resultData.code===200){
        const resultRecords = resultData.result.records
        for (let i = 0; i < resultRecords.length; i++) {
          this.itemList.push(resultRecords[i])
        }
      }else {

      }
    },


    convertTime(convertTime){
      if (convertTime!==null||convertTime!==""){
        return convertTime.split(" ")[0]
      }else {
        return convertTime
      }

      // 这个在提醒ISO 无法正常使用
      // return new Date(convertTime).toISOString().split('T')[0]

    },


    async init() {
      try {
        await showLoading();
        await this.fetchExams();
      } finally {
        hideLoading();
      }

      try {
        await showLoading();
        await this.fetchProfessionList();
      } finally {
        hideLoading();
      }

      try {
        await showLoading();
        setTimeout( async() => {
          //   证书
          await this.fetchCertificateList();
        }, 300);
      } finally {
        hideLoading();
      }


    },


    getTitleName(value) {
      let title = '考试';
      if (value === 1) {
        title = '专业';
      } else if (value === 2) {
        title = '证书';
      }
      return title + '列表';
    },

    handleExam(item,index){
      // console.log(item,index)
      // 这里拼装跳转参数
      let queryParameters = Object.entries(item).map(([k, v]) => `${k}=${v}`).join('&');
      Taro.navigateTo({url: "/pages/exam_pages/exam_detail/index?"+queryParameters})
    },

    async handleCertificate(item){
      Taro.navigateTo({url: "/pages/user_pages/certificate_detail/index?id="+item.id.toString()});
    },


    async handProfession(item,index){
      // 小于60分不给点
      if (item.score<60){

      }else {
        if (item.certificate){
          Taro.navigateTo({url: "/pages/user_pages/certificate_detail/index?id="+item.certificate.toString()});
        }else {
          const requestParams = {
            "professional": item.professional.toString(),
          };
          const resultData = await api.genCert(requestParams)
          // 分析参数
          console.log("生成证书的数据：",resultData)
          if (resultData.code===200){
            // 提示然后修改参数样式
            await successMessage("证书生成成功，请到证书查看")

            this.professionList[index].showMessage="查看证书"
            this.professionList[index].certificate= resultData.result
            // 跳转证书详情页
            Taro.navigateTo({url: "/pages/user_pages/certificate_detail/index?id="+resultData.result});
          }else if (resultData.code===500){
            // 如果是没有上传照片。跳转到上传页
            if (resultData.message==="请先上传标准照后生成合格证"){
              await warnMessage(resultData.message,2000)
              setTimeout(() => {
                // 在这里执行你想要延迟执行的函数或代码
                Taro.navigateTo({url: "/pages/user_pages/user_info/index"});
              }, 2000);
            }else {
              //
              await warnMessage(resultData.message,3000)
            }
          }
        }
      }
    },

    handleTabClick({paneKey}) {
      const value = Number(paneKey);
      this.searchValue = "";
      Taro.setNavigationBarTitle({title:  this.getTitleName(value)})
      this.resetPage();
    },

    handleSearch() {
      this.resetPage();
    },

    resetPage() {
      this.hasNextPageRef = true;
      this.nextPageRef = 1;
    },


    async handleRefresh(item,index){
      const requestParams= {
        "professional":item.id,
      }
      const resultData = await api.calcLearndTime(requestParams)
      if (resultData.code===200){
      //   这里没有单独刷新的，没有办法只有全部刷新了
        await  this.fetchProfessionList();
      }else {

      }
    },


    handleToCourse(item,index){
      console.log(item)
      Taro.reLaunch({ url: "/pages/course/index?id="+item.professional});
    },


  }
}





</script>

<style>
.exam-view .nut-tab-pane {
  padding: 0;
}


</style>
