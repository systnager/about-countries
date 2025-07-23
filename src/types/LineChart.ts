export interface LineChartData {
  id: string
  categories: (string | number)[]
  series: {
    name: string | number
    data: (string | number)[]
  }[]
}
