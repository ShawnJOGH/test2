<template>
  <el-card class="category-container">
    <el-table
        :load="state.loading"
        ref="multipleTable"
        :data="state.tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column
          prop="shopInfo"
          label="店铺名"
          width="150"
      >
      </el-table-column>
      <el-table-column
          prop="shopName"
          label="店长"
          width="150"
      >
      </el-table-column>
      <el-table-column
          prop="loginName"
          label="商铺电话"
          width="150"
      >
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="添加时间"
          width="250"
      >
      </el-table-column>

      <el-table-column
          label="操作"
          width="300"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.shopId)">修改</a>

        </template>
      </el-table-column>
    </el-table>

    <DialogUpdateShop :shopData="state.tableData"  ref='updateShop' :reload="getShops" :type="state.type" />
  </el-card>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref, toRefs, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import axios from '@/utils/axios'
import DialogUpdateShop from '@/components/DialogUpdateShop.vue'

const updateShop = ref(null)
const router = useRouter() // 声明路由实例
const route = useRoute() // 获取路由参数
const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  type: 'edit', // 操作类型
  level: 1,
  parent_id: 0
})
onMounted(() => {
  getShops()
})
watchEffect(() => {
  console.log(state.pageSize)
})
const unwatch = router.afterEach((to) => {
  // 每次路由变化的时候，都会触发监听时间，重新获取列表数据
  if (['category', 'level2', 'level3'].includes(to.name)) {
    getShops()
  }
})
onUnmounted(() => {
  unwatch()
})
// 获取分类列表
const getShops = () => {
  const { level = 1, parent_id = 0 } = route.query
  state.loading = true
  axios.get('/shops', {
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
  getShops()
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
// // 添加分类
// const handleAdd = () => {
//   state.type = 'add'
//   updateShop.value.open()
// }
// 修改分类
const handleEdit = (id) => {
  state.type = 'edit'
  updateShop.value.open(id)
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
    getShops()
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
    getShops()
  })
}
</script>

<style>

</style>
