<template>
  <view v-if="examInfo !== undefined" class="exam-detail">
    <view class="exam-detail-info">
      <text class="card-title">{{ examInfo.name }}</text>
      <view class="exam-detail-item-info-pane">
        <view>
          <view class="exam-detail-item-info">
            <text class="exam-desc-item">
              抽题方式：{{ examInfo.selectQuestionWay_dictText }}
            </text>
          </view>
          <view class="exam-detail-item-info">
            <text class="exam-desc-item">
              所属专业：{{ examInfo.professional_dictText }}
            </text>
          </view>
          <view class="exam-detail-item-info">
            <text class="exam-desc-item" v-if="examInfo.totalScore!==NaN">
              试卷总分：{{ examInfo.totalScore }} 分
            </text>
          </view>
          <view class="exam-detail-item-info">
            <text class="exam-desc-item" v-if="examInfo.tags.length!==0">
              试卷标签：
            </text>
            <nut-tag
                v-for="(tag, index) in examInfo.tags"
                :key="index"
                class="exam-type"
                type="success"
                size="small"
            >
              {{ tag }}
            </nut-tag>
          </view>
        </view>
      </view>
    </view>
    <view>
      <view class="exam-pane">

        <text class="exam-pane-desc">考试介绍：</text>


        <view class="exam-pane-content">
          <!-- 判断题个数         -->
          <view v-if="examInfo.intro.pdNum !== '0' && examInfo.intro.pdNum !=='null'   ">
            判断题：{{examInfo.intro.pdNum}} 道
          </view>
          <!-- 多选题个数         -->
          <view v-if="examInfo.intro.multipleNum !== '0'  && examInfo.intro.multipleNum !=='null' ">
            多选题：{{examInfo.intro.multipleNum}} 道
          </view>
          <!--  单选题个数        -->
          <view v-if="examInfo.intro.radioNum !== '0'  && examInfo.intro.radioNum !=='null' ">
            单选题：{{examInfo.intro.radioNum}} 道
          </view>
          <!--  解答题个数       -->
          <view v-if="examInfo.intro.answersNum !== '0'  && examInfo.intro.answersNum !=='null' ">
            解答题：{{examInfo.intro.answersNum}} 道
          </view>
        </view>
        <view class="exam-pane-desc">
          <text>注意事项：</text>
        </view>
        <view class="exam-pane-content">
          <view class="showImportant">
            考试时间 {{examInfo.examTime }} 分钟
          </view>
          <view class="showNotice">
            <text>考试开始：{{examInfo.startTime}}</text>
          </view>
          <view class="showNotice">
            <text>考试截止：{{examInfo.endTime}}</text>
          </view>
          <view class="showNotice" v-for="(attention, index) in examInfo.attentions" :key="index">
            {{ attention }}
          </view>
        </view>
      </view>
    </view>
  </view>


  <view class="controller-startExam">
    <view class="exam-start-button" v-if="examAgain === true && examInfo.paperStatus==='2'">
      <nut-button plain type="warning" size="large" @click="handleReexam">重新考试</nut-button>
    </view>
    <view class="exam-start-button" v-if="examInfo.paperStatus==='0'|| examInfo.paperStatus==='-1' ">
      <nut-button type="primary" size="large" @click="handleClickStart">开始考试</nut-button>
    </view>
    <view class="exam-start-button" v-if="examInfo.paperStatus==='1'  ">
      <nut-button type="primary" size="large" @click="continueExamPage">继续考试</nut-button>
    </view>
    <view class="exam-start-button" v-if="examInfo.paperStatus==='2'">
      <nut-button type="primary" size="large" @click="viewExam">查看试卷</nut-button>
    </view>
  </view>


  <nut-dialog content="确定要开始答题吗？" v-model:visible="isOpenedStartModal" @cancel="handleCancelStartModal" @ok="handleConfirmStartModal" />
  <nut-dialog content="确定要重新考试吗？重考会刷新你的得分" v-model:visible="isOpenedReExamModal" @cancel="handleCancelReExamModal" @ok="handleConfirmReExamModal" />


</template>

<script lang="ts">
import Taro from "@tarojs/taro";
import {hideLoading, showLoading, successMessage, warnMessage} from '../../../utils/util';
import api from "../../../api/api";

export default {

  data() {
    return {
      examItem: {
        /*解答题个数 */
        answersNum: "",
        /*解答题分值 */
        answersScore: "",
        /*创建人 */
        createBy: "",
        /*创建日期 */
        createTime: "",
        /*自动保存周期（分） */
        cycle: "",
        /*结束时间 */
        endTime: "",
        /*是否允许重考 */
        examAgain: "",
        /*是否开启 */
        examStat: "",
        /*考试时长(分) */
        examTime: "",
        /*主键 */
        id: "",
        /*组卷考题固定 */
        isFxed: "",
        /*显示图片 */
        logo: "",
        /*多选题题库信息 */
        multiple: "",
        /*多选题个数 */
        multipleNum: "",
        /*多选题分值 */
        multipleScore: "",
        /*考试项目名称 */
        name: "",
        /*多选给分规则 */
        optionScoreRule: "",
        /*试卷状态 */
        paperStatus: "",
        /*试卷id */
        paperid: "",
        /*判断题个数 */
        pdNum: "",
        /*判断题分值 */
        pdScore: "",
        /*是否练习 */
        practice: "",
        /*专业 */
        professional: "",
        /*信息发布时间 */
        publishTime: "",
        /*单选题题库信息 */
        radio: "",
        /*单选题个数 */
        radioNum: "",
        /*单选题分值 */
        radioSource: "",
        /*考试说明 */
        remark: "",
        /*抽题方式 */
        selectQuestionWay: "",
        /*验卷显示答案 */
        showAnswers: "",
        /*开始时间 */
        startTime: "",
        /*所属部门 */
        sysOrgCode: "",
        /*租户 */
        tenantId: "",
        /*更新人 */
        updateBy: "",
        /*更新日期 */
        updateTime: "",
        selectQuestionWay_dictText:"",
        professional_dictText:"",
        optionScoreRule_dictText:"",
      },



      examId:"",
      examInfo: {
        id:"",
        name: "",
        tags: [],
        selectQuestionWay_dictText: "",
        professional_dictText:"",
        totalScore: 0,
        intro: {
          radioNum:'0',
          multipleNum:'0',
          pdNum:'0',
          answersNum:'0',
        },
        examTime:"",
        startTime:"",
        endTime:"",
        attentions: [],
        // 自动保存时间
        cycle:"",
        paperStatus:"",
        paperid:"",
      },
      isOpenedStartModal: false,
      isOpenedReExamModal:false,
      total: "1",
      examAgain:false,
      pageNo: 1,
      pageSize : 10,
    };
  },

  mounted() {
    this.init()
  },

  methods: {
    /*
    只能重新请求参数，用json 传字符串 好像要报错
     */
    async fetchExamMessage(){
      //   这里不是后端请求，用到的数据解析
      const params = Taro.getCurrentInstance().router.params;
      Object.assign(this.examItem, params);

      console.log("父页面传递的参数：",params)
      let allDetailExamInfo = this.examItem
      // 获取名字
      this.examInfo.name = allDetailExamInfo.name

      // 重考的参数设置
      if (allDetailExamInfo.examAgain==="Y"){
        this.examInfo.tags.push("允许重考")
        this.examInfo.attentions.push("考生可以多次参加考试，取得更好的成绩。")
        this.examAgain = true;
      }else {
        this.examInfo.attentions.push("考试只有一次机会，请考生认真作答。")
      }

      /**
       * 练习模式，并没有做
       */
      if (allDetailExamInfo.practice==="Y"){
        this.examInfo.tags.push("练习")
        this.examInfo.attentions.push("可以选择为练习模式，不记录成绩。")
      }else {
        this.examInfo.attentions.push("")
      }

      /**
       * 自动保存时间
       */
      this.examInfo.cycle = allDetailExamInfo.cycle
      if (this.examInfo.cycle!==""&&this.examInfo.cycle!==null){
        this.examInfo.attentions.push("考试自动保存时间为 "+this.examInfo.cycle+" 分钟。")
      }

      /**
       * 多选
       */
      this.examInfo.selectQuestionWay_dictText = allDetailExamInfo.selectQuestionWay_dictText
      /**
       * 专业
       */
      this.examInfo.professional_dictText = allDetailExamInfo.professional_dictText


      this.examInfo.intro.pdNum = allDetailExamInfo.pdNum
      this.examInfo.intro.multipleNum = allDetailExamInfo.multipleNum

      if (this.examInfo.intro.multipleNum!==0){
        this.examInfo.attentions.push("多选题只有全对才有分数")
      }

      this.examInfo.intro.radioNum = allDetailExamInfo.radioNum
      this.examInfo.intro.answersNum = allDetailExamInfo.answersNum

      let totalScore =allDetailExamInfo.radioSource *allDetailExamInfo.radioNum + allDetailExamInfo.multipleScore *allDetailExamInfo.multipleNum + allDetailExamInfo.pdScore * allDetailExamInfo.pdNum+ allDetailExamInfo.answersScore *allDetailExamInfo.answersNum

      this.examInfo.totalScore =totalScore

      this.examInfo.examTime= allDetailExamInfo.examTime
      this.examInfo.startTime= allDetailExamInfo.startTime
      this.examInfo.endTime= allDetailExamInfo.endTime
      this.examInfo.id=allDetailExamInfo.id

      // 这是存入ID
      let paperStatusSet =  allDetailExamInfo.paperStatus
      this.examInfo.paperid = allDetailExamInfo.paperid
      this.examInfo.paperStatus = paperStatusSet

      // 判断能否进入

      if (paperStatusSet==="2"){
        console.log("当前考试已经完成，只能重考或者查看卷子")

        Taro.removeStorageSync(this.examInfo.id)
      }else if (paperStatusSet==="1") {
      //   判断是否能进入卷子，是否超时
        await this.continueExam()

      }else if (paperStatusSet==='0'){

      }

    },


    async continueExam(){
    //   能否进入考试，判断的时间 ，判断已经考完没有
      if (this.examInfo.paperid!==""){
        let requestParams = {
          "paperid":this.examInfo.paperid,
        }
        const resultData = await api.examHeartbeat(requestParams)
        if (resultData.code===200){
          let examTimeData = resultData.result
          let answeredTime = Math.round(examTimeData.answeredTime /60)
          if (answeredTime >= parseInt(this.examInfo.examTime,10) ){
            console.log("当前考试已经完成，但未交卷，只能重考或者查看卷子")
            // 考试状态设置
            this.examInfo.paperStatus = "2"
            //   这里就要交卷了
            await this.getExamAndHandlePaper()
          }else {

          }

        }
      }
    },

    async continueExamPage(){
      // 这里也需要判断是否能进入考试
      // await this.continueExam()

      Taro.navigateTo({ url: "/pages/exam_pages/all_subject/index?examid=" + this.examInfo.id+"&examTime=" + this.examInfo.examTime+"&cycle=" +this.examInfo.cycle});
    },


    async viewExam(){
      console.log("现在的考试状态：",this.examItem.paperStatus)
      if (this.examItem.paperStatus==="1"){

      }else {

      }
      let InspectSet = "y"
      Taro.navigateTo({ url: "/pages/exam_pages/answer/index?examid=" + this.examInfo.paperid +"&isInspect="+ InspectSet });

    },


    /**
     * 确定是否能考试
     */
    async confirmExam(){

    //   这个判断result 判断isOpenedStartModal 是否能打开
    },

    async init(){

      try {
        await showLoading();
        // 先解析信息
        await this.fetchExamMessage()



      } finally {
        hideLoading();
      }

    },

    async handleConfirmStartModal() {
      try {
        await showLoading();

        let params = {
          "examid":this.examInfo.id
        }

        const resultData = await api.judgeEnterExam(params)
        console.log("能否进入考试结果：",resultData)

        if (resultData.code===200){
          Taro.navigateTo({ url: "/pages/exam_pages/all_subject/index?examid=" + this.examInfo.id+"&examTime=" + this.examInfo.examTime+"&cycle=" +this.examInfo.cycle});
        }else {
          await warnMessage(resultData.message,2000)
        }
      } finally {
        this.handleCloseStartModal();
        await Taro.hideLoading();
      }
    },

    async handleConfirmReExamModal(){
      try {
        await showLoading();
        const params = {
          "proid": this.examInfo.id,
        };
        const resultData = await  api.reexam(params)
        console.log("重考的结果：",resultData)
        if (resultData.code===200){
          await successMessage("重新考试成功",1000)
          Taro.navigateTo({ url: "/pages/exam_pages/all_subject/index?examid=" + this.examInfo.id+"&examTime=" + this.examInfo.examTime+"&cycle=" +this.examInfo.cycle });
        }else {
          await warnMessage(resultData.message,3000)
        }
      } finally {
        this.handleCloseReExamModal();
        await Taro.hideLoading();
      }
    },


    async getExamAndHandlePaper(){
      const requestParams = {
        "proid": this.examInfo.id
      }
      const resultData = await api.startExam(requestParams)
      if (resultData.code===200){
        let handleAnswer = []
        const paperQuestion = resultData.result.paperQuestion
        if (paperQuestion!==null) {
          Object.entries(paperQuestion).forEach(([k, v]) => {
            console.log(k, v);
            if (v!==null){
              for (let i = 0; i < v.length; i++) {
                let question = v[i]
                let single = {
                  "id":question.id,
                  "exaAnswer":question.exaAnswer,
                }
                handleAnswer.push(single)
              }
            }
          });
        }
        const requestParams = {
          "answers": JSON.stringify(handleAnswer),
          "type": 1,
        };
        await api.saveAnswer(requestParams)
      }
    },



    handleClickStart() {
      this.isOpenedStartModal = true;
    },

    handleCloseStartModal() {
      this.isOpenedStartModal = false;
    },

    handleCancelStartModal() {
      this.isOpenedStartModal = false;
    },


    handleReexam(){
      this.isOpenedReExamModal = true;
    },

    handleCancelReExamModal(){
      this.isOpenedReExamModal = false;
    },

    handleCloseReExamModal() {
      this.isOpenedReExamModal = false;
    },

    /**
     * 保存当前考试的信息。为了其他地方能够访问
     */
    saveTheExamInformation(){

    }

  },

  onPullDownRefresh() {
    try {

    //   下拉的逻辑

    } finally {
      Taro.stopPullDownRefresh();
    }
  },

  onShow(){
    console.log("展示界面")
    //本地保存了,那么就是继续考试
    const exam = Taro.getStorageSync(this.examInfo.id)
    console.log(exam)
    if (exam!==null&&exam!==""){
      // 如果是1那么这里就是继续考试
      if (exam===1){
        this.examInfo.paperStatus = "1"
      }
    }
  },

};

</script>

<style>
.exam-detail {
  margin-left: 22px;
  margin-right: 22px;
  padding: 30px;
  border: solid 3px #909ca4
}

.exam-detail-image {
  width: 100%;
  height: 260px;
  border-radius: 6px;
}

.exam-detail-info {
  font-size: 32px;
  margin-top: 20px;
}

.exam-detail-item-info-pane {
  display: flex;
  justify-content: space-between;
}

.exam-detail-item-info {
  margin-top: 10px;
}

.exam-type {
  margin-left: 18px;
}

.exam-desc-item {
  font-size: 30px;
  color: gray;
  line-height: 1.5;
}

.exam-start-button {
  margin-top: 25px;
  margin-left: 30px;
  margin-right: 30px;
}

.exam-pane {
  margin-top: 50px;
  color: #2C405A;
}

.exam-pane-desc {
  font-size: 40px;
  font-weight: bold;
  margin-top: 50px;
  margin-bottom: 22px;
}

.exam-pane-content {
  margin-top: 16px;
  font-size: 30px;
  width: 100%;
  overflow-y: auto; /* Enable vertical scrolling if content overflows */
  overflow-x: hidden;
}

.showImportant {
  font-size: 30px;
  font-weight: bold;
  color: red;
  line-height: 1.7;
}

.controller-startExam{
  height: 270px;
  width: 100%;
  bottom: 0;
}

.showNotice{
  line-height: 1.7;
}
</style>
