import { defineStore } from "pinia";
import { api } from "boot/axios";
import { format } from "quasar";

export const useLogsStore = defineStore("logs-store", {
  state: () => ({
    indexPageColumns: [
      { name: "id", align: "center", label: "ID", field: "id", sortable: true },
      {
        name: "controlNum",
        align: "center",
        label: "Номер точки контроля",
        field: "controlNum",
        sortable: true,
      },
      {
        name: "date",
        align: "center",
        label: "Дата",
        field: "date",
        format: (val) => val.replace(/-/g, "."),
        sortable: true,
      },
      {
        name: "controlNumStatus",
        align: "center",
        label: "Статус точки контроля",
        field: "controlNumStatus",
        sortable: true,
      },
      {
        name: "processName",
        align: "center",
        label: "Применяемое действие",
        field: "processName",
        sortable: true,
      },
      {
        name: "drugsName",
        align: "center",
        label: "Наименование препарата",
        field: "drugsName",
        sortable: true,
      },
      {
        name: "toxicAgent",
        align: "center",
        label: "Токсический агент (действующее вещество)",
        field: "drugsName",
        sortable: true,
      },
      {
        name: "countDrugs_istrativeDeratization",
        align: "center",
        label: "Количество препарата (гр)",
        field: "countDrugs",
        sortable: true,
      },
      {
        name: "countDrugs",
        align: "center",
        label: "Количество препарата (мл)",
        field: "countDrugs",
        sortable: true,
      },
      {
        name: "countDrugs_deratization",
        align: "center",
        label: "Количество препарата",
        field: "countDrugs",
        sortable: true,
      },
      {
        name: "countInsects",
        align: "center",
        label: "Количество обнаруженных насекомых (ед)",
        field: "countInsects",
        sortable: true,
      },
      {
        name: "process_name",
        align: "center",
        label: "Наименование вредителя",
        field: "process_name",
        sortable: true,
      },
      {
        name: "count_insects",
        align: "center",
        label: "Количество обнаруженных особей (ед)",
        field: "count_insects",
        sortable: true,
      },
      {
        name: "investigatedArea",
        align: "center",
        label: "Обследованная территория (Фл/км)",
        field: "investigatedArea",
        sortable: true,
      },
      {
        name: "countTicks",
        align: "center",
        label: "Количество обнаруженных клещей (ед)",
        field: "countTicks",
        sortable: true,
      },
      {
        name: "treatedArea",
        align: "center",
        label: "Обрабатываемая площадь (Га)",
        field: "treatedArea",
        sortable: true,
      },
      {
        name: "countControlPoint",
        align: "center",
        label: "Количество точек контроля (ед)",
        field: "countControlPoint",
        sortable: true,
      },
      {
        name: "facilityName",
        align: "center",
        label: "Наименование объекта",
        field: "facilityName",
        sortable: true,
      },

      //   {name: 'action', align: 'center', label: 'Действие', field: 'name'},
    ],
    items: [],
  }),

  getters: {
    getColumns(state) {
      return state.indexPageColumns;
    },
  },
  actions: {
    load: function (facilityID) {
      const response = api
        .get(process.env.API_)
        .then(({ data }) => {
          this.items = data.content;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
