<template>
  <view class="course-section">
    <view class="at-article">
      <view>
        <view class="at-article__content">
          <view class="section-content">
            <nut-tabs v-model="currentTag" swipeable>
              <nut-tab-pane title="视频" pane-key="0">
                <view class="section-video" v-if="courseInfo.video !== ''">
                  <!--              完整的不能拖动，带有监控的播放时间的控件-->
                  <video class="section-video-content"
                         v-if="courseInfo.video !== undefined"
                         id="studyVideo"
                         :src="courseInfo.video"
                         :initial-time="initialTime"
                         :controls="true"
                         :autoplay="false"
                         :loop="true"
                         :muted="false"
                         :danmuBtn = "false"
                         :enableDanmu = "false"
                         :showProgress="false"
                         :showFullscreenBtn="true"
                         :enableProgressGesture="false"
                         :showCenterPlayBtn="true"
                         :enablePlayGesture="true"
                         :showBottomProgress="false"
                         :onPlay="beginPlay"
                         :onPause="videoPause"
                         :onEnded="onEnded"
                         :initialTime="initialTime"
                         :direction="direction"
                         :vslideGestureInFullscreen="true"
                         :enableAutoRotation="true"
                         @timeupdate='getUpdateTime'
                  ></video>

                  <nut-progress :percentage="showPercentage" stroke-color="skyblue" stroke-width="15"  text-inside>
                    <view class="showProgress">
                      {{ formattedTime }}
                    </view>
                  </nut-progress>

<!--                  <view class="videoControllerButton">-->
<!--                    <nut-row>-->
<!--                      <nut-col :span="12">-->
<!--                        <nut-button shape="square" type="default"  @click="handleReplay">重播</nut-button>-->
<!--                      </nut-col>-->
<!--                      <nut-col :span="12">-->
<!--                        <nut-button shape="square" type="success" @click="determineStorageTime">保存</nut-button>-->
<!--                      </nut-col>-->
<!--                    </nut-row>-->
<!--                  </view>-->

                  <view>
                    <view>
                      <view class="course-evaluates">
                        <view class="course-evaluate-operator">
                          <view>
                            <view>{{ studyNotes.createBy }}</view>
                          </view>
                          <view class="course-flex-item course-evaluate-time">{{ studyNotes.createTime }}</view>
                        </view>
                        <view class="course-evaluate-content" :user-select="true">
                          {{ studyNotes.content }}
                        </view>
                      </view>
                    </view>

                    <view>
                      <view>
                        <nut-textarea
                            v-model="studyNote"
                            :maxLength="300"
                            height="150px"
                            placeholder='请输入学习笔记'
                        />
                      </view>
                      <nut-button class="course-evaluate-input-btn" type='primary' block :loading="submitting" @click="handleSubmitEvaluate">提交
                      </nut-button>
                    </view>


                  </view>

                </view>

              </nut-tab-pane>
              <nut-tab-pane title="附件" pane-key="1">
                <view v-if="attachments.length!==0">
                  <nut-space wrap v-for="(item, index) in attachments">
                    <view class="showAttachment" @click="handleShow(item)">
                      <IconFont font-class-name="iconfont" class-prefix="icon" name="fujian" size="26px" color="#FF9800" ></IconFont>附件_{{item.name}}
                    </view>
                  </nut-space >
                </view>
              </nut-tab-pane>

            </nut-tabs>

          </view>
        </view>
      </view>
    </view>

    <nut-dialog v-model:visible="isReplay" content="确定要重播视频吗？"
                @cancel="handleReplayClose"
                @ok="handleConfirmReplay"></nut-dialog>

    <nut-dialog v-model:visible="isStudyNoteChange" content="确定要提交笔记？"
                @cancel="handleStudyNoteClose"
                @ok="handleConfirmStudyNote"></nut-dialog>


  </view>
</template>

<script lang="ts">
import Taro from '@tarojs/taro';
import {showLoading, hideLoading, warnMessage, successMessage} from '../../../utils/util';
import api from "../../../api/api";
import {IconFont} from "@nutui/icons-vue-taro";

export default {
  components: {IconFont},
  data(){
    return{
      courseId:"",
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
      sectionDetail:undefined,
      // 展示视频播放
      currentTime:0,
      studyTime:0,
      showPercentage:0,
      // 视频开始播放时间
      initialTime:0,
      duration:0,
      direction:90,
      formattedTime: '00:00',
      studyNote:"",
      submitting:false,
      studyNotes:{},
      attachments:[],
      idOpenDownLoad:false,
      temporaryIndex:0,
      temporarySaveTimeSet:0,
      isReplay:false,
      // 每次保存的时间设置
      everySaveTimeSet:180,
      timestamp:0,
      saveIntervalId:null,
      studyNoteID:"",
      currentTag:0,
      // 修改
      isStudyNoteChange:false,
    }
  },


  // onPullDownRefresh() {
  //   try {
  //     // 向上刷新
  //     this.init()
  //   } finally {
  //     Taro.stopPullDownRefresh();
  //   }
  // },


  mounted() {
    this.init()
  },

  methods:{

    handleReplayClose(){
      this.isReplay=false
    },

    /**
     * 确定重播
     */
    handleConfirmReplay(){
      this.isReplay=true
      // 拿到这个然后直接回到开始的地方
      let videoContext = Taro.createVideoContext('studyVideo')
      videoContext.pause()
      videoContext.seek(0)
    },

    handleReplay(){
      this.isReplay=true
    },


    async init(){
      try {
        await showLoading();
        await this.fetchCourse_detail();
      } finally {
        hideLoading();
      }
    },

    beginPlay() {
      console.log("视频开始播放")
    //   播放的时候更新一下 当前播放的时间
      if (this.temporarySaveTimeSet!==0){
        this.temporarySaveTimeSet = this.currentTime
      }
      console.log("播放的时候保存的时间",this.temporarySaveTimeSet)
      this.startSaveInterval()
    },

    videoPause() {
      console.log("视频暂停")
    },

    async onEnded() {
      console.log("视频结束")
    //   开始进行视频保存，当视频长度小于保存时间的时候
      await this.determineStorageTime()
      await successMessage("你已经完成当前学习视频")
    },

    backTop(){
      console.log("回到顶部")
    },

// 监控的播放时间
    async getUpdateTime(e) {
      let allDetail = e.detail
      this.currentTime = allDetail.currentTime
      this.duration = allDetail.duration
      // console.log("正在播放",allDetail)
      this.showPercentage = this.currentTime/this.duration*100
      // 进度条展示的时间
      this.formatTime()

    },

    async fetchStudyNote(){
      const requestParams = {
        "courseId": this.courseId,
      };
      const resultData = await api.queryCourseNote(requestParams)
      console.log("获取的学习笔记：",resultData)
      if (resultData.code===200){
        this.studyNotes = resultData.result
        this.studyNoteID = resultData.result.id
      }else {

      }
    },


    async determineStorageTime(){
      let videoLength = this.duration
      // 如果视频长度本身就比保存时间小，那么就在onEnded里面进行保存
      if (videoLength<this.everySaveTimeSet){
      //   这里传进去的就是视频长度
        if (videoLength!==0){
          await this.handleSaveLeardTime(videoLength,videoLength)
        }
      }else if ( videoLength>=this.everySaveTimeSet){
      //   当视频长度设置的长度的时候，就进行 时间戳对比

        // 下一次自动保存时间,时间戳下一次的 everySaveTimeSet 设定的时间.只有超过了这个时间才能保存.

        if (this.timestamp!==0){
          // 下一次请求时间
          let nextRequestTime = this.timestamp + this.everySaveTimeSet *1000
          let targetDate = new Date(nextRequestTime)
          let currentDate = new Date()

          console.log("下次请求时间：",targetDate,"当前时间：",currentDate)
          if (targetDate >= currentDate) {
            //   还没有进入保存事件，不可以进行请求
            console.log("时间还没有到")
          } else if (targetDate < currentDate) {
            //   已经超过请求时间，可以进行请求保存了

            // 开始对比播放时间，如果播放时间 和开始播放时间 相差小于一秒钟，不请求了。大于一秒钟就请求
            // let timeSet = this.currentTime - this.temporarySaveTimeSet

            // 如果改为
            let timeSet = this.currentTime

            console.log("对比时间：",timeSet)

            let finalSaveTime = parseInt(timeSet.toString(),10)
            await this.handleSaveLeardTime(finalSaveTime,this.currentTime)


          }
        }
      }
    },



    /**
     * 获取视频等信息
     */
    async fetchCourse_detail(){
      console.log("父页面传递的参数",Taro.getCurrentInstance().router.params);
      this.courseId = Taro.getCurrentInstance().router.params.courseId;
      const requestParams = {
        "scoreid": this.courseId,
      };

      // 获取学习笔记
      await this.fetchStudyNote()
      this.attachments = [];

      const resultData = await api.startLearning(requestParams)

      if (resultData.code===200){
        let result = resultData.result
        // 这里看能不能自动隐射了
        this.courseInfo = result
        // 解析附件
        this.parseAttachment()
        // 保存时间戳
        this.timestamp= resultData.timestamp
        // 处理完所有的后开始弄这个，看本地有无缓存
        this.initSaveTime()

      }else {
        // 失败处理
        await warnMessage(resultData.message,3000)
      }
    },


    /**
     * 生成播放列表
     */
    formatTime() {
      const hours = Math.floor(this.currentTime / 3600);
      const minutes = Math.floor((this.currentTime % 3600) / 60);
      const seconds = Math.floor(this.currentTime % 60);
      if (hours > 0) {
        this.formattedTime = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
      } else {
        this.formattedTime = `${this.pad(minutes)}:${this.pad(seconds)}`;
      }
    },

    // 只取钱两位
    pad(value) {
      return value.toString().padStart(2, '0');
    },

    /**
     * 提交学习笔记
     */
    async handleSubmitEvaluate(){

      this.isStudyNoteChange = true
    },


    handleStudyNoteClose(){
      this.isStudyNoteChange = false
    },

    async handleConfirmStudyNote(){
      if (this.submitting===false){
        try {
          this.submitting=true
          if (this.studyNote!==""){
            const requestParams = {
              "id":this.studyNoteID,
              "content": this.studyNote,
              "course": this.courseId,
            };
            const resultData = await api.saveNote(requestParams)
            console.log("保存结果：",resultData)
            if (resultData.code===200){
            //   提交完后，去拿ID，然后重新去刷新笔记，然后
              await this.fetchStudyNote()
              this.studyNote = ""
            }else {
              await warnMessage(resultData.message,3000)
            }
          }else {
            await warnMessage("输入内容为空",3000)
          }
        }finally {
          this.submitting =false
          this.isStudyNoteChange = false
        }
      }else {
        await warnMessage('请勿频繁提交');
      }
    },

    /**
     * 处理学习时间
     */
    async handleSaveLeardTime(saveTime:number,requestCurrentTime:number){
      const requestParams = {
        "scoreid": this.courseId,
        "time":saveTime,
      };
      const resultData = await api.saveLeardTime(requestParams)
      if (resultData.code===200){
        await successMessage("成功保存学习时间")

      //   开始更新 时间戳和临时的播放时间
        this.timestamp = resultData.timestamp

        this.temporarySaveTimeSet = requestCurrentTime
      }else {
        await warnMessage(resultData.message,3000)
      }
    },


    /**
     * 解析附件连接
     */
    parseAttachment(){
      let attachmentsPrase = JSON.parse(this.courseInfo.attachment)

      if (attachmentsPrase!==null){
        for (let i = 0; i < attachmentsPrase.length; i++) {
          let item ={
            name: attachmentsPrase[i].name,
            url:attachmentsPrase[i].url,
          }
          this.attachments.push(item)
        }
      }else {



      }

    },


    handleShow(item){
      this.temporaryIndex = item.url
      this.downloadAndOpenFile()
    },

    downloadAndOpenFile(){
      let fileUrl = this.temporaryIndex
      console.log("下载url：",fileUrl)
      Taro.downloadFile({//下载
        url: fileUrl,
        success: function (res) {
          let filePath = res.tempFilePath;
          console.log("文件路径：",filePath)
          let fileType = ''
          let getFileTypeFromUrl = fileUrl.split('.').pop()
          console.log("文件后缀：",getFileTypeFromUrl)
          switch (getFileTypeFromUrl) {
            case 'doc':
              fileType = 'doc'
              break;
            case 'xls':
              fileType = 'xls'
              break;
            case 'ppt':
              fileType = 'ppt'
              break;
            case 'pdf':
              fileType = 'pdf'
              break;
            case 'docx':
              fileType = 'docx'
              break;
            case 'xlsx':
              fileType = 'xlsx'
              break;
            case 'pptx':
              fileType = 'pptx'
              break;
            default:
              fileType = 'else'
              break;
          }

          if(fileType !== 'else'){
            Taro.openDocument({
              filePath: filePath,
              showMenu: true,
              success: function(res) {
                console.log("文档打开成功：",res);
                Taro.showToast({
                  title: '文档打开成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (res) {
                console.log("文档打开失败：",res)
                Taro.showToast({
                  title: '文档打开失败',
                  icon: 'none',
                  duration: 2000
                })
              },
            });
          }else{
            Taro.previewImage({
              current: '',
              urls:[res.tempFilePath]
            })
          }
        },
        fail: function (res) {
          console.log("打开失败",res)
        }
      })
    },


    /**
     * 本地保存学习时间，保存时间 退出播放，暂停播放，保存进度
     */
    async saveStudyTimeInLocal(){
      try {
        if (this.courseId!==""){
          Taro.setStorageSync(this.courseId,JSON.stringify({
            currentTime:this.currentTime,
            temporarySaveTimeSet:this.temporarySaveTimeSet
          }))
          // await successMessage("成功保存学习时间")
        }
      }finally {

      }
    },


    /**
     * 初始化播放时间
     */
    initSaveTime(){
      const saveTime = Taro.getStorageSync(this.courseId)
      console.log("本地保存的学习时间：",saveTime)

      if (saveTime){
        let parseData = JSON.parse(saveTime)
        this.initialTime = parseData.currentTime
        this.temporarySaveTimeSet =parseData.temporarySaveTimeSet
        //   如果这个作用失效，就是video已经渲染
        let videoContext = Taro.createVideoContext('studyVideo')
        videoContext.seek( this.initialTime)
      }else {
        console.log("未保存学习时间：")
        this.initialTime = 0;
      }
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
        await this.determineStorageTime(); // Call your save function
      }, this.everySaveTimeSet * 1000 ); // Convert seconds to milliseconds
    },

  },

  onUnload(){
    console.log("退出页面")
    // 清空计时器
    clearInterval(this.saveIntervalId)
    // 保存在本地，时间
    this.saveStudyTimeInLocal()
  },



}




</script>

<style>
.nut-tab-pane{
  padding-top: 40px;
  padding-left: 0;
  padding-right: 0;
}


.course-section {
  margin-left: 22px;
  margin-right: 22px;
}

.at-article {
  word-break: break-all;
  word-wrap: break-word;
  line-height: 1.5;
}

.at-article__h2 {
  margin-top: 0.64rem;
  font-size: 36px;
  line-height: 1.28rem;
}

.at-article__h3 {
  margin-top: 20px;
  font-size: 32px;
  line-height: 1.024rem;
}

.at-article__h1, .at-article__h2, .at-article__h3 {
  color: #333;
}

.at-article__info {
  margin-top: 20px;
  color: #CCC;
  font-size: 30px;
  line-height: 0.896rem;
}

.at-article__content {

}

.section-content {
  margin-top: 20px;
  font-size: 30px;
  color: #666;
  overflow: hidden;
}

.section-video {

}

.section-video-content {
  width: 100%;
}


.showProgress{
  width: 100px;
  height: 50px;
  display: flex;
  text-align: right;
  align-items: flex-end;
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

.course-flex-item {
  padding: 2px;
}

.course-evaluate-time {
  font-size: 22px;
  font-weight: 300;
  color: gray;
}

.course-evaluate-content {
  margin-bottom: 20px;
}

.showAttachment{
  display: inline-flex;
  text-align: center;
  align-items: center;
  padding: 16px;
  margin: 30px;
}

.videoControllerButton{
  margin: 15px 20px 20px;
  display: flex;
  text-align: center;
  align-items: center;
}
</style>
