<!--专业展示模块-->
<template>
  <view class="course-item-container">
    <view >
      <nut-row type="flex" wrap="nowrap">
        <view class="setID">{{item.id}}}</view>
        <nut-col :span="24" class="profession-item-info">
          <h2 class="pro-card-title">{{ item.professional_dictText }}</h2>
          <view class="card-simple-desc">
            <p>当前考试得分： {{item.score}} 分</p>
          </view>

          <view class="card-simple-desc" v-if="item.totalTime!=='null'&&item.totalTime!==0&&item.totalTime!==null">
            <p>需要学习时间： {{  Math.round(parseInt(item.totalTime,10)  /60) }} 分钟 </p>
          </view>

          <view class="card-simple-desc" v-if="item.learned!=='null'&&item.learned!==0&&item.learned!==null">
            <p>已经学习时间： {{  Math.round(parseInt(item.learned,10)  /60) }} 分钟 </p>
          </view>

          <view class="profession-detail-btn" >
            <view class="showMessage">
            <nut-button type="primary" size="small"  @click="handleRefresh">刷新时间</nut-button>
            </view>

            <view class="showMessage">
              <nut-button type="primary" size="small" @click="handleToCourse">前往课程</nut-button>
            </view>

            <view class="showMessage">
              <nut-button type="primary" size="small" v-if="item.score >= 60" @click="handleStart">{{ item.showMessage }}</nut-button>
            </view>




            <!--            <nut-button type="primary" size="small" @click="handleStart">生成证书</nut-button>-->
          </view>
        </nut-col>
      </nut-row>
    </view>
  </view>
</template>


<script lang="ts">
import {defineComponent} from 'vue'
import {IconFont} from '@nutui/icons-vue-taro';
import {Row, Col} from '@nutui/nutui-taro';

export default defineComponent({
  name: "ProfessionItem",
  components: {IconFont, Row, Col},
  props: {
    item: {
      type: Object
    }
  },
  setup(props, {emit}){
    function handleStart() {
      emit('handProfession', props.item);
    }

    function handleRefresh() {
      emit('handleRefresh',props.item)
    }

    function handleToCourse() {
      emit('handleToCourse',props.item)
    }


    return{
      handleStart,
      handleRefresh,
      handleToCourse,
    }
  }
})
</script>

<style>


.profession-detail-btn {
  position: absolute;
  top: 0;
  grid-gap: 5px;
  right: 20px;
  bottom: 10px;
  text-align: center;
  text-transform: uppercase;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 30px;
  color: white;
  display: inline-grid;
}


.pro-card-title {
  margin: 12px 12px;
  display: block;
  color: rgba(0,0,0,.8);
  line-height: 1.4;
  font-weight: 600;
  font-size: 40px;
  padding-right: 160px;
}


.showMessage{
  padding-top: 5px;
}
</style>
