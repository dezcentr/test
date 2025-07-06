<template>
  <q-page padding>
    <q-btn :href="baseUrl"
           target="_self"
           label="Назад"></q-btn>
    <h4>РСДК - вход в экран просмотра списка объектов компании</h4>
    <div class="row">
      <div class="col">
        <q-card class="q-pa-md">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            @keydown.enter.prevent="onSubmit"
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

            <div v-if="errorAuth">
              Восстановить пароль: <a href="tel:+7 910 735-77-48"> +7 910 735-77-48</a>
            </div>

            <div>
              <q-btn class="full-width" label="Вход" @click="onSubmit" color="primary"/>
            </div>

          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import {useAuthStore} from "stores/auth-store";
import {useCompanyStore} from "stores/company";
import {api} from "boot/axios";

export default {
  name: "CompanyPage.vue",

  data() {
    return {
      baseUrl: process.env.BASE_URL,
      errorAuth: false,
      loaded: false,
      authStore: useAuthStore(),
      companyStore: useCompanyStore(),
      user: {
        login: '',
        password: ''
      }
    }
  },

  methods: {
    onSubmit: async function () {
      const response = await api.post(process.env.URL_AUTH_COMPANY, this.user).then(({data}) => {
        if (data.status == 200) {
          this.loaded = true

          localStorage.setItem(process.env.KEY_AUTH_TOKEN_NAME, data.content.token)
          localStorage.setItem(process.env.KEY_USER_LOGIN, data.content.companyName)
          localStorage.setItem(process.env.KEY_ROLE_NAME, process.env.USER_ROLE_COMPANY)

          this.$q.notify({type: 'positive', textColor: 'white', message: 'Добро пожаловать!'})

          this.authStore.login = data.content.companyName
          this.authStore.role = process.env.USER_ROLE_COMPANY
          this.authStore.loaded = true

          this.companyStore.id = data.content.companyId
          this.companyStore.init()
          this.$router.push({name: 'facility', params: {company_id: data.content.companyId}})
        }

        if (data.status == 400) {
          this.errorAuth = true
        }
        this.loaded = false
      })

    },

    onReset() {

    }
  }
}
</script>

<style scoped>

</style>
