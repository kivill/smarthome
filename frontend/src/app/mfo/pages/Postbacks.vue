<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-sm">
      <div class="col">
        <q-select
          v-model="filter.appId"
          :options="apps"
          label="ID приложения"
          option-value="_id"
          option-label="name"
          emit-value
          map-options
          outlined
          dense
          clearable
          multiple
        />
      </div>
      <div class="col">
        <q-input outlined v-model="filter.from" dense mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="filter.from" minimal> </q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon
              name="clear"
              class="cursor-pointer"
              @click="filter.from = null"
            />
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-input outlined v-model="filter.to" dense mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="filter.to" minimal> </q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon
              name="clear"
              class="cursor-pointer"
              @click="filter.to = null"
            />
          </template>
        </q-input>
      </div>
      <div class="col-1">
        <q-btn color="primary" label="Поиск" dense @click="getPostbacks" />
      </div>
    </div>

    <div class="q-mt-lg">
      <q-table
        :loading="isLoading"
        title="Постбеки"
        :rows="postbacks"
        :columns="columns"
        row-key="_id"
        v-model:pagination="pagination"
        @request="getPostbacks"
      >
        <template v-slot:top-right>
          <q-btn color="primary" label="Добавить" dense @click="modal = true" />
        </template>
      </q-table>
    </div>

    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section class="items-center q-gutter-sm">
          <div>
            <q-select
              v-model="newPostbacks.appIds"
              :options="apps"
              label="ID приложения"
              option-value="_id"
              option-label="name"
              emit-value
              map-options
              outlined
              dense
              clearable
              multiple
            />
          </div>
          <div>
            <q-input
              outlined
              v-model="newPostbacks.from"
              dense
              mask="date"
              label="От"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="newPostbacks.from" minimal> </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon
                  name="clear"
                  class="cursor-pointer"
                  @click="newPostbacks.from = null"
                />
              </template>
            </q-input>
          </div>
          <div>
            <q-input
              outlined
              v-model="newPostbacks.to"
              dense
              mask="date"
              label="До"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="newPostbacks.to" minimal> </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon
                  name="clear"
                  class="cursor-pointer"
                  @click="newPostbacks.to = null"
                />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отменить"
            color="red"
            v-close-popup
            @click="setNewPostbacksEmpty"
          />
          <q-btn
            flat
            label="Добавить"
            color="green"
            v-close-popup
            @click="getMfoNewPostbacks"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMfo } from '../mfo';
import { useApps } from '../../app-modules';
interface Postback {
  id: string;
  currency: string;
  payout: number;
  created_at: Date;
}

export default defineComponent({
  setup() {
    const {
      getPostbacks,
      postbacks,
      isLoading,
      filter,
      pagination,
      newPostbacks,
      setNewPostbacksEmpty,
      getMfoNewPostbacks,
    } = useMfo();
    const { getApps, apps } = useApps();
    const columns = [
      {
        name: '_id',
        field: '_id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'date',
        field: (row: Postback) => row.created_at,
        label: 'Время прихода',
        align: 'left',
        format: (val: string) => {
          const date = new Date(val);
          return date.toLocaleString('ru-RU', { timeZone: 'UTC' });
        },
      },
      {
        name: 'payout',
        field: 'payout',
        label: 'Сумма',
        align: 'left',
      },
      {
        name: 'currency',
        field: 'currency',
        label: 'Валюта',
        align: 'left',
      },
    ];
    getPostbacks();
    getApps();
    let modal = ref(false);
    return {
      isLoading,
      columns,
      getPostbacks,
      newPostbacks,
      postbacks,
      filter,
      apps,
      pagination,
      modal,
      setNewPostbacksEmpty,
      getMfoNewPostbacks,
    };
  },
});
</script>

<style></style>
