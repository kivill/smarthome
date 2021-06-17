<template>
  <div class="q-pa-md">
    <q-table
      :loading="isLoading"
      title="Триггеры"
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
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
          <q-td auto-width>
            <q-btn size="sm" color="primary" round dense @click="edit(props.row)" icon="create" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>

  <q-dialog v-model="modal" persistent>
    <q-card style="min-width: 400px">
      <q-card-section v-if="!isCurrentLoading" class="items-center">
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-select
              v-model="currentApp.sensorId"
              :options="stats"
              label="Сенсор"
              option-value="_id"
              option-label="sensorId"
              emit-value
              map-options
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-btn
              class="col"
              label="Добавить ограничение"
              color="primary"
              @click="currentApp.confines.push({
                confine: '',
                value: 0,
              })"
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <div
              v-for="(card, index) in currentApp.confines"
              :key="index"
              class="row q-col-gutter-sm"
            >
              <div class="col-5">
                <q-select
                  dense
                  v-model="currentApp.confines[index].confine"
                  :options="['>', '<']"
                  label="Ограничение"
                />
              </div>
              <div class="col-5">
                <q-input dense v-model="currentApp.confines[index].value" label="Значение" />
              </div>
              <div class="col">
                <q-icon
                  color="primary"
                  @click.stop="currentApp.confines.splice(index, 1)"
                  name="cancel"
                  style="font-size: 32px;"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <q-btn
              class="col"
              label="Добавить команду"
              color="primary"
              @click="currentApp.jobs.push({
                jobType: '',
                jobInfo: 0,
              })"
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col">
            <div v-for="(card, index) in currentApp.jobs" :key="index" class="row q-col-gutter-sm">
              <div class="col-5">
                <q-select
                  dense
                  v-model="currentApp.jobs[index].jobType"
                  :options="['light']"
                  label="Команда"
                />
              </div>
              <div class="col-5">
                <q-input dense v-model="currentApp.jobs[index].jobInfo" label="Значение" />
              </div>
              <div class="col">
                <q-icon
                  color="primary"
                  @click.stop="currentApp.jobs.splice(index, 1)"
                  name="cancel"
                  style="font-size: 32px;"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отменить" color="red" @click="setCurrentAppEmpty" v-close-popup />
        <q-btn flat label="Сохранить" color="green" @click="saveCurrent" v-close-popup />
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
import { useGoogleAnalytics } from '../../app-modules';

interface Sensor {
  _id?: string;
  deviceId: string;
  sensorId: string;
}

interface Confines {
  _id?: string;
  confine: string;
  value: number;
}

interface Job {
  _id?: string;
  jobType: string;
  jobInfo: string;
}

interface App {
  _id?: string;
  sensorId: string | Sensor;
  confines: Confines[];
  jobs: Job[];
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
    const { getAnalyticsStats, stats } = useGoogleAnalytics();
    const { hasPermisson } = useAuth();
    getAnalyticsStats();
    const columns = [
      {
        name: 'id',
        field: '_id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'fullName',
        field: (row: App) => row,
        format: (val: App) => {
          if (typeof val.sensorId == 'string') {
            return val;
          } else {
            return `${val.sensorId.deviceId} ${val.sensorId.sensorId}`;
          }
        },
        label: 'Сенсор',
        align: 'left',
      },
    ];
    getApps();
    // getUsers();
    // getMfoStatus();

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
      stats,
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
