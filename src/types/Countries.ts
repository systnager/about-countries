export type Country = {
  flags: {
    png: string
  }
  name: {
    official: string
  }
  region: string
  population: number
  area: number
  languages: {
    [key: string]: string
  }
  isFavorite: boolean
}
