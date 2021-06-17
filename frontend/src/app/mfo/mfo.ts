import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface authData {
  readonly email: string;
  readonly password: string;
  readonly service: {
    name: string,
    url: string
  }
}

interface mfoData {
  name: string;
  status: string
}
interface Filter {
  appIds?: string[],
  from?: Date,
  to?: Date,
}

interface Pagination {
  page?: number,
  rowsPerPage?: number,
  rowsNumber?: number
}
interface PaginationProp {
  pagination: Pagination
}

interface ServerAns extends Pagination {
  postbacks: Postback[],
}

interface Postback {
  id: string;
  currency: string;
  payout: number;
  created_at: Date;
}

interface MfoState {
  isLoading: boolean;
  mfoData: mfoData[];
  postbacks: Postback[];
  filter: Filter;
  newPostbacks: Filter;
  pagination: Pagination;
}

const state = reactive<MfoState>({
  isLoading: false,
  mfoData: [],
  postbacks: [],
  filter: {
    appIds: undefined,
    from: undefined,
    to: undefined,
  },
  newPostbacks: {
    appIds: undefined,
    from: undefined,
    to: undefined,
  },
  pagination: {
    page: 1,
    rowsPerPage: 10,
    rowsNumber: undefined
  }
})

export const useMfo = () => {
  const getMfoStatus = (): void => {
    state.isLoading = true
    api.get('/mfo/settings')
      .then((data) => {
        state.mfoData = data.data as Array<mfoData>
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const authMfo = (payload: authData): void => {
    state.isLoading = true
    api.post('/mfo', payload)
      .then(() => {
        getMfoStatus();
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getPostbacks = (props?: PaginationProp): void => {
    state.isLoading = true;
    props?.pagination ? state.pagination = props?.pagination : undefined;
    const params = {
      ...state.filter,
      ...state.pagination
    }
    api.get('/mfo', { params })
      .then((data) => {
        const asd = data.data as ServerAns;
        state.postbacks = asd.postbacks;
        state.pagination = {
          page: asd.page,
          rowsNumber: asd.rowsNumber,
          rowsPerPage: asd.rowsPerPage
        }

      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const getMfoNewPostbacks = (): void => {
    state.isLoading = true;
    api.get('/mfo/get_postbacks', { params: state.newPostbacks })
      .then(() => {
        setTimeout(getPostbacks, 5000);
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })

  }

  const setNewPostbacksEmpty = (): void => {
    state.newPostbacks = {
      appIds: undefined,
      from: undefined,
      to: undefined,
    }
  }

  return {
    getMfoStatus,
    authMfo,
    getPostbacks,
    setNewPostbacksEmpty,
    getMfoNewPostbacks,
    ...toRefs(state)
  }
}
