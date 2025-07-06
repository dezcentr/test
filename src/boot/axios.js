import { boot } from 'quasar/wrappers'
import axios from 'axios'
import {Notify} from 'quasar'

const responseHandler = response => {

  if( response.status != 200 ){
    Notify.create({
      type: 'negative',
      html: false,
      textColor: 'white',
      message: 'Возникла ошибка на сервере. Обратитесть к администратору!'
    })
  }else {

    if (response.data.status != 200) {
      Notify.create({
        type: 'negative',
        html: false,
        textColor: 'white',
        message: response.data.content.message
      })
    }

    if( response.data.content !==null ) {
      if (response.data.content.length == 0) {
        Notify.create({
          type: 'negative',
          html: false,
          textColor: 'white',
          message: 'Пусто'
        })
      }
    }
  }

  return response;
};

const errorHandler = error => {
  Notify.create({
    type: 'negative',
    html: false,
    textColor: 'white',
    message: 'Возникла ошибка на сервере. Обратитесть к администратору!'
  })
  return Promise.reject(error);
};

function getBaseApiURL(){
  return process.env.BASE_URL_API;
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: getBaseApiURL() })

api.interceptors.request.use(
  (request) => {
    request.baseURL = getBaseApiURL()
   // request.headers.Authorization = 'Bearer ' + token
    request.headers.Authorization = localStorage.getItem(process.env.KEY_AUTH_TOKEN_NAME)
    request.headers.accept = 'application/json'
    return request;
  },
  (error) => errorHandler(error)
);

api.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
