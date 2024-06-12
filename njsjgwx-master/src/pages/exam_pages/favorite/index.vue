<template>
  <view class="">

    <view v-for="(item, index) in records" :key="index" >
      <view class="showinspectItem" @click="toAnswerPage(index)">
      <nut-row :gutter="10">
        <nut-col :span="19">
          <view>
            <h2 class="card-title">试卷{{index+1}}     <nut-tag color="#FA2400" plain><view class="showStatues"> {{item.status}}</view> </nut-tag></h2>
            <view class="course-item-info-member">
              <text class="card-simple-desc">得分：{{item.totalScore}} 分</text>
            </view>
            <view class="course-item-info-member">
              <text class="card-simple-desc">开始：{{item.createTime}}</text>
            </view>
            <view class="course-item-info-member">
              <text class="card-simple-desc">更新：{{item.updateTime}}</text>
            </view>
          </view>
        </nut-col>
        <nut-col :span="5">
          <view class="showInspectPapers">
            <nut-button type="info" plain  size="small" >查看详情</nut-button>
          </view>
        </nut-col>
      </nut-row>
      </view>
    </view>


    <nut-empty v-if="!loading && records.length === 0"></nut-empty>
    <nut-divider v-if="hasNextPageRef===false"> 到底了 </nut-divider>
  </view>
</template>

<script lang="ts">
import {ExamItem} from '../../../components/exam-item';
import {CourseItem} from '../../../components/course-item';
import Taro from "@tarojs/taro";
import {Choice} from '../../../components/subject/choice/index';
import {Judgement} from '../../../components/subject/judgement/index';
import {ShortAnswer} from '../../../components/subject/shortAnswer/index';
import {hideLoading, showLoading, successMessage} from '../../../utils/util';
import {IconFont} from '@nutui/icons-vue-taro';
import api from "../../../api/api";

export default {
  components: {
    IconFont,
    'exam-item': ExamItem,
    'course-item': CourseItem,
    'choice': Choice,
    'judgement': Judgement,
    'short-answer': ShortAnswer,
  },


  data(){
    return{
      // 考试记录
      records: [],
      // 是否有下一页，
      hasNextPageRef:true,
      // 页数请求
      pageNo:1,
      // 请求大小
      pageSize:10,
      // 加载
      loading:false,
      // 总页数
      pageNumRef:1,
      // 总数
      total:1,
    }
  },

  mounted() {
    this.init()
  },

  methods:{
    async init(){
      try {
        await showLoading();
        await this.fetchExamHistory(false);
      } finally {
        hideLoading();
      }
    },

    async fetchExamHistory(  append :boolean = true   ){

      if (this.hasNextPageRef===false) {
        return;
      }

      if (this.loading===true){
        return;
      }

      this.loading = true;

      if (append===true){
        this.records = [];
      }


      try {
        const params = {
          "pageNo": this.pageNo,
          "pageSize":  this.pageSize,
        };
        const resultData = await  api.querExamLog(params)


        if (resultData.code===200){
          await successMessage("获取成功")

          const resultRecords = resultData.result.records
          for (let i = 0; i <resultRecords.length; i++) {
            let record = resultRecords[i]

            let item = {
              id:record.id,
              createTime:record.createTime,
              updateTime:record.updateTime,
              status:this.parseStatues(record.status.toString()),
              totalScore:record.totalScore,
              professional:record.professional,
            }
            this.records.push(item)
          }

          this.total = resultData.result.total;
          this.pageNumRef = Math.floor(this.total/this.pageSize) + 1
          console.log("总页数：",this.pageNumRef)

        }else {

        }
      }
      finally {
        if (this.pageNo>=this.pageNumRef){
          this.hasNextPageRef=false
        }
        this.loading = false;
      }

    },


    parseStatues(pagperStatue:string){
      if (pagperStatue==="2"){
        return "已交卷"
      }else if (pagperStatue==="1"){
        return "考试中"
      }else if (pagperStatue==="0"){
        return "未开始"
      }
    },


    toAnswerPage(index){
      console.log("选择的试卷",index)
      let paper = this.records[index]
      let InspectSet = "y"
      Taro.navigateTo({ url: "/pages/exam_pages/answer/index?examid=" +paper.id+"&totalScore="+"&isInspect="+ InspectSet });
    }

  },

  // onPullDownRefresh() {
  //   try {
  //     this.init();
  //   } finally {
  //     Taro.stopPullDownRefresh();
  //   }
  // },

  onReachBottom() {
    try {
      this.pageNo=this.pageNo+1
      this.fetchExamHistory( false);
    } finally {
      Taro.stopPullDownRefresh();
    }
  },





}
</script>

<style>
.showInspectPapers{
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-top: 75px;
}

.showinspectItem{
  border-radius: 6px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: solid lightgray;
}

.showTitlePaper{
  font-size: larger;
  text-align: center;
  margin: 20px;
}

.showStatues{
  font-size: larger;
  text-align: center;
  margin: 2px;
}

.show-score{
  font-size: larger;
}
</style>
