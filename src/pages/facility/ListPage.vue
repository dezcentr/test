<template>
  <q-page padding>
    <q-btn v-if="['admin'].includes(user.getRole)" :to="{ name: 'companies' }"
      >назад</q-btn
    >
    <h5>{{ companyName }} - Список объектов</h5>

    <yndx-map
      :markers="preparedMarkers"
      @click-marker="
        $router.push({
          name: 'log-index',
          params: { facility_id: $event.id, ctx: companyID },
        })
      "
    />

    <q-table
      ref="tblFacility"
      class="facility-table virtual-scroll-table"
      style="max-height: 600px"
      table-header-class="bg-blue-grey-4 text-bold"
      virtual-scroll
      wrap-cells
      flat
      binary-state-sort
      @request="onRequest"
      :rows="facility.items"
      :columns="facility.getColumns"
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
              :to="{ name: 'new-facility', params: { company_id: companyID } }"
              >Добавить Объект</q-btn
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
        <q-td :props="props">
          <q-btn
            :to="{
              name: 'edit-facility',
              params: { company_id: companyID, id: props.row.id },
            }"
            label="Подробнее"
          />
          <q-btn
            :to="{
              name: 'log-index',
              params: { facility_id: props.row.id, ctx: companyID },
            }"
            label="Отчеты"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-uuid="props">
        <q-td :props="props">
          <clipboard-value :value="props.value" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { useRoute } from "vue-router";
import { useFacilityStore } from "stores/facility";
import { useCompanyStore } from "stores/company";
import { api } from "boot/axios";
import { useAuthStore } from "stores/auth-store";
import { ref, shallowRef } from "vue";
import YndxMap from "components/YndxMap.vue";
import ClipboardValue from "components/ClipboardValue.vue";

export default {
  name: "ListPage",
  components: { ClipboardValue, YndxMap },
  data() {
    const facility = useFacilityStore();

    const company = useCompanyStore();

    const currentRoute = useRoute();

    const companyID = currentRoute.params.company_id;
    company.id = companyID;

    company.load();
    facility.load(companyID);

    return {
      pagination: ref({
        rowsPerPage: 0,
      }),
      search: "",
      user: useAuthStore(),
      facility,
      companyID,
      company,
      companyName: "",
      listItems: [],
    };
  },
  mounted() {
    this.onRequest();
    this.loadCompanyName();
  },
  computed: {
    filter() {
      return {
        search: this.search,
      };
    },
    preparedMarkers() {
      return this.facility.items
        .filter((facility) => facility.isActive)
        .map((facility) => ({
          id: facility.id,
          coords: [facility.longitude, facility.latitude],
          damage: facility.damage,
        }));
    },
  },

  methods: {
    customFilter(rows, terms, cols, getCellValue) {
      let lowerSearch = terms.search ? terms.search.toLowerCase() : "";

      return rows.filter((row, i) => {
        let ans = true;
        if (lowerSearch !== "") {
          ans = false;
          let s1_values = Object.values(row);
          let s1_lower = s1_values.map((x) => x?.toString().toLowerCase());

          for (let val = 0; val < s1_lower.length; val++) {
            if (s1_lower[val]?.includes(lowerSearch)) {
              ans = true;
              break;
            }
          }
        }
        return ans;
      });
    },

    onRequest(props) {
      const response = api
        .get(process.env.API_GET_FACILITY + this.companyID)
        .then(({ data }) => {
          this.listItems = data.content.map((item) => {
            if (item.damagedCount === null) {
              item.damagedCount = 0;
            }
            if (item.unavailableCount === null) {
              item.unavailableCount = 0;
            }
            return item;
          });
        });
    },
    loadCompanyName() {
      api
        .get(process.env.API_GET_COMPANY_ID + this.companyID)
        .then(({ data }) => {
          this.companyName = data.content.name;
        });
    },
  },
};
</script>

<style lang="scss">
.facility-table {
  thead tr:first-child th:first-child {
    width: 10%;
  }
}

.facility-table td:last-child a {
  margin: 5px 10px;
}
</style>
