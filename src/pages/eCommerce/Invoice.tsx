import { useParams, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Printer,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react"

// Dummy Invoice Data Mapping
const dummyInvoices: Record<string, any> = {
  "ORD-001": {
    id: "INV-001",
    orderId: "ORD-001",
    date: "2024-02-01",
    dueDate: "2024-02-08",
    status: "Paid",
    company: {
      name: "Aham Grham",
      address: "Divine Spaces, Kerala, India",
      email: "billing@ahamgraham.com",
    },
    customer: {
      name: "John Doe",
      address: "123 Serenity Lane, Wellness City, UK",
      email: "john@example.com",
    },
    items: [
      { name: "Natural Shampoo", qty: 1, price: 25.00 },
    ],
    subtotal: 25.00,
    tax: 0.00,
    shipping: 0.00,
    total: 25.00,
  },
  "ORD-002": {
    id: "INV-002",
    orderId: "ORD-002",
    date: "2024-02-02",
    dueDate: "2024-02-09",
    status: "Paid",
    company: {
      name: "Aham Grham",
      address: "Divine Spaces, Kerala, India",
      email: "billing@ahamgraham.com",
    },
    customer: {
      name: "Sarah Smith",
      address: "45 Lotus Garden, Sydney, Australia",
      email: "sarah@example.com",
    },
    items: [
      { name: "Natural Pepper", qty: 1, price: 15.00 },
    ],
    subtotal: 15.00,
    tax: 0.00,
    shipping: 0.00,
    total: 15.00,
  },
  "ORD-003": {
    id: "INV-003",
    orderId: "ORD-003",
    date: "2024-02-03",
    dueDate: "2024-02-10",
    status: "Paid",
    company: {
      name: "Aham Grham",
      address: "Divine Spaces, Kerala, India",
      email: "billing@ahamgraham.com",
    },
    customer: {
      name: "Michael Brown",
      address: "78 Ancient Grove, California, USA",
      email: "michael@example.com",
    },
    items: [
      { name: "Natural Shampoo", qty: 1, price: 25.00 },
      { name: "Natural Pepper", qty: 1, price: 15.00 },
    ],
    subtotal: 40.00,
    tax: 0.00,
    shipping: 0.00,
    total: 40.00,
  },
  "ORD-004": {
    id: "INV-004",
    orderId: "ORD-004",
    date: "2024-02-04",
    dueDate: "2024-02-11",
    status: "Paid",
    company: {
      name: "Aham Grham",
      address: "Divine Spaces, Kerala, India",
      email: "billing@ahamgraham.com",
    },
    customer: {
      name: "Emily Davis",
      address: "12 Pine View, London, UK",
      email: "emily@example.com",
    },
    items: [
      { name: "Coconut Oil", qty: 1, price: 20.00 },
    ],
    subtotal: 20.00,
    tax: 0.00,
    shipping: 0.00,
    total: 20.00,
  },
  "ORD-005": {
    id: "INV-005",
    orderId: "ORD-005",
    date: "2024-02-05",
    dueDate: "2024-02-12",
    status: "Pending",
    company: {
      name: "Aham Grham",
      address: "Divine Spaces, Kerala, India",
      email: "billing@ahamgraham.com",
    },
    customer: {
      name: "Robert Wilson",
      address: "99 Ocean Breeze, Florida, USA",
      email: "robert@example.com",
    },
    items: [
      { name: "Natural Shampoo", qty: 1, price: 25.00 },
      { name: "Natural Pepper", qty: 1, price: 15.00 },
      { name: "Coconut Oil", qty: 1, price: 20.00 },
    ],
    subtotal: 60.00,
    tax: 0.00,
    shipping: 0.00,
    total: 60.00,
  },
}

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Find invoice data based on Order ID
  const invoice = id ? dummyInvoices[id] : null

  const handlePrintInvoice = () => {
    window.print()
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <h2 className="text-2xl font-bold">Invoice Not Found</h2>
        <p className="text-muted-foreground">The invoice associated with order "{id}" could not be located.</p>
        <Button onClick={() => navigate("/eCommerce/order-list")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6 border-primary/10">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate("/eCommerce/order-list")} className="border-primary/20 hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h2 className="text-2xl font-semibold uppercase tracking-tight">
              Invoice {invoice.id}
            </h2>
            <p className="text-sm text-muted-foreground">
              Reference: Order {invoice.orderId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handlePrintInvoice} className="border-primary/20">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>

          <Button variant="outline" size="sm" className="border-primary/20">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>

          <Badge className={invoice.status === "Paid" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30 px-3 py-1" : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 px-3 py-1"}>
            {invoice.status}
          </Badge>
        </div>
      </div>

      <Card className="mx-auto max-w-4xl border-primary/20 shadow-2xl overflow-hidden bg-background">
        <CardContent className="space-y-10 p-10">
          <div className="flex flex-wrap justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-primary italic">
                {invoice.company.name}
              </h3>
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p>{invoice.company.address}</p>
                <p>{invoice.company.email}</p>
              </div>
            </div>

            <div className="text-sm bg-muted/30 p-6 rounded-2xl border border-primary/10 min-w-[200px]">
              <div className="space-y-2">
                <p className="flex justify-between gap-4"><span className="text-muted-foreground uppercase text-[10px] font-bold">Invoice</span> <span className="font-bold">{invoice.id}</span></p>
                <p className="flex justify-between gap-4"><span className="text-muted-foreground uppercase text-[10px] font-bold">Date</span> <span className="font-medium">{invoice.date}</span></p>
                <p className="flex justify-between gap-4"><span className="text-muted-foreground uppercase text-[10px] font-bold">Due</span> <span className="font-medium text-rose-500">{invoice.dueDate}</span></p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-6 border border-primary/10 rounded-2xl bg-muted/10">
              <p className="mb-3 text-[10px] font-bold uppercase text-primary tracking-widest">
                Bill To
              </p>
              <p className="font-bold text-lg mb-1">
                {invoice.customer.name}
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{invoice.customer.address}</p>
                <p>{invoice.customer.email}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-2xl border-primary/10">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-primary/5">
                <tr className="border-b border-primary/10">
                  <th className="py-4 px-6 text-left font-bold uppercase text-[10px] tracking-widest">Item Description</th>
                  <th className="py-4 px-6 text-center font-bold uppercase text-[10px] tracking-widest">Qty</th>
                  <th className="py-4 px-6 text-right font-bold uppercase text-[10px] tracking-widest">Unit Price</th>
                  <th className="py-4 px-6 text-right font-bold uppercase text-[10px] tracking-widest">Amount</th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-primary/5 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 font-medium">{item.name}</td>
                    <td className="py-4 px-6 text-center">{item.qty}</td>
                    <td className="py-4 px-6 text-right">₹{item.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right font-bold text-primary">₹{(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pr-6">
            <div className="w-full max-w-xs space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (0%)</span>
                <span className="font-medium text-foreground">₹{invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground pb-2">
                <span>Shipping</span>
                <span className="font-medium text-foreground">₹{invoice.shipping.toFixed(2)}</span>
              </div>
              <Separator className="bg-primary/20 h-[2px]" />
              <div className="flex justify-between text-xl font-bold pt-2">
                <span className="text-primary">Total Amount</span>
                <span className="text-primary">₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-primary/10" />

          <div className="text-center space-y-2">
            <p className="text-sm font-bold text-primary tracking-widest uppercase">Thank you for your business!</p>
            <p className="text-[10px] text-muted-foreground italic">If you have any questions regarding this invoice, please contact us at support@ahamgraham.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
