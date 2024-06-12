<template>
  <view class="exam-record">
<!--    <nut-searchbar v-model="searchValue" @search="handleSearch"-->
<!--                   placeholder="请输入名称"></nut-searchbar>-->
    <nut-tabs v-model="current" @change="handleTabClick">
      <nut-tab-pane title="考试">
        <view class="item flex-row" v-for="item in examList" @click="goToExam(item)">
          <view class="item-cont">
            <view class="flex-row">
              <text class="item-name">{{ item.examinationName }}</text>
            </view>
            <text class="item-time">{{ item.startTime }}</text>
          </view>
          <view class="item-status">{{ item.submitStatusName }}</view>
        </view>
        <nut-empty v-if="!loading && itemList.length === 0"></nut-empty>
      </nut-tab-pane>

      <nut-tab-pane title="考试记录">
        <view class="item flex-row" v-for="item in itemList" @click="goToDetails(item)">
          <view class="item-cont">
            <view class="flex-row">
              <text class="item-name">{{ item.examinationName }}</text>
            </view>
            <text class="item-time">{{ item.startTime }}</text>
          </view>
          <view class="item-status">{{ item.submitStatusName }}</view>
        </view>
        <nut-empty v-if="!loading && itemList.length === 0"></nut-empty>
      </nut-tab-pane>

      <nut-tab-pane title="课程">
        <view class="item flex-row" v-for="item in courseList" @click="goToCourses(item)">
          <view class="item-cont">
            <view class="flex-row">
              <text class="item-name">{{ item.examinationName }}</text>
            </view>
            <text class="item-time">{{ item.startTime }}</text>
          </view>
          <view class="item-status">{{ item.submitStatusName }}</view>
        </view>
        <nut-empty v-if="!loading && itemList.length === 0"></nut-empty>
      </nut-tab-pane>

      <nut-tab-pane title="专业">
        <view class="item flex-row" v-for="item in proList" @click="goToDetails(item)">
          <view class="item-cont">
            <view class="flex-row">
              <text class="item-name">{{ item.examinationName }}</text>
            </view>
            <text class="item-time">{{ item.startTime }}</text>
          </view>
          <view class="item-status">{{ item.submitStatusName }}</view>
        </view>
        <nut-empty v-if="!loading && itemList.length === 0"></nut-empty>
      </nut-tab-pane>
    </nut-tabs>
  </view>
</template>
<script lang="ts">
import Taro from '@tarojs/taro';
import {recordTagList} from '../../../constant/constant';

export default {
  data(){
    const currentInstance = Taro.getCurrentInstance();
    const params = currentInstance.router?.params;
    let type = 0;
    if (params !== undefined && params.type !== undefined) {
      type = Number(params.type);
    }
    return{
      current:type,
      loading:true,
      searchValue:"",
      pageNumRef:1,
      nextPageRef:1,
      hasNextPageRef:1,
      itemList:[],
      courseList:[],
      proList:[],
      examList:[],
      tagsList:recordTagList,
    }
  },

  onPullDownRefresh() {
    try {
      this.init();
    } finally {
      Taro.stopPullDownRefresh();
    }
  },
  onReachBottom() {
    try {

    } finally {
      Taro.stopPullDownRefresh();
    }
  },
  methods:{
    goToDetails(item) {
      Taro.navigateTo({url: `/pages/exam_pages/answer/index?recordId=${item.id}`});
    },

    goToCourses(item){
      Taro.navigateTo({url: `/pages/exam_pages/course_detail/index?courseId=${item.id}`});
    },

    goToExam(item){
      console.log(item)
    },

    handleTabClick({paneKey}) {
      this.current = paneKey;
      this.searchValue = '';
      this.resetPage();
    },

    handleSearchChange(value) {
      this.searchValue= value;
    },

    handleSearch() {
      this.resetPage();
    },

    resetPage() {
      this.hasNextPageRef = true;
      this.nextPageRef = 1;
    },
  }

}



</script>

<style>
.exam-record .nut-tab-pane {
  padding: 0;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item {
  justify-content: space-between;
  margin: 0 24px;
  border-bottom: 1px solid rgb(235, 237, 240);
  padding: 20px 0;
  position: relative;
}

.item-name {
  color: #323233;
  font-size: 30px;
}

.item-time {
  margin-top: 10px;
  color: #969799;
  font-size: 26px;
}

.item-status {
  color: #969799;
  font-size: 26px;
}

.item-status::after {
  content: " >";
  position: relative;
  padding-left: 4px;
}
</style>
