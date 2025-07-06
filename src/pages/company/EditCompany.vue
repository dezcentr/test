<template>
  <q-page padding>
    <q-btn
      v-if="user && ['admin', 'company'].includes(user.getRole)"
      :to="{ name: 'companies' }"
      >назад</q-btn
    >
    <h5>{{ companyName }} - Просмотр и редактирование компании</h5>

    <q-card class="q-pa-md">
      <q-form class="q-gutter-sm">
        <q-input
          class="q-ma-md"
          filled
          v-model="item.id"
          type="number"
          label="id"
          disable
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="item.name"
          type="text"
          label="Название"
          :rules="[
            (val) => (val && val.length > 0) || 'Название компании',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="item.inn"
          label="ИНН"
          type="number"
          mask="##########"
          :rules="[
            (val) => (val && val.length > 0) || 'Введите ИНН',
            (val) => val.length < 100 || 'Не более 12 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="item.login"
          type="text"
          label="Логин"
          :rules="[
            (val) => (val && val.length > 0) || 'Введите Логин',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="item.password"
          type="text"
          label="Пароль"
          :rules="[
            (val) => val.length >= 6 || 'Пароль не менее 6 символов',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="item.manager"
          type="text"
          label="Менеджер"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="item.note"
          label="Примечание"
          type="textarea"
          :rules="[(val) => val.length < 10000 || 'Не более 10 000 символов']"
        />

        <q-toggle v-model="item.isActive" label="Компания активна" />

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
              class="full-width col-xs-12 col-sm-6 col-md-5 col-lg-3"
              :to="{ name: 'facility', params: { company_id: item.id } }"
              label="Показать список объектов"
              color="primary"
            />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { useCompanyStore } from "stores/company";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { useAuthStore } from "stores/auth-store";
import { ref } from "vue";

export default {
  name: "EditCompany",
  setup() {
    const company = useCompanyStore();
    const route = useRoute();
    const router = useRouter();
    const user = useAuthStore();
    const item = ref({});
    const companyName = ref("");

    return {
      company,
      route,
      router,
      user,
      item,
      companyName,
    };
  },
  created() {
    this.loadCompanyData();
  },
  methods: {
    async loadCompanyData() {
      try {
        if (!this.route.params.id) {
          this.redirectToCompanies();
          return;
        }

        this.company.id = this.route.params.id;

        if (this.company.items.length < 1) {
          this.redirectToCompanies();
          return;
        }

        const companyItem = this.company.getItem(this.company.id);
        if (!companyItem) {
          this.redirectToCompanies();
          return;
        }

        this.item = {
          ...companyItem,
          isActive: Boolean(companyItem.isActive),
        };

        this.companyName = this.item.name || "";
      } catch (e) {
        this.redirectToCompanies();
      }
    },
    redirectToCompanies() {
      this.router.push({ name: "companies" });
    },
    async onSubmit() {
      if (!this.validateForm()) {
        return false;
      }

      try {
        this.item.isActive = this.item.isActive ? 1 : 0;

        const { data } = await api.put(
          process.env.API_UPDATE_COMPANY,
          this.item
        );
        if (data.status == 200) {
          this.item = {
            ...data.content,
            isActive: Boolean(data.content.isActive),
          };
          this.$q.notify({
            type: "positive",
            message: "Данные компании обновлены",
          });
          return true;
        }
      } catch (error) {
        console.error("Error updating company:", error);
      }
      return false;
    },
    validateForm() {
      if (!this.item.name || this.item.name.length < 1) {
        this.$q.notify({
          type: "negative",
          message: "Введите название компании",
        });
        return false;
      }

      if (!this.item.inn || this.item.inn.length < 1) {
        this.$q.notify({ type: "negative", message: "Введите ИНН компании" });
        return false;
      }

      if (!this.item.login || this.item.login.length < 1) {
        this.$q.notify({
          type: "negative",
          message: "Введите Логин для входы компании",
        });
        return false;
      }

      if (!this.item.password || this.item.password.length < 6) {
        this.$q.notify({
          type: "negative",
          message: "Введите Пароль для входы компании, не менее 6 символов",
        });
        return false;
      }

      return true;
    },
  },
};
</script>

<style scoped></style>
