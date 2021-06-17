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
              <!-- <div class="col">
                <q-table
                  title="Приложения"
                  :rows="stat.table"
                  :columns="columns"
                  row-key="_id"
                  dense
                  :pagination="initialPagination"
                >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                      <q-th auto-width>Профит</q-th>
                      <q-th auto-width>Цена установки</q-th>
                      <q-th auto-width>ROI</q-th>
                      <q-th auto-width>LTV1</q-th>
                      <q-th auto-width>LTV30</q-th>
                    </q-tr>
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
                      <q-td auto-width>{{ (props.row.income - props.row.expenses).toFixed(2) }}</q-td>
                      <q-td auto-width>{{ computedInstallCost(props.row).value }}</q-td>
                      <q-td auto-width>{{ computedROI(props.row).value }}%</q-td>
                      <q-td auto-width>{{ computedLTV1(props.row).value }} руб.</q-td>
                      <q-td auto-width>{{ computedLTV30(index, props.rowIndex).value }} руб.</q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>-->
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
import { useGoogleAnalytics } from '../analytics';
import { useApps } from '../../app-modules';
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
    const {
      getAnalyticsStats,
      getOldAnalyticsStats,
      stats,
      filter,
      computedSeries,
      computedChartOptions,
      // computedLTV30,
    } = useGoogleAnalytics();
    const { getApps, apps } = useApps();
    // getApps();
    getAnalyticsStats();
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
    const event_names = [
      'first_open',
      'notification_receive',
      'notification_open',
      'purchase',
    ];
    const columns = [
      {
        name: 'date',
        field: (row: row) => row.date,
        label: 'Время прихода',
        align: 'left',
        format: (val: Date) => {
          return date.formatDate(val, 'YYYY-MM-DD');
        },
      },
      {
        name: 'expenses',
        field: 'expenses',
        label: 'Расходы',
        align: 'left',
      },
      {
        name: 'income',
        field: 'income',
        label: 'Доходы',
        align: 'left',
      },
      {
        name: 'installs',
        field: 'installs',
        label: 'Установки',
        align: 'left',
      },
    ];
    return {
      columns,
      apps,
      event_names,
      stats,
      filter,
      computedSeries,
      computedChartOptions,
      getAnalyticsStats,
      getOldAnalyticsStats,
      // computedLTV30,
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
