"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Loader2 } from 'lucide-react'
import type { FinancialData, FilterState, SortField, SortOrder } from "@/types/financial"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function FinancialTable() {
  const [data, setData] = useState<FinancialData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: "2019", end: "2024" },
    revenue: { min: undefined, max: undefined },
    netIncome: { min: undefined, max: undefined }
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`
      )
      if (!response.ok) throw new Error('Failed to fetch data')
      const jsonData = await response.json()
      
      const formattedData: FinancialData[] = jsonData.map((item: {
        date: string;
        revenue: number;
        netIncome: number;
        grossProfit: number;
        eps: number;
        operatingIncome: number;
      }) => ({
        date: item.date,
        revenue: item.revenue,
        netIncome: item.netIncome,
        grossProfit: item.grossProfit,
        eps: item.eps,
        operatingIncome: item.operatingIncome
      }))
      
      setData(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const filteredAndSortedData = data
    .filter(item => {
      const year = new Date(item.date).getFullYear()
      const minRevenue = filters.revenue.min !== undefined ? Number(filters.revenue.min) * 1e9 : 0
      const maxRevenue = filters.revenue.max !== undefined ? Number(filters.revenue.max) * 1e9 : Infinity
      const minNetIncome = filters.netIncome.min !== undefined ? Number(filters.netIncome.min) * 1e9 : -Infinity
      const maxNetIncome = filters.netIncome.max !== undefined ? Number(filters.netIncome.max) * 1e9 : Infinity

      return (
        year >= parseInt(filters.dateRange.start) &&
        year <= parseInt(filters.dateRange.end) &&
        item.revenue >= minRevenue &&
        item.revenue <= maxRevenue &&
        item.netIncome >= minNetIncome &&
        item.netIncome <= maxNetIncome
      )
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1
      if (sortField === "date") {
        return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      return multiplier * (a[sortField] - b[sortField])
    })

  if (error) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Apple Inc. Financial Data</CardTitle>
        <CardDescription>Annual income statements with filtering and sorting capabilities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Start Year"
                  className="shadow-sm"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, start: e.target.value }
                  })}
                />
                <Input
                  type="number"
                  placeholder="End Year"
                  className="shadow-sm"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, end: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Revenue Range (Billions USD)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min (e.g., 200)"
                  className="shadow-sm"
                  onChange={(e) => setFilters({
                    ...filters,
                    revenue: { ...filters.revenue, min: e.target.value ? Number(e.target.value) : undefined }
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max (e.g., 400)"
                  className="shadow-sm"
                  onChange={(e) => setFilters({
                    ...filters,
                    revenue: { ...filters.revenue, max: e.target.value ? Number(e.target.value) : undefined }
                  })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Net Income Range (Billions USD)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min (e.g., 50)"
                  className="shadow-sm"
                  onChange={(e) => setFilters({
                    ...filters,
                    netIncome: { ...filters.netIncome, min: e.target.value ? Number(e.target.value) : undefined }
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max (e.g., 100)"
                  className="shadow-sm"
                  onChange={(e) => setFilters({
                    ...filters,
                    netIncome: { ...filters.netIncome, max: e.target.value ? Number(e.target.value) : undefined }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-2 hover:shadow-md transition-shadow"
                    >
                      Date
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("revenue")}
                      className="flex items-center gap-2 hover:shadow-md transition-shadow"
                    >
                      Revenue
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("netIncome")}
                      className="flex items-center gap-2 hover:shadow-md transition-shadow"
                    >
                      Net Income
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Gross Profit</TableHead>
                  <TableHead>EPS</TableHead>
                  <TableHead>Operating Income</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedData.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell>{formatCurrency(item.revenue)}</TableCell>
                      <TableCell>{formatCurrency(item.netIncome)}</TableCell>
                      <TableCell>{formatCurrency(item.grossProfit)}</TableCell>
                      <TableCell>${item.eps.toFixed(2)}</TableCell>
                      <TableCell>{formatCurrency(item.operatingIncome)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

