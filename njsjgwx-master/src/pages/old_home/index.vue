<template>
  <view>
<!--    首页轮播图的地方-->
    <view class="banner-swiper-view">
      <nut-swiper :init-page="banners.length" :pagination-visible="true" pagination-color="#426543" auto-play="3000"
                  height="250">
        <nut-swiper-item v-for="(item, idx) in banners" :key="idx">
          <view @click="handleClickBanner(item)">
            <img :src="item" class="banner-swiper-image" :mode="mode"/>
          </view>
        </nut-swiper-item>
      </nut-swiper>
    </view>

  </view>
  <view>
    <nut-noticebar direction="vertical" :list="list" :speed="10" :stand-time="2000" @click="handleClick"/>
  </view>
  <view class="home-view">
    <view class="home-view-tips">功能列表</view>
    <nut-grid :column-num="3"  clickable>
      <nut-grid-item text="考试" @click="handleGridClickExam0">
        <IconFont font-class-name="iconfont" class-prefix="icon" name="kaoshi" size="42px" color="#FF9800"></IconFont>
      </nut-grid-item>
      <nut-grid-item text="课程" @click="handleGridClickCourse">
        <IconFont font-class-name="iconfont" class-prefix="icon" name="kecheng" size="42px" color="#5ab6ff"></IconFont>
      </nut-grid-item>
      <nut-grid-item text="专业" @click="handleGridClickExam1">
        <IconFont font-class-name="iconfont" class-prefix="icon" name="zhuanye" size="42px" color="#ff217c"></IconFont>
      </nut-grid-item>
      <nut-grid-item text="证书" @click="handleGridClickExam2">
        <IconFont font-class-name="iconfont" class-prefix="icon" name="tiaochawenjuan" size="42px" color="#F44336"></IconFont>
      </nut-grid-item>
      <nut-grid-item text="试卷" @click="handleGridClickFav">
        <IconFont font-class-name="iconfont" class-prefix="icon" name="shoucang" size="42px" color="red"></IconFont>
      </nut-grid-item>
      <nut-grid-item text="通知" @click="handleGridClickExam3">
        <IconFont font-class-name="iconfont" class-prefix="icon" name="tongzhi" size="42px" color="#FF9800"></IconFont>
      </nut-grid-item>
    </nut-grid>

    <view class="home-view-tips">我的学习专业</view>

    <view class="popular-course-item box-show-item mb-bottom-40"  v-for="(item, index) in professionList" :key="index">
      <profession-item :item="item" @handProfession="handProfession(item,index)"  @handleRefresh="handleRefresh(item,index)" @handleToCourse="handleToCourse(item,index)" ></profession-item>
    </view>

<!--    <view class="popular-course-item box-show-item mb-bottom-40" v-for="course in records">-->
<!--      <course-item :item="course" @click="handleClickCourse(course)"></course-item>-->
<!--    </view>-->

  </view>
</template>
<script lang="ts">
import Taro from '@tarojs/taro';
import {IconFont} from '@nutui/icons-vue-taro';
import {shardMessage} from '../../constant/constant';
import {CourseItem} from '../../components/course-item/'
import {
  hideLoading,
  saveProfessionListToStorage,
  showCertificateMessage,
  showLoading,
  successMessage,
  warnMessage
} from '../../utils/util';
import api from "../../api/api";
import {ProfessionItem} from "../../components/profession-item";


export default {
  components: {
    IconFont,
    'course-item': CourseItem,
    'profession-item':ProfessionItem
  },
  data(){
    return {
      noticeValue:"通知，最新课程已经更新",
      searchValue:"",
      records:[],
      banners:api.getBannerList(),
      // 通知栏消息
      noticeList:[],
      pageNo:1,
      pageSize:10,
      list:[],
      professionList:[],
      total:0,
      current:0,
      mode:"aspectFill",
      prosPageNo:1,
      prosPageSize:1,
    };
  },

  mounted() {
    this.init()
  },

  methods:{

    /**
     * 格子的点击事件
     */
    handleGridClickExam0() {
      Taro.navigateTo({url: "/pages/exam_pages/exam/index?active=0"});
    },

    handleGridClickExam1() {
      Taro.navigateTo({url: "/pages/exam_pages/exam/index?active=1"});
    },

    handleGridClickExam2() {
      Taro.navigateTo({url: "/pages/exam_pages/exam/index?active=2"})
    },

    handleGridClickExam3() {
      Taro.navigateTo({url: "/pages/user_pages/messages/index"});
    },

    handleGridClickCourse() {
      Taro.navigateTo({url: "/pages/exam_pages/course/index"});
    },

    handleGridClickFav() {
      Taro.navigateTo({url: "/pages/exam_pages/favorite/index"});
    },


    /**
     * 课程详细点击事件
     * @param course
     */
    handleClickCourse(course) {
      console.log('Clicked on course:', course);
      let queryParameters = Object.entries(course).map(([k, v]) => `${k}=${v}`).join('&');
      Taro.navigateTo({url: "/pages/exam_pages/course_detail/index?"+queryParameters})

    },

    handleClickBanner(item) {
      const {redirectUrl} = item;
      if (redirectUrl === null || redirectUrl === '') {
        return;
      }
      if (redirectUrl.startsWith('http')) {
        Taro.navigateTo({url: "/pages/exam_pages/webview/index?url=" + redirectUrl})
      } else {
        Taro.navigateTo({url: redirectUrl});
      }
    },

    handleFav(item) {
      const text = item.favorite ? '收藏' : '取消收藏';
      successMessage(text + '成功');
    },

    /**
     * 获取当前用户所报名的专业及学习情况
     */
    async fetchScoreByUser(){
      const params = {
        "pageNo": this.pageNo,
        "pageSize":  this.pageSize,
      };
      const resultData = await api.getScoreByUser(params)
      console.log("获取的课程数据：",resultData)
      this.records=[];
      const resultRecords = resultData.result.records
      for (let i = 0; i <resultRecords.length; i++) {
        this.records.push(resultRecords[i])
      }

    },

    /**
     * 获取头部通知栏
     */
    async fetchNotice(){
      const params = {
        "pageNo": this.pageNo,
        "pageSize":  this.pageSize,
      };
      const resultData = await api.getAnnouncement(params)
      console.log("获取的通知数据",resultData)

      this.noticeList=[];
      if (resultData.code === 0 && resultData.result.anntMsgList) {
        this.list = resultData.result.anntMsgList.map(singleNotice => singleNotice.titile);
      }
    },

    handleClick(item){
      console.log(item)
      Taro.navigateTo({url: "/pages/user_pages/messages/index"});
    },



    async init() {
      try {
        await showLoading();
        // 录播图
        // await fetchBanners();
        // 通知
        await this.fetchNotice();

        // 获取用户课程
        // await this.fetchScoreByUser();

      //   这里需要获取用户的专业了
        await this.fetchProfessionList();

      } finally {
        hideLoading();
      }
    },


    /**
     * 获取专业列表
     */
    async fetchProfessionList(){
      const requestParams = {
        "pageNo": this.prosPageNo,
        // 这里先请求一个
        "pageSize":  this.prosPageSize,
      };
      const resultData = await api.getCurUserPro(requestParams)
      console.log("获取的专业列表：",resultData)
      this.professionList= []
      if (resultData.code===200){
        //   请求后把剩下的全部请求出来。因为上面要做分专业
        let total = resultData.result.total
        // 如果总数大于 1 因为理论上只有一个专业 ，如果只有1个 应该专业就添加。大于 1个专业就请求所有的
        if (total>this.prosPageSize){
          this.prosPageSize = total
          //   然后再请求一次把所有专业拉下来
          const allProsRequestParams ={
            "pageNo": this.prosPageNo,
            "pageSize":  this.prosPageSize,
          }
          // 获取所有专业
          const allProsResultData = await api.getCurUserPro(allProsRequestParams)
          if (allProsResultData.code===200){
            for (let i = 0; i < allProsResultData.result.records.length; i++) {
              // console.log("获取的专业科目",showSinglePro)
              let item =  allProsResultData.result.records[i]
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
        }else {
          // 只有一个就添加进去
          const resultRecords = resultData.result.records
          for (let i = 0; i < resultRecords.length; i++) {
            // console.log("获取的专业科目",showSinglePro)
            let item = resultRecords[i]
            // 设置展示的内容
            let showMessage = showCertificateMessage(item)
            // 重新分配进去
            let showSinglePro = {}
            Object.assign(showSinglePro, item, { showMessage: showMessage,});
            // console.log("获取的专业科目",showSinglePro)
            this.professionList.push(showSinglePro)
          }
        }

      //   当添加完所有的professionList后，开始缓存
        saveProfessionListToStorage(this.professionList)

      }else {
        await warnMessage(resultData.message,3000)
      }
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



  },




  onPullDownRefresh() {
    try {
      this.init();
    } finally {
      Taro.stopPullDownRefresh();
    }
  },
  onShareAppMessage() {
    return shardMessage;
  },
  async onShareTimeline() {
    return shardMessage;
  }
}

</script>

<style>


.nut-grid-item__text{
  font-size: 35px;
}


.popular-course-item {
  background: white;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}
</style>
