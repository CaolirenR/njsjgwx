
<!--首页展示课程模块-->
<template>
<!--  <view class="course-item-container">-->
    <view @click="handleStart">

<!--      <nut-row type="flex" wrap="nowrap">-->
<!--        <view class="setID">{{item.id}}}</view>-->
<!--        <nut-col :span="8">-->
<!--          <image class="course-item-img" :src="item.logo" :onError="onImageError" :onLoad="onImageLoad"></image>-->
<!--        </nut-col>-->
<!--        <nut-col :span="16" class="course-item-info">-->
<!--          <h2 class="card-title">课程名：{{ item.name }}</h2>-->
<!--          <h3 class="showProSet">专业： {{  item.professional_dictText }} </h3>-->
<!--          <view class="card-simple-desc">-->
<!--            <p>总时长 {{  Math.round(item.duration/60) }} 分钟</p>-->
<!--          </view>-->
<!--          <view class="course-item-info-member" v-if="item.learedTime!==0">-->
<!--            <text class="card-simple-desc">已学习 {{ Math.round(item.learedTime/60)  }} 分钟 </text>-->
<!--          </view>-->
<!--          <view class="course-detail-btn">-->
<!--            <nut-button type="primary" size="small" >了解详情</nut-button>-->
<!--&lt;!&ndash;            <nut-button type="primary" size="small" @click="handleStart">了解详情</nut-button>&ndash;&gt;-->
<!--          </view>-->
<!--        </nut-col>-->
<!--      </nut-row>-->


        <view class="courseBox">
          <image class="couresimg" :src="item.logo" />
          <view class="textbox">
            <view class="textb">课程名：<text>{{ item.name }}</text></view>
            <view class="textz">专业：<text>{{  item.professional_dictText }}</text></view>
            <view class="textz">总时长：<text> {{  Math.round(item.duration/60) }} 分钟</text></view>
            <view class="textz" v-if="item.learedTime!==0">已学习：<text>{{ Math.round(item.learedTime/60)  }} 分钟</text></view>
            <view class="btnbox">
              <view class="detailBtn">了解详情</view>
            </view>
          </view>
        </view>


    </view>
<!--  </view>-->
</template>

<script lang="ts">
import {IconFont} from '@nutui/icons-vue-taro';
import {Row, Col} from '@nutui/nutui-taro';
import {defineComponent} from 'vue';


export default defineComponent({
  name: 'CourseItem',
  components: {IconFont, Row, Col},
  props: {
    item: {
      type: Object
    }
  },
  emits: [
    'click'
  ],
  setup(props, {emit}){

    function onImageError(onErrorEventDetail){
      console.log(onErrorEventDetail)
    }

    function onImageLoad(onLoadEventDetail) {
      console.log(onLoadEventDetail)
    }

    function handleStart() {
      emit('click', props.item);
    }

    return{
      handleStart,
      onImageError,
      onImageLoad,

    }
  }

})



</script>

<style>
.at-tag--primary {
  color: #78A4F4;
  border-color: #78A4F4;
  background-color: #FFF;
}

.course-item-container {
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
}

.course-item-img {
  width: 100%;
  height: 160px;
  border-radius: 8px;
  margin: 20px;
}

.course-item-info {
  margin-left: 30px;
  margin-top: 10px;
}

.course-item-info-member {
  position: static;
  bottom: 20px;
  line-height: 1.8;
}

.setID{
  display: none;
}

.showProSet{
  color: gray;
  line-height: 1.7;
  font-size: 35px;
  margin-left: 12px;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-right: 150px;
}



.courseBox{
  width: calc(94% - 40px);
  padding: 20px;
  margin: 10px auto 30px auto;
  position: relative;
  box-shadow: 0 3px 8px rgba(0,0,0,.15);
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 15px;
}
.couresimg{
  width: 250px;
  height: 165px;
  padding-bottom: 22px;
}
.textbox{
  display: inline-flex;
  flex-direction: column;
  padding-left: 20px;
  width: 60%;
}
.textb{
  font-size: 38px;
  font-weight: bold;
}
.textz{
  font-size: 30px;
  padding: 6px 0;
  color: #999999;
}
.btnbox{
  display: flex;
  justify-content: flex-end;
}
.detailBtn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  color: #fff;
  background-color: #6190e8;
  padding: 7px 22px;
}

</style>
