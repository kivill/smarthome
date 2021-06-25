import { reactive, computed, toRefs } from 'vue'
import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import { date, Notify } from 'quasar'

interface Readings {
  sensorId: string;
  reading: number;
  createdAt: Date;
}

interface Sensor {
  _id: string;
  deviceId: string;
  sensorId: string;
  readings: Readings[];
}

interface Filter {
  from: Date,
  to: Date,
}

interface AnalyticsState {
  isLoading: boolean;
  filter: Filter;
  stats: Sensor[];
}

const state = reactive<AnalyticsState>({
  isLoading: false,
  filter: {
    from: date.startOfDate(date.subtractFromDate(new Date(), { days: 7 }), 'day', true),
    to: date.startOfDate(new Date(), 'day', true),
  },
  stats: [],
})

const computedSeries = (x: Sensor) => {
  return computed(() => {return [{ 
    name: `${x.sensorId}`,
    data: x.readings.map((x) => x.reading)
   }]})
}

const computedChartOptions = (x: Sensor) => {
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


export const useSensors = () => {
  const getReadings = (): void => {
    state.isLoading = true;
    api.get('/sensors', { params: state.filter })
      .then((data) => {
        state.stats = data.data as Sensor[]
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
    getReadings,
    computedSeries,
    computedChartOptions,
    ...toRefs(state)
  }
}
