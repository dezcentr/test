<script>
export default {
  data() {
    return {
      searchSelected: '',
      searchAll: '',
      selectedFacilities: []
    }
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    pAllFacilities: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.selectedFacilities = this.modelValue;
  },
  watch: {
    selectedFacilities(v) {
      this.$emit('update:modelValue', v);
    }
  },
  computed: {
    computedUnselectedFacilities() {
      const searchAll = this.searchAll.toLowerCase();
      return this.pAllFacilities.filter(e =>
        e.name.toLowerCase().includes(searchAll) &&
        !this.selectedFacilities.find(ie => ie.id === e.id)
      )
    },
    computedSelectedFacilities() {
      const searchSelected = this.searchSelected.toLowerCase();
      return this.selectedFacilities.filter(e => e.name.toLowerCase().includes(searchSelected))
    }
  }
}
</script>

<template>
  <div class="group-facilities-tables">
    <h5>Объекты группы</h5>
    <div class="facilities-block__block">
      <q-table
        class="groups-facility-table virtual-scroll-table"
        style="height: 400px"
        ref="tblGroupFacility"
        table-header-class="bg-blue-grey-4 text-bold"
        virtual-scroll
        wrap-cells
        flat binary-state-sort
        :rows="computedSelectedFacilities"
        :columns="columns"
        row-key="id"
        color="amber"
        :rows-per-page-options="[0]"
        selection="multiple"
        v-model:selected="selectedFacilities"
        hide-bottom
      >
        <template v-slot:top>
          <div style="width: 100%" class="row">
            <div class="col-6">
              <h6 style="margin: 0">Выбраны</h6>
            </div>
            <div class="col-6">
              <q-input outlined dense debounce="400" color="primary" type="search" label="Поиск" v-model="searchSelected">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>
    <div class="facilities-block__block">
      <q-table
        class="groups-facility-table virtual-scroll-table"
        style="height: 400px"
        ref="tblGroupFacility"
        table-header-class="bg-blue-grey-4 text-bold"
        virtual-scroll
        wrap-cells
        flat binary-state-sort
        :rows="computedUnselectedFacilities"
        :columns="columns"
        row-key="id"
        color="amber"
        :rows-per-page-options="[0]"
        selection="multiple"
        v-model:selected="selectedFacilities"
        hide-bottom
      >
        <template v-slot:top>
          <div style="width: 100%" class="row">
            <div class="col-6">
              <h6 style="margin: 0">Не выбраны</h6>
            </div>
            <div class="col-6">
              <q-input outlined dense debounce="400" color="primary" type="search" label="Поиск" v-model="searchAll">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group-facilities-tables {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas: "S S" "B1 B2";
  gap: 10px;

  & h5 {
    grid-area: S;
    margin: 0;
  }
  &__block {
    overflow-x: auto;
  }
}
</style>
<style>
.q-table tbody td:after {
  background: transparent;
}
</style>
