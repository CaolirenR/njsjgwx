<template>
  <view class="couresebg" >
    <nut-searchbar v-model="searchValue" @search="search" type="text" confirm-type="search" @clear="clear"></nut-searchbar>
    <nut-menu>
      <nut-menu-item v-model="menuChoose" :cols="1" :options="options" @close="menuClose" @open="menuOpen" @change="menuChange"/>
    </nut-menu>

    <view v-if="menuChoose===0">
      <!--      在itemList中进行初始化 -->
      <view v-for="course in records">
        <course-item :item="course" @click="handleClickCourse(course)"></course-item>
      </view>
      <nut-empty v-if="!loading && records.length === 0"></nut-empty>
      <nut-divider v-if="hasNextPageRef===false"> 到底了 </nut-divider>
    </view>

    <view v-if="menuChoose!==0">
      <!--      在itemList中进行初始化 -->
      <view v-for="course in recordsWithProfession">
        <course-item :item="course" @click="handleClickCourse(course)"></course-item>
      </view>
      <nut-empty v-if="!loading && recordsWithProfession.length === 0"></nut-empty>
      <nut-divider v-if="hasNextPageRefWithProfession===false"> 到底了 </nut-divider>
    </view>
  </view>


<!--  <view class="ml-22 mr-22" v-if="menuChoose===0">-->
<!--    &lt;!&ndash;      在itemList中进行初始化 &ndash;&gt;-->
<!--    <view class="box-show-item mb-bottom-40" v-for="course in records">-->
<!--      <course-item :item="course" @click="handleClickCourse(course)"></course-item>-->
<!--    </view>-->
<!--    <nut-empty v-if="!loading && records.length === 0"></nut-empty>-->
<!--    <nut-divider v-if="hasNextPageRef===false"> 到底了 </nut-divider>-->
<!--  </view>-->

<!--  <view class="ml-22 mr-22" v-if="menuChoose!==0">-->
<!--    &lt;!&ndash;      在itemList中进行初始化 &ndash;&gt;-->
<!--    <view class="box-show-item mb-bottom-40" v-for="course in recordsWithProfession">-->
<!--      <course-item :item="course" @click="handleClickCourse(course)"></course-item>-->
<!--    </view>-->
<!--    <nut-empty v-if="!loading && recordsWithProfession.length === 0"></nut-empty>-->
<!--    <nut-divider v-if="hasNextPageRefWithProfession===false"> 到底了 </nut-divider>-->
<!--  </view>-->

</template>

<script lang="ts">
import api from "../../api/api";
import {
  getProfessionListFromStorage,
  hideLoading,
  replaceLeftSlashTurnToRightSlash,
  showLoading,
  warnMessage
} from "../../utils/util";
import Taro from "@tarojs/taro";
import {CourseItem} from "../../components/course-item";

export default {
  components: {
    'course-item': CourseItem
  },
  /**
   * 这里一开始思路就有问题，不应该把两个分开的。就一个只需要写一个统一的课程请求的。
   */



  data(){
    return{
      // 检查登录
      hasToken:false,
      professionList:[],
      options:[],
      menuChoose:0,
      prosPageNo:1,
      prosPageSize:1,
      // 选择的专业
      professionalChooseSet :"",


      // 带专业的列表
      recordsWithProfession:[],
      pageNoWithProfession:1,
      pageSizeWithProfession:10,
      totalWithProfession:1,
      pageNumRefWithProfession:1,
      hasNextPageRefWithProfession:true,


      loadingWithProfession:false,


      //搜索
      searchValue:"",
      // 课程的具体内容
      records: [],
      // 页数请求
      pageNo:1,
      // 请求大小
      pageSize:10,
      // 总数
      total:1,
      // 是否有下一页，
      hasNextPageRef:true,

      // 总页数
      pageNumRef:1,
      // 加载
      loading:false,

      type:"",
    }
  },

  mounted() {
    this.hasToken = api.judgeHaveToken()
    if (this.hasToken===true){
      this.init()
    }
  },


  onPullDownRefresh() {
    if (this.hasToken){
      try {
        if (this.menuChoose===0){
          this.setAsBasicDefault()
          this.fetch(true)
        }else {
          // 初始化
          this.setAsProDefault()
          //   如果在首页，就刷新全部
          this.fetchCourseWithProfessional(false)
        }
      } finally {
        Taro.stopPullDownRefresh();
      }
    }
  },


  onReachBottom() {
    if (this.hasToken){
      try {
        // 如果是全部分类
        if (this.menuChoose===0){
          this.pageNo=this.pageNo+1
          this.fetch( false);
        }else {
          // 其他的单独请求
          this.pageNoWithProfession= this.pageNoWithProfession+1
          this.fetchCourseWithProfessional(true)
        }
      } finally {
        Taro.stopPullDownRefresh();
      }
    }
  },



  methods:{

    menuClose(){
      console.log("关闭菜单。")
    },

    menuOpen(){
      console.log("打开菜单。")
    },

    async menuChange(callbackParameters){
      // 这里只传回来了value
      console.log("选择的：",callbackParameters)
    //   选择后开始请求
      console.log("变化的",this.menuChoose)
      this.menuSet = this.menuChoose
      if (callbackParameters!==0){
        await this.requestWithChoose(callbackParameters)
      }else {

      }
    },

    async requestWithChoose(callbackParameters){
      this.professionalChooseSet = callbackParameters
      await this.fetchCourseWithProfessional(false)
    },


    async init(){
      try {
        await showLoading();
        await this.fetchProfessionList();
      } finally {
        hideLoading();
      }
    },


    async fetchProfessionList(){
      // 在取数据之前尝试在内存中取
      let professionListStorage = getProfessionListFromStorage()
      // 如果没有取出来
      if (professionListStorage!==null){
        this.professionList =professionListStorage
        // 把option做出来
        this.options.push(
            {
              text:"所有专业分类",
              value:0
            }
        )
        for (let i = 0; i < professionListStorage.length; i++) {
          let item = professionListStorage[i]
          this.options.push(
              {
                text:item.professional_dictText,
                value:item.professional
              }
          )
        }
        //   完了后再请求课程
        await this.beginFetchCourseAndParseRouterData()
      }else {
        // 没有数据了就请求
        await this.fetchProfession()
      }
    },

    /**
     * 如果没有数据去出来
     */
    async fetchProfession(){
      const requestParams = {
        "pageNo": this.prosPageNo,
        // 这里先请求一个
        "pageSize":  this.prosPageSize,
      };
      const resultData = await api.getCurUserPro(requestParams)
      console.log("获取的专业列表：",resultData)
      this.professionList= []
      this.options.push(
          {
            text:"所有专业分类",
            value:0
          }
      )
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
              this.professionList.push( allProsResultData.result.records[i])
              this.options.push(
                  {
                    text:allProsResultData.result.records[i].professional_dictText,
                    value:allProsResultData.result.records[i].professional
                  }
              )
            }
            //   完了后再请求课程
            await this.beginFetchCourseAndParseRouterData()
          }else {
            await warnMessage(resultData.message,3000)
          }
        }else {
          // 只有一个就添加
          const resultRecords = resultData.result.records
          for (let i = 0; i < resultRecords.length; i++) {
            let item = resultRecords[i]
            // console.log("获取的专业科目",showSinglePro)
            this.professionList.push(item)
            this.options.push(
                {
                  text:item.professional_dictText,
                  value:item.professional
                }
            )
          }
          //   完了后再请求课程
          await this.beginFetchCourseAndParseRouterData()
        }

      }else {
        await warnMessage(resultData.message,3000)
      }

    },

    /**
     * 当解析完专业后，开始请求课程
     */
    async beginFetchCourseAndParseRouterData(){
      // 请求所有的课程
      await this.fetch( false);
      // 解析完专业后，开始解析来的参数
      await this.getParamsFromRouter()
    },


    async fetchCourseWithProfessional(append:boolean){
      if (this.loadingWithProfession ===true){
        return
      }
      if (this.hasNextPageRefWithProfession === false){
        return
      }

      // 不添加就重置
      if (append===false){
        this.recordsWithProfession=[]
      }else {

      }

      try {
        this.loadingWithProfession = true
        // 后端的分页请求。需要重新写
        // 这里是用的网页版的请求
        // const resultData = await api.getCourseList( this.pageNo,this.pageSize,courseSearchName)
        const params = {
          "name":this.searchValue,
          "pageNo": this.pageNoWithProfession,
          "pageSize":  this.pageSizeWithProfession,
          "professional" : this.professionalChooseSet,
          "type":this.type,
        };
        const resultData = await  api.getScoreByUser(params)
        if (resultData.code===200){
          console.log("获取的课程数据：",resultData)
          const resultRecords = resultData.result.records
          for (let i = 0; i <resultRecords.length; i++) {

            let recordSet = resultRecords[i]
            recordSet.logo = replaceLeftSlashTurnToRightSlash(recordSet.logo)
            console.log(recordSet.logo)
            this.recordsWithProfession.push(recordSet)
          }
          this.totalWithProfession = resultData.result.total;
          this.pageNumRefWithProfession = Math.floor(this.totalWithProfession/this.pageSizeWithProfession) + 1
          console.log("总页数：",this.pageNumRefWithProfession)
        }else {
          await warnMessage(resultData.message,3000)
        }
      } finally {
        if (this.pageNoWithProfession>=this.pageNumRefWithProfession){
          this.hasNextPageRefWithProfession=false
        }
        this.loadingWithProfession = false;
        await hideLoading();
      }


    },


    async fetch( append :boolean = true,) {
      if (this.hasNextPageRef===false) {
        return;
      }
      if (this.loading===true) {
        return;
      }
      // 设置为正在请求，免得重复请求
      this.loading = true;
      // 在首次请求，或者搜索请求的时候都需要清空数据
      if (append===true) {
        this.records = [];
      }
      await showLoading();
      try {
        // 后端的分页请求。需要重新写
        // 这里是用的网页版的请求
        // const resultData = await api.getCourseList( this.pageNo,this.pageSize,courseSearchName)
        const params = {
          "name":this.searchValue,
          "pageNo": this.pageNo,
          "pageSize":  this.pageSize,
          "professional" : "",
          "type":this.type,
        };
        const resultData = await  api.getScoreByUser(params)
        if (resultData.code===200){
          console.log("获取的课程数据：",resultData)
          const resultRecords = resultData.result.records

          for (let i = 0; i <resultRecords.length; i++) {
            let recordSet = resultRecords[i]
            recordSet.logo = replaceLeftSlashTurnToRightSlash(recordSet.logo)
            this.records.push(recordSet)
          }
          this.total = resultData.result.total;
          this.pageNumRef = Math.floor(this.total/this.pageSize) + 1
          console.log("总页数：",this.pageNumRef)
        }else {
          await warnMessage(resultData.message,3000)
        }
      } finally {
        if (this.pageNo>=this.pageNumRef){
          this.hasNextPageRef=false
        }
        this.loading = false;
        await hideLoading();
      }
    },




    handleClickCourse(course) {
      console.log('Clicked on course:', course);
      let queryParameters = Object.entries(course).map(([k, v]) => `${k}=${v}`).join('&');
      Taro.navigateTo({url: "/pages/exam_pages/course_detail/index?"+queryParameters})
    },


    search(){
      if (this.hasToken===true){
        if (this.menuChoose===0){
          this.setAsBasicDefault()
          this.fetch(true)
        }else {
          this.setAsProDefault()
          this.fetchCourseWithProfessional(false)
        }
      }
    },

    clear(){
      this.searchValue= ""
    },

    // 下拉刷新和搜索的时候需要重新设置
    setAsBasicDefault(){
      this.searchValue=""
      this.records= []
      this.pageNo=1
      this.pageSize=10
      this.total=1
      this.hasNextPageRef=true
    },


    setAsProDefault(){
      this.searchValue=""
      this.recordsWithProfession=[]
      this.pageNoWithProfession=1
      this.pageSizeWithProfession=10
      this.totalWithProfession=1
      this.pageNumRefWithProfession=1
      this.hasNextPageRefWithProfession=true
    },


    async getParamsFromRouter(){
      // 获取参数
      const params = Taro.getCurrentInstance().router.params
      // console.log("父页面传递的参数",params);
      if (params.id!==null&&params.id!==undefined){
        let professionalId = params.id
        console.log(professionalId)
        this.menuChoose = professionalId
        this.professionalChooseSet = professionalId
        await this.fetchCourseWithProfessional(false)
      }else {

      }

    },





  },



}



</script>


<style>

.custom-tab-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
  padding-top:10px;
  padding-bottom: 20px;
  width: fit-content;
  font-size: 40px;
  font-weight: 550;
}

.custom-title {
  color: black;
  cursor: pointer;
}
.custom-title.active {
  color: gray;
}

</style>
