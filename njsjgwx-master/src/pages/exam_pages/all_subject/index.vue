<template>
  <view class="showTop">
  <h5 class="showLeftTime">
    <IconFont font-class-name="iconfont" class-prefix="icon" name="naozhong" size="20px" color="#ff217c"></IconFont>
    <nut-countdown :end-time="time" format="HH 时 mm 分 ss 秒" />
  </h5>
  <view class="subject-exam-title bg-white">
    <view class="subject-exam-progress">
      <nut-progress :percentage="percentage" size="small" strokeWidth="8"/>
    </view>
  </view>
  </view>

<!--  这个是老版的题目展示，直接展示所有的问题-->
<!--  <view v-if="!loading">-->
<!--    <view class="subject-content bg-white" v-for="(item, index) in subjects" :key="index" :title="index+1" :pane-key="index">-->
<!--      <view class="subject-type-label">-->
<!--        <nut-tag size="small" type="success">{{ item.typeLabel }}</nut-tag>-->
<!--      </view>-->
<!--      <view class="subject-title">-->
<!--        <text class="subject-title-content">{{  index+1 }}.&nbsp; {{ item.subjectName}}</text>-->
<!--      </view>-->
<!--      <view>-->
<!--        <view v-if=" item.type === '1'">-->
<!--          <choice :ref="refs[index]" :subject="refItem(item)" @update-selected="handleChoiceSelectedChange"></choice>-->
<!--        </view>-->
<!--        <view v-else-if="item.type === '2'">-->
<!--          <choice :ref="refs[index]" :subject="refItem(item)" :multi="true" @update-selected="handleChoiceSelectedChange"></choice>-->
<!--        </view>-->
<!--        <view v-else-if="item.type === '3'">-->
<!--          <judgement :ref="refs[index]" :subject="refItem(item)" @update-selected="handleChoiceSelectedChange"></judgement>-->
<!--        </view>-->
<!--        <view v-else-if="item.type === '4'">-->
<!--          <short-answer :ref="refs[index]" :subject="refItem(item)" @update-selected="handleChoiceSelectedChange"></short-answer>-->
<!--        </view>-->
<!--      </view>-->
<!--    </view>-->
<!--  </view>-->

<!--  这是新版的题目展示，没有做滑动，不好调整因为每个手机的感应不一样-->
  <view v-if="!loading" class="showQuestion">
    <view class="subject-content bg-white" :key="currentQuestionIndex">
      <view class="subject-type-label">
        <nut-tag size="small" type="success">{{ subjects[currentQuestionIndex].typeLabel }}</nut-tag>
        <view> &nbsp;&nbsp; 选择：</view>
        <view class="showCheckedAnswer" v-if="subjects[currentQuestionIndex].answerValue !== ''">{{subjects[currentQuestionIndex].answerValue}} </view>
      </view>
      <view class="subject-title" :user-select="true">
        <text  class="subject-title-content">{{ currentQuestionIndex + 1 }}.&nbsp;</text>
        <wxparse class="subject-title-content" :html="subjects[currentQuestionIndex].subjectName"  />
      </view>
      <view>
        <view v-if="subjects[currentQuestionIndex].type === '1'">
          <choice :ref="refs[currentQuestionIndex]" :subject="subjects[currentQuestionIndex]" @update-selected="handleChoiceSelectedChange"></choice>
        </view>
        <view v-else-if="subjects[currentQuestionIndex].type === '2'">
          <choice :ref="refs[currentQuestionIndex]" :subject="subjects[currentQuestionIndex]" :multi="true" @update-selected="handleChoiceSelectedChange"></choice>
        </view>
        <view v-else-if="subjects[currentQuestionIndex].type === '3'">
          <short-answer :ref="refs[currentQuestionIndex]" :subject="subjects[currentQuestionIndex]" @update-selected="handleChoiceSelectedChange"></short-answer>
        </view>
        <view v-else-if="subjects[currentQuestionIndex].type === '4'">
          <judgement :ref="refs[currentQuestionIndex]" :subject="subjects[currentQuestionIndex]" @update-selected="handleChoiceSelectedChange"></judgement>
        </view>
      </view>
    </view>
  </view>

<!--控制部分-->
  <view class="controller-view">
    <view class="control-btn">
      <nut-row :gutter="10" class="control">
        <nut-col :span="6">
          <nut-button plain type="primary" @click="previousQuestion">上一题</nut-button>
        </nut-col>
        <nut-col :span="6">
          <nut-button type="info" @click="showAllQuestions = true">答题卡</nut-button>
        </nut-col>
        <nut-col :span="6">
          <nut-button type="success" :circle="true" @click="handleSave">保存</nut-button>
        </nut-col>
        <nut-col :span="6">
          <nut-button plain type="primary" @click="nextQuestion">下一题</nut-button>
        </nut-col>
      </nut-row>
    </view>
  </view>

  <nut-dialog :content="submitMessage" v-model:visible="isOpenedSubmitModal" @cancel="handleCloseSubmitModal" @ok="handleConfirmSubmitModal" />



  <nut-popup v-model:visible="showAllQuestions" position="bottom" closeable  :style="{ height: '70%' }">
    <view class="answer-card">
      答题卡：
    </view>
    <view class="chooseQuestion">
      <nut-grid :gutter="10" :column-num="6">
        <nut-grid-item  v-for="(item, index) in subjects" :key="index" @click="jumpToQuestion(index)">
          <view :class="{ 'checkedQuestion': item.checked === true, 'unCheckedQuestion': item.checked === false }">
            {{index+1}}
          </view>
        </nut-grid-item>
      </nut-grid>
    </view>

    <view class="all-subject-submit-btn">
    <nut-button type="primary" :circle="true" block :loading="submitting" @click="handleSubmit">交卷</nut-button>
    </view>
  </nut-popup>
</template>

<script lang="ts">

import { ref, unref } from 'vue';
import { IconFont } from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';
import { Choice } from '../../../components/subject/choice/index';
import { Judgement } from '../../../components/subject/judgement/index';
import { ShortAnswer } from '../../../components/subject/shortAnswer/index';
import { Parser } from "../../../components/parser/index";
import {showLoading, hideLoading, successMessage, warnMessage, optionAToI} from '../../../utils/util';
import api from "../../../api/api";

export default {
  components: {
    IconFont,
    'choice': Choice,
    'judgement': Judgement,
    'short-answer': ShortAnswer,
    Parser,
  },

  data() {
    return {
      currentQuestionIndex: 0,
      examid:"",
      subjects: [],
      radioArr: [],
      visibleSubmitDialog: false,
      percentage: 0,
      examination: {
        type:1,
      },
      isOpenedSubmitModal: false,
      refs: [],
      // 是否加载的参数
      loading: true,
      submitting: false,
      //
      examTime:"120",
      showAllQuestions:false,
      cycle:"",
      saveInterval: 0,
      saveIntervalId: null,
      answerTime:0,
      answeredTime:0,
      createTime:"",
      time:Date.now() + 120 * 60 * 1000,
      Countdown:null,
      totalScore:null,
      timestamp:0,
      // 提交显示
      submitMessage:"确定提交吗？",
    };
  },

  mounted() {
    // 进来考试需要做的
    this.init()
  },


  methods: {
    handleShortAnswerChange($event, item) {
      const { detail } = $event;
      unref(item).answer = detail;
      unref(item).checked = true;
      this.refreshProgress();
    },


    /**
     * 刷新进度条
     */
    refreshProgress() {
      let count = 0;
      this.subjects.forEach(subject => {
        if (subject.checked) {
          count++;
        }
      });
      this.percentage = Math.round(count / this.subjects.length * 100);
    },

    /**
     * 提交
     */
    async handleSubmit() {
      if (this.percentage!== Math.round(100)){
        await warnMessage("当前答题没有完成!",2000)
      }else {
        this.isOpenedSubmitModal = true;
        this.submitMessage="确定要提交试卷"
      }
    },

    onCancelSubmit() {
      this.isOpenedSubmitModal = false;
    },

    /**
     * 回调的函数
     */
    handleChoiceSelectedChange() {
      this.refreshProgress();
      // console.log("当前题目变化：",this.subjects[this.currentQuestionIndex])
    },

    handleCloseSubmitModal() {
      this.isOpenedSubmitModal = false;
    },


    /**
     * 交卷的方法
     */
    async handleConfirmSubmitModal() {
      try {
        this.submitting = true;
        this.handleCloseSubmitModal();
        await showLoading('提交中');
        // 处理答案
        let answersData = this.processingAnswers();
        const requestParams = {
          "answers": answersData,
          "type": 1,
        };
        const resultData = await api.saveAnswer(requestParams)
        console.log("交卷结果：",resultData)
        if (resultData.code===200){
          await successMessage(resultData.message,1000)
        //   如果保存成功就是跳转到其他页面
          this.unSaveExam()
          this.toAnswerPage();
        }else {
          await warnMessage(resultData.message,3000)
          if (resultData.message==="该试卷已提交不能重复提交"){
            this.toAnswerPage();
          }
        }
      } finally {
        this.submitting = false;
        hideLoading();
      }
    },

    /**
     * 临时保存
     */
    async handleSave(){
      try {
        await showLoading('保存试卷中');
        let answersData = this.processingAnswers();
        const requestParams = {
          "answers": answersData,
          "type": 0,
        };
        const resultData = await api.saveAnswer(requestParams)
        console.log("临时保存结果：",resultData)
        if (resultData.code===200){
          await successMessage("题目保存成功")
        }else {
          await warnMessage(resultData.message,3000)
          // 处理已经提交的卷子，还是跳转到已经提交的地方
          if (resultData.message==="该试卷已提交不能重复提交"){
            this.toAnswerPage();
          }
        }
      }finally {
        hideLoading();
      }
    },


    /**
     * 处理答案
     * return answerData的集合
     */
    processingAnswers(){
      let answerData = [];
      this.subjects.forEach(subject =>{
        let single = {
          "id":subject.questionID,
          "exaAnswer":this.removeSeparatorsAndSort(subject.answerValue),
        }
        answerData.push(single)
      })
      console.log("提交的答案：",answerData)
      return JSON.stringify(answerData)
    },


    refItem(item) {
      return ref(item);
    },


    previousQuestion(){
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--; // Move to the previous question
      }
    },

    nextQuestion(){
      if (this.currentQuestionIndex < this.subjects.length - 1) {
        this.currentQuestionIndex++; // Move to the next question
      }
    },

    jumpToQuestion(index){
      console.log("选择的题:",index)
      this.currentQuestionIndex=index
    },

    /**
     * 获取试卷
     */
    fetchQuestion: async function () {
      // 从上一页传递试卷ID
      const params = Taro.getCurrentInstance().router.params;
      console.log("传递的参数", params)

      this.examid = params.examid;
      this.examTime = params.examTime;
      // 刷新时间，
      this.cycle = params.cycle
      // 解析自动保存时间
      this.saveInterval = parseInt(this.cycle,10)
      // 保存时间解析失败就
      if (isNaN(this.saveInterval)) {
        this.saveInterval = 5
      }
      console.log("考试时间：",this.examTime)
      console.log("自动保存时间：",this.cycle)
      // 开启自动保存
      this.startSaveInterval();

      const requestParams = {
        "proid": this.examid.toString()
      }

      const resultData = await api.startExam(requestParams)

      console.log("所有的题库", resultData)
      if (resultData.code===200){

        this.totalScore = resultData.result.totalScore;

        /*考试记时 */
        this.answerTime = resultData.result.answerTime
        /*已答题时间 */
        this.answeredTime = resultData.result.answeredTime
        // 创建时间
        this.createTime = resultData.result.createTime

        this.timestamp = resultData.timestamp

        console.log("考试记时：",this.answerTime)
        console.log("已答题时间：",this.answeredTime)
        console.log("考试创建时间：",this.createTime)
        console.log("考试时间戳：",this.timestamp)
        // 处理倒计时 如果倒计时已经到了 直接交卷跳转了
        this.HandleCountdown();
        //   要解析为 1:[] 初始化问题
        this.subjects = [];
        // 这里不用解析List等会来解析
        const paperQuestion = resultData.result.paperQuestion
        // 这里需要判断paperQuestion 是不是为空

        if (paperQuestion!==null){
          Object.entries(paperQuestion).forEach(([k, v]) => {
            console.log(k, v);
            if (k === "1") {
              this.addQuestions(k, v,"单选题")
            } else if (k === "2") {
              this.addQuestions(k, v,"多选题")
            } else if (k === "3") {
              this.addQuestions(k, v,"解答题")
            } else if (k === "4") {
              this.addQuestions(k, v,"判断题")
            }
          });
        }else{
        //   试题为空直接返回首页，这里先处理为这个

        }
      }else {
        await warnMessage(resultData.message,3000)



      }
      // 这里就不用paperList
      // // 如果继续答题就是解析paperList
      // if (resultData.result.paperQuestionList!==null){
      //   const  paperQuestionList = resultData.result.paperQuestionList
      //   this.subjects = [];
      //   this.addQuestionWithList(paperQuestionList)
      // }else {
      //   // 这个就是解析开始的
      // }
    },

    async init(){
      try {
        await showLoading("加载试卷中");
        await this.fetchQuestion();
        this.loading = false;
      } finally {
        hideLoading();
      }

      try {
        await showLoading("加载进度条");
        // 刷新进度条
        this.refreshProgress();
      } finally {
        hideLoading();
      }

      try {
        //   解析完所有题后，保存一下，看是不是已经答题完了的
        // 这里就不慌先保存了
        // await this.handleSave();
      } finally {

      }

    },

    addQuestionWithList(qustionsList:[]){
      for (let i = 0; i < qustionsList.length; i++) {
        let question = qustionsList[i]
        let parseOptions = optionAToI(question)
        let typeLabel = ""
        if (question.type === "1") {
         typeLabel = "单选题"
        } else if (question.type === "2") {
         typeLabel = "多选题"
        } else if (question.type === "3") {
         typeLabel = "解答题"
        } else if (question.type === "4") {
         typeLabel = "判断题"
        }

        let answerValue = ""
        let checked = false
        if (question.exaAnswer!==""&&question.exaAnswer!==null){
          // 这里要将 ABC 转换为 A,B,C
          answerValue=question.exaAnswer
          checked =true
        }

        let singleQuestion = {
          typeLabel:typeLabel,
          type:question.type,
          subjectName:question.name,
          checked:checked,
          options:parseOptions,
          answerValue:answerValue,
          questionID:question.id,
        }
        // console.log("每道题的初始化",singleQuestion)
        this.subjects.push(singleQuestion)
      }
    },


    /**
     * 解析问题的设置
     * @param questionBank
     * @param type
     */
    addQuestions(type:string,questionBank:[],typeLabel:string){
      for (let i = 0; i < questionBank.length; i++) {
        let question = questionBank[i]
        let parseOptions = optionAToI(question)

        let answerValue = ""
        let checked = false
        // 为空或者为""都不处理
        if (question.exaAnswer!==""&&question.exaAnswer!==null){
          answerValue=this.serverAnswerConvert(question.exaAnswer)
          checked =true
        }

        let singleQuestion = {
          typeLabel:typeLabel,
          type:type,
          subjectName:question.name,
          checked:checked,
          options:parseOptions,
          answerValue:answerValue,
          questionID:question.id,

        }
        // console.log("每道题的初始化",singleQuestion)
        this.subjects.push(singleQuestion)
      }
    },




    /**
     * 移除答案中的分隔符并且排序
     * @param {string} answer - The input answer string with separators.
     * @returns {string} The answer string with separators removed.
     */
    removeSeparatorsAndSort(answer:string) {
      // 先移除然后再重组
      const characters = answer.split(',');
      // 排序
      characters.sort();
      // 转换为string
      return characters.join('');
    },

    /**
     * 转换多选题
     * @param originalAnswer 服务器保存的答案
     */
    serverAnswerConvert(originalAnswer:string) {
      // 如果为空就直接返回
      if (!originalAnswer) {
        return '';
      }
      if (originalAnswer.length===1){
        return originalAnswer
      }
      const characters = originalAnswer.split('');
      characters.sort();
      const formattedAnswer = characters.join(',');
      return formattedAnswer;
    },

    /**
     * 自动保存功能
     */
    startSaveInterval() {
      if (this.saveIntervalId) {
        clearInterval(this.saveIntervalId); // Clear existing interval if any
      }
      // Start a new interval based on the retrieved save interval duration
      this.saveIntervalId = setInterval(async () => {
        await this.handleSave(); // Call your save function
      }, this.saveInterval * 1000 * 60); // Convert seconds to milliseconds
    },

    /**
     * 处理倒计时这里用的是返回字段中的createtime进行处理
     */
    HandleCountdown(){
      let endTimeSet = new Date(this.createTime)
      this.time = this.addMinutes(endTimeSet,this.examTime)
    //   如果当前的时间戳 已经大于了考试结束事件，直接保存提交
      let nowTime = new Date(this.timestamp)
      if (this.time>=nowTime){
        console.log("未到考试结束时间继续考试")

      }else if (this.time < nowTime) {
        console.log("考试已经结束，即将保存，提交跳转")
        this.handleConfirmSubmitModal()
      }
    },

    addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes * 60000); // milliseconds calculation
    },


    toAnswerPage(){
      Taro.navigateTo({ url: "/pages/exam_pages/answer/index?examid=" +this.examid+"&totalScore=" +this.totalScore});
    },

    saveExam(){
      Taro.setStorageSync(this.examid,1)
    },

    unSaveExam(){
      Taro.setStorageSync(this.examid,2)
    }
  },


  created() {

  },

  onHide () {
    console.log("退出页面,onhide")
    clearInterval(this.saveIntervalId)
    this.saveExam()
  },

  // 退出页面的时候触发
  onUnload(){
    console.log("退出页面,onunload")
    clearInterval(this.saveIntervalId)
    this.saveExam()
  },

  onShow(){
    console.log("展示界面")
  // 如果总分有了，那么就直接跳转

    if (this.totalScore!==null){
      Taro.reLaunch({ url: "/pages/home/index" });
    }


  },


  // onPullDownRefresh() {
  //   try {
  //     // 先保存再刷新
  //     this.handleSave();
  //     this.init();
  //   } finally {
  //     Taro.stopPullDownRefresh();
  //   }
  // },


};

</script>

<style>
page {
  background-color: rgba(242, 244, 248, 1);
}

.subject-exam-title {
  font-size: 42px;
  line-height: 25px;
}

.all-subject-submit-btn {
  display: flex;
  text-align: center;
  justify-content: center;
  margin-top: 40px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 40px;
}

.control-btn{
  display: flex;
  text-align: center;
  justify-content: center;
  margin-top: 20px;
}

.subject-type-label {
  display: inline-flex;
  justify-content: space-between;
  padding-right: 10px;
  padding-top: 22px;
  align-items: flex-start;
  font-size: 20px;
}

.all-subject-bottom {
  height: 160px;
}


.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s;
}

.slide-enter, .slide-leave-to {
  transform: translateX(100%);
}


.control{
  text-align: center;
}

.showLeftTime{
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.chooseQuestion{
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
}

.checkedQuestion {
  width: 50px;
  height: 50px;
  background-color: #78A4FA;
  font-size: larger;
  color: white;
  text-align: center;
  border-radius: 10px;
  display: flex;
  justify-content: center; /* Horizontal centering */
  align-items: center; /* Vertical centering */
}

.unCheckedQuestion {
  width: inherit;
  height: inherit;
}


.controller-view{
  height: 150px;
  width: 100%;
  position: absolute;
  bottom: 0;
}

.swiperSet{
  height: 100%;
  width: inherit;
}


.showQuestion{
  width: 100%;
  height: 80vh; /* 80% of viewport height */
  overflow-y: auto; /* Enable vertical scrolling if content overflows */
  overflow-x: hidden;
}

.showTop{
  height: 75px; /* 头部高度设置 */
  background-color: white;
}

.showCheckedAnswer{
  width: fit-content;
  height: 50px;
  font-size: 35px;
  color: black;
  text-align: center;
  border-radius: 20px;
  display: flex;
  justify-content: center; /* Horizontal centering */
  align-items: center; /* Vertical centering */
}

.answer-card{
  height: 50px;
  margin-left: 20px;
  font-size: 40px;
}
</style>
