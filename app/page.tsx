import FinancialTable from "@/components/financial-table"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>
      <FinancialTable />
    </main>
  )
}

