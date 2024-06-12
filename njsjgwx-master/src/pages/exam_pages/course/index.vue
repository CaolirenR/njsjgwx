<!--课程列表。课程查看-->
<template>
<!--    <view class="bg">-->
<!--        <view class="courseBox">-->
<!--            <image class="couresimg" src="https://exam.njscia.com/njjzyxh/video/1787788653439889410.jpg" />-->
<!--            <view class="textbox">-->
<!--                <view class="textb">课程名：<text>测试</text></view>-->
<!--                <view class="textz">专业：<text>测试专业</text></view>-->
<!--                <view class="textz">总时长：<text>40分钟</text></view>-->
<!--                <view class="textz">已学习：<text>10分钟</text></view>-->
<!--                <view class="btnbox">-->
<!--                    <view class="detailBtn">了解详情</view>-->
<!--                </view>-->
<!--            </view>-->
<!--        </view>-->
<!--    </view>-->

<!--    <view>-->
<!--      <nut-searchbar v-model="searchValue" @search="handleSearch" placeholder="搜索"/>-->
<!--        <view class="ml-22 mr-22">-->
<!--            &lt;!&ndash;      在itemList中进行初始化 &ndash;&gt;-->
<!--            <view class="box-show-item mb-bottom-40" v-for="course in records">-->
<!--                <course-item :item="course" @click="handleClickCourse(course)"></course-item>-->
<!--            </view>-->
<!--            <nut-empty v-if="!loading && records.length === 0"></nut-empty>-->
<!--            <nut-divider v-if="hasNextPageRef===false"> 到底了 </nut-divider>-->
<!--        </view>-->
<!--    </view>-->

  <view class="couresebg" >
    <nut-searchbar v-model="searchValue" @search="search" type="text" confirm-type="search" @clear="clear"></nut-searchbar>
    <nut-menu>
      <nut-menu-item v-model="menuChoose" :cols="1" :options="options" @close="menuClose" @open="menuOpen" @change="menuChange"/>
    </nut-menu>

    <view v-for="course in records">
      <course-item :item="course" @click="handleClickCourse(course)"></course-item>
    </view>
    <nut-empty v-if="!loading && records.length === 0"></nut-empty>
    <nut-divider v-if="hasNextPageRef===false"> 到底了 </nut-divider>
  </view>


</template>

<script lang="ts">
    import Taro from '@tarojs/taro';
    import { CourseItem } from '../../../components/course-item';
    import { showLoading, hideLoading, warnMessage } from '../../../utils/util';
    import api from "../../../api/api";


    export default {
        components: {
            'course-item': CourseItem
        },
        data() {
            return {
              options:[],
              menuChoose:0,
                //搜索
                searchValue: "",
                // 课程的具体内容
                records: [],
                // 是否有下一页，
                hasNextPageRef: true,
                // 页数请求
                pageNo: 1,
                // 请求大小
                pageSize: 10,
                // 加载
                loading: false,
                // 总页数
                pageNumRef: 1,
                // 总数
                total: 1,
            }
        },


        onPullDownRefresh() {
            try {
                this.resetPage();
                // 初始化数据
                this.initDefaultData()
                this.fetch('', true);
            } finally {
                Taro.stopPullDownRefresh();
            }
        },


        onReachBottom() {
            try {
                this.pageNo = this.pageNo + 1
                this.fetch('', false);
            } finally {
                Taro.stopPullDownRefresh();
            }
        },

        mounted() {
            this.init()
        },


        /**
         * 数据量不够，还差分页查询和分类搜素
         */
        methods: {
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
            if (callbackParameters!==0){


            }else {

            }
          },


          search(){

          },

          clear(){
            this.searchValue= ""
          },





            async fetch(courseSearchName: string = '', append: boolean = true,) {
                if (courseSearchName != '') {
                    console.log("搜索", courseSearchName)
                }
                if (this.hasNextPageRef === false) {
                    return;
                }
                if (this.loading === true) {
                    return;
                }
                // 设置为正在请求，免得重复请求
                this.loading = true;
                // 在首次请求，或者搜索请求的时候都需要清空数据
                if (append === true) {
                    this.records = [];
                }
                await showLoading();
                try {
                    // 后端的分页请求。需要重新写
                    // 这里是用的网页版的请求
                    // const resultData = await api.getCourseList( this.pageNo,this.pageSize,courseSearchName)
                    const params = {
                        "pageNo": this.pageNo,
                        "pageSize": this.pageSize,
                    };
                    const resultData = await api.getScoreByUser(params)
                    if (resultData.code === 200) {
                        console.log("获取的课程数据：", resultData)
                        const resultRecords = resultData.result.records
                        for (let i = 0; i < resultRecords.length; i++) {
                            this.records.push(resultRecords[i])
                        }
                        this.total = resultData.result.total;
                        this.pageNumRef = Math.floor(this.total / this.pageSize) + 1
                        console.log("总页数：", this.pageNumRef)
                    } else {
                        await warnMessage(resultData.message, 3000)
                    }
                } finally {
                    if (this.pageNo >= this.pageNumRef) {
                        this.hasNextPageRef = false
                    }
                    this.loading = false;
                    await hideLoading();
                }
            },

            handleSearch() {
                this.resetPage();
                this.fetch(this.searchValue, true);
            },

            resetPage() {
                this.hasNextPageRef = true;
                this.nextPageRef = 1;
            },

            handleClickCourse(course) {
                console.log('Clicked on course:', course);
                let queryParameters = Object.entries(course).map(([k, v]) => `${k}=${v}`).join('&');
                Taro.navigateTo({ url: "/pages/exam_pages/course_detail/index?" + queryParameters })
            },

            async init() {
                try {
                    await showLoading();
                    await this.fetch("", true);
                } finally {
                    hideLoading();
                }
            },

            /**
             * 舒适化所有数据
             */
            initDefaultData() {
                Object.assign(
                    this.$data,
                    {
                        //搜索
                        searchValue: "",
                        // 课程的具体内容
                        records: [],
                        // 是否有下一页，
                        hasNextPageRef: true,
                        // 页数请求
                        pageNo: 1,
                        // 请求大小
                        pageSize: 10,
                        // 加载
                        loading: false,
                        // 总页数
                        pageNumRef: 1,
                        // 总数
                        total: 1,
                    }
                );
            }





        },
    }




</script>

<style>



</style>
