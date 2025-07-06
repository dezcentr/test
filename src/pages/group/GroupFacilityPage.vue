<template>
  <q-page padding>
    <h5>{{ groupName }} - Список объектов</h5>

    <yndx-map
      :markers="preparedMarkers"
      @click-marker="$router.push({name: 'log-index', params: {facility_id: $event.id, ctx: groupID} })"
    />

    <q-table ref="tblFacility"
             class="facility-table virtual-scroll-table"
             style="max-height: 600px"
             table-header-class="bg-blue-grey-4 text-bold"
             virtual-scroll
             wrap-cells
             flat binary-state-sort
             :rows="group.groupFacilities"
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
        <q-td :props="props" >
          <q-btn :to="{name: 'group-facility-edit', params: { group_id: groupID, id: props.row.id} }" label="Подробнее"/>
          <q-btn :to="{name: 'log-index', params: {facility_id: props.row.id, ctx: groupID} }" label="Отчеты"/>
        </q-td>
      </template>
      <template v-slot:body-cell-uuid="props">
        <q-td :props="props" >
          <clipboard-value :value="props.value"/>
        </q-td>
      </template>

    </q-table>
  </q-page>
</template>

<script>

import {useRoute} from "vue-router";
import {useAuthStore} from "stores/auth-store";
import {ref, shallowRef} from "vue";
import {useGroupStore} from "stores/group";
import {useFacilityStore} from "stores/facility";
import YndxMap from "components/YndxMap.vue";
import ClipboardValue from "components/ClipboardValue.vue";


export default {
  name: "GroupFacilityPage",
  components: {ClipboardValue, YndxMap},
  data() {
    return {
      pagination: ref({
        rowsPerPage: 0
      }),
      user: undefined,
      groupID: undefined,
      group: undefined,
      facility: undefined,
      search: '',
      groupName: '',
      listItems: []
    }
  },
  async created() {
    const currentRoute = useRoute()
    this.user = useAuthStore()
    this.group = useGroupStore()
    this.facility = useFacilityStore()

    this.groupID = currentRoute.params.group_id
    this.group.id = this.groupID

    await this.group.loadAllInfoAboutId(this.groupID);
    this.groupName = this.group.item.name
  },
  computed: {
    filter() {
      return {
        search: this.search
      }
    },
    preparedMarkers() {
      return this.group.groupFacilities.filter(facility => facility.isActive).map(facility => ({
        id: facility.id,
        coords: [facility.longitude, facility.latitude],
        damage: facility.damage
      }))
    }
  },

  methods: {
    customFilter(rows, terms, cols, getCellValue) {

      let lowerSearch = terms.search ? terms.search.toLowerCase() : ""

      return rows.filter(
        (row, i) => {
          let ans = true
          if (lowerSearch !== "") {
            ans = false
            let s1_values = Object.values(row)
            let s1_lower = s1_values.map(x => x?.toString().toLowerCase())

            for (let val = 0; val < s1_lower.length; val++) {
              if (s1_lower[val]?.includes(lowerSearch)) {
                ans = true
                break
              }
            }
          }
          return ans
        });
    },
  }
}
</script>

<style lang="sass">
.facility-table
  thead tr:first-child th:first-child
    width: 10%

.facility-table td:last-child a
  margin: 5px 10px
</style>
