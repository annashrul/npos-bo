import { MODALS } from "redux/actions/_constants"

export const modalReducer = (state = false, action) => {
  switch (action.type) {
    case MODALS.IS_MODAL_OPEN:
      return action.isOpen;
    default:
      return state
  }
}
export const modalTypeReducer = (state = "login", action) => {
  switch (action.type) {
    case MODALS.MODAL_TYPE:
      return action.tipe
    default:
      return state
  }
}