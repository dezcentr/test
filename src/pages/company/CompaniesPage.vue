<template>
  <q-page padding>
  <h5>Список компаний</h5>
    <q-table class="companies-table"
           ref="tblCompany"
           table-header-class="bg-blue-grey-4 text-bold"
           wrap-cells
           flat binary-state-sort
           :rows="listItems"
           :columns="company.getColumns"
           :loading="loading"
           @request="onRequest"
           row-key="id"
           color="amber"
           :filter="filter"
           :filter-method="customFilter"
           v-model:pagination="pagination"
           :rows-per-page-options="[0]"
           hide-bottom
  >
    <template v-slot:top>
      <div style="width: 100%" class="row">
        <div class="col-9">
          <q-btn v-if="['admin'].includes(user.getRole)" :to="{name: 'new-company'}">Добавить компанию</q-btn>
        </div>
        <div class="col-3">
          <q-input outlined dense debounce="400" color="primary" type="search" label="Поиск" v-model="search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </template>

    <template v-slot:body-cell-action="props">
      <q-td :props="props">
        <q-btn :to="{name: 'edit-company', params: { id: props.row.id} }" label="Подробнее"/>
        <q-btn :to="{name: 'facility', params: { company_id: props.row.id} }" label="Объекты"/>
      </q-td>
    </template>

  </q-table>

  </q-page>
</template>

<script>

import {useCompanyStore} from "stores/company";
import {useAuthStore} from "stores/auth-store";
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";

export default {
  name: "CompaniesPage",
  data() {
    const route = useRoute()
    const company = useCompanyStore()
    company.init()
    return {
      pagination: ref({
        rowsPerPage: 0
      }),
      listItems: [],
      loading: false,
      search: '',
      company,
      user: useAuthStore(),
    }
  },
  computed: {
    filter() {
      return {
        search: this.search
      }
    }
  },
  mounted() {
    //this.fetchData()
    this.onRequest()
  },
  methods: {
    customFilter(rows, terms, cols, getCellValue) {

      let lowerSearch = terms.search ? terms.search.toLowerCase() : ""

      return rows.filter(
        (row, i) => {
          let ans = true
          //   let lowerSearch = "";
          //If search term exists, convert to lower case and see which rows contain it
          if (lowerSearch !== "") {
            ans = false
            //Get the values
            let s1_values = Object.values(row)

            //Convert to lowercase
            let s1_lower = s1_values.map(x => x.toString().toLowerCase())

            for (let val = 0; val < s1_lower.length; val++) {
              if (s1_lower[val].includes(lowerSearch)) {
                ans = true
                break
              }
            }
          }
          return ans
        });
    },

    onRequest(props) {
      this.loading = true
      api.get(process.env.API_GET_COMPANY_ALL)
        .then(({data}) => {
          if(data.status == 200) {
            this.listItems = data.content
            this.loading = false
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="sass">
.companies-table
  thead tr:first-child th:first-child
    width: 10%

.companies-table
  td:last-child a
    margin: 5px 10px

</style>
