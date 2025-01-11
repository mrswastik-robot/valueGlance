export interface FinancialData {
  date: string
  revenue: number
  netIncome: number
  grossProfit: number
  eps: number
  operatingIncome: number
}

export interface FilterState {
  dateRange: {
    start: string
    end: string
  }
  revenue: {
    min: number | undefined
    max: number | undefined
  }
  netIncome: {
    min: number | undefined
    max: number | undefined
  }
}

export type SortField = "date" | "revenue" | "netIncome"
export type SortOrder = "asc" | "desc"

