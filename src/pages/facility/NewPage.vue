<template>
  <q-page padding>
    <q-btn v-if="['admin'].includes(user.getRole)" :to="{ name: 'facility' }">
      назад
    </q-btn>
    <h5>{{ company?.name }} - Добавление нового Объекта</h5>
    <q-card class="q-pa-md">
      <q-form>
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.name"
          type="text"
          label="Название*"
          :rules="[
            (val) => (val && val.length > 0) || 'Название обязательно',
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
            (val) => (val && val.length > 0) || 'Полное название обязательно',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.address"
          label="Адрес*"
          type="text"
          :rules="[
            (val) => (val && val.length > 0) || 'Введите адрес',
            (val) => val.length < 1000 || 'Не более 1 000 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model.number="facility.latitude"
          type="text"
          label="Широта"
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
          label="Площадь"
          type="text"
          readonly
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.regionRf"
          label="Регион РФ"
          type="text"
          readonly
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="facility.note"
          label="Примечание"
          type="textarea"
          :rules="[(val) => val.length < 10000 || 'Не более 10 000 символов']"
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
          :options="objectTypes"
          label="Выберите категорию"
          :disable="!['admin'].includes(user.getRole)"
          emit-value
          map-options
        />
        <q-btn @click="onSubmit" label="Добавить объект" color="primary" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import { useRoute } from "vue-router";
import { useCompanyStore } from "stores/company";
import { useAuthStore } from "stores/auth-store";

export default {
  name: "NewPage",
  data() {
    const route = useRoute();
    return {
      user: useAuthStore(),
      companyStore: undefined,
      company: undefined,
      facility: {
        name: "",
        fullName: "",
        address: "",
        latitude: "",
        longitude: "",
        square: "",
        regionRf: "",
        note: "",
        numberContainers: "",
        selectedCategory: null,
        isActive: 1,
        companyId: route.params.company_id,
      },
      objectTypes: [],
      route: undefined,
    };
  },
  async created() {
    this.route = useRoute();
    this.companyStore = useCompanyStore();
    this.company = await this.companyStore.loadId(this.route.params.company_id);

    try {
      const { data } = await api.get(process.env.API_GET_FACILITY_CATEGORIES);
      if (data.status === 200 && Array.isArray(data.content)) {
        this.objectTypes = data.content.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      } else {
        this.$q.notify({
          type: "negative",
          message: "Не удалось получить типы объектов",
        });
      }
    } catch (error) {
      this.$q.notify({
        type: "negative",
        message: "Ошибка загрузки типов объектов",
      });
    }
  },
  methods: {
    onSubmit() {
      api
        .post(process.env.API_NEW_FACILITY, this.facility)
        .then(({ data }) => {
          if (data.status === 200) {
            this.$q.notify({ type: "positive", message: "Объект добавлен" });
            this.$router.push({
              name: "facility",
              params: { company_id: this.facility.companyId },
            });
          } else {
            this.$q.notify({
              type: "negative",
              message: "Ошибка при добавлении объекта",
            });
          }
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: "Ошибка при добавлении объекта",
          });
        });
    },
  },
};
</script>

<style scoped></style>
