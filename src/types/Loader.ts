import type { Ref } from 'vue'

export interface loaderProvide {
  showLoader: () => void
  hideLoader: () => void
  isLoading: Ref<boolean>
}
