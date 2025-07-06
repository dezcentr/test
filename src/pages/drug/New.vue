<template>
  <q-page padding>
    <q-btn v-if="['admin'].includes(user.getRole)" :to="{ name: 'drugs-index' }"
      >назад</q-btn
    >
    <h5>Добавление нового препарата</h5>

    <q-card class="q-pa-md">
      <q-form ref="newForm" id="newForm" class="q-gutter-sm">
        <q-input
          class="q-ma-md"
          filled
          v-model="drug.name"
          type="text"
          label="Название*"
          :rules="[
            (val) => (val && val.length > 0) || 'Название препарата',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="drug.ingredients"
          type="textarea"
          label="Действующие вещества*"
          :rules="[
            (val) => (val && val.length > 0) || 'Действующие вещества',
            (val) => val.length < 10000 || 'Не более 10 000 символов',
          ]"
        />

        <q-input
          class="q-ma-md"
          filled
          v-model="drug.position"
          type="text"
          label="Позиция"
        />

        <q-select
          class="q-ma-md"
          filled
          v-model="drug.idGroupDrugs"
          :options="drugGroupsOptions"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          label="Группа препарата*"
          :rules="[(val) => val !== null || 'Выберите группу препарата']"
        />

        <q-btn @click="onSubmit" label="Добавить препарат" color="primary" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useAuthStore } from "stores/auth-store";
import { api } from "boot/axios";
import { ref } from "vue";

export default {
  name: "DugNew",
  data() {
    return {
      user: useAuthStore(),
      drug: {
        name: "",
        ingredients: "",
        position: "",
        idGroupDrugs: null,
      },
      drugGroups: ref([]), // Массив для хранения групп препаратов
    };
  },
  computed: {
    // Преобразуем массив групп в формат для q-select
    drugGroupsOptions() {
      return this.drugGroups.map((group) => ({
        id: group.id,
        name: group.name,
      }));
    },
  },
  methods: {
    async loadDrugGroups() {
      try {
        const response = await api.get(process.env.API_GET_ALL_GROUP_DRUG);
        if (response.data.status === 200) {
          this.drugGroups = response.data.content;
        }
      } catch (error) {
        console.error("Ошибка при загрузке групп препаратов:", error);
        this.$q.notify({
          type: "negative",
          message: "Не удалось загрузить список групп препаратов",
        });
      }
    },

    onSubmit: function () {
      if (!this.validateForm()) {
        return false;
      }
      const result = api
        .post(process.env.API_DRUGS_NEW, this.drug)
        .then(({ data }) => {
          if (data.status == 200) {
            this.$q.notify({ type: "positive", message: "Препарат добавлен" });
            this.$router.push({ name: "drugs-index" });
          } else {
            this.$q.notify({
              type: "negative",
              message: "Ошибка на сервере! Попробуйте позже.",
            });
          }
        });
    },

    validateForm: function () {
      if (this.drug.name.length < 1) {
        this.$q.notify({
          type: "negative",
          message: "Введите название препарата",
        });
        return false;
      }
      if (this.drug.ingredients.length < 1) {
        this.$q.notify({
          type: "negative",
          message: "Введите действующие вещества",
        });
        return false;
      }
      if (!this.drug.idGroupDrugs) {
        this.$q.notify({
          type: "negative",
          message: "Выберите группу препарата",
        });
        return false;
      }
      return true;
    },
  },
  async mounted() {
    await this.loadDrugGroups();
  },
};
</script>

<style scoped></style>
