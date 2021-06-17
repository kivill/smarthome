import { boot } from 'quasar/wrappers'
import Axios from 'axios'

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $axios: AxiosInstance;
//   }
// }

const authToken = localStorage.getItem('token')
const baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api/v1'
  : `${location.origin}/api/v1`
let ax = {
  baseURL: baseURL
}
if (authToken) {
  ax = Object.assign(ax, {
    headers: {
      Authorization: authToken
    }
  })
}

const api = Axios.create(ax)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api, baseURL, authToken }
