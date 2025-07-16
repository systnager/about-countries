import type { Ref } from 'vue'

export type loaderProvide = {
  showLoader: () => void
  hideLoader: () => void
  isLoading: Ref<boolean>
}
