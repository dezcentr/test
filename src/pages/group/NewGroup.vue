<template>
  <q-page padding>

    <q-btn v-if="['admin'].includes(user.getRole)" :to="{name:'groups'}">назад</q-btn>
    <h5>Добавление новой группы</h5>

    <q-card class="q-pa-md">
      <q-form ref="newForm" id="newForm">
        <q-input class="q-ma-md"
                 filled
                 v-model="item.name"
                 type="text"
                 label="Название*"
                 :rules="[
                 val =>  val && val.length > 0 || 'Название компании',
                 val => val.length < 100 || 'Не более 100 символов'
               ]"
        />
        <q-input class="q-ma-md"
                 filled
                 v-model="item.login"
                 type="text"
                 label="Логин*"
                 :rules="[
                  val => val && val.length > 0 || 'Введите Логин',
                  val => val.length < 100 || 'Не более 100 символов'
                 ]"
        />
        <q-input class="q-ma-md"
                 filled
                 v-model="item.password"
                 type="text"
                 label="Пароль*"
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

        <q-btn @click="onSubmit" label="Добавить группу" color="primary"/>
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
      item: {
        name: '',
        login: '',
        password: ''
      },
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
      await this.group.loadFacilities()
    } catch (e) {
      console.error(e)
      this.$q.notify({type: 'negative', message: 'Ошибка при загрузки информации для создания группы'})
      this.$router.push({name: 'groups'})
    }
  },
  methods: {
    onSubmit: function () {
      if (!this.validateForm()) {
        return false
      }

      const result = api.post(process.env.API_NEW_GROUP, {
        ...this.item,
        idFacility: this.selectedFacilitiesIds
      })
        .then(({data}) => {
          if (data.status === 200) {
            this.item = data.content
            this.$q.notify({type: 'positive', message: 'Группа успешно создана'})
            this.$router.push({name: 'groups'})
          }
        })
        .catch(error => {
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
.facilities-block {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas: "S S" "B1 B2";
  gap: 10px;

  & h5 {
    grid-area: S;
    margin: 0;
  }
  &__block {
    overflow-x: auto;
  }
}
</style>
<style>
.q-table tbody td:after {
  background: transparent;
}
.groups-facility-table {
  height: 410px;

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:last-child th {
    top: 48px;
  }
  thead tr:first-child th {
    top: 0;
  }
  tbody {
    scroll-margin-top: 48px;
  }
}
</style>
