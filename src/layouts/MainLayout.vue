<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-blue-grey-4">
      <q-toolbar>
        <q-avatar>
          <img src="/app/icon.png">
        </q-avatar>
        <div class="head-title">РСДК</div>
        <div>
          <q-btn stretch v-if="['admin'].includes(user.getRole)" flat :to="{name: 'companies'}">Список компаний</q-btn>
          <q-btn v-if="['admin'].includes(user.getRole)" flat :to="{name: 'drugs-index'}">Список препаратов</q-btn>
          <q-btn v-if="['admin'].includes(user.getRole)" flat :to="{name: 'groups'}">Список групп</q-btn>
          <q-btn v-if="['company'].includes(user.getRole)" flat
                 :to="{name: 'facility', params:{'company_id':companyID}}">
            Список объектов
          </q-btn>
          <q-btn v-if="!['admin'].includes(user.getRole)" target="_blank" href="https://dezcentr32.ru/certificate" flat
                 label="Разрешительные документы"></q-btn>
        </div>

        <q-space/>

        <div class="text-center">
          <span>{{ user.getLogin }}:</span>
          <q-btn flat @click="onLogout">Выход</q-btn>
        </div>

      </q-toolbar>
    </q-header>
    <q-page-container class="q-pa-md">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {useAuthStore} from "stores/auth-store";
import {useRoute} from "vue-router";
import {useFacilityStore} from "stores/facility";

export default {
  name: 'MainLayout',

  data() {
    const user = useAuthStore()
    const route = useRoute()
    var companyID = route.params.company_id ?? 0

    if (companyID < 1) {
      const facilityID = route.params.facility_id ?? 0
      if (facilityID > 0) {
        const facilityStore = new useFacilityStore()
        facilityStore.loadID(facilityID).then(value => {
          this.companyID = value.companyId
        })
      }
    }

    return {
      route,
      user,
      companyID
    }
  },
  methods: {
    onLogout: function () {
      this.user.logout()
      window.location.href = process.env.BASE_URL;
    }
  }
}
</script>

<style>
.head-title {
  margin-left: 1rem;
  font-size: 21px;
}
</style>
