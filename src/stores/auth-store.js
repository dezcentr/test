import {defineStore} from "pinia";
import {toRaw} from "vue";


export const useAuthStore = defineStore('auth-store', {
  state: () => ({
    login: 'Гость',
    role: '',
    loaded: false, // Данные пользователя не загружены
    uuid:''
  }),

  getters:{
    getLogin(state){
      return state.login
    },

    getRole(state){
      return state.role
    }
  },

  actions: {
    userCanRoute: function (route) {
      //Если это незащищенный роут, то разрешаем
      const freeRoutes = ['home', 'login-admin', 'login-user', 'login-client']
      if (freeRoutes.includes(route.name)) {
        return true
      }
      const routePerms = route.meta.roles ?? []
      if( routePerms.length < 1 ) {
        return true;
      }

      return routePerms.includes( this.role );
    },

    async loadMe() {
      const response = await axi.post('/auth/me', {app: 'app'})
      if (response.data.status === true) {
        this.login = response.data.content.username
        this.role = response.data.content.permissions ?? []
        this.loaded = true
        return true
      }
      return false
    },
    // Проверка токена пользователя.
    checkAuth: function () {

      const token = localStorage.getItem(process.env.KEY_AUTH_TOKEN_NAME)
      const role = localStorage.getItem(process.env.KEY_ROLE_NAME)

      this.loaded =  token !== null && role !== null;

      if( this.loaded === true){
        this.login = localStorage.getItem(process.env.KEY_USER_LOGIN)
        this.role = localStorage.getItem(process.env.KEY_ROLE_NAME)
      }

      return this.loaded;
    },
    logout: function () {
      this.login = ''
      this.role = ''
      this.loaded = false
      this.uuid = ''

      localStorage.removeItem(process.env.KEY_AUTH_TOKEN_NAME)
      localStorage.removeItem(process.env.KEY_USER_LOGIN)
      localStorage.removeItem(process.env.KEY_ROLE_NAME)
    }
  }

})
