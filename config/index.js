export default {
  development: {
    baseUrl: '/api' // 测试接口域名
  },
  beta: {
    baseUrl: '//192.168.0.200:3000/manage-api/v1' // 测试接口域名
  },
  release: {
    baseUrl: '//192.168.0.200:3000/manage-api/v1' // 正式接口域名
  }
}
