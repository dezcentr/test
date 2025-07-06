import {defineStore} from 'pinia'
import {api} from "boot/axios";

export const useGroupStore = defineStore('group-store', {
  state: () => ({
    baseUrl: '/group-facility/get-all',
    updateUrl: '/group-facility/update-by-id',
    id: '',
    indexPageColumns: [
      {name: 'id', align: 'center', label: 'Номер группы', field: 'id', sortable: true},
      {name: 'name', align: 'center', label: 'Название группы', field: 'name', sortable: true},
      {name: 'isActive', align: 'center', label: 'Статус', field: 'active',format: val => val===true?'Активный' :'Неактивный',  sortable: true},
      {name: 'action', align: 'center', label: 'Действия', field: 'action'},
    ],
    facilitiesTableColumns: [
      {name: 'id', align: 'center', label: 'Номер склада', field: 'id', sortable: true},
      {name: 'name', align: 'center', label: 'Название объекта', field: 'name', sortable: true}
    ],
    items: [],
    facilities: [],
    groupFacilities: [],
    item:{},
  }),
  getters: {
    getItems(state) {
      return state.items
    },
    getColumns(state) {
      return state.indexPageColumns
    },
    getFacilitiesColumns(state) {
      return state.facilitiesTableColumns
    },
    getItem(state) {
      return (id) => {
        return state.items.find((item) => item.id === id)
      }
    }
  },
  actions: {
    init: function () {
      if (this.items.length < 1) {
        this.load();
      }
    },
    loadOnlyId: async function (id){
      try {
        const response = await api.get(process.env.API_GET_GROUP_ID + id)
        this.item = response.data.content;
        return response.data.content;
      } catch (e) {
        console.log(e);
      }
    },
    loadId: async function (id){
      try {
        const response = await this.loadOnlyId(id);
        await this.loadFacilities(id)
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    loadAllInfoAboutId: async function (id){
      try {
        const response = await this.loadOnlyId(id);
        await this.loadGroupFacilities(id)
        return response;
      } catch (e) {
        console.log(e);
      }
    },
    load: function () {
      const response = api.get(process.env.API_GET_GROUP_ALL)
        .then(({data}) => {
          this.items = data.content
        })
        .catch(error => {
          console.log(error);
        })
    },
    loadFacilities: async function () {
      try {
        const response = await api.get(process.env.API_GET_ALL_FACILITY)
        this.facilities = response.data.content
      } catch (e) {
        console.log(e);
      }
    },
    loadGroupFacilities: async function (id) {
      try {
        const response = await api.get(process.env.API_GET_GROUP_FACILITY_ALL + id)
        this.groupFacilities = response.data.content
      } catch (e) {
        console.log(e);
      }
    }
  }
})
