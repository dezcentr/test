<template>
  <q-page padding v-if="item">
    <q-btn v-if="['admin', 'group'].includes(user.getRole)" :to="{name:'groups'}">назад</q-btn>
    <h5>{{ groupName }} - Просмотр и редактирование группы</h5>

    <q-card class="q-pa-md">
      <q-form class="q-gutter-sm">
        <q-input class="q-ma-md"
                 filled
                 v-model="item.id"
                 type="number"
                 label="id"
                 disable
        />
        <q-input class="q-ma-md"
                 filled
                 v-model="item.name"
                 type="text"
                 label="Название"
                 :rules="[
                 val =>  val && val.length > 0 || 'Название группы',
                 val => val.length < 100 || 'Не более 100 символов'
               ]"
        />
        <q-input class="q-ma-md"
                 filled
                 v-model="item.login"
                 type="text"
                 label="Логин"
                 :rules="[
                  val => val && val.length > 0 || 'Введите Логин',
                  val => val.length < 100 || 'Не более 100 символов'
                 ]"
        />
        <q-input class="q-ma-md"
                 filled
                 v-model="item.password"
                 type="text"
                 label="Пароль"
                 :rules="[
                   val => val.length >= 6 || 'Пароль не менее 6 символов',
                    val => val.length < 100 || 'Не более 100 символов'
                   ]"
        />

        <group-facilities-tables
          :columns="group.getFacilitiesColumns"
          :p-all-facilities="group.facilities"
          v-model="selectedFacilities"
        />

        <q-toggle v-model="item.active" label="Группа активна"/>

        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-5 col-lg-3">
            <q-btn class="full-width" @click="onSubmit" label="Обновить информацию о группе" color="primary"/>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import {useGroupStore} from "stores/group";
import {useRoute} from 'vue-router'
import {api} from "boot/axios";
import {useAuthStore} from "stores/auth-store";
import GroupFacilitiesTables from "components/GroupFacilitiesTables.vue";

export default {
  name: "EditGroup",
  components: {GroupFacilitiesTables},
  data() {
    return {
      user: undefined,
      group: undefined,
      groupName: '',
      item: undefined,
      selectedFacilities: []
    }
  },
  computed: {
    selectedFacilitiesIds() {
      return this.selectedFacilities.map(e => e.id)
    }
  },
  async created() {
    const router = useRoute()
    this.user = useAuthStore()
    this.group = useGroupStore()

    try {
      if (router.params.id === undefined) {
        this.$q.notify({type: 'negative', message: 'Ошибка при загрузки информации о группе'})
        this.$router.push({name: 'groups'})
      }
      this.group.id = +router.params.id

      this.item = await this.group.loadId(this.group.id)
      this.selectedFacilities = this.item.facilityList

      this.groupName = '';
      if (this.item) {
        this.groupName = this.item.name
      }
    } catch (e) {
      console.error(e)
      this.$q.notify({type: 'negative', message: 'Ошибка при загрузки информации о группе'})
      this.$router.push({name: 'groups'})
    }
  },
  methods: {
    onSubmit: function () {
      if (!this.validateForm()) {
        return false
      }

      api.put(process.env.API_UPDATE_GROUP, {
        ...this.item,
        idFacility: this.selectedFacilitiesIds
      })
        .then(({data}) => {
          if (data.status === 200) {
            this.item = data.content
            this.$q.notify({type: 'positive', message: 'Данные группы обновлены'})
          }
        })

      return true;
    },

    validateForm: function () {
      if (this.item.name.length < 1) {
        this.$q.notify({type: 'negative', message: 'Введите название группы'})
        return false
      }

      if (this.item.login.length < 1) {
        this.$q.notify({type: 'negative', message: 'Введите Логин для входа группы'})
        return false
      }

      if (this.item.password.length < 6) {
        this.$q.notify({type: 'negative', message: 'Введите Пароль для входа группы, не менее 6 символов'})
        return false
      }

      return true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
