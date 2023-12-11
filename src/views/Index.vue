<template>
  <el-card class="introduce">
    <div class="order">

      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>店铺名</span>
          </div>
        </template>
        <div class="item">{{state.shopName}}</div>
      </el-card>
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>订单数</span>
          </div>
        </template>
        <div class="item">{{ state.orderNum }}</div>
      </el-card>
      <el-card class="order-item">
        <template #header>
          <div class="card-header">
            <span>评论数</span>
          </div>
        </template>
        <div class="item">{{ state.plNum }}</div>
      </el-card>
    </div>
    <div id="zoom"></div>
  </el-card>
</template>

<script setup>
import {onMounted, onUnmounted, reactive} from 'vue'
import axios from '@/utils/axios'
let myChart = null

const state = reactive({
  orderNum:0,
  plNum:0,
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小,
  shopName:'',
  orderLine:[]
})

onMounted(() => {
  getOrderList();
  getCommentNum();
  getShops();
  getOrderLine();

})
const getShops = () => {
  // const { level = 1, parent_id = 0 } = route.query
  state.loading = true
  axios.get('/shops', {
    params: {
      pageNumber: state.currentPage,
      pageSize: state.pageSize,
      // categoryLevel: level,
      // parentId: parent_id
    }
  }).then(res => {
    state.shopName = res.list[0].shopInfo
  })
}
const getOrderLine = () => {
  state.loading = true
  axios.get('/getOrderLine').then(res => {
    state.orderLine = res
    setChar()
  })
}
const setChar = () => {
  if (window.echarts) {
    // 基于准备好的dom，初始化echarts实例
    let time = []
    let count = []
    state.orderLine.forEach(item=>{
      time.push(item.date)
      count.push(item.count)
    })
    // console.log("count",state.orderLine)
    // console.log("count",count)
    // console.log(time)
    myChart = window.echarts.init(document.getElementById('zoom'))
    // 指定图表的配置项和数据
    const option = {
      title: {
        text: '销量折线图'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      // legend: {
      //   data: ['新增注册', '付费用户', '活跃用户', '订单数', '当日总收入']
      // },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: time
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '当日销量',
          type: 'line',
          stack: '总量',
          label: {
            show: true,
            position: 'top'
          },
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: count
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
const getOrderList = () => {
  state.loading = true
  axios.get('/ordersNum').then(res => {
    state.orderNum = res
  })
}
const getCommentNum = () => {
  state.loading = true
  axios.get('/getCommentNum').then(res => {
    state.plNum = res
  })
}
onUnmounted(() => {
  myChart.dispose()
})
</script>

<style scoped>
  .introduce .order {
    display: flex;
    margin-bottom: 50px;
  }
  .introduce .order .order-item {
    flex: 1;
    margin-right: 20px;
  }
  .introduce .order .order-item:last-child{
    margin-right: 0;
  }
  #zoom {
    min-height: 300px;
  }
</style>
