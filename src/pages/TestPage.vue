<template>
  <!--
    Forked from:
    https://quasar.dev/vue-components/table#Example--Using-dense-prop
  -->
  <div id="q-app">
    <div class="q-pa-md">
      <q-table
        title="Treats"
        :data="data"
        :columns="columns"
        :filter="filter"
        :filter-method="customFilter"
        row-key="name"
      >
        <template v-slot:top>
          <div style="width: 100%" class="row">
            <div class="col-9">
              <q-toggle v-model="filterToggle.breakfast" val="breakfast" label="Show Breakfast" />
              <q-toggle v-model="filterToggle.lunch" val="lunch" label="Show Lunch" />
              <q-toggle v-model="filterToggle.dinner" val="dinner" label="Show Dinner" />
              <q-toggle v-model="showAll" val="showAll" label="Show All" />
            </div>
            <div class="col-3">
              <q-input  dense debounce="400" color="primary" v-model="search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
      <div>{{filter}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TestPage",
  data () {
    return {
      filterToggle: {
        breakfast: true,
        lunch: true,
        dinner: true
      },
      search: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'category', align: 'center', label: 'Category', field: 'category', sortable: true },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data: [
        {
          name: 'Frozen Yogurt',
          category: 'breakfast',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          category: 'breakfast',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: 'Eclair',
          category: 'lunch',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: 'Cupcake',
          category: 'lunch',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          category: 'dinner',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          category: 'dinner',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: 'Lollipop',
          category: 'dinner',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          category: 'breakfast',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          name: 'Donut',
          category: 'lunch',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: 'KitKat',
          category: 'breakfast',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ]
    }
  },
  computed: {
    showAll: {
      get: function () {

        return this.filterToggle.breakfast && this.filterToggle.lunch && this.filterToggle.dinner
      },
      set: function (newValue){
        this.filterToggle.breakfast = newValue
        this.filterToggle.lunch = newValue
        this.filterToggle.dinner = newValue
      }
    },
    filter() {
      return {
        search: this.search,
        breakfast: this.filterToggle.breakfast,
        lunch: this.filterToggle.lunch,
        dinner: this.filterToggle.dinner,
      }
    }
  },
  methods: {
    customFilter(rows, terms){
      // rows contain the entire data
      // terms contains whatever you have as filter



      let lowerSearch = terms.search ? terms.search.toLowerCase() : ""

      const filteredRows = rows.filter(
        (row, i) =>{

          let ans = false

          //Gather toggle conditions
          let c1 = this.filterToggle.breakfast && row.category == "breakfast"
          let c2 = this.filterToggle.lunch && row.category == "lunch"
          let c3 = this.filterToggle.dinner && row.category == "dinner"

          //Gather search condition



          //Assume true in case there is no search
          let s1 = true

          //If search term exists, convert to lower case and see which rows contain it
          if(lowerSearch != ""){
            s1 = false
            //Get the values
            let s1_values = Object.values(row)
            //Convert to lowercase
            let s1_lower = s1_values.map(x => x.toString().toLowerCase())

            for (let val = 0; val<s1_lower.length; val++){
              if (s1_lower[val].includes(lowerSearch)){
                s1 = true
                break
              }
            }
          }

          //assume row doesn't match
          ans = false

          //check if any of the conditions match
          if ( (c1 && s1) || (c2 && s1) || (c3 && s1) ) {
            ans = true
          }

          return ans

        })

      return filteredRows
    }
  }
}
</script>

<style scoped>

</style>
