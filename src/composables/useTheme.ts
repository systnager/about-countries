import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  valueDark: 'dark',
  valueLight: '',
  storageKey: 'theme',
})

const toggleDark = useToggle(isDark)

export function useTheme() {
  return {
    isDark,
    toggleDark,
  }
}
