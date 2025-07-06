<template>
  <q-page padding>
    <q-btn :to="{ name: 'log-index', params: { facility_id: facilityID, ctx } }"
      >назад</q-btn
    >
    <h5>
      {{ companyName }} - {{ facility.name }} - {{ workName }} -
      {{ date.replace(/-/g, ".") }}
    </h5>
    <div v-if="workName.toLowerCase() === 'дератизация'">
      <charts-doughnut
        :background-color="doughnutData.backgroundColor"
        :labels="doughnutData.labels"
        :data="doughnutData.data"
      />
      <div class="generalization-block">
        <p class="generalization">
          — В приманочных контейнерах установлены механизмы дозирования
          родентицидной приманки. В первоначально снаряженном механизме
          дозирования приманки для контейнера «М» заложено 40гр родентицидной
          приманки, для контейнера «К» - заложено 60гр родентицидной приманки.
        </p>
        <template v-if="containerNotAvailableText">
          <p class="generalization">— {{ containerNotAvailableText }}</p>
        </template>
        <p class="generalization">
          — Анализируя данные, полученные после проведения дератизационных
          мероприятий, можно выделить следующее:
        </p>
        <p class="generalization">
          — Активность популяции грызунов в указанный период демонстрирует
          {{ eatenBaitText }}
        </p>
        <p class="generalization">
          — В целом по предприятию отмечается полное съедение приманки в
          {{ eatenBait }}% случаев, погрызы приманки обнаружены в
          {{ baitBites }}% случаев.
        </p>
        <p class="generalization">
          — Из них динамика вновь обнаруженных повреждений приманки: – полное
          съедение приманки в {{ eatenBaitInDynamics }}% случаев, погрызы
          приманки {{ baitBitesInDynamics }}% случаев.
        </p>
        <p class="generalization">
          — На территории участка обнаружено и утилизировано павших грызунов -
          {{ numberDeadRodents }}.
        </p>
        <p>Мониторинг активности будет продолжен.</p>
      </div>
    </div>

    <q-table
      ref="tblLogs"
      class="logs-table"
      table-header-class="bg-blue-grey-4 text-bold"
      flat
      binary-state-sort
      :rows="items"
      :columns="logsStore.getColumns"
      :filter="filter"
      :filter-method="customFilter"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      hide-bottom
      :visible-columns="showColumns()"
    >
      <template v-slot:body="props">
        <q-tr :props="props" :class="getColor(props.row.controlNumStatus)">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="controlNum" :props="props">
            {{ props.row.controlNum }}
          </q-td>
          <q-td key="date" :props="props">
            {{ props.row.date }}
          </q-td>
          <q-td key="controlNumStatus" :props="props">
            {{ props.row.controlNumStatus }}
          </q-td>
          <q-td class="td-processName" key="processName" :props="props">
            {{ props.row.processName }}
          </q-td>
          <q-td key="drugsName" :props="props">
            {{ props.row.drugsName }}
          </q-td>
          <q-td key="toxicAgent" :props="props">
            {{ props.row.drugsName }}
          </q-td>
          <q-td key="countDrugs" :props="props">
            {{ props.row.countDrugs }}
          </q-td>
          <q-td key="countDrugs_deratization" :props="props">
            {{ props.row.countDrugs }}
          </q-td>
          <q-td key="countDrugs_istrativeDeratization" :props="props">
            {{ props.row.countDrugs }}
          </q-td>
          <q-td key="countInsects" :props="props">
            {{ props.row.countInsects }}
          </q-td>
          <q-td key="process_name" :props="props">
            {{ props.row.countInsects }}
          </q-td>
          <q-td key="count_insects" :props="props">
            {{ props.row.countInsects }}
          </q-td>
          <q-td key="investigatedArea" :props="props">
            {{ props.row.investigatedArea }}
          </q-td>
          <q-td key="countTicks" :props="props">
            {{ props.row.countTicks }}
          </q-td>
          <q-td key="treatedArea" :props="props">
            {{ props.row.treatedArea }}
          </q-td>
          <q-td key="countControlPoint" :props="props">
            {{ props.row.countControlPoint }}
          </q-td>
          <q-td key="facilityName" :props="props">
            {{ props.row.facilityName }}
          </q-td>
        </q-tr>
      </template>

      <template v-slot:top>
        <div style="width: 100%" class="row">
          <div class="col-9"></div>
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
    </q-table>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import { useLogsStore } from "stores/logs-store";
import { useFacilityStore } from "stores/facility";
import { ref } from "vue";
import { useWorkTypeStore } from "stores/workType";
import ChartsDoughnut from "components/charts/Doughnut.vue";

export default {
  name: "ViewLogs",
  components: { ChartsDoughnut },
  data: function () {
    const router = useRoute();

    const facilityID = router.params.facility_id ?? 0;
    const ctx = router.params.ctx ?? 0;
    const workID = router.params.work_id ?? 0;
    const date = router.params.date ?? "";
    const logsStore = useLogsStore();
    const facilityStore = useFacilityStore();

    return {
      pagination: ref({
        rowsPerPage: 0,
      }),
      search: "",
      facilityID,
      ctx,
      workID,
      workName: "",
      date,
      items: [],
      companyName: "",
      logsStore,
      facility: {},
      facilityStore,
      containerNotAvailableText: "",
      eatenBaitText: "",
      eatenBait: 0,
      baitBites: 0,
      eatenBaitInDynamics: 0,
      baitBitesInDynamics: 0,
      numberDeadRodents: 0,
    };
  },

  mounted() {
    this.init();
    this.loadWorkName();
    this.loadLogs();
    this.loadGeneralizationInfo();
  },

  computed: {
    filter() {
      return {
        search: this.search,
      };
    },
    doughnutData() {
      const addColors = ["#4e5be5", "#E46651", "#00D8FF", "#DD1B16"];
      const labels = [
        "+",
        "Погрыз-25%",
        "Погрыз-50%",
        "Погрыз-75%",
        "ПрОт",
        "Гр",
        "Гр/Присут",
        "МехПовр",
        "КонтЗам",
        "КонтНед",
        "Конт/Повр",
        "СрокГодн",
        "Гр/Отсут",
        "КонтОт/Повр",
        "МехОт/Повр",
        "",
        "`+`",
        "`Погрыз-25%`",
        "`Погрыз-50%`",
        "`Погрыз-75%`",
        "`ПрОт`",
        "`Гр`",
        "`Гр/присут`",
        "`МехПовр`",
        "`КонтЗам`",
        "`КонтНед`",
        "`Конт/Повр`",
        "`СрокГодн`",
        "`Гр/Отсут`",
        "`КонтОт/Повр`",
        "`МехОт/Повр`",
        "",
      ];
      const labelsStore = [
        ...new Set(this.items.map((item) => item.controlNumStatus)),
      ];

      for (let i = 0; i < labels.length; i++) {
        const index = labelsStore.indexOf(labels[i]);
        if (index === -1) {
          labels.splice(i, 1);
          i--;
        }
      }

      const backgroundColor = labels.map(
        (label) =>
          this.getDoughnutColor(label) ?? addColors.splice(0, 1)[0] ?? "#000000"
      );
      const data = labels.map(
        (label) =>
          this.items.filter((item) => item.controlNumStatus === label).length
      );

      const indentCounts = labels.length - backgroundColor.length;
      indentCounts && backgroundColor.push(...addColors.slice(0, indentCounts));

      return {
        backgroundColor,
        labels,
        data,
      };
    },
  },
  methods: {
    showColumns: function () {
      console.log(this.workName.toString().toLowerCase());
      if (this.workName.toString().toLowerCase() === "дератизация") {
        return [
          "controlNum",
          "date",
          "processName",
          "controlNumStatus",
          "toxicAgent",
          "countDrugs_deratization",
          "facilityName",
        ];
      } else if (this.workName.toString().toLowerCase() === "дезинсекция") {
        return [
          "controlNum",
          "date",
          "drugsName",
          "countDrugs",
          "countInsects",
        ];
      } else if (
        this.workName.toString().toLowerCase() ===
        "энтомологическое обследование"
      ) {
        return ["controlNum", "date", "investigatedArea", "countTicks"];
      } else if (
        this.workName.toString().toLowerCase() === "акарицидная обработка"
      ) {
        return ["controlNum", "date", "drugsName", "countDrugs", "treatedArea"];
      } else if (
        this.workName.toString().toLowerCase() === "истребительная дератизация"
      ) {
        return [
          "controlNum",
          "date",
          "drugsName",
          "countDrugs_istrativeDeratization",
          "countControlPoint",
        ];
      } else if (
        this.workName.toString().toLowerCase() === "феромонный мониторинг"
      ) {
        return [
          "controlNum",
          "date",
          "process_name",
          "count_insects",
          "facilityName",
        ];
      }
    },
    getDoughnutColor(status) {
      const text = status.toString().toLowerCase();
      console.log(text);
      if (text.indexOf("+") !== -1) {
        return "#92d050";
      }

      if (text.indexOf("25%") !== -1) {
        return "#ffc000";
      }

      if (text.indexOf("50%") !== -1) {
        return "#ff5353";
      }

      if (text.indexOf("75%") !== -1) {
        return "#c73627";
      }

      if (text.indexOf("прот") !== -1) {
        return "#ff0000";
      }

      if (text.indexOf("гр/отсут") !== -1) {
        return "#92d050";
      }

      if (text.indexOf("гр") !== -1) {
        return "#db5749";
      }

      if (text.includes("конт/повр")) {
        return "#95b3d7";
      }

      if (text.includes("конт/повр")) {
        return "#95b3d7";
      }

      if (text.includes("контзам")) {
        return "#cc0066";
      }

      if (text.includes("мехповр")) {
        return "#da7e46";
      }

      if (text.includes("контнед")) {
        return "#d9d9d9";
      }

      if (text.includes("срокгодн")) {
        return "#d9d9d9";
      }
      if (text.includes("контот/повр")) {
        return "##95b3d7";
      }
      if (text.includes("мехот/повр")) {
        return "#d9d9d9";
      }

      return null;
    },
    getColor: function (text) {
      try {
        text = text.toString().toLowerCase();
        const work = this.workName.toLowerCase();
        if (work === "феромонный мониторинг") {
          if (text.indexOf("0") !== -1) {
            return "green";
          } else {
            return "prot";
          }
        }
        if (this.workName.toString().toLowerCase() !== "дератизация") {
          return "";
        }

        if (text.indexOf("+") !== -1) {
          return "green";
        }

        if (text.indexOf("25%") !== -1) {
          return "pog-25";
        }

        if (text.indexOf("50%") !== -1) {
          return "pog-50";
        }

        if (text.indexOf("75%") !== -1) {
          return "pog-75";
        }

        if (text.indexOf("прот") !== -1) {
          return "prot";
        }

        if (text.indexOf("срокгодн") !== -1) {
          return "expiration-date";
        }

        if (text.indexOf("гр/отсут") !== -1) {
          return "green";
        }

        if (text.indexOf("гр") !== -1) {
          return "gr";
        }

        if (text.indexOf("конт/повр") !== -1) {
          return "kontpowr";
        }

        if (text.indexOf("контповр") !== -1) {
          return "kontpowr";
        }

        if (text.indexOf("контотповр") !== -1) {
          return "kontpowr";
        }

        if (text.indexOf("мехповр") !== -1) {
          return "mehpowr";
        }

        if (text.indexOf("мехотповр") !== -1) {
          return "mehpowr";
        }

        if (text.indexOf("контзам") !== -1) {
          return "kontzam";
        }

        if (text.indexOf("контнед") !== -1) {
          return "kontned";
        }

        return "";
      } catch {
        return "";
      }
    },
    loadLogs() {
      const response = api
        .post(process.env.API_GET_LOG_BY_DATE, {
          date: this.date,
          workId: this.workID,
          facilityId: this.facilityID,
        })
        .then(({ data }) => {
          this.items = data.content.map((row) => ({
            ...row,
            controlNum: parseInt(row.controlNum, 10),
          }));
        })
        .catch();
    },
    loadGeneralizationInfo() {
      const response = api
        .post(process.env.API_GET_LOG_BY_DATE_WORK, {
          date: this.date,
          workId: this.workID,
          facilityId: this.facilityID,
        })
        .then(({ data }) => {
          console.log(data);
          const content = data.content || {};
          this.containerNotAvailableText =
            content.containerNotAvailableText || "";
          this.eatenBaitText = content.eatenBaitText || "";
          this.eatenBait = parseFloat(content.eatenBait) || 0; // Приведение к числу
          this.baitBites = parseFloat(content.baitBites) || 0; // Приведение к числу
          this.eatenBaitInDynamics =
            parseFloat(content.eatenBaitInDynamics) || 0; // Приведение к числу
          this.baitBitesInDynamics =
            parseFloat(content.baitBitesInDynamics) || 0; // Приведение к числу
          this.numberDeadRodents = parseInt(content.numberDeadRodents, 10) || 0;
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
          let s1_lower = s1_values.map((x) =>
            x !== null ? x.toString().toLowerCase() : x
          );

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

    loadCompanyName(companyId) {
      api.get(process.env.API_GET_COMPANY_ID + companyId).then(({ data }) => {
        this.companyName = data.content.name;
      });
    },

    async loadWorkName() {
      await api.get(process.env.API_GET_LOGS_WORKS_TYPE).then(({ data }) => {
        let workType = data.content;
        this.workName = workType.find((item) => item.id == this.workID).name;
      });
    },

    init: function () {
      this.facilityStore.loadID(this.facilityID).then((value) => {
        this.loadCompanyName(value.companyId);
        this.facility = value;
      });
    },
  },
};
</script>

<style scoped>
.green {
  background-color: #92d050;
}

.generalization {
  text-align: justify;
  text-indent: 1.25cm;
  margin: 0.5vh;
}

@media (min-width: 1024px) {
  .generalization-block {
    display: flex;
    margin: 0 auto;
    margin-top: 5vh;
    margin-bottom: 3vh;
    width: 75vw;
    flex-direction: column;
  }
}

@media (max-width: 1023px) {
  .generalization-block {
    display: flex;
    margin: 0 auto;
    margin-top: 4vh;
    margin-bottom: 4vh;
    width: 90vw;
    flex-direction: column;
  }
}

p.generalization br::after {
  content: ""; /* Пустое содержимое, чтобы создать эффект отступа */
  display: inline-block; /* Сделать элемент блочным */
  width: 2em; /* Отступ слева */
}

.pog-25 {
  background-color: #ffc000;
}

.pog-50 {
  background-color: #ff5353;
}

.pog-75 {
  background-color: #c73627;
}

.prot {
  background-color: #ff0000;
}

.expiration-date {
  background-color: #d9d9d9;
}

.gr {
  background-color: #db5749;
}

.kontpowr {
  background-color: #95b3d7;
}

.mehpowr {
  background-color: #da7e46;
}

.kontzam {
  background-color: #cc0066;
}

.kontned {
  background-color: #d9d9d9;
}

.red {
  background-color: #f4cccc;
}

.td-processName {
  max-width: 25%;
}

table td {
  text-wrap: wrap;
}
</style>
