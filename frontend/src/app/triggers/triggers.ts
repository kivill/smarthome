import { reactive, computed, toRefs } from 'vue'
import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import { Notify } from 'quasar'

interface User {
  _id?: string,
  fullName: string,
}

interface Sensor {
  _id?: string,
  deviceId: string,
  sensorId: string,
}

interface Confines {
  _id?: string,
  confine: string,
  value: number,
}

interface Job {
  _id?: string,
  jobType: string,
  jobInfo: string,
}

interface App {
  _id?: string,
  sensorId: string | Sensor,
  confines: Confines[],
  jobs: Job[],
}

interface Filter {
  appId?: string[],
  userId?: string[],
  from?: Date,
  to?: Date,
}
interface AppsState {
  isLoading: boolean;
  isCurrentLoading: boolean;
  isAppSpendingsLoading: boolean,
  apps?: App[];
  currentTrigger?: App;
  filter: Filter;
}

const state = reactive<AppsState>({
  isLoading: false,
  isCurrentLoading: false,
  isAppSpendingsLoading: false,
  apps: undefined,
  currentTrigger: undefined,
  filter: {
    appId: undefined,
    userId: undefined,
    from: undefined,
    to: undefined,
  },
})

export const useTriggers = () => {
  const getTriggers = (): void => {
    state.isLoading = true;
    api.get('/triggers')
      .then((data) => {
        state.apps = data.data as Array<App>
      })
      .catch((error: AxiosError) => {
        Notify.create({
          type: 'negative',
          message: `${error?.message ||'Неожиданная ошибка'}`
        })
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const setCurrentTrigger = (app: App): void => {
    state.isCurrentLoading = true;
    api.get(`/triggers/${app._id || ''}`)
      .then((data) => {
        state.currentTrigger = data.data as App
      })
      .catch((error: AxiosError) => {
        Notify.create({
          type: 'negative',
          message: `${error?.message ||'Неожиданная ошибка'}`
        })
        console.log(error)
      })
      .finally(() => {
        state.isCurrentLoading = false;
      })
  }

  const setCurrentTriggerEmpty = (): void => {
    state.currentTrigger = {
      sensorId: '',
      confines: [],
      jobs: [],
    }
  }

  const saveCurrent = (): void => {
    if (!state.currentTrigger?._id) {
      state.isLoading = true;
      api.post('/triggers', state.currentTrigger)
        .then(() => {
          getTriggers();
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          state.isLoading = false;
        })
    } else {
      state.isLoading = true;
      api.put(`/triggers/${state.currentTrigger._id}`, state.currentTrigger)
        .then(() => {
          getTriggers();
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          state.isLoading = false;
        })
    }
  }

  return {
    getTriggers,
    setCurrentTrigger,
    setCurrentTriggerEmpty,
    saveCurrent,
    ...toRefs(state),
  }
}
