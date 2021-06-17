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
        <q-btn color="red" label="Удалить все" dense @click="confirm" />
        <q-btn color="primary" label="Поиск" dense @click="getSpendings" />
      </div>
    </div>

    <div class="q-mt-lg">
      <q-table
        :loading="isLoading"
        title="Списания"
        :rows="spendings"
        :columns="columns"
        row-key="_id"
        v-model:pagination="pagination"
        @request="getSpendings"
      >
        <template v-slot:top-right>
          <q-btn color="primary" label="Добавить" dense @click="modal = true" />
        </template>
      </q-table>
    </div>

    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section class="items-center">
          <q-uploader
            :url="send_url"
            :headers="header"
            color="teal"
            flat
            bordered
            field-name="file"
            style="max-width: 300px"
            accept=".csv"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Закрыть"
            color="green"
            v-close-popup
            @click="getSpendings"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useSpendings } from '../../app-modules';
import { useApps } from '../../app-modules';
import { baseURL, authToken } from '../../../boot/axios';
interface Spending {
  card: string;
  date: string;
  amount: number;
}
export default defineComponent({
  setup() {
    const {
      getSpendings,
      deleteSpendings,
      spendings,
      isLoading,
      filter,
      pagination,
    } = useSpendings();
    const { getApps, apps } = useApps();
    const $q = useQuasar();
    const columns = [
      {
        name: '_id',
        field: '_id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'date',
        field: (row: Spending) => row.date,
        label: 'Время списания',
        align: 'left',
        format: (val: string) => {
          const date = new Date(val);
          return date.toLocaleString('ru-RU', { timeZone: 'UTC' });
        },
      },
      {
        name: 'card',
        field: 'card',
        label: 'Карта',
        align: 'left',
      },
      {
        name: 'amount',
        field: 'amount',
        label: 'Ссумма списания в рублях',
        align: 'left',
      },
    ];
    getSpendings();
    getApps();
    let modal = ref(false);
    const send_url = `${baseURL}/card/spendings/new_spending`;
    const header = [{ name: 'Authorization', value: authToken }];
    const search = () => {
      getSpendings();
    };
    const confirm = () => {
      $q.dialog({
        title: 'Подтверждение',
        message: 'Вы действительно хотите удалить все записи?',
        cancel: {
          flat: true,
          label: 'Отменить',
        },
        ok: {
          flat: true,
          color: 'red',
          label: 'Удалить',
        },
        persistent: true,
      }).onOk(() => {
        deleteSpendings();
      });
    };
    return {
      isLoading,
      columns,
      spendings,
      modal,
      getSpendings,
      send_url,
      header,
      filter,
      apps,
      search,
      pagination,
      confirm,
    };
  },
});
</script>

<style></style>
