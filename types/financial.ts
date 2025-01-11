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
    min: number
    max: number
  }
  netIncome: {
    min: number
    max: number
  }
}

export type SortField = "date" | "revenue" | "netIncome"
export type SortOrder = "asc" | "desc"

