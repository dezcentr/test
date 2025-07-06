<template>
  <q-page padding>
  <q-btn :href="baseUrl"
         target="_self"
         label="Назад"></q-btn>
  <h4>РСДК - вход в экран администратора</h4>
  <div class="row">
    <div class="col">
      <q-card class="q-pa-md">
        <q-form
          @submit="onSubmit"
          @keydown.enter.prevent="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            filled
            v-model="user.login"
            label="Логин"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Введите логин']"
          />

          <q-input
            v-model="user.password"
            filled
            label="Пароль"
            lazy-rules
            type="password"

            :rules="[ val => val && val.length > 0 || 'Введите пароль']"
          />

          <q-btn flat @click="onPasswordRecovery" label="Восстановить пароль"/>

          <div>
            <q-btn @click="onSubmit"
                   class="full-width"
                   label="Вход"
                   color="primary"/>
          </div>

        </q-form>
      </q-card>
    </div>
  </div>
  </q-page>
</template>

<script>

import {useAuthStore} from "stores/auth-store";
import {api} from "boot/axios";

export default {
  name: "AdminPage.vue",

  data() {
    return {
      baseUrl: process.env.BASE_URL,
      loaded: false,
      authStore: useAuthStore(),
      user: {
        login: '',
        password: ''
      }
    }
  },

  methods: {
    onSubmit: function () {
      const response = api.post(process.env.URL_AUTH_ADMIN, this.user).then(({data})=> {
        if (data.status == 200) {
          this.loaded = true
          localStorage.setItem(process.env.KEY_AUTH_TOKEN_NAME, data.content.token)
          localStorage.setItem(process.env.KEY_USER_LOGIN, this.user.login)
          localStorage.setItem(process.env.KEY_ROLE_NAME, process.env.USER_ROLE_ADMIN)
          this.$q.notify({type: 'positive', textColor: 'white', message: 'Добро пожаловать!'})

          this.authStore.login = this.user.login
          this.authStore.role = process.env.USER_ROLE_ADMIN
          this.authStore.loaded = true

          this.$router.push({name: 'companies'})
        } else {
          this.loaded = false
        }
      })
    },

    onPasswordRecovery() {
      const response = api.get(process.env.URL_RESTORE)
      this.$q.notify({type: 'positive', textColor: 'white', message: 'Письмо с пароле отправлено на Email!'})
      return false;
    }
  }
}
</script>

<style scoped>

</style>
