<template>
  <q-page padding>
    <q-btn :to="{ name: 'facility', params: { company_id: company.id } }"
      >назад</q-btn
    >
    <h5>{{ company.name }} - {{ facility.name }} - Редактирование объекта</h5>

    <q-card class="q-pa-md">
      <q-form class="q-gutter-sm">
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.id"
          type="number"
          label="id"
          disable
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.name"
          type="text"
          label="Название"
          :disable="!['admin'].includes(user.getRole)"
          :rules="[
            (val) => (val && val.length > 0) || 'Название',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.fullName"
          type="text"
          label="Полное название"
          :disable="!['admin'].includes(user.getRole)"
          :rules="[
            (val) => (val && val.length > 0) || 'Полное название',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.address"
          type="text"
          label="Адресс"
          :disable="!['admin'].includes(user.getRole)"
          :rules="[
            (val) => (val && val.length > 0) || 'Введите адрес',
            (val) => val.length < 1000 || 'Не более 1 000 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.note"
          label="Примечание"
          type="textarea"
          :disable="!['admin'].includes(user.getRole)"
          :rules="[(val) => val.length < 10000 || 'Не более 10 000 символов']"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model.number="facility.latitude"
          type="text"
          label="Широта"
          :disable="!['admin'].includes(user.getRole)"
          :rules="[
            (val) => val !== '' || 'Введите широту',
            (val) => !isNaN(val) || 'Широта должна быть числом',
            (val) =>
              (val >= -90 && val <= 90) ||
              'Широта должна быть в диапазоне от -90 до 90',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model.number="facility.longitude"
          type="text"
          label="Долгота"
          :disable="!['admin'].includes(user.getRole)"
          :rules="[
            (val) => val !== '' || 'Введите долготу',
            (val) => !isNaN(val) || 'Долгота должна быть числом',
            (val) =>
              (val >= -180 && val <= 180) ||
              'Долгота должна быть в диапазоне от -180 до 180',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.square"
          :disable="!['admin'].includes(user.getRole)"
          label="Площадь"
          type="text"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.regionRf"
          :disable="!['admin'].includes(user.getRole)"
          label="Регион РФ"
          type="text"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model.number="facility.numberContainers"
          type="text"
          label="Количество контейнеров"
          :disable="!['admin'].includes(user.getRole)"
          :rules="[
            (val) => val !== '' || 'Введите количество контейнеров',
            (val) => !isNaN(val) || 'Количество контейнеров должно быть числом',
          ]"
        />
        <q-select
          class="q-ma-md"
          filled
          v-model="facility.idObjectType"
          :options="categories"
          label="Выберите категорию"
          :disable="!['admin'].includes(user.getRole)"
          emit-value
          map-options
        />

        <h6
          class="groups-table-title"
          :class="{ 'groups-table-title--opened': isGroupsOpened }"
          style="margin-bottom: 5px"
          @click="isGroupsOpened = !isGroupsOpened"
        >
          Список привязанных групп
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="currentColor"
              d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
            />
          </svg>
        </h6>
        <template v-if="isGroupsOpened">
          <q-table
            class="groups-table virtual-scroll-table"
            v-if="facility.groupFacilityNameList.length"
            table-header-class="bg-blue-grey-4 text-bold"
            flat
            binary-state-sort
            style="max-height: 400px"
            virtual-scroll
            :rows="
              facility.groupFacilityNameList?.map((name, i) => ({
                id: i + 1,
                name,
              }))
            "
            :rows-per-page-options="[0]"
            :columns="[
              {
                name: 'nn',
                align: 'center',
                label: 'Номер п/п',
                field: 'id',
                style: { width: '200px' },
              },
              {
                name: 'name',
                align: 'center',
                label: 'Название группы',
                field: 'name',
                sortable: true,
              },
            ]"
            hide-bottom
          />
          <div class="groups-table__null" v-else>Список пуст</div>
        </template>

        <q-toggle
          :disable="!['admin'].includes(user.getRole)"
          v-model="facility.isActive"
          label="Склад активный"
        />

        <q-input
          class="q-ma-md"
          filled
          v-model="facility.uuid"
          type="text"
          label="UUID"
          disable
        />

        <q-btn v-if="['admin'].includes(user.getRole)" @click="newUUID"
          >Сгенераровать новый UUID</q-btn
        >

        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-5 col-lg-3">
            <q-btn
              v-if="['admin'].includes(user.getRole)"
              class="full-width"
              @click="onSubmit"
              label="Обновить информацию об объекте"
              color="primary"
            />
            <br />
            <br />
            <q-btn
              class="full-width col-xs-12 col-sm-6 col-md-5 col-lg-3"
              :to="{
                name: 'log-index',
                params: { facility_id: facility.id, ctx: companyID },
              }"
              label="Показать логи объектов"
              color="primary"
            />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { useFacilityStore } from "stores/facility";
import { v4 as uuidv4 } from "uuid";
import { api } from "boot/axios";
import { useCompanyStore } from "stores/company";
import { useAuthStore } from "stores/auth-store";

export default {
  name: "EditPage",
  data() {
    const route = useRoute();
    const companyID = route.params.company_id ?? 0;
    const facilityID = route.params.id ?? 0;

    if (companyID === 0 || facilityID === 0) {
      this.$q.notify({
        type: "negative",
        message: "Ошибка при загрузке списка",
      });
      this.$router.push({ name: "companies" });
    }

    const facilityStore = useFacilityStore();
    const companyStore = new useCompanyStore();

    return {
      companyID,
      company: {},
      facilityID,
      isGroupsOpened: false,
      facility: {},
      facilityStore,
      companyStore,
      user: useAuthStore(),
      categories: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    onSubmit() {
      this.facility.isActive = this.facility.isActive ? 1 : 0;

      api
        .put(process.env.API_UPDATE_FACILITY, this.facility)
        .then(({ data }) => {
          if (data.status == 200) {
            this.facility = data.content;
            this.facility.isActive = Boolean(this.facility.isActive);
            this.$q.notify({
              type: "positive",
              message: "Данные компании обновлены",
            });
          }
        })
        .catch((error) => {
          // this.$q.notify({type: 'negative', message: 'Ошибка при обновлении!'})
          // console.log(error)
        });
    },
    newUUID() {
      this.facility.uuid = uuidv4();
    },
    init() {
      this.facilityStore.loadID(this.facilityID).then((value) => {
        this.facility = value;
        this.facility.isActive = Boolean(this.facility.isActive);
        if (!this.facility.selectedCategory) {
          this.facility.selectedCategory = 5;
        }
      });

      this.companyStore.loadId(this.companyID).then((value) => {
        this.company = value;
      });

      api
        .get(process.env.API_GET_FACILITY_CATEGORIES)
        .then(({ data }) => {
          this.categories = data.content.map((item) => ({
            label: item.name,
            value: item.id,
          }));
        })
        .catch((error) => {
          this.$q.notify({
            type: "negative",
            message: "Ошибка при загрузке категорий",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.groups-table {
  &-title {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    & svg {
      font-size: 16px;
    }
    &--opened {
      & svg {
        transform: scaleY(-1);
      }
    }
  }
  &__null {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
  }
}
</style>
