import { LOADING } from "actions/_constants"

export const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case LOADING.IS_LOADING:
      state = action.loading
      return state
    default:
      return state
  }
}