<template>
  <q-page padding>
    <q-btn v-if="['admin'].includes(user.getRole)" :to="{ name: 'companies' }"
      >назад</q-btn
    >
    <h5>Добавление новой компании</h5>

    <q-card class="q-pa-md">
      <q-form ref="newForm" id="newForm">
        <q-input
          class="q-ma-md"
          filled
          v-model="company.name"
          type="text"
          label="Название*"
          :rules="[
            (val) => (val && val.length > 0) || 'Название компании',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="company.inn"
          label="ИНН*"
          type="number"
          mask="##########"
          :rules="[
            (val) => (val && val.length > 0) || 'Введите ИНН',
            (val) => val.length < 12 || 'Не более 12 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="company.login"
          type="text"
          label="Логин*"
          :rules="[
            (val) => (val && val.length > 0) || 'Введите Логин',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="company.password"
          type="text"
          label="Пароль*"
          :rules="[
            (val) => val.length >= 6 || 'Пароль не менее 6 символов',
            (val) => val.length < 100 || 'Не более 100 символов',
          ]"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="company.manager"
          type="text"
          label="Менеджер"
        />
        <q-input
          class="q-ma-md"
          filled
          v-model="company.note"
          label="Примечание"
          type="textarea"
          :rules="[(val) => val.length < 10000 || 'Не более 10 000 символов']"
        />
        <q-btn @click="onSubmit" label="Добавить компанию" color="primary" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { api } from "boot/axios";
import { useAuthStore } from "stores/auth-store";
import { useCompanyStore } from "stores/company";

export default {
  name: "NewCompany",
  data() {
    return {
      user: useAuthStore(),
      companyStore: useCompanyStore(),
      newForm: ref(null),
      company: {
        name: "",
        inn: "",
        login: "",
        password: "",
        note: "",
      },
    };
  },
  methods: {
    onSubmit: function () {
      if (!this.validateForm()) {
        return false;
      }
      const result = api
        .post(process.env.API_NEW_COMPANY, this.company)
        .then(({ data }) => {
          if (data.status == 200) {
            this.$q.notify({ type: "positive", message: "Компания добавлена" });
            this.companyStore.load();
            this.$router.push({ name: "companies" });
          }
        });
    },

    validateForm: function () {
      if (this.company.name.length < 1) {
        this.$q.notify({
          type: "negative",
          message: "Введите название компании",
        });
        return false;
      }

      if (this.company.inn.length < 1) {
        this.$q.notify({ type: "negative", message: "Введите ИНН компании" });
        return false;
      }

      if (this.company.login.length < 1) {
        this.$q.notify({
          type: "negative",
          message: "Введите Логин для входы компании",
        });
        return false;
      }

      if (this.company.password.length < 6) {
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
