import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useDrugStore = defineStore("drug-store", {
  state: () => ({
    id: "",
    indexPageColumns: [
      {
        name: "id",
        align: "center",
        label: "Номер",
        field: "id",
        sortable: true,
      },
      {
        name: "name",
        align: "center",
        label: "Название",
        field: "name",
        sortable: true,
      },
      {
        name: "ingredients",
        align: "center",
        label: "Действующие вещества",
        field: "ingredients",
        sortable: true,
      },
      { name: "action", align: "center", label: "Действия", field: "action" },
      {
        name: "position",
        align: "center",
        label: "Позиция",
        field: "position",
      },
      {
        name: "idGroupDrugs",
        align: "center",
        label: "Группа препарата",
        field: "idGroupDrugs",
      },
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
    loadId: function (id) {
      api.get(process.env.API_GET_DRUGS_ID + id).then(({ data }) => {
        this.item = data.content;
      });
      return this.item;
    },
    load: function () {
      const response = api
        .get(process.env.API_GET_DRUGS_ALL)
        .then(({ data }) => {
          this.items = data.content;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    delete: function (id) {
      const response = api
        .delete(process.env.API_DRUGS_DELETE + id)
        .then(({ data }) => {
          this.load();
        });

      return true;
    },
  },
});
