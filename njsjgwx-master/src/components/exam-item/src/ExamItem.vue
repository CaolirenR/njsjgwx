<template>
  <view class="exam-item-container">
    <view @click="handleStart">
      <nut-row type="flex" wrap="nowrap">
<!--        <nut-col :span="8">-->
<!--          <image class="exam-item-img" :src="item.imageUrl"></image>-->
<!--        </nut-col>-->
        <nut-col :span="24" class="exam-item-info">
          <h2 class="card-title">{{ item.name }}</h2>
          <view class="course-item-info-member">
            <text class="card-simple-desc">专业：{{item.professional_dictText}}</text>
          </view>
          <view class="course-item-info-member">
            <text class="card-simple-desc">开始：{{item.startTime}}</text>
          </view>
          <view class="course-item-info-member">
            <text class="card-simple-desc">结束：{{item.endTime}}</text>
          </view>
          <view class="course-detail-btn">
            <nut-button type="primary" size="small" >查看</nut-button>
<!--            <nut-button type="primary" size="small" @click="handleStart">了解详情</nut-button>-->
          </view>
        </nut-col>
      </nut-row>
    </view>
  </view>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {IconFont} from '@nutui/icons-vue-taro';

export default defineComponent({
  name: 'ExamItem',
  components: {IconFont},
  props: {
    item: {
      type: Object
    }
  },
  emits: [
    'start',
    'fav'
  ],
  setup(props, {emit}) {

    function handleStart() {
      emit('handleExam', props.item);
    }

    return {
      handleStart
    }
  }
})
</script>

<style>
.exam-item-container {
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
}

.exam-item-img {
  width: 100%;
  height: 160px;
  border-radius: 8px;
  margin: 20px;
}

.exam-item-info {
  margin-left: 30px;
  margin-top: 10px;
}
</style>
