export type ActionTypes = 'SET_NEXT_LOADER_NOTIFICATION' | 'SET_NOTIFICATIONS'

interface IState {
  NOTIFICATIONS: IterableIterator<string> | null
  CURRENT_NOTIFICATION: string
}

export const initialState: IState = {
  NOTIFICATIONS: null,
  CURRENT_NOTIFICATION: '',
}

const Loader = (state = initialState, action: { type: ActionTypes; payload?: IterableIterator<string> }) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      if (!action.payload) throw Error(`(Loader/model/Loader.ts): invalid payload at - ${action.type}`)
      return {
        ...initialState,
        NOTIFICATIONS: action.payload,
      }
    case 'SET_NEXT_LOADER_NOTIFICATION':
      if (!state.NOTIFICATIONS)
        throw Error(`Invalid event at - ${action.type}. Notifications is ${state.NOTIFICATIONS}`)
      if (state.NOTIFICATIONS) {
        const nextNotification = state.NOTIFICATIONS.next()
        if (nextNotification.done) {
          return initialState
        }
        return {
          ...state,
          CURRENT_NOTIFICATION: nextNotification.value,
        }
      }
    default:
      return state
  }
}

export default Loader
