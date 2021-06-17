import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import { Notify } from 'quasar'

interface User {
  _id?: string,
  reading: number,
}
interface Event {
  type: string;
  createdAt: Date;
  sensorReadingId: User;
  // requestData?: any;
  // eventData?: any
}


interface Filter {
  events: string[];
  userId: string[];
  from?: Date;
  to?: Date;
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
  events: Event[],
}
interface EventsState {
  isLoading: boolean;
  data: Event[];
  filter: Filter;
  pagination: Pagination;
}


const state = reactive<EventsState>({
  isLoading: false,
  data: [],
  filter: {
    events: [],
    userId: [],
    from: undefined,
    to: undefined,
  },
  pagination: {
    page: 1,
    rowsPerPage: 10,
    rowsNumber: undefined
  }
})

export const useEvents = () => {
  const getEvents = (props?: PaginationProp): void => {
    state.isLoading = true;
    props?.pagination ? state.pagination = props?.pagination : undefined;
    const params = {
      ...state.filter,
      ...state.pagination
    }
    api.get('/job', { params })
      .then(({ data }) => {
        console.log(data)
        state.data = data as Event[]
        // state.pagination = {
        //   page: data.page,
        //   rowsNumber: data.rowsNumber,
        //   rowsPerPage: data.rowsPerPage
        // }
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
    getEvents,
    ...toRefs(state)
  }
}
