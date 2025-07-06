import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import {useAuthStore} from "stores/auth-store";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

   const Router =  createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    const meStore = useAuthStore()
    // Если данные о юзере не были ниразу подгружены, и это не страница логина, то подгружаем их
    if (meStore.loaded === false && !['login-admin','login-company', 'login-group', 'login-client', 'home'].includes(to.name)) {
      // Если что-то не так пошло при подгрузке, то логаут и на страницу логина
      if (meStore.checkAuth() === false) {
        meStore.logout()
        return next({name: 'home'})
      }
    }

    if (meStore.userCanRoute(to) === false) {
      //TODO : добавить всплывашку с сообщением об отсутствии доступа
     // this.$q.notify({type: 'negative', textColor: 'white', message: 'У вас нет доступа к странице '+to.fullPath })
      return next({name: 'home'})
    }

    // Если все ок, то переходим на следующую страницу
    next()
  })
  return Router
})
