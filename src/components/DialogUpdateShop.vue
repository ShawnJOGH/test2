<template>
  <el-dialog
    :title="state.type == 'add' ? '添加店铺' : '修改店铺信息'"
    v-model="state.visible"
    width="400px"
  >
    <el-form :model="state.ruleForm" :rules="state.rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="店铺名" prop="shopInfo">
        <el-input type="text" v-model="state.ruleForm.shopInfo  "></el-input>
      </el-form-item>
      <el-form-item label="店长" prop="shopName">
        <el-input type="text" v-model="state.ruleForm.shopName"></el-input>
      </el-form-item>
        <el-form-item label="商铺电话" prop="tel">
        <el-input type="number" v-model="state.ruleForm.tel"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  type: String, // 用于判断是添加还是编辑
  reload: Function, // 添加或修改完后，刷新列表页
  shopData: Array
})

const formRef = ref(null)
const route = useRoute()
const state = reactive({
  visible: false,
  categoryLevel: 1,
  parentId: 0,
  shopDataInfo:[],
  ruleForm: {
    shopInfo: '',
    shopName: '',
    tel:'',
    goodsInfo:'',
  },
  rules: {
    shopInfo: [
      { required: 'true', message: '名称不能为空', trigger: ['change'] }
    ],
    shopName: [
      { required: 'true', message: '名称不能为空', trigger: ['change'] }
    ],
    tel: [
      { required: 'true', message: '电话不能为空', trigger: ['change'] }
    ],
  },
  id: ''
})
// 获取详情
const getDetail = (id) => {
  // axios.get(`/shops/${id}`).then(res => {
  //   state.ruleForm = {
  //     shopInfo: res.shopInfo,
  //     shopName: res.shopName,
  //    shopName: res.shopName
  //   }
  // })
  state.shopDataInfo=props.shopData;
  state.ruleForm={
      shopInfo:props.shopData[0].shopInfo,
      shopName: props.shopData[0].shopName,
      tel: props.shopData[0].loginName
  }
}
// 开启弹窗
const open = (id) => {
  state.visible = true
  if (id) {
    state.id = id
    // 如果是有 id 传入，证明是修改模式
    getDetail(id)
  }
  // else {
  //   // 否则为新增模式
  //   // 新增类目，从路由获取分类 level 级别和父分类 id
  //   const { level = 1, parent_id = 0 } = route.query
  //   state.ruleForm = {
  //     name: '',
  //     rank: ''
  //   }
  // }
}
// 关闭弹窗
const close = () => {
  state.visible = false
}
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (props.type == 'add') {
        // 添加方法
        axios.post('/shops', {
          shopInfo: res.shopInfo,
          shopName: res.shopName,
          tel:res.loginName,
        }).then(() => {
          ElMessage.success('添加成功')
          state.visible = false
          // 接口回调之后，运行重新获取列表方法 reload
          if (props.reload) props.reload()
        })
      } else {
        // 修改方法
        axios.put('/shops', {
          shopId:1001,
          shopInfo:state.ruleForm.shopInfo,
          shopName:state.ruleForm.shopName,
          tel:state.ruleForm.loginName,
        }).then(() => {
          ElMessage.success('修改成功')
          state.visible = false
          // 接口回调之后，运行重新获取列表方法 reload
          if (props.reload) props.reload()
        })
      }
    }
  })
}
defineExpose({ open, close })
</script>
