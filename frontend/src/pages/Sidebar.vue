<template>
  <div>
    <div :class="{ 'bg-primary': marker.text != 'new' }">
      <div>
        <q-btn
          :color="marker.text != 'new' ? 'blue-light-7' : 'green'"
          class="full-width text-white"
          label="Sobaken"
          size="xl"
          glossy
          icon="pets"
        />
      </div>
      <div v-if="marker.text != 'new'" class="q-mt-lg text-center text-white">
        <p class="text-h6 text-bold q-mb-sm">{{ marker.name }}</p>
        <p class="text q-mb-sm">{{ computedPointType(marker.type) }}</p>
        <b style="font-size: 16px">{{ marker.address }}<br /></b>
        <p v-if="marker.phone" class="">{{ marker.phone }}</p>
        <a v-if="marker.link" class="text-white" :href="marker.link"
          >{{ marker.link }}<br
        /></a>
        <span v-if="marker.workHours"
          >Часы работы: <b>{{ marker.workHours }}</b></span
        >
        <p v-if="marker.workHours">{{ computedWorkHours(marker.workHours) }}</p>
        <p v-if="marker.stat"><q-icon name="visibility"></q-icon>{{marker.stat}}</p>

        <template v-if="marker.services">
          <q-chip
            v-for="_serv in marker.services"
            size="8px"
            :key="_serv"
            class="glossy"
            color="green text-white"
            icon="sell"
            >{{ _serv }}</q-chip
          >
        </template>
        <template v-if="marker.breeds">
          <q-chip
            v-for="_breed in marker.breeds"
            size="8px"
            :key="_breed"
            class="glossy"
            color="white text-black"
            icon="pets"
            >{{ _breed }}</q-chip
          >
        </template>
        <p class="bg-red" v-if="marker.comment">
          <q-spinner-puff color="white" size="3em" />{{ marker.comment
          }}<q-spinner-puff color="white" size="3em" />
        </p>
        <p />
        <p v-if="!marker.name">Выберите метку на карте!</p>
        <q-btn
          size="sm"
          color="red"
          v-if="hasPermisson('admin') && marker.name"
          @click="deletePoint(marker._id)"
          >Удалить (Администратор)</q-btn
        >
        <!-- <p
          v-if="marker.coordinates"
          class="text-caption text-weight-thin q-pb-sm"
        >
          {{ marker.coordinates[0] }}, {{ marker.coordinates[1] }}
        </p> -->
        <div v-if="isCommentsLoading">
          <q-spinner-comment color="primary" size="2em" />
          <q-tooltip :offset="[0, 8]"></q-tooltip>
        </div>
        <div v-else class="bg-white q-mb-lg text-primary">
          <div class="q-mx-lg q-mb-lg" v-if="marker._id">
            <q-input
              bottom-slots
              v-model="currentComment.comment"
              :label="user.fullName"
              counter
              maxlength="90"
              :dense="dense"
            >
              <template v-slot:append>
                <q-icon
                  v-if="currentComment.comment !== ''"
                  name="close"
                  @click="currentComment.comment = ''"
                  class="cursor-pointer"
                />
              </template>
              <template v-slot:after>
                <q-btn
                  color="primary"
                  rounded
                  dense
                  flat
                  icon="chat"
                  @click="sendComment"
                />
              </template>
              <template v-slot:hint>Комментарий</template>
            </q-input>
          </div>
          <p v-if="comments?.length > 0">Комментарии</p>
          <p v-else>Оставьте комментарий первым!</p>
          <template v-for="_comment of comments">
            <q-chat-message
              class="q-mx-lg text-black text-left"
              v-if="_comment.status != '!approved'"
              :name="_comment.creator?.fullName || 'Пользователь удален'"
              :stamp="dateFormatter(_comment.createdAt)"
              :sent="user.fullName == _comment.creator?.fullName"
              :key="_comment._id"
              :text="[_comment.comment]"
            />
          </template>
        </div>
      </div>
      <div v-else class="q-mx-lg q-mb-lg text-center">
        <div class="q-gutter-y-md column">
          <!-- <p>{{ marker }}</p> -->
          <p>Новая метка на карте</p>
          <q-input dense borderless v-model="marker.name" label="Название" />
          <q-select
            dense
            borderless
            v-model="marker.type"
            :options="types"
            label="Тип"
            option-value="value"
            option-label="label"
            emit-value
            map-options
          />
          <q-input dense v-model="marker.address" label="Адрес" />
          <q-select
            v-if="['club', 'shop', 'vet'].includes(marker.type)"
            label="Оплата"
            dense
            borderless
            v-model="marker.paymentsMethods"
            :options="[
              { label: 'Наличные', value: 'cash' },
              { label: 'Карта', value: 'credit' },
            ]"
          />

          <q-input
            v-if="!['hunt', 'breeders'].includes(marker.type)"
            dense
            v-model="marker.workHours"
            label="Часы работы"
          />
          <q-input
            v-if="!['hunt'].includes(marker.type)"
            dense
            v-model="marker.phone"
            label="Телефон"
          />
          <q-input
            v-if="!['hunt'].includes(marker.type)"
            dense
            v-model="marker.link"
            label="Ссылка"
          />
          <q-input
            v-if="['hunt'].includes(marker.type)"
            dense
            v-model="marker.comment"
            label="Комментарий"
          />
          <q-select
            v-if="['breeders', 'handlers'].includes(marker.type)"
            dense
            v-model="marker.breeds"
            multiple
            use-input
            use-chips
            input-debounce="0"
            :options="filterOptions"
            @filter="filterFn"
            label="Породы"
            style="width: 250px"
          />
          <q-select
            v-if="['club', 'handlers', 'vet'].includes(marker.type)"
            dense
            v-model="marker.services"
            multiple
            use-chips
            :options="[
              'Стрижка',
              'Тримминг',
              'Мытьё',
              'Уход за длинной шерстью',
              'Вычёсывание во время линьки',
              'Стрижка когтей',
              'Чистка ушей и глаз',
              'Чистка желез',
              'СПА – процедуры',
            ]"
            label="Услуги"
            style="width: 250px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usePoints } from '../modules/points';
import { useAuth } from '../modules/auth';
import { useComments } from '../modules/comments';
import { ref, defineComponent, computed } from 'vue';
import { useUsers } from '../modules/users';
import moment from 'moment';
moment.locale('ru');
export default defineComponent({
  setup() {
    let newMarker = ref({});
    const dateFormatter = (_date: string) => {
      return moment(_date).fromNow();
    };
    const {
      points,
      setMarker,
      marker,
      canEdit,
      types,
      sideOpen,
      breeds,
      deletePoint,
    } = usePoints();
    const { isLoggedIn, logout, hasPermisson, user } = useAuth();
    const { currentUser } = useUsers();
    const {
      comments,
      currentComment,
      canEditComment,
      sendComment,
      isCommentsLoading,
    } = useComments();
    const filterOptions = ref(breeds);
    const filterFn = (val: any, update: any) => {
      update(() => {
        if (val === '') {
          filterOptions.value = breeds;
        } else {
          const needle = val.toLowerCase();
          filterOptions.value = breeds.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    };
    const computedWorkHours = (data: string) => {
      if (!data) return '';
      let [h1, h2] = data.split('-');
      let _now = moment();
      let _h1 = moment().hours(parseInt(h1));
      let _h2 = moment().hours(parseInt(h2));
      let diffText = '';
      if (_h2.isAfter(_now) && _h1.isBefore(_now)) {
        diffText += `Закроется ${_h2.fromNow()}`;
      } else {
        diffText += 'Откроется ';
        if (_h1.isAfter(_now)) diffText += _h1.fromNow();
        else diffText += _h1.add(1, 'days').fromNow();
      }

      return diffText;
    };
    const computedPointType = (type: string) => {
      if (type) {
        return computed(() => {
          const asn = types.value.find((x) => x.value == type);
          if (asn) {
            return asn.label;
          } else {
            return '';
          }
        }).value;
      } else {
        return '';
      }
    };
    return {
      newMarker,
      points,
      setMarker,
      marker,
      hasPermisson,
      computedPointType,
      canEdit,
      currentComment,
      comments,
      canEditComment,
      currentUser,
      sendComment,
      dateFormatter,
      types,
      user,
      sideOpen,
      computedWorkHours,
      isCommentsLoading,
      breeds,
      filterOptions,
      filterFn,
      deletePoint,
    };
  },
});
</script>

<style>
</style>
