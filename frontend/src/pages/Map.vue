<template>
  <div>
    <div style="position: absolute; z-index: 1000; right: 20px; top: 10px">
      <div v-if="!isLoggedIn">
        <q-btn
          push
          size="sm"
          color="white"
          text-color="primary"
          label="Войти"
          to="/login"
        />
      </div>
      <span v-if="isLoggedIn" class="q-gutter-x-xs">
        <span v-if="hasPermisson('admin')" class="q-gutter-x-xs">
          <q-btn
            push
            size="sm"
            color="white"
            text-color="primary"
            label="Метки"
            to="/points"
          />
          <q-btn
            push
            size="sm"
            color="white"
            text-color="primary"
            label="Комментарии"
            to="/comments"
          />
          <q-btn
            push
            size="sm"
            color="white"
            text-color="primary"
            label="Пользователи"
            to="/users"
          />
        </span>

        <span v-if="hasPermisson('user')"></span>
        <q-btn
          push
          size="sm"
          :color="canEdit ? 'primary' : 'white'"
          :text-color="canEdit ? 'white' : 'primary'"
          label="Метка"
          @click="setEdit(!canEdit)"
        />
        <q-btn
          push
          size="sm"
          color="white"
          text-color="primary"
          label="Выход"
          @click="logout"
          to="/map"
        />
      </span>
    </div>
    <div style="height: 100vh; width: 100%">
      <l-map
        ref="map"
        :zoom="zoom"
        :center="coords"
        @click="addMarker"
        @ready="onMapReady"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
        
        <l-marker
          v-for="point in points"
          :key="point.id"
          :lat-lng="point.coordinates"
          @click="
            setMarker(point);
            setView(point);
            currentComment.point = point._id;
            getComments(point._id);
          "
        >
          <l-icon
            :icon-url="computedIconUrl(point.type)"
            :icon-size="[25, 25]"
            :popup-anchor="[0, -10]"
          ></l-icon>
          <l-popup>{{ point.name }}</l-popup>
        </l-marker>
        <l-marker
          v-if="canEdit"
          :lat-lng="newPoint.coordinates"
          draggable
          @moveend="log"
          @click="setMarker(newPoint)"
        >
          <l-popup>
            <q-btn dense color="primary" size="sm" @click="savePoint"
              >Сохранить</q-btn
            >
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  reactive,
  toRef,
  Ref,
  Component,
} from 'vue';
import 'leaflet/dist/leaflet.css';
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LIcon,
} from '@vue-leaflet/vue-leaflet';
import { useAuth } from '../modules/auth';
import { usePoints } from '../modules/points';
import { useComments } from '../modules/comments';
export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
  },
  setup() {
    const { isLoggedIn, logout, hasPermisson } = useAuth();
    const {
      points,
      setMarker,
      marker,
      addNewPoint,
      canEdit,
      setEdit,
      getAddress,
      getPoints,
      types,
      setSide,
    } = usePoints();
    const {
      comments,
      currentComment,
      canEditComment,
      sendComment,
      getComments,
    } = useComments();
    let zoom = ref(15);
    let coords = [58.0094, 56.2276];
    let currentGeo: any[] = [];
    (() => {
      navigator.geolocation.getCurrentPosition((_) => {
        if (_.coords) {
          console.log(_);
          currentGeo = [_.coords.latitude, _.coords.longitude];
        }
      });
    })();
    const computedIconUrl = (type: any) => {
      if (type) {
        return computed(() => {
          const asn = types.value.find((x) => x.value == type);
          if (asn) {
            return asn.url;
          } else {
            return '';
          }
        }).value;
      } else {
        return '';
      }
    };
    const map = ref(null);
    const onMapReady = () => {
      console.log('MAPA', map.value);
    };
    const setView = (newCoords: any) => {
      coords = newCoords;
    };
    let newPoint = ref({
      coordinates: [60, 60],
      text: 'new',
      workHours: '10-21',
    });
    let iconWidth = ref(45);
    let iconHeight = ref(90);
    const addMarker = (event: any) => {
      if (
        Object.prototype.hasOwnProperty.call(event, 'latlng') &&
        canEdit.value
      ) {
        try {
          newPoint.value.coordinates = [event.latlng?.lat, event.latlng?.lng];
          setMarker(newPoint.value);
          getAddress(
            newPoint.value.coordinates[0],
            newPoint.value.coordinates[1]
          );
        } catch (error) {}
      }
    };

    const log = (event: any) => {
      try {
        newPoint.value.coordinates[0] = event.target.getLatLng().lat;
        newPoint.value.coordinates[1] = event.target.getLatLng().lng;
        setMarker(newPoint.value);
        getAddress(
          newPoint.value.coordinates[0],
          newPoint.value.coordinates[1]
        );
      } catch (error) {}
    };
    getPoints();
    const savePoint = () => {
      addNewPoint(newPoint.value);
      setEdit(false);
    };
    return {
      coords,
      setView,
      isLoggedIn,
      logout,
      hasPermisson,
      zoom,
      points,
      setMarker,
      marker,
      newPoint,
      canEdit,
      setEdit,
      iconWidth,
      iconHeight,
      addMarker,
      savePoint,
      log,
      currentComment,
      getComments,
      computedIconUrl,
      types,
      setSide,
      currentGeo,
      map,
      onMapReady,
    };
  },
});
</script>

<style></style>
