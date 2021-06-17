<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-sm">
      <div class="col" v-if="hasPermisson('admin')">
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
      <div class="col" v-if="hasPermisson('admin')">
        <q-select
          v-model="filter.userId"
          :options="users"
          label="ID пользователя"
          option-value="_id"
          option-label="fullName"
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
        <q-btn color="primary" label="Поиск" dense @click="getAppsSpendings" />
      </div>
    </div>
    <q-table
      :loading="isAppSpendingsLoading"
      title="Списания"
      :rows="appSpendings"
      :columns="columns"
      row-key="_id"
      :pagination="initialPagination"
    >
      <template v-slot:bottom-row>
        <q-tr>
          <q-td auto-width />
          <q-td auto-width />
          <q-td auto-width />
          <q-td auto-width> {{ spendingsSumm }} - Сумма </q-td>
          <q-td auto-width> {{ postbacksSumm }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useApps } from '../apps';
import { useUsers } from '../../app-modules';
import { useAuth } from '../../app-modules';

interface AppSpendings {
  _id: string;
  name: string;
  cards: string[];
  amount: number;
  user_info: Array<User>;
  spendings: Array<Spending>;
  postbacks: Array<Postback>;
}

interface Spending {
  card: string;
  date: string;
  amount: number;
}

interface User {
  _id?: string;
  fullName: string;
}

interface Postback {
  _id: string;
  sum: number;
}

export default defineComponent({
  setup() {
    const {
      getApps,
      appSpendings,
      isAppSpendingsLoading,
      getAppsSpendings,
      apps,
      filter,
      spendingsSumm,
      postbacksSumm,
    } = useApps();
    const { getUsers, users } = useUsers();
    const { hasPermisson } = useAuth();
    const columns = [
      {
        name: '_id',
        field: '_id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'name',
        field: 'name',
        label: 'Название приложения',
        align: 'left',
      },
      {
        name: 'fullName',
        field: (row: AppSpendings) => row.user_info[0],
        label: 'Пользователь',
        align: 'left',
        format: (val: User) => {
          return val.fullName;
        },
      },
      {
        name: 'amount',
        field: 'amount',
        label: 'Ссумма списания в рублях',
        align: 'left',
      },
      {
        name: 'postbacks',
        field: (row: AppSpendings) => row.postbacks,
        label: 'Выручка',
        align: 'left',
        format: (val: Array<Postback>) => {
          return val.map((x) => `${x.sum} ${x._id}`).toString();
        },
      },
    ];
    getAppsSpendings();
    getApps();
    getUsers();
    return {
      appSpendings,
      columns,
      filter,
      apps,
      isAppSpendingsLoading,
      getAppsSpendings,
      users,
      hasPermisson,
      spendingsSumm,
      postbacksSumm,
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
});
</script>
