import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useCompanyStore = defineStore("company-store", {
  state: () => ({
    baseUrl: "/company/all",
    updateUrl: "/company/update",
    id: "",
    indexPageColumns: [
      {
        name: "id",
        align: "center",
        label: "Номер компании",
        field: "id",
        sortable: true,
      },
      {
        name: "name",
        align: "center",
        label: "Название компании",
        field: "name",
        sortable: true,
      },
      {
        name: "inn",
        align: "center",
        label: "ИНН",
        field: "inn",
        sortable: true,
      },
      {
        name: "isActive",
        align: "center",
        label: "Статус",
        field: "isActive",
        format: (val) => (val == 1 ? "Активный" : "Неактивный"),
        sortable: true,
      },
      { name: "action", align: "center", label: "Действия", field: "action" },
    ],
    items: [],
    item: {},
  }),
  getters: {
    getItems(state) {
      return state.items;
    },
    getColumns(state) {
      return state.indexPageColumns;
    },
    getItem(state) {
      return (id) => state.items.find((item) => item.id == id);
    },
  },
  actions: {
    init: function () {
      if (this.items.length < 1) {
        this.load();
      }
    },
    loadId: async function (id) {
      return await api
        .get(process.env.API_GET_COMPANY_ID + id)
        .then(({ data }) => {
          // this.item = data.content
          return data.content;
        });
    },
    load: function () {
      const response = api
        .get(process.env.API_GET_COMPANY_ALL)
        .then(({ data }) => {
          this.items = data.content;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
