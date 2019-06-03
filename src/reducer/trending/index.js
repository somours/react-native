import Types from '../../action/types'

const defaultState = {}

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.TRENDING_REFRESH_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          items: action.items,
          projectModels: action.projectModels,
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex
        }
      }
    case Types.TRENDING_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName]
        }
      }
  }
}