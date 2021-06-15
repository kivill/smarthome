import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'

interface Compitence {
  id?: number,
  name: string,
  description: string,
}

interface CompitenceState {
  isLoading: boolean;
  isCurrentLoading: boolean;
  facility?: Compitence[];
  currentCompitence?: Compitence;
}

const state = reactive<CompitenceState>({
  isLoading: false,
  isCurrentLoading: false,
  facility: undefined,
  currentCompitence: undefined,
})

export const useCompitencies = () => {
  const getCompitencies = (): void => {
    state.isLoading = true;
    api.get('/competence/get')
      .then((data) => {
        state.facility = data.data as Array<Compitence>
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isLoading = false;
      })
  }

  const setCurrentCompitence = (user: Compitence): void => {
    state.isCurrentLoading = true;
    api.get(`/competence/get/${user.id || ''}`)
      .then((data) => {
        state.currentCompitence = data.data as Compitence
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        state.isCurrentLoading = false;
      })
  }

  const setCurrentCompitenceEmpty = (): void => {
    state.currentCompitence = {
      name: '',
      description: '',
    }
  }

  const saveCurrentCompitence = (): void => {
    if (!state.currentCompitence?.id) {
      state.isLoading = true;
      api.post('/competence/create', state.currentCompitence)
        .then(() => {
          getCompitencies();
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          state.isLoading = false;
        })
    } else {
      state.isLoading = true;
      api.post(`/competence/update/${state.currentCompitence.id}`, state.currentCompitence)
        .then(() => {
          getCompitencies();
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
    getCompitencies,
    setCurrentCompitence,
    setCurrentCompitenceEmpty,
    saveCurrentCompitence,
    ...toRefs(state),
  }
}
