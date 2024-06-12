<template>
  <view class="certificate-item-container">
    <view @click="handleStart">
      <nut-row type="flex" wrap="nowrap">
        <nut-col :span="24" class="certificate-item-info">
          <h2 class="card-title">{{ item.certificateName }} </h2>
          <view class="card-simple-desc">
            <p>获取时间：{{item.createTime}}</p>
          </view>
          <view class="course-detail-btn">
            <nut-button type="primary" size="small">查看证书</nut-button>
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
  name: 'CertificateItem',
  components: {IconFont, Row, Col},
  props: {
    item: {
      type: Object
    }
  },
  setup(props, {emit}){
    function handleStart() {
      emit('handleCertificate', props.item);
    }
    return{
      handleStart
    }
  }
})
</script>


<style scoped>


.certificate-item-container {
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
}

.certificate-item-info {
  border-radius: 6px;
  margin-bottom: 10px;
  margin-left: 30px;
  margin-top: 10px;
}



</style>
