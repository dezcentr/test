<script>
import {
  YandexMap,
  YandexMapClusterer,
  YandexMapControls,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
  YandexMapZoomControl,
} from "vue-yandex-maps";
import { shallowRef } from "vue";

export default {
  name: "YndxMap",
  computed: {
    ZoomRange() {
      return ZoomRange;
    },
  },
  components: {
    YandexMapControls,
    YandexMapZoomControl,
    YandexMapClusterer,
    YandexMapDefaultFeaturesLayer,
    YandexMapMarker,
    YandexMapDefaultSchemeLayer,
    YandexMap,
  },
  props: {
    markers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: shallowRef(null),
    };
  },
};
</script>

<template>
  <yandex-map
    v-model="map"
    :settings="{
      zoomRange: {
        min: 2,
        max: 1000,
      },
      location: {
        center: markers.length ? markers[0].coords : [37.617644, 55.755819],
        zoom: 2,
        controls: ['zoomControl'],
      },
    }"
    width="100%"
    height="600px"
  >
    <yandex-map-default-scheme-layer />
    <yandex-map-default-features-layer />
    <yandex-map-clusterer zoom-on-cluster-click :settings="{}">
      <yandex-map-marker
        v-for="marker in markers"
        :key="marker.coords.toString()"
        :settings="{
          coordinates: marker.coords,
        }"
        position="top left-center"
      >
        <div
          class="marker"
          :class="{
            'marker--green': marker.damage <= 35,
            'marker--yellow': marker.damage > 35 && marker.damage <= 65,
            'marker--red': marker.damage > 65 && marker.damage <= 100,
          }"
          @click="$emit('clickMarker', marker)"
        >
          {{ marker.damage }}%
        </div>
      </yandex-map-marker>

      <template #cluster="{ length }">
        <div class="marker marker--cluster">
          {{ length }}
        </div>
      </template>
    </yandex-map-clusterer>
    <yandex-map-controls :settings="{ position: 'right' }">
      <yandex-map-zoom-control />
    </yandex-map-controls>
  </yandex-map>
</template>

<style lang="scss">
.marker {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid #fff;
  text-align: center;
  color: #fff;
  font-weight: bold;
  line-height: 20px;
  cursor: pointer;

  &--cluster {
    background: #939393;
    box-shadow: 0 0 5px 2px #939393;
  }

  &--green {
    background: #b6d7a8;
    box-shadow: 0 0 5px 2px #b6d7a8;
  }
  &--yellow {
    background: #ffe599;
    box-shadow: 0 0 5px 2px #ffe599;
  }
  &--red {
    background: #f4cccc;
    box-shadow: 0 0 5px 2px #f4cccc;
  }
}
</style>
