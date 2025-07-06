<template>
  <q-page padding>
    <q-btn v-if="['admin'].includes(user.getRole)" :to="{ name: 'drugs-index' }"
      >назад</q-btn
    >
    <h5>Редактирование препарата - {{ drug.name }}</h5>

    <q-card class="q-pa-md">
      <q-form class="q-gutter-sm">
        <q-input
          class="q-ma-md"
          filled
          v-model="drug.id"
          type="number"
          label="id"
          disable
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="drug.name"
          type="text"
          label="Название"
          :rules="[
            (val) => (val && val.length > 0) || 'Название препарата',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />

        <q-input
          class="q-ma-md"
          filled
          v-model="drug.ingredients"
          label="Примечание"
          type="textarea"
          :rules="[(val) => val.length < 10000 || 'Не более 10 000 символов']"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="drug.position"
          type="text"
          label="Позиция"
        />

        <!-- Заменяем текстовое поле на выпадающий список -->
        <q-select
          class="q-ma-md"
          filled
          v-model="drug.idGroupDrugs"
          :options="drugGroupsOptions"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          label="Группа препарата"
          :rules="[(val) => val !== null || 'Выберите группу препарата']"
        />

        <div class="row">
          <div class="col-xs-12 col-sm-6 col-md-5 col-lg-3">
            <q-btn
              class="full-width"
              @click="onSubmit"
              label="Обновить информацию о компании"
              color="primary"
            />
            <br />
            <br />
            <q-btn
              class="full-width"
              @click="onDelete"
              label="Удалить препарат"
              color="negative"
            />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useAuthStore } from "stores/auth-store";
import { useDrugStore } from "stores/drug-store";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import { ref } from "vue";

export default {
  name: "DrugUpdate",
  data() {
    const router = useRoute();
    let drugID = router.params.drug_id;
    const drugStore = useDrugStore();
    let drugCurrent = drugStore.getItem(drugID);

    return {
      user: useAuthStore(),
      drugStore: drugStore,
      drug: drugCurrent,
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
        .put(process.env.API_DRUGS_UPDATE, this.drug)
        .then(({ data }) => {
          if (data.status == 200) {
            this.drug = data.content;
            this.$q.notify({
              type: "positive",
              message: "Данные препарата обновлены",
            });
          }
        })
        .catch((error) => {});
      return true;
    },
    onDelete: function () {
      if (this.drugStore.delete(this.drug.id)) {
        this.$q.notify({ type: "positive", message: "Препарат удален" });
        this.$router.push({ name: "drugs-index" });
      } else {
        this.$q.notify({
          type: "positive",
          message: "Ошибка при удалении препарата!",
        });
      }
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
