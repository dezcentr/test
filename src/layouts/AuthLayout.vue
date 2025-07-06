<template>
  <q-layout>

    <q-page-container>
      <div class="my-card fixed-center text-center">
        <router-view/>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'AuthLayout',
  data() {
    return {}
  }
}
</script>

<style lang="css" scoped>
.my-card_ {
  width: 100%;
  max-width: 600px;
}
</style>
