<template>
  <q-page padding>
    <q-btn :href="baseUrl"
           target="_self"
           label="Назад"></q-btn>
  <h4>РСДК - вход в экран просмотр логов объекта</h4>
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
            v-model="UUID"
            label="UUID"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Введите логин']"
          />
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
import {api} from "boot/axios";
import {useCompanyStore} from "stores/company";

export default {
  name: "ClientPage.vue",

  data() {
    return {
      baseUrl: process.env.BASE_URL,
      companyStore: useCompanyStore(),
      UUID:'',
      authStore: useAuthStore(),
    }
  },

  methods: {
    onSubmit: function () {
      const response = api.get(process.env.URL_AUTH_CLIENT+this.UUID).then(({data}) => {
        if (data.status == 200) {
          this.loaded = true

          localStorage.setItem(process.env.KEY_AUTH_TOKEN_NAME, data.content.token)
          localStorage.setItem(process.env.KEY_USER_LOGIN, data.content.facilityName)
          localStorage.setItem(process.env.KEY_ROLE_NAME, process.env.USER_ROLE_CLIENT)

          this.$q.notify({type: 'positive', textColor: 'white', message: 'Добро пожаловать!'})

          this.authStore.login = data.content.facilityName
          this.authStore.role = process.env.USER_ROLE_CLIENT
          this.authStore.uuid = this.UUID
          this.authStore.loaded = true

          this.companyStore.init()
          this.$router.push({name: 'log-index', params: {'facility_id': data.content.facilityId, ctx: -1}})
        } else {
          this.loaded = false
        }
      })
    },

    onReset() {

    }

  }
}
</script>

<style scoped>

</style>
