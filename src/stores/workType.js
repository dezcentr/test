import {defineStore} from "pinia";
import {api} from "boot/axios";


export const useWorkTypeStore = defineStore('', {
  state: () => ({
    items: []
  }),
  getters: {
    getItem(state) {
      return (id) => state.items.find((item) => item.id == id)
    }
  },

  action: {
    init: function(){
      if( this.items.length >0 ){
        return true;
      }

      const response = api.get(process.env.API_GET_LOGS_WORKS_TYPE)
        .then(({data}) => {
          this.items = data.content
        })

    }
  }
})
