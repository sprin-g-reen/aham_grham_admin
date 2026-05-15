import { useMemo, useState, ReactNode, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"
import axios from "axios"
import { API_URL } from "@/config"
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  User,
  Settings,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Hash,
  Map,
  Navigation,
  Eye,
  RefreshCcw,
  Trash2
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { Textarea } from "@/components/ui/textarea"

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email: string;
  pincode: string;
  city: string;
  state: string;
  address: string;
  createdAt: string;
}

export default function CustomerList() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)
  const [isBulkDelete, setIsBulkDelete] = useState(false)

  const [customerList, setCustomerList] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const PAGE_SIZE = 10

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    pincode: "",
    city: "",
    state: "",
    address: ""
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = `${API_URL}/customers`;
      console.log("Fetching customers from:", url);
      const res = await axios.get(url)
      console.log("Fetched customers:", res.data);
      setCustomerList(res.data)
    } catch (err: any) {
      console.error("Error fetching customers:", err)
      setError(err.message || "Failed to connect to backend")
    } finally {
      setLoading(false)
    }
  }


  const handleAddCustomer = async () => {
    try {
      if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
        alert("Please fill in all required fields")
        return
      }
      await axios.post(`${API_URL}/customers`, newCustomer)
      fetchCustomers()
      setOpen(false)
      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        pincode: "",
        city: "",
        state: "",
        address: ""
      })
    } catch (err) {
      console.error("Error adding customer:", err)
      alert("Failed to add customer")
    }
  }

  const handleDeleteSelected = () => {
    setIsBulkDelete(true)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    try {
      if (isBulkDelete) {
        await Promise.all(selected.map(id => axios.delete(`${API_URL}/customers/${id}`)))
        setSelected([])
      } else if (customerToDelete) {
        await axios.delete(`${API_URL}/customers/${customerToDelete}`)
        setSelected(prev => prev.filter(i => i !== customerToDelete))
      }
      fetchCustomers()
    } catch (err) {
      console.error("Error during deletion:", err)
    } finally {
      setDeleteConfirmOpen(false)
      setCustomerToDelete(null)
      setIsBulkDelete(false)
    }
  }

  const handleDeleteOne = (id: string) => {
    setCustomerToDelete(id)
    setIsBulkDelete(false)
    setDeleteConfirmOpen(true)
  }


  const filtered = useMemo(() => {
    return customerList.filter((customer) =>
      `${customer.name} ${customer.email} ${customer.phone} ${customer.city} ${customer.state}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, customerList])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const paginated = filtered.slice(start, start + PAGE_SIZE)

  const handleSelectAll = () => {
    if (selected.length === paginated.length) {
      setSelected([])
    } else {
      setSelected(paginated.map((customer) => customer._id))
    }
  }

  const handleSelectOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isAllSelected = paginated.length > 0 && paginated.every(c => selected.includes(c._id))
  const totalCustomers = customerList.length

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <CustomerStatCard
          icon={<Users className="h-6 w-6 text-sky-600" />}
          value={totalCustomers}
          label="Total Registered Customers"
        />
        <CustomerStatCard
          icon={<Calendar className="h-6 w-6 text-emerald-600" />}
          value={customerList.length > 0 ? new Date(customerList[0].createdAt).toLocaleDateString() : "No Records"}
          label="Latest Ritual Registration"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ritual Customers</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, city..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchCustomers} disabled={loading}>
                <Settings className={`mr-1 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {selected.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected ({selected.length})
                </Button>
              )}
              <Button onClick={() => setOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Add Entry
              </Button>
            </div>

          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-2 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p>Loading customers...</p>
            </div>
          ) : error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-12 text-center text-red-600">
              <LogOut className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-semibold">{error}</p>
              <p className="text-sm mt-1">Make sure the backend server is running on port 5000.</p>
              <Button variant="outline" className="mt-4 border-red-200 hover:bg-red-100 text-red-700" onClick={fetchCustomers}>
                Retry Connection
              </Button>
            </div>
          ) : paginated.length === 0 ? (

            <div className="rounded-md border p-12 text-center text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No customers found matching your search.</p>
            </div>
          ) : isMobile ? (
            <div className="space-y-4">
              {paginated.map((customer) => (
                <Card key={customer._id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border flex items-center justify-center bg-muted/50">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 
                            className="font-semibold cursor-pointer hover:underline hover:text-primary transition-colors" 
                            onClick={() => navigate(`/ecommerce/customer_details/${customer._id}`)}
                          >

                            {customer.name}
                          </h4>

                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/ecommerce/customer_details/${customer._id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOne(customer._id)}>
                            <LogOut className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{customer.city}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                        <Calendar className="h-3 w-3" />
                        <span>Registered: {new Date(customer.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="relative w-full overflow-x-auto rounded-md border">
              <Table className="w-full">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile No</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Pincode</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginated.map((customer) => (
                    <TableRow key={customer._id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selected.includes(customer._id)}
                          onCheckedChange={() => handleSelectOne(customer._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full border flex items-center justify-center bg-muted/50">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span 
                            className="font-medium cursor-pointer hover:underline hover:text-primary transition-colors" 
                            onClick={() => navigate(`/ecommerce/customer_details/${customer._id}`)}
                          >

                            {customer.name}
                          </span>

                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" /> {customer.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" /> {customer.phone}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs gap-1">
                          <span className="flex items-center gap-1 font-medium"><Navigation className="h-3 w-3 text-muted-foreground" /> {customer.city}</span>
                          <span className="flex items-center gap-1 text-muted-foreground">{customer.state}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <p className="text-xs truncate" title={customer.address}>{customer.address}</p>
                      </TableCell>
                      <TableCell>
                         <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{customer.pincode}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/ecommerce/customer_details/${customer._id}`)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteOne(customer._id)}>
                              <LogOut className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              Showing {start + 1} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} customers
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-[420px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add New Customer Record
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="e.g. Alexander Doe" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="alex@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={newCustomer.city} onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})} placeholder="City" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={newCustomer.state} onChange={(e) => setNewCustomer({...newCustomer, state: e.target.value})} placeholder="State" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input value={newCustomer.pincode} onChange={(e) => setNewCustomer({...newCustomer, pincode: e.target.value})} placeholder="110001" />
              </div>
              <div className="space-y-2">
                <Label>Full Address</Label>
                <Textarea value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} rows={3} placeholder="Apartment, Street, Landmark..." />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="w-full sm:w-auto" onClick={handleAddCustomer}>Save Customer</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" /> 
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="py-4 text-base">
                {isBulkDelete 
                  ? `Are you sure you want to delete ${selected.length} selected customers? This action cannot be undone.`
                  : "Are you sure you want to delete this customer record? All associated data will be permanently removed."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}


function CustomerStatCard({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted/20">
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

