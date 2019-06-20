import axios from 'axios'

const host = process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : window.location.origin

const http = axios.create ({
  baseURL: `${host}/api`,
  headers: { 'Content-Type': 'application/json', },
})

http.interceptors.request.use (
  function (config) {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  function (error) {
    return Promise.reject (error)
  }
)

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

http.interceptors.response.use(function (response) {
  return response
}, function (error) {

  const originalRequest = error.config
  if (error.response.status === 401 && error.response.headers.hasOwnProperty('token-expired')) {

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject})
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return http(originalRequest)
        }).catch(err => {
          return err
        })
      }

    originalRequest._retry = true
    isRefreshing = true

    const token = window.localStorage.getItem('access_token')
    const refreshToken = window.localStorage.getItem('refresh_token')
    return new Promise(function (resolve, reject) {
       http.post('/token/refresh', { token, refreshToken })
        .then(({data}) => {
            window.localStorage.setItem('access_token', data.token)
            window.localStorage.setItem('refresh_token', data.refreshToken)
            processQueue(null, data.token)
            resolve(http(originalRequest))
        })
        .catch((err) => {
            processQueue(err, null)
            reject(err)
        })
        .then(() => { isRefreshing = false })
    })
  }

  return Promise.reject(error)
})

export default http