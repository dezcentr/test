import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useFacilityStore = defineStore("facility-store", {
  state: () => ({
    baseUrl: "/company/all",
    updateUrl: "/company/update",
    indexPageColumns: [
      {
        name: "id",
        align: "center",
        label: "Номер склада",
        field: "id",
        sortable: true,
      },
      {
        name: "name",
        align: "center",
        label: "Название объекта",
        field: "name",
        sortable: true,
      },
      {
        name: "address",
        align: "center",
        label: "Адрес",
        field: "address",
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
      {
        name: "uuid",
        align: "center",
        label: "UUID объекта",
        field: "uuid",
        sortable: true,
      },
      { name: "action", align: "center", label: "Действия", field: "action" },
      {
        name: "damagedCount",
        align: "center",
        label: "Повреждено",
        field: "damagedCount",
        sortable: true,
      },
      {
        name: "unavailableCount",
        align: "center",
        label: "Недоступно",
        field: "unavailableCount",
        sortable: true,
      },
    ],
    items: [],
    item: [],
    diagramData: [],
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
    getDiagramData(state) {
      return state.diagramData;
    },
  },

  actions: {
    loadUUID: function (uuid) {
      const response = api
        .get(process.env.API_GET_FACILITY_UUID + uuid)
        .then(({ data }) => {
          // if(data.status == 200){
          this.item = data.content;
          // }
        });
    },
    loadID: async function (id) {
      return await api
        .get(process.env.API_GET_FACILITY_ID + id)
        .then(({ data }) => {
          return data.content;
        });
    },
    loadDiagramDataByID: async function (id, workId) {
      return await api
        .get(
          process.env.API_GET_DATA_FOR_DIAGRAM_FACILITY_ID +
            "?id=" +
            id +
            "&workId=" +
            workId
        )
        .then(({ data }) => {
          this.diagramData = data.content.content.reverse();
        });
    },
    load: function (companyID) {
      const response = api
        .get(process.env.API_GET_FACILITY + companyID)
        .then(({ data }) => {
          this.items = data.content.map((item) => {
            if (item.damagedCount === null) {
              item.damagedCount = 0;
            }
            if (item.unavailableCount === null) {
              item.unavailableCount = 0;
            }
            return item;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
