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
  code: string
  capital: string[]
  currencies: {
    [key: string]: {
      symbol: string
      name: string
    }
  }
  timezones: {
    [key: string]: string
  }
  latlng: [number, number]
  subregion: string
  ccn3: string
}
