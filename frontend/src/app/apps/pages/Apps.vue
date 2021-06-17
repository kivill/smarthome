<template>
  <div class="q-pa-md">
    <q-table
      :loading="isLoading"
      title="Приложения"
      :rows="apps"
      :columns="columns"
      row-key="_id"
      :pagination="initialPagination"
    >
      <template v-slot:top-right>
        <q-btn color="primary" label="Добавить" dense @click="add" />
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th auto-width> Количество карт </q-th>
          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="primary"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'expand_more' : 'chevron_right'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            {{ props.row.cards.length }}
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="primary"
              round
              dense
              @click="edit(props.row)"
              icon="create"
            />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              Карточки:
              <div v-for="card in props.row.cards" :key="card._id">
                {{ card }}
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>

  <q-dialog v-model="modal" persistent>
    <q-card>
      <q-card-section v-if="!isCurrentLoading" class="items-center">
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-input
              v-model="currentApp.name"
              label="Название"
              :disable="currentApp._id ? true : false"
            />
          </div>
          <div class="col">
            <q-select
              v-model="currentApp.user"
              :options="users"
              label="Пользователь"
              option-value="_id"
              option-label="fullName"
              emit-value
              map-options
            />
          </div>
          <div class="col">
            <q-select
              v-model="currentApp.mfoService"
              :options="mfoData"
              label="Приложение"
              option-value="_id"
              option-label="name"
              emit-value
              map-options
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-input v-model="currentApp.userId" label="ID пользователя" />
          </div>
          <div class="col">
            <q-input v-model="currentApp.utmSource" label="utm_source" />
          </div>
          <div class="col">
            <q-input v-model="currentApp.propertyId" label="Property ID" />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-btn
              class="col"
              label="Добавить карту"
              color="primary"
              @click="currentApp.cards.push('')"
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div v-for="(card, index) in currentApp.cards" :key="index">
            <q-input v-model="currentApp.cards[index]" label="Номер карты">
              <template v-if="currentApp.cards[index]" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop="currentApp.cards.splice(index, 1)"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Отменить"
          color="red"
          @click="setCurrentAppEmpty"
          v-close-popup
        />
        <q-btn
          flat
          label="Сохранить"
          color="green"
          @click="saveCurrent"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useApps } from '../apps';
import { useUsers } from '../../app-modules';
import { useMfo } from '../../app-modules';
import { useAuth } from '../../app-modules';

interface App {
  name: string;
  utmSource: string;
  userId: number;
  cards: string[];
  user: string;
  mfoService: number;
  propertyId: number;
}
interface User {
  _id?: string;
  fullName: string;
}
interface Row {
  user: User;
}
export default defineComponent({
  name: 'Apps',
  setup() {
    const {
      getApps,
      isLoading,
      isCurrentLoading,
      apps,
      currentApp,
      setCurrentApp,
      setCurrentAppEmpty,
      saveCurrent,
    } = useApps();
    const { getUsers, users } = useUsers();
    const { getMfoStatus, mfoData } = useMfo();
    const { hasPermisson } = useAuth();
    const columns = [
      {
        name: 'id',
        field: '_id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'name',
        field: 'name',
        label: 'Название',
        align: 'left',
      },
      {
        name: 'fullName',
        field: (row: Row) => row.user.fullName,
        format: (val: string) => `${val}`,
        label: 'Пользователь',
        align: 'left',
      },
    ];
    getApps();
    getUsers();
    getMfoStatus();

    let modal = ref(false);
    const add = () => {
      setCurrentAppEmpty();
      modal.value = true;
    };
    const edit = (app: App) => {
      setCurrentApp(app);
      modal.value = true;
    };
    return {
      apps,
      columns,
      isLoading,
      isCurrentLoading,
      modal,
      add,
      edit,
      currentApp,
      setCurrentApp,
      setCurrentAppEmpty,
      saveCurrent,
      users,
      mfoData,
      hasPermisson,
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
