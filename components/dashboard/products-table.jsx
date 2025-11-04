import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const products = [
  { id: "1", name: "Premium Analytics Suite", price: 299, sales: 24500, change: 12 },
  { id: "2", name: "Business Intelligence Tool", price: 199, sales: 18234, change: -5 },
  { id: "3", name: "Real-time Dashboard", price: 399, sales: 31245, change: 8 },
  { id: "4", name: "Data Visualization Kit", price: 149, sales: 12580, change: 15 },
]

export function ProductsTable() {
  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top Products</h3>
        <a href="#" className="text-chart-1 text-sm font-medium hover:underline">
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Product Name</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Price</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Total Sales</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Change</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 text-foreground font-medium">{product.name}</td>
                <td className="py-4 px-4 text-foreground">${product.price}</td>
                <td className="py-4 px-4 text-foreground">${product.sales.toLocaleString()}</td>
                <td className="py-4 px-4">
                  <div
                    className={`flex items-center gap-1 ${product.change >= 0 ? "text-chart-1" : "text-destructive"}`}
                  >
                    {product.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-semibold">{Math.abs(product.change)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
