import { reactive, computed, toRefs } from 'vue'
import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import { Notify } from 'quasar'

interface User {
  _id?: string,
  fullName: string,
}

interface App {
  _id?: string,
  name: string,
  utmSource: string,
  userId?: number,
  cards: string[],
  user: string | User,
  mfoService?: number,
  propertyId?: number,
}


interface Postback {
  _id: string;
  sum: number;
}

interface AppSpendings {
  _id: string,
  name: string,
  cards: string[],
  amount: number,
  postbacks: Postback[];
  user_info?: User
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
  currentApp?: App;
  appSpendings?: AppSpendings[];
  filter: Filter;
}

const state = reactive<AppsState>({
  isLoading: false,
  isCurrentLoading: false,
  isAppSpendingsLoading: false,
  apps: undefined,
  currentApp: undefined,
  appSpendings: undefined,
  filter: {
    appId: undefined,
    userId: undefined,
    from: undefined,
    to: undefined,
  },
})

const spendingsSumm = computed<string | undefined>(() => state?.appSpendings?.map(a => a.amount).reduce((a, b) => a + b, 0).toFixed(2))

const postbacksSumm = computed<string | undefined>(() => {
  const arr = state?.appSpendings?.map(a => a.postbacks)
  const tmp: { [k: string]: number } = {};
  if (arr) {
    for (const a of arr) {
      for (const s of a) {
        if (tmp.hasOwnProperty(s._id)) {
          tmp[s._id] += s.sum
        } else {
          tmp[s._id] = s.sum
        }
      }
    }
    let s = ''
    for (const [key, value] of Object.entries(tmp)) {
      s = s.concat(value.toString(), ' ', key, ', ')
    }
    return s.slice(0, s.length - 2)
  } else {
    return '0'
  }
})

export const useApps = () => {
  const getApps = (): void => {
    state.isLoading = true;
    api.get('/card/apps')
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

  const getAppsSpendings = (): void => {
    state.isAppSpendingsLoading = true;
    const params = {
      ...state.filter,
    }
    api.get('/card/spendings/by_apps', { params })
      .then((data) => {
        state.appSpendings = data.data as Array<AppSpendings>;
      })
      .catch((error: AxiosError) => {
        Notify.create({
          type: 'negative',
          message: `${error?.message ||'Неожиданная ошибка'}`
        })
        console.log(error)
      })
      .finally(() => {
        state.isAppSpendingsLoading = false;
      })
  }

  const setCurrentApp = (app: App): void => {
    state.isCurrentLoading = true;
    api.get(`/card/apps/${app._id || ''}`)
      .then((data) => {
        state.currentApp = data.data as App
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

  const setCurrentAppEmpty = (): void => {
    state.currentApp = {
      name: '',
      utmSource: '',
      userId: undefined,
      cards: [],
      user: '',
      mfoService: undefined,
      propertyId: undefined,
    }
  }

  const saveCurrent = (): void => {
    if (!state.currentApp?._id) {
      state.isLoading = true;
      api.post('/card/apps/', state.currentApp)
        .then(() => {
          getApps();
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          state.isLoading = false;
        })
    } else {
      state.isLoading = true;
      api.post(`/card/apps/${state.currentApp._id}`, state.currentApp)
        .then(() => {
          getApps();
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
    getApps,
    getAppsSpendings,
    setCurrentApp,
    setCurrentAppEmpty,
    saveCurrent,
    spendingsSumm,
    postbacksSumm,
    ...toRefs(state),
  }
}
