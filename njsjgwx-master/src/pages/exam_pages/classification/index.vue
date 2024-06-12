<template>

    <nut-menu>
        <nut-menu-item v-model="valueMenu" :cols="1" :options="topItems" @close="menuClose" @open="menuOpen" @change="menuChange" />
    </nut-menu>

    <nut-tabs v-model="valueTabs" direction="vertical" title-scroll style="height: 100%" name="tabName" align="left"
        type="smile" v-if="tabsChildrenList.length!==0">
        <nut-tab-pane v-for="item in tabsChildrenList" :key="item" :title="item.name" :pane-key="item.id">

            <view class="background">
                <view class="expertise">{{ item.name}}</view>
                <text class="alternatives_text" v-if="listChooseOne">可选专业：</text>

                <view class="alternatives" v-for="choose in listChooseOne" @click="">
                    <view class="alternatives_title">{{ choose}} </view>
                    <view class="alternatives_type">所属分类: {{ classificationSet }}</view>
                    <nut-button class="more" type="default">查看详细</nut-button>
                </view>

            </view>

        </nut-tab-pane>
    </nut-tabs>

  <view class="alternatives" v-for="choose in listChooseOne" v-if="valueMenu!==1">
    <view class="alternatives_title">{{ choose}} </view>
    <view class="alternatives_type">所属分类: {{ classificationSet }}</view>
    <nut-button class="more" type="default">查看详细</nut-button>
  </view>

</template>


<script lang="ts">
import {hideLoading, showLoading} from "../../../utils/util";
import api, {TreeNode} from "../../../api/api";

interface ListItem {
  id: string;
  name: string;
  children: boolean;
  parent: string | null;
  type: string,
}


export default {
  data() {
    let listTabs: ListItem[] = [
      {
        id: 1,
        name: "建筑施工企业安全生产管理人员",
        children: true,
        parent: null,
      },
      {
        id: 2,
        name: "企业负责人（A类）",
        children: false,
        parent: 1,
      },
      {
        id: 3,
        name: "项目负责人（B类）",
        children: false,
        parent: 1,
      },
      {
        id: 4,
        name: "专职安全员（C类）",
        children: true,
        parent: null,
      },
      {
        id: 5,
        name: "C1类",
        children: false,
        parent: 4,
      },
      {
        id: 6,
        name: "C2类",
        children: false,
        parent: 4,
      },
      {
        id: 7,
        name: "C3类",
        children: false,
        parent: 4,
      },
      {
        id: 8,
        name: "建筑施工企业特种作业人员",
        children: true,
        parent: null,
      },
      {
        id: 9,
        name: "建筑起重司索信号工",
        children: false,
        parent: 8,
      },
      {
        id: 10,
        name: "塔式起重机安装拆卸工",
        children: false,
        parent: 8,
      },
      {
        id: 11,
        name: "塔式起重机司机",
        children: false,
        parent: 8,
      },
      {
        id: 12,
        name: "施工升降机司机",
        children: false,
        parent: 8,
      },
      {
        id: 13,
        name: "施工升降机安拆工",
        children: false,
        parent: 8,
      },
      {
        id: 14,
        name: "建筑电工",
        children: false,
        parent: 8,
      },
      {
        id: 15,
        name: "普通脚手架",
        children: false,
        parent: 8,
      },
      {
        id: 16,
        name: "附着升降脚手架",
        children: false,
        parent: 8,
      },
      {
        id: 17,
        name: "高处作业吊篮安装拆卸工",
        children: false,
        parent: 8,
      },
      {
        id: 18,
        name: "建设工程技术人员专业科目继续教育",
        children: false,
        parent: null,
      },
      {
        id: 19,
        name: "内江市农村建筑工匠培训",
        children: false,
        parent: null,
      },
      {
        id: 20,
        name: "建筑工人培训",
        children: false,
        parent: null,
      }
    ];
    return {
      valueMenu: 1,
      valueTabs: 0,
      listTabs,
      topItems: [
        {
          text: "全部分类",
          value: 1,
        }

      ],
      tabsChildrenList:[],
      listChooseOne: ["新培训", "继续教育"],
      classificationSet: "",
    }
  },


  created() {

  },

  mounted() {
    this.init();
  },

  methods: {

    async init() {

      try {
        await showLoading();
        await this.fetchClassification();

      } finally {
        hideLoading();
      }

    },


    async fetchClassification(){
      const resultData = await api.queryProfessionalTree()
      //
      if (resultData.code===200){
        this.listTabs=[]
        let tree = resultData.result
        this.listTabs = this.parseTreeToList(tree)
      }
      this.setMenuList()
    },


    /**
     * 解析
     * @param tree
     */
    parseTreeToList(tree: TreeNode[]): ListItem[] {
      const list: ListItem[] = [];

      /**
       * 传入节点，头结点是null，剩下的都是
       * @param node
       * @param parentId
       */
      function traverse(node: TreeNode, parentId:string|null) {
        const listItem: ListItem = {
          id: node.id,
          name: node.name,
          children: node.child && node.child.length > 0,
          parent: parentId,
          type: node.type,
        };

        list.push(listItem);
        node.child.forEach(childNode => {
          traverse(childNode, listItem.id);
        });
      }

      tree.forEach(rootNode => traverse(rootNode, null));
      return list;
    },




    setMenuList() {
      let top = this.parseData(null, this.listTabs)
      this.topItems = this.topItems.concat(this.parseTop(top[0].id, this.listTabs))
    },



    parseTop(parentId: string|null , items: ListItem[]) {
      return items
          .filter(item => item.parent === parentId)
          .map(item => ({
            text: item.name,
            value: item.id
          }));
    },

    parseChildren(parentId:string, items: ListItem[]) {
      return items
          .filter(item => item.parent === parentId)
    },

    parseData(parentId:string, items: ListItem[]) {
      return items
          .filter(item => item.parent === parentId)
    },


    getNameFromId(id: string, items: ListItem[]) {
      return items
          .filter(item => item.id === id)
    },

    menuClose() {
      console.log("关闭菜单。")
    },

    menuOpen() {
      console.log("打开菜单。")
    },

    async menuChange(callbackParameters) {
      // 这里只传回来了value
      console.log("选择的：", callbackParameters)
      //   选择后开始请求
      console.log("变化的", this.valueMenu)
      this.tabsChildrenList = this.parseChildren(this.valueMenu, this.listTabs)
      this.classificationSet = this.getNameFromId(this.valueMenu, this.listTabs)[0].name
    },

  }
}

</script>


<style>
    .expertise {
        background-color: #6699CC;
        color: #fff;
        border-radius: 10px;
        padding:12px;
    }
    .alternatives_text{
        padding-top: 1rem;
        display: block;
    }
    .alternatives {
        margin: 1rem auto;
        border-radius: 8px;
        background-color: #f0f0f0;
        padding: 0.6rem 4rem 0.6rem 1rem;
        position: relative;
    }
    .alternatives_title{
        font-weight: bold;
        font-size: 30px;
    }
    .alternatives_type{
        color: #999;
        font-size: 28px;
        padding-top: 8px;
    }
    .more{
        background-color: #ec9146;
        color: #fff;
        padding: 0 0.5rem;
        display: inline-flex;
        align-items: center;
        height: 2rem;
        font-size: 28px;
        border: none;
        border-radius: 8px;
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 3.5rem;
        line-height: normal;
    }
</style>
