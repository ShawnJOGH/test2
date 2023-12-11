<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入商品名称"
          v-model="state.goodsName"
          @change="handleOption1"
          clearable
        />
        <!-- <el-select
          @change="handleOption"
          v-model="state.commentStatus"
          style="width: 200px; margin-right: 10px"
        >
          <el-option
            v-for="item in state.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
      </div>
    </template>
    <el-table
      :load="state.loading"
      :data="state.tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="commentId" label="评论id"> </el-table-column>
      <el-table-column prop="goodsName" label="商品名称"> </el-table-column>
      <el-table-column prop="nickName" label="用户名"> </el-table-column>
      <el-table-column prop="commentContent" label="评价内容">
        <!-- <template #default="scope">
          <span>{{ $filters.orderMap(scope.row.orderStatus) }}</span>
        </template> -->
      </el-table-column>

      <el-table-column prop="commentDate" label="创建时间"> </el-table-column>
      <!-- <el-table-column label="操作">
      </el-table-column> -->
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="state.total"
      :page-size="state.pageSize"
      :current-page="state.currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import { HomeFilled, Delete } from "@element-plus/icons-vue";
import axios from "@/utils/axios";
import setTime from "@/utils/setTime.js";

const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  serachData: [],
  multipleSelection: [], // 选中项
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  commentDate: "",
  commentStatus: "",
  goodsName: "", //商品名称
  nickName: "", //用户名称
  commentId: "",
  goodsId: "", // 商品id
  commentContent: "", //评价内容
  // 评价等级筛选项默认值
  options: [
    {
      value: "",
      label: "默认",
    },
    {
      value: 0,
      label: "一星差评",
    },
    {
      value: 1,
      label: "两星差评",
    },
    {
      value: 2,
      label: "三星中评",
    },
    {
      value: 3,
      label: "四星好评",
    },
    {
      value: 4,
      label: "五星好评",
    },
  ],
});
// 初始化获取评论信息列表
onMounted(() => {
  getCommentList();
 
});
// 获取列表方法
const getCommentList = () => {
  state.loading = true;
  axios
    .get("/selectComment", {
      params: {
        pageNumber: state.currentPage,
        pageSize: state.pageSize,
        goodsName: state.goodsName,
      },
    })
    .then((res) => {
      state.tableData = res.list;
      state.total = res.totalCount;
      state.currentPage = res.currPage;
      state.loading = false;
       setdate();
    });
};
// 触发过滤项方法
const handleOption = () => {
  state.currentPage = 1;
  getCommentList();
};
const handleOption1 = () => {
  if (state.goodsName != "") {
    state.tableData.forEach((element) => {
      if (element.goodsName.match(state.goodsName)) {
        state.serachData.push(element);
        console.log(element);
      }
    });
    state.tableData = state.serachData;
  } else {
    getCommentList();
    state.serachData = [];
  }
};
const setdate = () =>{
  state.tableData.forEach((element,index)=> {
    element.commentDate=setTime.formatDate(element.commentDate);
    state.tableData[index]=element;
  });
}
// checkbox 选择项
const handleSelectionChange = (val) => {
  state.multipleSelection = val;
};
// 翻页方法
const changePage = (val) => {
  state.currentPage = val;
  getCommentList();
};
</script>
