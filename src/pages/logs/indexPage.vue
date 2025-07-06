<template>
  <q-page padding>
    <q-btn
      v-if="['admin', 'company'].includes(authUser.getRole)"
      :to="{ name: 'facility', params: { company_id: ctx } }"
      >назад
    </q-btn>

    <q-btn
      v-if="['group'].includes(authUser.getRole)"
      :to="{ name: 'group-facility', params: { group_id: ctx } }"
      >назад
    </q-btn>

    <h5>{{ companyName }} - {{ facilityName }} - {{ workName }}</h5>

    <charts-bar :labels="barData.labels" :data="barData.data" />

    <q-table
      ref="tblLogs"
      class="logs-table"
      table-header-class="bg-blue-grey-4 text-bold"
      flat
      binary-state-sort
      :rows="logsItems"
      :columns="logsStore.getColumns"
      :filter="filter"
      :filter-method="customFilter"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      hide-bottom
    >
      <template v-slot:top>
        <div style="width: 100%" class="row">
          <div class="col-9">
            <q-btn
              v-for="item in workType"
              :key="item.id"
              :push="pushButton == item.id"
              :flat="pushButton != item.id"
              @click="
                onLoadLogs(item.id);
                onSetWork(item);
                this.facilityStore.loadDiagramDataByID(
                  this.facility.id,
                  item.id
                );
              "
            >
              {{ item.name }}
            </q-btn>
          </div>
          <div class="col-3">
            <q-input
              outlined
              dense
              debounce="400"
              color="primary"
              type="search"
              label="Поиск"
              v-model="search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props" style="width: 1%; white-space: nowrap">
          <q-btn
            :to="{
              name: 'log-view',
              params: {
                facility_id: facilityID,
                work_id: workId,
                date: props.row.date,
                ctx,
              },
            }"
            label="Подробнее"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-report="props">
        <q-td :props="props" style="width: 1%; white-space: nowrap">
          <q-btn @click="loadFilePDF(props.row.date)" label="Скачать отчет" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import { useFacilityStore } from "stores/facility";
import { useLogsDate } from "stores/logsDate-store";
import { useCompanyStore } from "stores/company";
import { useAuthStore } from "stores/auth-store";
import { ref } from "vue";
import { useWorkTypeStore } from "stores/workType";
import axios from "axios";
import ChartsBar from "components/charts/Bar.vue";

export default {
  name: "indexLogs",
  components: { ChartsBar },
  data() {
    const router = useRoute();
    const facilityID = router.params.facility_id ?? 0;
    const ctx = router.params.ctx;

    const authUser = useAuthStore();
    const logsStore = useLogsDate();
    const companyStore = useCompanyStore();
    const workStore = useWorkTypeStore();
    const workId = 1;

    return {
      pagination: ref({
        rowsPerPage: 0,
      }),
      search: "",
      ctx,
      facilityName: "",
      facilityID,
      facility: {},
      facilityStore: useFacilityStore(),
      workType: [],
      workName: "",
      logsItems: [],
      workId,
      workStore,
      company: {},
      logsStore,
      authUser,
      companyName: "",
      companyId: 1,
      pushButton: ref(0),
      dataReady: false,
    };
  },
  mounted() {
    // this.onRequest()
    const response = api
      .get(process.env.API_GET_LOGS_WORKS_TYPE)
      .then(({ data }) => {
        this.workType = data.content;
        this.workStore.items = data.content;
        this.onLoadLogs(this.workType[0].id);
      });
    this.init();
  },
  computed: {
    filter() {
      return {
        search: this.search,
      };
    },
    barData() {
      const months = [
        "",
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ];
      const columns = this.facilityStore.getDiagramData;
      const labels = columns.map((col) => months[col.numberMonth ?? 0]);
      const data = columns.map((col) => col.damage);

      return {
        labels,
        data,
      };
    },
  },

  methods: {
    loadFile: function (date) {
      const request = axios
        .get(
          process.env.BASE_URL_API +
            "logs/download-report?workid=" +
            this.workId +
            "&facilityId=" +
            this.facilityID +
            "&date=" +
            date,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: localStorage.getItem(
                process.env.KEY_AUTH_TOKEN_NAME
              ),
            },
          }
        )
        .then((response) => {
          const type = response.headers["content-type"];
          let filename =
            this.companyName +
            "-" +
            this.facilityName +
            "-" +
            this.workName +
            "-" +
            date +
            ".csv";
          let url = window.URL.createObjectURL(
            new Blob([response.data], { type: type })
          );
          let link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    },
    loadFilePDF: function (date) {
      let isCsv;
      if (this.workId === 1) {
        isCsv = false;
      } else {
        isCsv = true;
      }
      const fileType = isCsv ? "text/csv;charset=utf-8;" : "application/pdf";
      const fileExtension = isCsv ? "csv" : "pdf";

      axios
        .get(
          process.env.BASE_URL_API +
            "logs/download-report?workid=" +
            this.workId +
            "&facilityId=" +
            this.facilityID +
            "&date=" +
            date,
          {
            responseType: "blob",
            headers: {
              Authorization: localStorage.getItem(
                process.env.KEY_AUTH_TOKEN_NAME
              ),
            },
          }
        )
        .then((response) => {
          const type = response.headers["content-type"] || fileType;
          const filename = `${this.companyName}-${this.facilityName}-${this.workName}-${date}.${fileExtension}`;

          if (isCsv) {
            const reader = new FileReader();
            reader.onload = () => {
              const csvContent = reader.result;
              const blob = new Blob([csvContent], { type });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", filename);
              document.body.appendChild(link);
              link.click();
              link.remove();
            };
            reader.readAsText(response.data, "utf-8");
          } else {
            const url = window.URL.createObjectURL(
              new Blob([response.data], { type })
            );
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
          }
        })
        .catch((error) => {
          console.error("Ошибка загрузки файла:", error);
        });
    },
    customFilter(rows, terms, cols, getCellValue) {
      let lowerSearch = terms.search ? terms.search.toLowerCase() : "";

      return rows.filter((row, i) => {
        let ans = true;
        //   let lowerSearch = "";
        //If search term exists, convert to lower case and see which rows contain it
        if (lowerSearch !== "") {
          ans = false;
          //Get the values
          let s1_values = Object.values(row);

          //Convert to lowercase
          let s1_lower = s1_values.map((x) => x.toString().toLowerCase());

          for (let val = 0; val < s1_lower.length; val++) {
            if (s1_lower[val].includes(lowerSearch)) {
              ans = true;
              break;
            }
          }
        }
        return ans;
      });
    },
    onSetWork: function (work) {
      this.workName = work.name;
      this.workId = work.id;
    },
    onLoadLogs: function (workID) {
      if (!workID) {
        return false;
      }
      this.pushButton = workID;
      api
        .post(process.env.API_GET_LOGS_FACILITY_WORK, {
          facilityId: this.facilityID,
          workId: workID,
        })
        .then(({ data }) => {
          if (!data.content.length) {
            // this.$q.notify({type: 'negative', message: 'Список пуст!'})
          } else {
            this.$q.notify({ type: "positive", message: "Список загружен" });
          }
          this.logsItems = data.content.map((item) => {
            if (item.damagedCount === null) {
              item.damagedCount = 0;
            }
            if (item.unavailableCount === null) {
              item.unavailableCount = 0;
            }
            return item;
          });
          this.workName =
            this.workType.find((item) => item.id == workID).name ?? "";
        })
        .catch((error) => {
          // this.$q.notify({type: 'negative', message: 'Ошибка'})
        });
    },
    getWorkType() {
      // Получение списка видов зицинсекции?
      const response = api
        .post(process.env.API_GET_LOGS_WORKS_TYPE, {})
        .then(({ data }) => {
          this.workType = data.content;
        })
        .catch();
    },

    init: function () {
      this.loadFacility(this.facilityID);
    },
    loadFacility(id) {
      api.get(process.env.API_GET_FACILITY_ID + id).then(({ data }) => {
        this.facility = data.content;
        this.facilityName = this.facility.name;

        this.facilityStore.loadDiagramDataByID(this.facility.id, 1);
        this.facilityStore.load(this.facility.companyId);
        this.companyId = this.facility.companyId;

        api
          .get(process.env.API_GET_COMPANY_ID + this.facility.companyId)
          .then(({ data }) => {
            this.companyName = data.content.name;
            this.dataReady = true;
          });
      });
    },
  },
};
</script>

<style lang="sass">
.logs-table
  thead tr:first-child th:first-child
    width: 10%
</style>
