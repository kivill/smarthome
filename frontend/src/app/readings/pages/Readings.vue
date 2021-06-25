<template>
  <q-page class="q-pa-md">
    <div class="row q-gutter-sm">
      <!-- <div class="col">
        <q-select
          v-model="filter.appIds"
          :options="apps"
          label="ID приложений"
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
        <q-select
          v-model="filter.events"
          :options="event_names"
          label="Ивенты"
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
      </div>-->
      <!-- <div class="col-1">
        <q-btn color="primary" label="Поиск" dense @click="getAnalyticsStats" />
      </div>-->
      <!-- <div class="col-1">
        <q-btn
          color="primary"
          label="Получить старую аналитику"
          dense
          @click="getOldAnalyticsStats"
        />
      </div>-->
    </div>
    <!-- <div class="row q-gutter-sm">
      <div class="col-2">
        <q-input
          v-model.number="filter.currency_eur"
          type="number"
          min="1"
          label="Стоимость евро"
          outlined
          dense
        />
      </div>
    </div>-->
    <div v-if="stats">
      <div v-for="(stat, index) in stats" :key="index" class="q-pt-md">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col">
                <apexchart
                  type="line"
                  height="350"
                  :options="computedChartOptions(stat).value"
                  :series="computedSeries(stat).value"
                ></apexchart>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, Component, computed } from 'vue';
import { date } from 'quasar';
import { useSensors } from '../readings';
import { useTriggers } from '../../app-modules';
import VueApexCharts from 'vue3-apexcharts';
interface row {
  date: Date;
  expenses: number;
  income: number;
  installs: number;
}
export default defineComponent({
  components: {
    apexchart: VueApexCharts as Component,
  },
  setup() {
    const { getReadings, stats, filter, computedSeries, computedChartOptions } =
      useSensors();
    const { getTriggers, apps } = useTriggers();
    // getApps();
    getReadings();
    const computedInstallCost = (row: row) => {
      return computed(() => {
        if (row.installs) {
          return (row.expenses / row.installs).toFixed(2);
        } else {
          return Number(0).toFixed(2);
        }
      });
    };
    const computedROI = (row: row) => {
      return computed(() => {
        if (row.expenses) {
          return (((row.income - row.expenses) / row.expenses) * 100).toFixed(
            2
          );
        } else {
          return 100;
        }
      });
    };
    const computedLTV1 = (row: row) => {
      return computed(() => {
        if (row.installs) {
          return ((row.income - row.expenses) / row.installs).toFixed(2);
        } else {
          return 0;
        }
      });
    };
    return {
      apps,
      stats,
      filter,
      computedSeries,
      computedChartOptions,
      computedInstallCost,
      computedROI,
      computedLTV1,
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

<style></style>
