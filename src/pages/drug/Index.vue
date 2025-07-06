<template>
  <q-page padding>
    <q-btn v-if="['admin'].includes(user.getRole)" :to="{ name: 'companies' }"
      >назад</q-btn
    >
    <h5>Список препаратов</h5>
    <q-table
      ref="tblFacility"
      class="facility-table"
      table-header-class="bg-blue-grey-4 text-bold"
      wrap-cells
      flat
      binary-state-sort
      @request="onRequest"
      :rows="drugsStore.items"
      :columns="modifiedColumns"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      hide-bottom
      row-key="id"
      color="amber"
      :filter="filter"
      :filter-method="customFilter"
    >
      <template v-slot:top>
        <div style="width: 100%" class="row">
          <div class="col-9">
            <q-btn
              v-if="['admin'].includes(user.getRole)"
              :to="{ name: 'drugs-new' }"
              >Добавить препарат</q-btn
            >
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
            :to="{ name: 'drugs-update', params: { drug_id: props.row.id } }"
            label="Подробнее"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { useDrugStore } from "stores/drug-store";
import { ref } from "vue";
import { useAuthStore } from "stores/auth-store";
import { api } from "boot/axios";

export default {
  name: "DrugIndex",
  data() {
    return {
      search: "",
      pagination: ref({
        rowsPerPage: 0,
      }),
      drugsStore: useDrugStore(),
      user: useAuthStore(),
      listItems: [],
      drugGroups: [], // Добавляем массив для хранения групп препаратов
    };
  },
  methods: {
    customFilter(rows, terms, cols, getCellValue) {
      let lowerSearch = terms.search ? terms.search.toLowerCase() : "";

      return rows.filter((row, i) => {
        let ans = true;
        if (lowerSearch !== "") {
          ans = false;
          let s1_values = Object.values(row);
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
    onRequest(props) {
      this.drugsStore.load();
    },
    // Метод для загрузки групп препаратов
    async loadDrugGroups() {
      try {
        const response = await api.get(process.env.API_GET_ALL_GROUP_DRUG);
        if (response.data.status === 200) {
          this.drugGroups = response.data.content;
        }
      } catch (error) {
        console.error("Ошибка при загрузке групп препаратов:", error);
      }
    },
    // Метод для получения названия группы по ID
    getGroupNameById(groupId) {
      const group = this.drugGroups.find((g) => g.id === groupId);
      return group ? group.name : groupId; // Возвращаем название или ID, если группа не найдена
    },
    // Преобразование position в число перед отправкой
    convertPositionToNumber(position) {
      return parseInt(position, 10);
    },
  },
  async mounted() {
    await this.loadDrugGroups(); // Загружаем группы препаратов
    this.onRequest();
  },
  computed: {
    filter() {
      return {
        search: this.search,
      };
    },
    // Модифицируем колонки для отображения названий групп
    modifiedColumns() {
      const originalColumns = this.drugsStore.getColumns;

      return originalColumns.map((column) => {
        if (column.field === "idGroupDrugs") {
          // Предполагаем, что поле с ID группы называется 'group_id'
          return {
            ...column,
            format: (val) => this.getGroupNameById(val),
          };
        }
        return column;
      });
    },
  },
};
</script>

<style scoped></style>
