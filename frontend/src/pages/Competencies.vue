<template>
  <q-page class="q-pa-md">
    <q-table
      :loading="isLoading"
      title="Компетенции"
      :rows="facility"
      :columns="columns"
      row-key="_id"
      :pagination="initialPagination"
      :visible-columns="visibleColumnsFacilities()"
      :grid="$q.screen.lt.md"
    >
      <template v-slot:top-right>
        <q-btn
          v-if="hasPermisson(['директор'])"
          color="primary"
          label="Добавить"
          dense
          @click="add"
        />
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
            <q-btn
              v-if="hasPermisson(['директор'])"
              size="sm"
              color="primary"
              round
              dense
              @click="edit(props.row)"
              icon="create"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section v-if="!isCurrentLoading" class="items-center">
          <div class="row">
            <div class="col">
              <q-input
                v-model="currentCompitence.name"
                label="Название компитенции"
                :disable="currentCompitence.id ? true : false"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="currentCompitence.description" label="Описание" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отменить"
            color="red"
            @click="setCurrentCompitenceEmpty"
            v-close-popup
          />
          <q-btn flat label="Сохранить" color="green" @click="saveCurrentCompitence" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAuth } from '../modules/auth';
import { useCompitencies } from '../modules/competencies';
// import { useClients } from '../modules/clients';

interface Facility {
  id?: number;
  name: string;
  description: string;
}
export default defineComponent({
  setup() {
    const {
      facility,
      currentCompitence,
      isLoading,
      isCurrentLoading,
      getCompitencies,
      setCurrentCompitence,
      setCurrentCompitenceEmpty,
      saveCurrentCompitence,
    } = useCompitencies();
    // const { getClients, clients } = useClients();
    const { hasPermisson, visibleColumnsFacilities } = useAuth();
    const columns = [
      {
        name: 'id',
        field: 'id',
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
        name: 'description',
        field: 'description',
        label: 'Описание',
        align: 'left',
      },
    ];
    getCompitencies();
    // getClients();
    let modal = ref(false);
    const add = () => {
      setCurrentCompitenceEmpty();
      modal.value = true;
    };
    const edit = (client: Facility) => {
      setCurrentCompitence(client);
      modal.value = true;
    };
    return {
      columns,
      facility,
      isLoading,
      modal,
      add,
      edit,
      isCurrentLoading,
      currentCompitence,
      setCurrentCompitenceEmpty,
      saveCurrentCompitence,
      hasPermisson,
      visibleColumnsFacilities,
      // clients,
      initialPagination: {
        sortBy: 'id',
        descending: false,
        page: 1,
        rowsPerPage: 15,
      },
    };
  },
});
</script>

<style></style>
