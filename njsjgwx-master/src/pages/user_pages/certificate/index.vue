<template>
  <view>
<!--    <nut-searchbar v-model="searchValue" @search="handleSearch" placeholder="搜索"/>-->
    <view class="ml-22 mr-22">
      <!--      在itemList中进行初始化 -->
      <view class="exam-item box-show-item flex-col"  v-for="item in certificateItems">
        <certificate-item :item="item" @handleCertificate="handleCertificate(item)"></certificate-item>
      </view>
      <nut-empty v-if="!loading && certificateItems.length === 0"></nut-empty>
    </view>
  </view>
</template>

<script lang="ts">
import Taro from '@tarojs/taro';
import {CertificateItem} from "../../../components/certificate-item";
import {hideLoading, showLoading, warnMessage} from "../../../utils/util";
import api from "../../../api/api";
export default {
  /**
   * 整个证书是一次性拿完的
   */

  components: {
    'certificate-item': CertificateItem
  },
  data(){
    return{
      certificateItems:[],
      searchValue:"",
      hasNextPageRef:true,
      // 下一页的参数
      nextPageRef:1,
      // 加载
      loading:false,
      // 总页数
      pageNumRef:1,
    }
  },

  mounted() {
    this.init()
  },

  methods:{
    handleCertificate(item){
      Taro.navigateTo({url: "/pages/user_pages/certificate_detail/index?id="+item.id.toString()});
    },

    async init() {
      try {
        await showLoading();
        //   证书
        await this.fetchCertificateList();
      } finally {
        hideLoading();
      }
    },

    async fetchCertificateList(){
      const resultData = await api.queryCert()
      if (resultData.code ===200){
        let certificateList = resultData.result
        for (let i = 0; i < certificateList.length; i++) {
          let item = certificateList[i]
          let showCertificateItem = {
            id:item.id,
            createTime:item.createTime,
            professional:item.professional,
            certificateName:"证书"+(i+1).toString(),
          }
          this.certificateItems.push(showCertificateItem)
        }
      }else {
        await warnMessage(resultData.message,3000)
      }
    },

  }

}

</script>


<style>

</style>
