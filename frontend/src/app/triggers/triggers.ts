import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import { Notify } from 'quasar'
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

interface Trigger {
  _id?: string,
  sensorId: string | Sensor,
  confines: Confines[],
  jobs: Job[],
}

interface TriggersState {
  isLoading: boolean;
  isCurrentLoading: boolean;
  triggers: Trigger[];
  currentTrigger?: Trigger;
}

const state = reactive<TriggersState>({
  isLoading: false,
  isCurrentLoading: false,
  triggers: [],
  currentTrigger: undefined,
})

export const useTriggers = () => {
  const getTriggers = (): void => {
    state.isLoading = true;
    api.get('/triggers')
      .then((data) => {
        state.triggers = data.data as Array<Trigger>
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

  const setCurrentTrigger = (trigger: Trigger): void => {
    state.isCurrentLoading = true;
    api.get(`/triggers/${trigger._id || ''}`)
      .then((data) => {
        state.currentTrigger = data.data as Trigger
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
      api.put(`/triggers/${state.currentTrigger._id}`,
       state.currentTrigger)
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
