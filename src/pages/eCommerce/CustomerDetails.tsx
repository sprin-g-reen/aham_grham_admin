import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@/config"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  MessageSquare,
  Edit2,
  Trash2,
  Search,
  User,
  Loader2,
  Home,
  Navigation
} from "lucide-react"

// Keep dummy data for UI placeholders if needed
const dummyOrders = [
  { id: "ORD-001", date: "2024-02-05", status: "Completed", items: 3, total: "$156.00" },
  { id: "ORD-002", date: "2024-01-28", status: "Completed", items: 2, total: "$89.50" },
  { id: "ORD-003", date: "2024-01-15", status: "Completed", items: 3, total: "$245.75" },
];

const dummyActivity = [
  { date: "2024-02-05", action: "Placed order ORD-001" },
  { date: "2024-01-28", action: "Placed order ORD-002" },
  { date: "2024-01-15", action: "Account created & joined" },
];

const statusClass = (status: string) => {
  return "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
}

const orderStatusClass = (status: string) => {
  return "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
}

export default function CustomerDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/customers`)
        // Filter by ID since we don't have a specific GET /id yet in backend (optional but robust)
        const found = response.data.find((c: any) => c._id === id)
        if (found) {
          setCustomer(found)
        } else {
          setError("Customer not found")
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch customer details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCustomer()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-2">
           <Trash2 className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold">{error || "Customer not found"}</h2>
        <Button onClick={() => navigate("/ecommerce/customer-list")}>
          Back to Customer List
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-background/60 p-4 rounded-xl border border-border/60 supports-[backdrop-filter]:backdrop-blur-md">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search other customers..." 
            className="pl-9 h-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate("/ecommerce/customer-list?search=" + e.currentTarget.value)
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/ecommerce/customer-list")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full border bg-muted/50 flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              {customer.name}
            </h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">
              ID: {customer._id.slice(-6)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={statusClass("Active")} variant="outline">
            Active Member
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* RECENT ORDERS */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {dummyOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell className="font-medium">{order.total}</TableCell>
                      <TableCell>
                        <Badge className={orderStatusClass(order.status)} variant="outline">
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ACTIVITY TIMELINE */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dummyActivity.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 last:pb-0">
                  <div className="relative">
                    <div className="h-3 w-3 rounded-full bg-blue-600 mt-1.5" />
                    {idx !== dummyActivity.length - 1 && (
                      <div className="absolute top-3 left-1.5 h-12 w-0.5 bg-border" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                  <div className="h-3 w-3 rounded-full bg-green-600 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium">Customer registered</p>
                    <p className="text-xs text-muted-foreground">{new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* PROFILE */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full border-2 bg-muted/30 flex items-center justify-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">{customer.name}</p>
                <p className="text-sm text-muted-foreground">Active Customer</p>
              </div>
            </CardContent>
          </Card>

          {/* CONTACT INFORMATION */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{customer.email}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Mobile No</p>
                  <p className="text-sm font-medium">{customer.phone}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Navigation className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{customer.city}, {customer.state}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">{customer.address}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Pincode</p>
                  <p className="text-sm font-medium">{customer.pincode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ACCOUNT INFORMATION */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Registration Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Account Status</p>
                <Badge className={statusClass("Active")} variant="outline">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* STATISTICS */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-muted-foreground">Total Orders</span>
                </div>
                <p className="font-semibold text-lg">3</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                </div>
                <p className="font-semibold text-lg">$491.25</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-muted-foreground">Status</span>
                </div>
                <p className="font-semibold text-sm text-green-600">Premium</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
