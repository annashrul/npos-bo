import { LOADING } from "./_constants"

export function isLoading(loading) {
  return {
    type: LOADING.IS_LOADING,
    loading
  }
}