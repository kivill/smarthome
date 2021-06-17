import { reactive, computed, toRefs } from 'vue'
import { api, baseURL } from 'boot/axios'
import { AxiosError } from 'axios'
import { date, Notify } from 'quasar'

interface data {
  status: string;
}

interface stat {
  name: string;
  events: number[];
}

interface readings {
  sensorId: string;
  reading: number;
  createdAt: Date;
}
interface row {
  date: Date;
  expenses: number;
  income: number;
  installs: number;
}
interface AppStat {
  _id: string;
  deviceId: string;
  sensorId: string;
  readings: readings[];
}
interface Filter {
  appIds: string[],
  events: string[],
  from: Date,
  to: Date,
  currency_eur: number,
}

interface AnalyticsState {
  isLoading: boolean;
  data: data;
  filter: Filter;
  stats: AppStat[];
}

const state = reactive<AnalyticsState>({
  isLoading: false,
  data: {
    status: 'failed'
  },
  filter: {
    appIds: [],
    events: [],
    from: date.startOfDate(date.subtractFromDate(new Date(), { days: 7 }), 'day', true),
    to: date.startOfDate(new Date(), 'day', true),
    currency_eur: 1,
  },
  stats: [],
})

const computedSeries = (x: AppStat) => {
  return computed(() => {return [{ 
    name: `${x.sensorId}`,
    data: x.readings.map((x) => x.reading)
   }]})
}

const computedChartOptions = (x: AppStat) => {
  const chartOptions = computed(() => {
    return {
      chart: {
        height: 550,
        type: 'line',
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 5, 4],
        curve: 'straight',
      },
      labels: x.readings.map((x)=>x.createdAt),
      xaxis: {
        labels: {
          formatter: function (value: string) {
            return date.formatDate(new Date(value), 'DD/MM/YYYY hh:mm:ss')
          }
        }
      },
      title: {
        text: `${x.deviceId} ${x.sensorId}`,
        align: 'left',
      },
      yaxis: {
        // logarithmic: true,
      }
    }
  });
  return chartOptions
}

// const computedLTV30 = (index: number, row: number) => {
//   const arr = state.stats[index].table.slice(0, row + 1)
//     .map(x => { return { income: x.income, expenses: x.expenses, installs: x.installs } })
//     .reduce((a, b) => {
//       return { income: a.income + b.income, expenses: a.expenses + b.expenses, installs: a.installs + b.installs }
//     }, { income: 0, expenses: 0, installs: 0 });
//   return computed(() => (
//     (arr.income - arr.expenses) /
//     arr.installs
//   ).toFixed(2))
// }

export const useGoogleAnalytics = () => {
  const authGoogleAnalytics = (): void => {
    window.location.replace(baseURL + '/analytics/auth_google')
  }

  const logoutGoogleAnalytics = (): void => {
    window.location.replace(baseURL + '/analytics/auth_google_logout')
  }

  const getAnalyticsSettings = (): void => {
    state.isLoading = true;
    api.get('/analytics/settings')
      .then((data) => {
        state.data = { ...data.data } as data
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const getAnalyticsStats = (): void => {
    state.isLoading = true;
    api.get('/sensors', { params: state.filter })
      .then((data) => {
        state.stats = data.data as AppStat[]
      })
      .catch((error: AxiosError) => {
        Notify.create({
          type: 'negative',
          message: `${error?.message || 'Неожиданная ошибка'}`
        })
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const getOldAnalyticsStats = (): void => {
    state.isLoading = true;
    api.get('/analytics/stats_old', { params: state.filter })
      .then(() => {
        Notify.create('Получение статистики запущенно в фоновом режиме')
      })
      .catch((error: AxiosError) => {
        Notify.create({
          type: 'negative',
          message: `${error?.message || 'Неожиданная ошибка'}`
        })
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  return {
    authGoogleAnalytics,
    logoutGoogleAnalytics,
    getAnalyticsSettings,
    getAnalyticsStats,
    getOldAnalyticsStats,
    computedSeries,
    computedChartOptions,
    // computedLTV30,
    ...toRefs(state)
  }
}
