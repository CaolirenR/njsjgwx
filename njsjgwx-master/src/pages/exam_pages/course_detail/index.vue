<template>
  <view v-if="records !== undefined" class="course-detail ml-22 mr-22">
    <image class="course-detail-image" :src="records.logo"></image>
    <view class="course-detail-info">
      <view class="course-detail-name">
        课程名：<text>{{ records.name }}</text>
      </view>
<!--      评分先取消了-->
<!--      <nut-rate class="course-detail-rate course-detail-item-info" v-model="courseInfo.level" size="small" spacing="3" readonly></nut-rate>-->
      <view class="course-detail-items course-detail-item-info" >
        <view>
          <view class="course-detail-item-info">
            <text class="course-teacher" >
              专业：{{  records.professional_dictText }}
            </text>
          </view>
          <view class="course-detail-item-info">
            <text class="course-teacher" >
              课程总时长：{{ Math.round( parseInt(records.duration,10) /60) }}分钟
            </text>
          </view>
          <view class="course-detail-item-info">
            <text class="course-teacher">
              已经学习：{{ Math.round( parseInt(records.learedTime,10) /60) }}分钟
            </text>
          </view>
        </view>
      </view>
      <view>
        <nut-button block  type="primary"  @click="handleStartLearn" >开始学习</nut-button>
      </view>
    </view>

    <view>
      <nut-tabs v-model="currentTag">

        <nut-tab-pane title="课程介绍">
          <view class="course-pane course-desc">
<!--        内容介绍    -->
            <wxparse :html="courseInfo.description"></wxparse>
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="课程大纲">
          <view class="course-pane">
            <wxparse :html="courseInfo.outline"></wxparse>
            <!--            <view v-for="chapter in chapters">-->
            <!--              <p class="course-chapter">{{ chapter.chapter.title }}</p>-->
            <!--              <view v-for="section in chapter.sections">-->
            <!--                <p class="course-section" @click="handleClickSection(section.section)">{{ section.section.title }}</p>-->
            <!--                <view v-for="point in section.points">-->
            <!--                  <p class="course-point" @click="handleClickPoint(point)">{{ point.title }}</p>-->
            <!--                </view>-->
            <!--              </view>-->
            <!--            </view>-->
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="课程指导">
          <view class="course-pane course-desc">
            <!--        内容介绍    -->
            <wxparse :html="courseInfo.guidance"></wxparse>
          </view>
        </nut-tab-pane>
        <nut-tab-pane title="学习笔记">
          <view class="course-pane course-desc">
            <!--        内容介绍    -->
            <wxparse :html="studyNote"></wxparse>
          </view>
        </nut-tab-pane>
      </nut-tabs>
    </view>
    <nut-dialog v-model:visible="isOpenedJoinModal" content="确定开始学习吗？"
                @cancel="handleCloseJoinModal"
                @ok="handleConfirmJoinModal"></nut-dialog>
  </view>
</template>
<script lang="ts">
import Taro from '@tarojs/taro';
import api from "../../../api/api";
import {showLoading, hideLoading, warnMessage} from '../../../utils/util';

export default {
  data(){
    return{
      // 这里要通过传递过来的ID 进行请求然后渲染整个页面
      courseId:null,
      records: {
        /*课件附件 */
        attachment: "",
        /*点击数 */
        clickNum: "",
        /*课程编码 */
        code: "",
        /*创建人 */
        createBy: "",
        /*创建日期 */
        createTime: "",
        /*课程描述 */
        description: "",
        /*时长 */
        duration: "",
        /*课程导学 */
        guidance: "",
        /*主键 */
        id: "",
        /* */
        lastLeardDate: "",
        /* 学习时间 */
        learedTime: "",
        /*封面图片 */
        logo: "",
        /*课程名称 */
        name: "",
        /*课程大纲 */
        outline: "",
        /*所属专业 */
        professional: "",
        /* */
        status: "",
        /*流地址 */
        streaming: "",
        /*所属部门 */
        sysOrgCode: "",
        /*师资介绍 */
        teachersIntro: "",
        /*租户 */
        tenantId: "",
        /*课程类型 */
        type: "",
        /*更新人 */
        updateBy: "",
        /*更新日期 */
        updateTime: "",
        /*多媒体附件 */
        video: "",
        type_dictText:"",
        professional_dictText:"",
      },


      courseDetail:"",
      //
      courseInfo:{
        /*课件附件 */
        attachment:"",
        /*点击数 */
        clickNum: 0,
        /*课程编码 */
        code: "",
        /*创建人 */
        createBy: "",
        /*创建日期 */
        createTime: "",
        /*课程描述 */
        description: "",
        /*时长 */
        duration: 0,
        /*课程导学 */
        guidance: "",
        /*主键 */
        id: "",
        /* 最后一次学习时间*/
        lastLeardDate: "",
        /* 学习时间 */
        learedTime: 0,
        /*封面图片 */
        logo: "",
        /*课程名称 */
        name: "",
        /*课程大纲 */
        outline: "",
        /*所属专业 */
        professional: "",
        /* 状态 */
        status: "",
        /*流地址 */
        streaming: "",
        /*所属部门 */
        sysOrgCode: "",
        /*师资介绍 */
        teachersIntro: "",
        /*租户 */
        tenantId: "",
        /*课程类型 */
        type: "",
        /*更新人 */
        updateBy: "",
        /*更新日期 */
        updateTime: "",
        /*多媒体附件 */
        video: "",
      },
      currentTag:0,
      studyNote:"",
      evaluateValue:"",
      evaluateRateValue:"",
      isSubmitted:false,
      submitting:false,
      isOpenedJoinModal:false,
      tagsList:[{title: '学习笔记'},{title: '课程介绍'}, {title: '课程大纲'},{title:'课程指导'}],
      learedTime:0,
      pageSize:10,
      pageNo:1,
    }
  },


  mounted() {
    this.init();
  },

  methods: {
    async init(){
      try {
        await showLoading();
        this.getParamsFromRouter();
        await this.fetchCourse_detail();
        await this.fetchStudyNote();
      } finally {
        hideLoading();
      }

    },


    async fetchStudyNote(){
      const requestParams = {
        "courseId": this.courseId,
      };
      const resultData = await api.queryCourseNote(requestParams)
      console.log("获取的学习笔记：",resultData)
      if (resultData.code===200){
        this.studyNote = resultData.result.content
      }else {

      }
    },


    getParamsFromRouter(){
      const params = Taro.getCurrentInstance().router.params
      console.log("父页面传递的参数",params);
      Object.assign(this.records, params);
      // 给courseID赋值
      this.courseId = this.records.id
    },


    async fetchCourse_detail(){
      const requestParams = {
        "scoreid": this.courseId,
      };

      const resultData = await api.startLearning(requestParams)


      if (resultData.code===200){
        let result = resultData.result
        // 这里看能不能自动隐射了
        this.courseInfo = result
      }else {
        // 失败处理
        await warnMessage(resultData.message,3000)
      }
    },


    /**
     * 这里的学习时间需要从后端获取，因为课程中的是不可能变得的只有从隐射集里面找
     */
    async fetch_learnTime(courseId:string,pageNo:number=1, pageSize:number=10){
      const params = {
        "pageNo": pageNo,
        "pageSize":  pageSize,
      };
      const resultData = await  api.getScoreByUser(params)
      const resultRecords = resultData.result.records


      for (let i = 0; i <resultRecords.length; i++) {
        let record = resultRecords[i]
        if (record.id===courseId){
          this.learedTime = record.learedTime;
        }
        break
      }



    },


    handleStartLearn() {
      this.isOpenedJoinModal = true;
    },

    handleCloseJoinModal() {
      this.isOpenedJoinModal = false;
    },

    async handleSubmitEvaluate() {
      this.isOpenedJoinModal = false;
    },

    async handleConfirmJoinModal() {
      Taro.navigateTo({url: "/pages/exam_pages/course_section/index?courseId=" +  this.courseId})
    }
  },

  onPullDownRefresh() {
    try {

    } finally {
      Taro.stopPullDownRefresh();
    }
  },


}

</script>

<style>
.course-detail {

}

.course-detail-image {
  width: 100%;
  height: 500px;
  border-radius: 6px;
}

.course-detail-info {
  padding: 8px;
  margin-bottom: 12px;
}

.course-detail-item-info {
  margin-top: 8px;
  display: flex;
  align-items: center;
  line-height: 1.5;
  font-size: 35px;
}

.course-teacher {
  font-size: 30px;
  color: gray;
}

.course-pane {
  margin-left: 8px;
  margin-top: 22px;
}

.course-section {
  margin-left: 20px;
  font-size: 28px;
}

.course-point {
  margin-left: 50px;
  font-size: 26px;
}

.course-chapter {
  font-size: 36px;
  margin-top: 26px;
}

.course-chapter:hover, .course-section:hover, .course-point:hover {
  color: #6190E8;
}

.course-section {
  font-size: 32px;
  margin-top: 6px;
}

.course-evaluate-time {
  font-size: 22px;
  font-weight: 300;
  color: gray;
}

.course-flex-item {
  padding: 2px;
}

.course-evaluate-input {
  display: flex;
  align-items: center;
}

.course-evaluate-input-rate, .course-evaluate-input-btn {
  margin-top: 10px;
  margin-bottom: 10px;
}

.course-evaluates {
  margin-top: 36px;
  border-bottom: 1px solid rgb(238 238 238);
}

.course-evaluate-operator {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 5px;
}

.course-chapter, .course-section, .course-point {

}

.join-button {
  margin-left: auto;
}

.course-charge-type {
  margin-left: 20px;
}

.course-detail-name {
  font-size: 50px;
  display: flex;
  align-items: center;
  line-height: 1.5;
}

.course-detail-rate {
  margin-top: 8px;
  margin-bottom: 8px;
}

.course-detail .nut-tab-pane {
  padding: 0;
}

.course-detail .nut-textarea {
  padding: 0;
}

.course-evaluate-content {
  margin-bottom: 20px;
}

.course-detail-items {
  display: flex;
  justify-content: space-between;
}

.course-desc {
  font-size: 36px;
  margin-top: 20px;
}

</style>
