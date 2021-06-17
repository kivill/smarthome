<template>
  <q-page class="q-pa-md">
    <!-- <div class="row q-gutter-sm">
      <div class="col" v-if="hasPermisson('admin')">
        <q-select
          v-model="filter.events"
          :options="events_names"
          label="Тип события"
          outlined
          dense
          clearable
          multiple
        />
      </div>
      <div class="col" v-if="hasPermisson('admin')">
        <q-select
          v-model="filter.userId"
          :options="userList()"
          label="ID пользователя"
          option-value="id"
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
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="filter.from" minimal></q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon name="clear" class="cursor-pointer" @click="filter.from = null" />
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-input outlined v-model="filter.to" dense mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="filter.to" minimal></q-date>
              </q-popup-proxy>
            </q-icon>
            <q-icon name="clear" class="cursor-pointer" @click="filter.to = null" />
          </template>
        </q-input>
      </div>
      <div class="col-1">
        <q-btn color="primary" label="Поиск" dense @click="getEvents" />
      </div>
    </div>-->
    <div class="row q-mt-lg">
      <div class="col">
        <q-table
          :loading="isLoading"
          title="События"
          :rows="data"
          :columns="columns"
          row-key="_id"
          v-model:pagination="pagination"
          @request="getEvents"
        >
          <!-- <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width></q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
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
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="row">
                  <div class="col" v-if="props.row.requestData?.body">
                    <pre
                      >{{ props.row.requestData.body }}
                    </pre>
                  </div>
                  <div class="col" v-if="props.row.requestData?.params">
                    <pre>
                      {{ props.row.requestData.params }}
                    </pre>
                  </div>
                  <div class="col" v-else>
                    <pre>
                      {{ props.row.eventData }}
                    </pre>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>-->
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useEvents } from '../events';
import { useAuth } from '../../app-modules';
import { useUsers } from '../../app-modules';
interface User {
  _id?: string;
  reading: number;
}

interface Event {
  type: string;
  createdAt: Date;
  sensorReadingId: User;
}
export default defineComponent({
  setup() {
    const { hasPermisson } = useAuth();
    const { getUsers, users } = useUsers();
    const { getEvents, data, isLoading, filter, pagination } = useEvents();
    const userList = () => {
      const list = users.value.map((x) => {
        return { name: x.fullName, id: x._id };
      });
      list.push({ name: 'system', id: '' });
      return list;
    };
    const columns = [
      {
        name: '_id',
        field: '_id',
        label: 'id',
        align: 'left',
      },
      {
        name: 'date',
        field: (row: Event) => row.createdAt,
        label: 'Время события',
        align: 'left',
        format: (val: string) => {
          const date = new Date(val);
          return date.toLocaleString('ru-RU');
        },
      },
      {
        name: 'type',
        field: 'type',
        label: 'Событие',
        align: 'left',
      },
      {
        name: 'userName',
        field: (row: Event) => row,
        label: 'Показание',
        align: 'left',
        format: (val: Event) => {
          return val?.sensorReadingId.reading;
        },
      },
    ];
    const events_names = [
      'user.app.update',
      'user.app.create',
      'user.spendings.delete',
      'user.spendings.create',
      'user.app.get',
    ];
    getUsers();
    getEvents();
    return {
      hasPermisson,
      isLoading,
      data,
      columns,
      filter,
      pagination,
      getEvents,
      userList,
      events_names,
    };
  },
});
</script>

<style></style>
