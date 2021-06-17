import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface Spending {
  card: string,
  date: Date,
  amount: number,
}

interface Filter {
  appId?: string,
  from?: Date,
  to?: Date,
}

interface Pagination {
  page?: number,
  rowsPerPage?: number,
  rowsNumber?: number
}

interface ServerAns extends Pagination {
  spendings: Spending[],
}

interface SpendingsState {
  isLoading: boolean;
  spendings?: Spending[];
  filter: Filter;
  pagination: Pagination;
}

interface PaginationProp {
  pagination: Pagination
}

const state = reactive<SpendingsState>({
  isLoading: false,
  spendings: undefined,
  filter: {
    appId: undefined,
    from: undefined,
    to: undefined,
  },
  pagination: {
    page: 1,
    rowsPerPage: 10,
    rowsNumber: undefined
  }
})

export const useSpendings = () => {
  const getSpendings = (props?: PaginationProp): void => {
    state.isLoading = true;
    props?.pagination ? state.pagination = props?.pagination : undefined;
    const params = {
      ...state.filter,
      ...state.pagination
    }
    api.get('/card/spendings', { params })
      .then((data) => {
        const asd = data.data as ServerAns;
        state.spendings = asd.spendings;
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

  const deleteSpendings = (): void => {
    state.isLoading = true;
    const params = {
      ...state.filter
    }
    api.delete('/card/spendings', { params })
      .then(() => {
        getSpendings()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  return {
    getSpendings,
    deleteSpendings,
    ...toRefs(state),
  }
}
