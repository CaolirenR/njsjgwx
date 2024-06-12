<template>
<!--  查看答案的内容页，这个-->
  <view class="answer-box" v-if="!loading">
    <view class="overview-container">
      <view>
        <view class="overview-container-btn">
          <nut-button shape="round" type="success" size="large" v-if="isSuccess===true">
            <template #icon>
              <IconFont name="Check" size="40px"></IconFont>
            </template>
          </nut-button>
          <IconFont font-class-name="iconfont" class-prefix="icon" name="cuowu" size="40px" color="#FF0000" v-if="isSuccess===false"></IconFont>
        </view>

      </view>

      <view class="overview-item">
        <text>你的得分：</text>
        <text class="overview-item-detail">{{ totalScore }}</text>
      </view>
    </view>
    <view class="answer-box-item">

<!--&lt;!&ndash;      这个看能不能看到 &ndash;&gt;-->
<!--      <view class="check-certification">-->
<!--        <view class="answer-subject-content">-->
<!--          <view class="answer-try-again-btn">-->
<!--            <nut-button type="primary" @click="handleCheckCertification">查看证书</nut-button>-->
<!--          </view>-->
<!--        </view>-->
<!--      </view>-->

      <view class="answer-subject-content">
        <view class="answer-try-again-btn">
          <nut-button type="primary" @click="handleTryAgain">
            <view class="jumpFront">
              <IconFont font-class-name="iconfont" class-prefix="icon" name="shouye_home" size="25px" color="#FFFFFF"></IconFont>
            </view>
            首页
          </nut-button>
        </view>

        <view v-if="isInspect==='y'">
        <nut-divider>答题列表</nut-divider>
        <view v-for="(item, index) in answers"  class="showAnswerItem">
          <view class="subject-title">
            <text class="subject-title-content">{{ index + 1 }}. &nbsp;</text>
            <wxparse class="subject-title-content" :html="item.subjectName"  />
          </view>
          <view>
            <view>
              <view v-if="item.type === '1'">
                <choice :subject="item" :answer="item.answer" :standAnswer="item.standAnswer" :disabled="true" :multi="false"></choice>
              </view>
              <view v-if="item.type === '2'">
                <choice :subject="item" :answer="item.answer" :standAnswer="item.standAnswer" :disabled="true" :multi="true"></choice>
              </view>
              <view v-else-if="item.type === '3'">
                <judgement :subject="item" :answer="item.answer" :standAnswer="item.standAnswer" :disabled="true"></judgement>
              </view>
              <view v-else-if="item.type === '4'">
                <short-answer :subject="item" :answer="item.answer" :standAnswer="item.standAnswer" :disabled="true"></short-answer>
              </view>
            </view>
          </view>

          <view class="answer-text" >
            <text class="answer-text-title">答案：</text>
            <text class="answer-text-value">
              {{ item.standAnswer }}
            </text>
          </view>

        </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script lang="ts">
import {IconFont} from '@nutui/icons-vue-taro';
import Taro from '@tarojs/taro';
import {Choice} from '../../../components/subject/choice/index';
import {Judgement} from '../../../components/subject/judgement/index';
import {ShortAnswer} from '../../../components/subject/shortAnswer/index';
import api from "../../../api/api";
import {hideLoading, optionAToI, showLoading} from "../../../utils/util";

export default {
  components: {
    IconFont,
    'choice': Choice,
    'judgement': Judgement,
    'short-answer': ShortAnswer
  },
  data(){


    return{
      examid:"",
      totalScore:0,
      rate:"",
      loading: false,
      isComplete:false,
      answers:[],
      // 十分
      isInspect:"n",
      isShowPaper:false,
      isSuccess:true,
    }
  },



  mounted() {
    this.init()
  },


  methods: {
    async handleTryAgain() {
      Taro.reLaunch({ url: "/pages/home/index" });
    },

    /**
     * 查看证书页
     */
    handleCheckCertification(){

    },

    getOptionColor(answer, subject) {
      if (answer === subject.answer.answer) {
        return '#07c160';
      }
      return '#ff7618';
    },

    async init(){
      const params = Taro.getCurrentInstance().router.params;
      console.log("传递的参数", params)
      this.examid = params.examid;
      // 如果交了卷子，或者查看卷子。那么就是2
      Taro.removeStorageSync(this.examid)

      this.totalScore = params.totalScore;
      this.isInspect =params.isInspect
      if (this.isInspect==="y"){

        try {
          await showLoading("正在查看试卷");
          await this.fetchInspect();
          this.loading = false;
        } finally {
          hideLoading();
        }


      }else {
        // 还是需要请求
        const requestParams = {
          "proid": this.examid.toString()
        }
        const resultData = await api.startExam(requestParams)
        //   获取分数和答题列表，就要重新解析了
        if (resultData.code===200){
          this.totalScore = resultData.result.totalScore;
          //   这里写查看答案
        }else{

        }
      }
    },


    addAnswers(type:string,questionBank:[],typeLabel:string){
      for (let i = 0; i < questionBank.length; i++) {
        let question = questionBank[i]
        let parseOptions = optionAToI(question)
        let checked = false
        let answerValue = ""
        let referAnswer = ""

        if (question.exaAnswer!==""&&question.exaAnswer!==null){
          answerValue=this.serverAnswerConvert(question.exaAnswer)
          referAnswer=this.serverAnswerConvert(question.referAnswer)
          checked =true
        }

        let singleAnswer = {
          type:type,
          subjectName: question.name,
          checked:checked,
          options:parseOptions,
          answer:answerValue,
          standAnswer:referAnswer,
          questionID:question.id,
        }
        this.answers.push(singleAnswer)
      }
      console.log(this.answers)
    },

    async fetchInspect(){
      const requestParams = {
        "paperid": this.examid.toString()
      }
      const resultData = await api.inspectPapers(requestParams)
      console.log("验证卷子的参数",resultData)

      if (resultData.code===200){
        this.answers = []
        this.isShowPaper=   true
        this.totalScore = resultData.result.totalScore
        const paperQuestion = resultData.result.paperQuestion
        if (paperQuestion!==null){
          Object.entries(paperQuestion).forEach(([k, v]) => {
            console.log(k, v);
            let type = k.toString()
            if (type === "1") {
              this.addAnswers(type, v,"单选题")
            } else if (type === "2") {
              this.addAnswers(type, v,"多选题")
            } else if (type === "3") {
              this.addAnswers(type, v,"解答题")
            } else if (type === "4") {
              this.addAnswers(type, v,"判断题")
            }
          });
        }
      }else {
        this.isSuccess=false
        this.isShowPaper = true
      }





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
  }

}


</script>

<style>
page {
  background-color: rgba(242, 244, 248, 1);
}

.overview-container-btn {
  width: 100px;
  margin: 30px auto 10px;
}

.showAnswerItem{
  margin: 20px;
  border-bottom: solid 4px #909ca4
}

.jumpFront{
  text-align: center;
  display: inline-flex;
  align-items: center;
}

</style>
