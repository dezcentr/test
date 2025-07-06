import { defineStore } from "pinia";

export const useLogsDate = defineStore("", {
  state: () => ({
    indexPageColumns: [
      {
        name: "date",
        align: "center",
        label: "Дата",
        field: "date",
        format: (val) => val.replace(/-/g, "."),
        sortable: true,
      },
      { name: "action", align: "center", label: "Действие" },
      { name: "report", align: "center", label: "Отчет" },
      {
        name: "damagedCount",
        align: "center",
        label: "Повреждено",
        style: "width: 5%;",
        field: "damagedCount",
        sortable: true,
      },
      {
        name: "unavailableCount",
        align: "center",
        label: "Недоступно",
        style: "width: 5%;",
        field: "unavailableCount",
        sortable: true,
      },
    ],
    items: [],
  }),
  getters: {
    getColumns(state) {
      return state.indexPageColumns;
    },
  },
});
