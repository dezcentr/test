<template>
  <q-page>
    <div class="row" style="justify-content: center">

      <div class="col-xs-12 col-sm-6 col-md-4 q-pa-md">
        <q-card class="flex flex-center q-pa-md">
          <q-btn :to="{name:'login-admin'}">Вход для Администратора системы</q-btn>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4 q-pa-md">
        <q-card class="flex flex-center q-pa-md">
          <q-btn :to="{name:'login-company'}">Вход для Компаний</q-btn>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4 q-pa-md">
        <q-card class="flex flex-center q-pa-md">
          <q-btn :to="{name:'login-group'}">Вход для Групп</q-btn>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4 q-pa-md">
        <q-card class="flex flex-center q-pa-md">
          <q-btn :to="{name:'login-client'}">Вход для Просмотра склада</q-btn>
        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'IndexPage'
})
</script>
