import { useParams, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  FileText,
  Printer,
  ChevronLeft,
} from "lucide-react"

// Dummy Data Lookup for all orders in the list
const dummyOrders: Record<string, any> = {
  "ORD-001": {
    id: "ORD-001",
    status: "Completed",
    paymentStatus: "Paid",
    date: "2024-02-01",
    total: "$25.00",
    subtotal: "$25.00",
    tax: "$0.00",
    shipping: "$0.00",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    items: [
      {
        name: "Natural Shampoo",
        price: "$25.00",
        qty: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      }
    ],
  },
  "ORD-002": {
    id: "ORD-002",
    status: "Processing",
    paymentStatus: "Paid",
    date: "2024-02-02",
    total: "$15.00",
    subtotal: "$15.00",
    tax: "$0.00",
    shipping: "$0.00",
    customer: {
      name: "Sarah Smith",
      email: "sarah@example.com",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    items: [
      {
        name: "Natural Pepper",
        price: "$15.00",
        qty: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      }
    ],
  },
  "ORD-003": {
    id: "ORD-003",
    status: "Pending",
    paymentStatus: "Unpaid",
    date: "2024-02-03",
    total: "$40.00",
    subtotal: "$40.00",
    tax: "$0.00",
    shipping: "$0.00",
    customer: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    items: [
      {
        name: "Natural Shampoo",
        price: "$25.00",
        qty: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Natural Pepper",
        price: "$15.00",
        qty: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
  "ORD-004": {
    id: "ORD-004",
    status: "Completed",
    paymentStatus: "Paid",
    date: "2024-02-04",
    total: "$20.00",
    subtotal: "$20.00",
    tax: "$0.00",
    shipping: "$0.00",
    customer: {
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    items: [
      {
        name: "Coconut Oil",
        price: "$20.00",
        qty: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      }
    ],
  },
  "ORD-005": {
    id: "ORD-005",
    status: "Processing",
    paymentStatus: "Paid",
    date: "2024-02-05",
    total: "$60.00",
    subtotal: "$60.00",
    tax: "$0.00",
    shipping: "$0.00",
    customer: {
      name: "Robert Wilson",
      email: "robert@example.com",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    items: [
      {
        name: "Natural Shampoo",
        price: "$25.00",
        qty: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Natural Pepper",
        price: "$15.00",
        qty: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Coconut Oil",
        price: "$20.00",
        qty: 1,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      },
    ],
  },
}

const statusClass = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/30"
    case "Pending":
      return "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-500/30"
    case "Processing":
      return "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30"
    case "Cancelled":
      return "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/30"
    default:
      return "bg-muted text-muted-foreground border-gray-500/30"
  }
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Find the order from our dummy data
  const order = id ? dummyOrders[id] : null

  // Handle print invoice action
  const handlePrintInvoice = () => {
    window.print()
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <p className="text-muted-foreground">The order ID "{id}" does not exist in our records.</p>
        <Button onClick={() => navigate("/eCommerce/order-list")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div className="order-detail-page animate-in fade-in duration-500">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate("/eCommerce/order-list")} className="border-primary/20 hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div>
                <h2 className="text-2xl font-semibold">
                  Order {order.id}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Placed on {order.date}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-primary/20">
                  <FileText className="mr-1 h-4 w-4" />
                  Invoice
                </Button>
                <Button variant="outline" size="sm" className="border-primary/20">
                  <Download className="mr-1 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrintInvoice} className="border-primary/20">
                  <Printer className="mr-1 h-4 w-4" />
                  Print
                </Button>
              </div>

              <Badge className={statusClass(order.status)} variant="outline">
                {order.status}
              </Badge>
            </div>
          </div>
          
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/10">
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item: any, idx: number) => (
                    <TableRow key={idx} className="border-primary/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-11 w-11 rounded-full border border-primary/10 object-cover p-1 bg-muted/50"
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell className="text-right">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle>Order Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm font-medium">
              <div className="flex items-center gap-3 text-emerald-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Order placed - {order.date}</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-500">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Payment confirmed - {order.paymentStatus}</span>
              </div>
              {order.status === "Completed" && (
                <div className="flex items-center gap-3 text-emerald-500">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Order completed and delivered</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5 xl:col-span-4">
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 border-b"><CardTitle>Customer</CardTitle></CardHeader>
              <CardContent className="pt-6 flex items-center gap-4">
                <img src={order.customer.avatar} alt={order.customer.name} className="h-14 w-14 rounded-full border-2 border-primary/20 object-cover" />
                <div>
                  <p className="font-bold text-lg">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 border-b"><CardTitle>Payment Information</CardTitle></CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Method</span>
                  <span className="font-medium">Credit Card</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest">Status</span>
                  <Badge className={order.paymentStatus === "Paid" ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" : "bg-rose-500/20 text-rose-500 border-rose-500/30"}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 border-b"><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="pt-6 space-y-3 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">{order.subtotal}</span></div>
                <div className="flex justify-between"><span>Tax</span><span className="font-medium">{order.tax}</span></div>
                <div className="flex justify-between border-b pb-3"><span>Shipping</span><span className="font-medium">{order.shipping}</span></div>
                <div className="flex justify-between font-bold text-lg pt-1"><span>Total</span><span className="text-primary">{order.total}</span></div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-primary/5 border-b"><CardTitle>Actions</CardTitle></CardHeader>
              <CardContent className="pt-6 space-y-3">
                <Select defaultValue={order.status}>
                  <SelectTrigger className="w-full bg-background border-primary/20">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">Refund Order</Button>
                <Button variant="destructive" className="w-full">Cancel Order</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
