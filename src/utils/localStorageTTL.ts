import { type TTLItem } from '@/types/localStorage'

export function setItemWithTTL<T>(key: string, value: T, ttlMs: number) {
  const item: TTLItem<T> = {
    value,
    expiredAt: Date.now() + ttlMs,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export function getItemWithTTL<T>(key: string): T | null {
  const raw = localStorage.getItem(key)
  if (!raw) {
    return null
  }

  try {
    const item: TTLItem<T> = JSON.parse(raw)
    if (Date.now() > item.expiredAt) {
      localStorage.removeItem(key)
      return null
    }
    return item.value
  } catch (err) {
    console.error(err)
    localStorage.removeItem(key)
    return null
  }
}

export function removeItem(key: string) {
  localStorage.removeItem(key)
}
