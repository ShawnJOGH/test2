<template>
  <el-card class="category-container">
    <el-table
        :load="state.loading"
        ref="multipleTable"
        :data="state.tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">

      <!-- <el-table-column
        prop="Name"
        label="分类名称"
      >
      </el-table-column> -->
      <el-table-column
          prop="nickName"
          label="用户名称"
          width="150"
      >
      </el-table-column>
      <el-table-column
          prop="shopName"
          label="店铺名"
          width="150"
      >
      </el-table-column>

      <el-table-column
          prop="complaintContent"
          label="投诉信息"
          width="220"
      >
      </el-table-column>
<!--      <el-table-column-->
<!--          label="操作"-->
<!--          width="300"-->
<!--      >-->
<!--        <template #default="scope">-->
<!--          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.complaintId)">处理</a>-->

<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <el-pagination
        background
        layout="prev, pager, next"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="changePage"
    />
    <DialogAddCategory ref='addCate' :reload="getcomplaints" :type="state.type" />
  </el-card>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, toRefs, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import DialogAddCategory from '@/components/DialogAddCategory.vue'

const addCate = ref(null)
const router = useRouter() // 声明路由实例
const route = useRoute() // 获取路由参数
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  type: 'add', // 操作类型
  level: 1,
  parent_id: 0
})
onMounted(() => {
  getcomplaints()
})
watchEffect(() => {
  console.log(state.pageSize)
})
const unwatch = router.afterEach((to) => {
  // 每次路由变化的时候，都会触发监听时间，重新获取列表数据
  if (['category', 'level2', 'level3'].includes(to.name)) {
    getcomplaints()
  }
})
onUnmounted(() => {
  unwatch()
})
// 获取分类列表
const getcomplaints = () => {
  const { level = 1, parent_id = 0 } = route.query
  state.loading = true
  axios.get('/complaints', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      // categoryLevel: level,
      // parentId: parent_id
    }
  }).then(res => {
    state.tableData = res.list
    state.total = res.totalCount
    state.currentPage = res.currPage
    state.loading = false
    // state.level = level
    // state.parentId = parent_id
  })
}
const changePage = (val) => {
  state.currentPage = val
  getcomplaints()
}
const handleNext = (item) => {
  const levelNumber = item.categoryLevel + 1
  if (levelNumber == 4) {
    ElMessage.error('没有下一级')
    return
  }
  router.push({
    name: `level${levelNumber}`,
    query: {
      level: levelNumber,
      parent_id: item.shopId
    }
  })
}
// 添加分类
const handleAdd = () => {
  state.type = 'add'
  addCate.value.open()
}
// 修改分类
const handleEdit = (id) => {
  state.type = 'edit'
  addCate.value.open(id)
}
// 选择项
const handleSelectionChange = (val) => {
  state.multipleSelection = val
}
// 批量删除
const handleDelete = () => {
  if (!state.multipleSelection.length) {
    ElMessage.error('请选择项')
    return
  }
  axios.delete('/shops', {
    data: {
      ids: state.multipleSelection.map(i => i.categoryId)
    }
  }).then(() => {
    ElMessage.success('删除成功')
    getcomplaints()
  })
}
// 单个删除
const handleDeleteOne = (id) => {
  axios.delete('/shops', {
    data: {
      ids: [id]
    }
  }).then(() => {
    ElMessage.success('删除成功')
    getcomplaints()
  })
}
</script>

<style>

</style>
