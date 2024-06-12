<template>
    <view class="bg">
        <!--  首页滚动图部分 也可以做成轮播图-->
<!--        <view class="titleSetView">-->
<!--            <text class="titleSetTextStyle">-->
<!--                {{titleSetText}}-->
<!--            </text>-->
<!--        </view>-->

      <view class="banner-swiper-view">
        <nut-swiper :init-page="banners.length" :pagination-visible="true" pagination-color="#426543" auto-play="3000"
                    height="200">
          <nut-swiper-item v-for="(item, idx) in banners" :key="idx">
            <view @click="handleClickBanner(item)">
              <img :src="item" class="banner-swiper-image" :mode="bannerMode"/>
            </view>
          </nut-swiper-item>
        </nut-swiper>
      </view>


        <!--  首页点击部分-->
        <view class="home-view">
            <nut-grid :column-num="4" :clickable="true" :gutter="0" :border="false">
              <nut-grid-item text="专业分类" @click="handleClassification">
                <view class="showIcon">
                  <image :src="iconCategory" class="showIconImage" />
                </view>
              </nut-grid-item>
                <nut-grid-item text="课程分类" @click="handleClickCourse">
                    <view class="showIcon">
                        <image :src="iconCourse" class="showIconImage" />
                    </view>
                </nut-grid-item>
                <nut-grid-item text="最新消息" @click="handleMessages">
                    <view class="showIcon">
                        <image :src="iconNews" class="showIconImage" />
                    </view>
                </nut-grid-item>
                <nut-grid-item text="考试报名" @click="handleGridClickExam0">
                    <view class="showIcon">
                        <image :src="iconCertificate" class="showIconImage" />
                    </view>
                </nut-grid-item>
            </nut-grid>
        </view>

        <!--  横幅展示-->
        <view class="bannerDisplay">
            <image :src="bannerDisplay" class="bannerDisplayImage" :mode="modeOfBanner" />
        </view>

        <view class="home-view-tips">市州学习平台</view>
        <view class="learning-platform">
          <view v-for="platform in platformList"></view>
            <view class="platform">内江市学习平台</view>
            <view class="platform">眉山市学习平台</view>
            <view class="platform">内江市学习平台</view>
            <view class="platform">眉山市学习平台</view>
        </view>

        <!-- 快捷通道 -->
        <view class="home-view-tips">快捷通道</view>
        <view class="quick-access">
            <view class="accessbox">
                <view class="leftShowCheck" @click="toCertificate">
                    <text class="leftCheckText">
                        {{leftCheckTextShow}}
                    </text>
                    <image :src="leftCheck" class="leftCheckImage" :mode="modeOfCheck" />
                </view>
            </view>
            <view class="accessbox">
                <view class="rightShowCheck">
                    <view class="itemRight" @click="toSubjects">
                        <text class="rightCheckText">
                            {{ rightCheckTextOne }}
                        </text>
                        <image :src="rightCheckOne" class="rightCheckImage" :mode="modeOfCheck" />
                    </view>
                    <view class="itemRight" @click="handleGridClickExam1">
                        <text class="rightCheckText">
                            {{ rightCheckTextTwo }}
                        </text>
                        <image :src="rightCheckTwo" class="rightCheckImage" :mode="modeOfCheck" />
                    </view>
                </view>
            </view>
        </view>
<!-- handleGridClickExam1 handleSpeciality-->
        <View text="专业分类" @click="handleSpeciality">
                <view class="showIcon">
                  <image :src="iconCategory" class="showIconImage" />
                </view>
        </View>
        <!-- <view class="speciality" @click="handleSpeciality">
          <image :src="rightCheckTwo" class="rightCheckImage" :mode="modeOfCheck" />
        </view> -->

        <!-- 信息发布  -->
        <view class="messlist">
            <view class="showMessagePublish">
                <text class="showMessagePublishImage">
                    {{messagePublishText}}
                </text>
            </view>
            <view class="Newsbox">
              <view v-for="news in newsList" class="News">
                <text>{{news}}</text>
              </view>

<!--                <view >-->
<!--                    <text>习近平出席习近平出席习近平出席习近平出席</text>-->
<!--                </view>-->
<!--                <view class="News">-->
<!--                    <text>习近平出席习近平出席习近平出席习近平出席</text>-->
<!--                </view>-->
<!--                <view class="News">-->
<!--                    <text>习近平出席习近平出席习近平出席习近平出席</text>-->
<!--                </view>-->
            </view>
        </view>
    </view>

    <!-- 国定底部标签栏 -->
<!--    <nut-tabbar v-model="Tabbaractive" bottom safe-area-inset-bottom placeholder @tab-switch="tabSwitch">-->
<!--        <nut-tabbar-item tab-title="首页">-->
<!--            <template #icon="props">-->
<!--                <image :src="props.active ? homeIcon.active : homeIcon.unactive" style="width: 25px;height: 25px;" mode="widthFix"/>-->
<!--            </template>-->
<!--        </nut-tabbar-item>-->
<!--        <nut-tabbar-item tab-title="课程">-->
<!--            <template #icon="props">-->
<!--                <image :src="props.active ? courseIcon.active : courseIcon.unactive" style="width: 25px;height: 25px;" mode="widthFix"/>-->
<!--            </template>-->
<!--        </nut-tabbar-item>-->
<!--        <nut-tabbar-item tab-title="成绩">-->
<!--            <template #icon="props">-->
<!--                <image :src="props.active ? subjectsIcon.active : subjectsIcon.unactive" style="width: 25px;height: 25px;" mode="widthFix"/>-->
<!--            </template>-->
<!--        </nut-tabbar-item>-->
<!--        <nut-tabbar-item tab-title="我的">-->
<!--            <template #icon="props">-->
<!--                <image :src="props.active ? myIcon.active : myIcon.unactive" style="width: 25px;height: 25px;" mode="widthFix"/>-->
<!--            </template>-->
<!--        </nut-tabbar-item>-->
<!--    </nut-tabbar>-->

</template>


<script lang="ts">
    import iconCourse from '../../assert/iconCourse.png'
    import iconCertificate from "../../assert/certification.png";
    import iconNews from '../../assert/news.png';
    import iconCategory from '../../assert/category.png';
    import bannerDisplay from '../../assert/bannerDisplay.png'
    import leftCheck from '../../assert/leftCheck.png'
    import rightCheckOne from '../../assert/rightCheckOne.png'
    import rightCheckTwo from '../../assert/rightCheckTwo.png'
    import { IconFont } from "@nutui/icons-vue-taro";
    import api from "../../api/api";
    import Taro from "@tarojs/taro";
    import {hideLoading, showLoading} from "../../utils/util";
import { View } from '@tarojs/components';
    export default {
      components: { IconFont },
      data() {
        return {
          hasToken:false,
          titleSetText: "市州建筑业联合教育平台",
          // 设置图片格式
          modeOfTitle: 'widthFix',
          modeOfBanner: "aspectFit",
          modeOfCheck: "aspectFit",
          modeOfPublish: "aspectFit",
          bannerMode:'widthFix',
          //图标
          iconCourse,
          iconCertificate,
          iconNews,
          iconCategory,
          bannerDisplay,
          leftCheck,
          rightCheckOne,
          rightCheckTwo,
          pageNo:1,
          pageSize:10,
          //   左边快捷查询
          leftCheckTextShow: "证书查询",
          rightCheckTextOne: "考试报名",
          rightCheckTextTwo: "专业>>",
          messagePublishText: "信息发布",
          newsList: ["--登录后查看更多的消息通知--"],
          backGroudSet: "white",
          platformList:[],
          banners:api.getBannerList(),
          Tabbaractive:0,
          homeIcon:{
            active:'../../assert/home_selected.png',
            unactive:'../../assert/home.png'
          },
          courseIcon:{
            active:'../../assert/course_selected.png',
            unactive:'../../assert/course.png'
          },
          subjectsIcon:{
            active:'../../assert/subjects_selected.png',
            unactive:'../../assert/subjects.png'
          },
          myIcon:{
            active:'../../assert/user_selected.png',
            unactive:'../../assert/user.png'
          }
        }
      },

      mounted() {
        this.hasToken = api.judgeHaveToken()
        if (this.hasToken===true){
         this.init()
        }
      },

      methods: {
        tabSwitch(item, index){
          console.log(item, index)
        },


        handleClickBanner(item){
          console.log(item)

        },

        async init(){
          try {
            await showLoading();
            await this.fetchNotice();
          } finally {
            hideLoading();
          }
        },


        async fetchNotice(){
          const params = {
            "pageNo": this.pageNo,
            "pageSize":  this.pageSize,
          };
          const resultData = await api.getAnnouncement(params)
          console.log("获取的通知数据",resultData)
          this.newsList=[];
          if (resultData.code === 0 && resultData.result.anntMsgList) {
            this.newsList = resultData.result.anntMsgList.map(singleNotice => singleNotice.titile);
          }
        },



        toCertificate(){
          this.jumpPage('/pages/user_pages/certificate/index');
        },

        toSubjects(){
          this.jumpPage('/pages/subjects/index');
        },


        handleMessages() {
          this.jumpPage("/pages/user_pages/messages/index");
        },

        handleGridClickExam0() {
         this.jumpPage("/pages/exam_pages/exam/index?active=0");
        },

        handleGridClickExam1() {
         this.jumpPage("/pages/exam_pages/exam/index?active=1");
        },

        handleSpeciality() {
         this.jumpPage("/pages/exam_pages/Speciality/index");
        },


        handleGridClickExam2() {
         this.jumpPage("/pages/exam_pages/exam/index?active=2")
        },

        handleGridClickExam3() {
         this.jumpPage("/pages/user_pages/messages/index");
        },

        handleClickCourse() {
         this.jumpPage("/pages/exam_pages/course/index");
        },

        handleGridClickFav() {
         this.jumpPage("/pages/exam_pages/favorite/index");
        },


        handleClassification(){
          Taro.navigateTo({ url: "/pages/exam_pages/classification/index" })
        },

        jumpPage(jumpUrl:string){
          if (this.hasToken===false){
            Taro.reLaunch({ url: "/pages/index/index" })
          }else {
            Taro.reLaunch({ url: jumpUrl })
          }
        }

      }
    }


</script>


<style>
    .nut-grid-item__content{
        background-color: #ffffff00!important;
    }
    .leftShowCheck {
        height: 300px;
        position: relative;
        display: flex;
        align-items: center;
    }

    .leftCheckText {
        width: 3rem;
        z-index: 2;
        font-size: 40px;
        font-weight: bold;
        color: white;
        line-height: 65px;
        letter-spacing: 5px;
        padding-left: 1rem;
    }

    .leftCheckImage {
        width: 100%;
        height: 300px;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .rightShowCheck {
        height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .rightCheckText {
        z-index: 2;
        padding-left: 1rem;
        font-size: 40px;
        font-weight: bold;
        color: white;
    }

    .itemRight {
        height: 150px;
        position: relative;
        display: flex;
        align-items: center;
    }

    .rightCheckImage {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 0;
        left: 0;
    }

    .titleSetView {
        height: 300px;
        overflow: hidden;
    }

    .titleSetTextStyle {
        position: absolute;
        font-size: 60px;
        font-weight: bold;
        color: white;
        left: 5%;
        top: 30px;
        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
    }
    .showIconImage {
        width: 100px;
        height: 100px;
    }
    .showIcon {}

    .nut-grid-item__text {
        font-size: 30px;
    }

    .titleImage {
        width: 100%;
        height: 300px;
        overflow: auto;
    }

    .bannerDisplay {
        height: 200px;
        border-radius: 10%;
        text-align: center;
    }

    .bannerDisplayImage {
        height: 200px;
        width: 94%;
        margin: auto;
    }
    .home-view-tips{
        padding: 0 3%;
        font-size: 1.2rem;
    }
    .home-view-tips::before{
        display: none!important;
    }

    .learning-platform{
        width: 94%;
        margin: auto;
        display: grid;
        grid-template-columns: repeat(2,1fr);
        grid-gap: 0.5rem;
    }
    .platform{
        background: linear-gradient(to bottom,#68c0ff,#b0dffd);
        border-radius: 10px;
        height: 2.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1rem;
    }
    .quick-access{
        width: 94%;
        margin: auto;
        display: grid;
        grid-template-columns: repeat(2,1fr);
        grid-gap: 0.5rem;
    }
    .accessbox{
        height: 300px;
    }

    .showMessagePublishImage {
        width: 50%;
        text-align: center;
        background: url(../../assert/messagePublish.png) no-repeat center center;
        background-size: contain;
        text-align: center;
        width: 56%;
        color: #fff;
        font-size: 1.5rem;
        font-weight: bold;
        padding: 16px 0;
    }

    .showMessagePublish {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 2;
        top: -21px;
    }
    .messlist{
        background: url(../../assert/jzyzxpt_13.png) no-repeat top center;
        background-size: cover;
        width: 80%;
        padding: 0 10%;
        margin: auto;
        position: relative;
        z-index: 1;
        margin-top: 45px;
        padding-bottom: 1rem;
    }
    .Newsbox{
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .Newsbox .News::before{
        content: '·';
        color: #000;
        font-size: 1.5rem;
        font-weight: bold;
    }
    .Newsbox .News{
        display: flex;
        align-items: center;
        flex-direction: row;
        color: #000;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 10px;
        margin: 10px auto;
        width: 100%;
    }
    .Newsbox .News text{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
