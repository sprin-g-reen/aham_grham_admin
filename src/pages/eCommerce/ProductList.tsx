"use client"

import { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL, UPLOADS_URL } from "@/config"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  MoreVertical,
  Plus,
  X,
  Upload,
  ShoppingBag,
  Wallet,
  Users,
  Box,
  ArrowUpRight,
  ArrowDownRight,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  Search,
  LayoutGrid,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { fileToBase64, compressImage } from "../../lib/image-utils"

// Define a proper interface for the product
interface Product {
  _id: string
  name: string
  category: string
  price: number
  image: string
  isMostSelling: boolean
  isServicePage: boolean
  description: string
  offer: string
  sku?: string
  tax?: string
  stockStatus?: string
  features?: string[]
  bannerImages?: string[]
}

// Use central UPLOADS_URL instead of local hardcoded one

export default function ProductList() {
  const [search, setSearch] = useState("")
  const [pageState, setPageState] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [ordersData, setOrdersData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const PAGE_SIZE = 10

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      setOrdersData(response.data || [])
    } catch (error) {
      toast.error("Failed to fetch products")
      setOrdersData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`)
      toast.success("Product deleted")
      fetchProducts()
    } catch (error) {
      toast.error("Failed to delete product")
    }
  }

  const toggleMostSelling = async (product: Product) => {
    try {
      await axios.put(`${API_URL}/products/${product._id}`, {
        isMostSelling: !product.isMostSelling
      })
      toast.success(product.isMostSelling ? "Removed from Most Selling" : "Added to Most Selling")
      fetchProducts()
    } catch (error) {
      toast.error("Failed to update product status")
    }
  }

  const toggleServicePage = async (product: Product) => {
    try {
      await axios.put(`${API_URL}/products/${product._id}`, {
        isServicePage: !product.isServicePage
      })
      toast.success(product.isServicePage ? "Removed from Services" : "Added to Services")
      fetchProducts()
    } catch (error) {
      toast.error("Failed to update service status")
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  // 🔍 Search filter
  const filteredOrders = useMemo(() => {
    if (!ordersData) return []
    return ordersData.filter((order) =>
      `${order.name} ${order.category}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search, ordersData])


  // Calculation for safe pagination without useEffect
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const currentPage = Math.min(pageState, totalPages)

  const paginatedProducts = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  // ☑️ Checkbox logic
  const toggleAll = (checked: boolean) => {
    setSelected(checked ? paginatedProducts.map(p => p._id) : [])
  }

  const toggleOne = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // 📤 Export to CSV
  const exportToCSV = (rows: Product[]) => {
    const headers = ["Name", "Category", "Stock Status", "SKU", "Price"]

    const csvContent = [
      headers.join(","),
      ...rows.map(row =>
        [
          row.name,
          row.category,
          row.stockStatus || "N/A",
          row.sku || "N/A",
          row.price,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "products.csv"
    link.click()

    URL.revokeObjectURL(url)
  }


  return (
    <div className="space-y-6">

      {/* KPI CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value="8,542"
          trend="+3.5%"
          icon={<ShoppingBag />}
          positive
        />
        <StatCard
          title="Total Revenue"
          value="$23,456"
          trend="+8.5%"
          icon={<Wallet />}
          positive
        />
        <StatCard
          title="Customers"
          value="5,678"
          trend="-2.5%"
          icon={<Users />}
        />
        <StatCard
          title="Products"
          value="1,234"
          trend="+5.0%"
          icon={<Box />}
          positive
        />
      </div>

      {/* PRODUCT LIST */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b py-4 flex-wrap gap-3">
          <div>
            <CardTitle className="text-lg mb-0">Products Management</CardTitle>
            <CardDescription>
              View, manage and organize your digital apothecary.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative mb-0 max-w-lg w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPageState(1)
                }}
              />
            </div>
            <Link to="/eCommerce/product-grid">
              <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                <LayoutGrid size={16} />
                Product Grid
              </Button>
            </Link>
            <Link to="/eCommerce/add-product">
              <Button className="gap-2 shadow-md">
                <Plus size={16} />
                Add Product
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {/* Selection Bar */}
          {selected.length > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-2">
              <p className="text-sm text-muted-foreground">
                {selected.length} selected
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    for (const id of selected) {
                      await deleteProduct(id)
                    }
                    setSelected([])
                  }}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="relative w-full overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={
                        paginatedProducts.length > 0 &&
                        selected.length === paginatedProducts.length
                      }
                      onCheckedChange={(val) => toggleAll(!!val)}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>

                  <TableHead>Services</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(product._id)}
                        onCheckedChange={() => toggleOne(product._id)}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.image
                              ? (product.image.startsWith('http') || product.image.startsWith('data:')
                                ? product.image
                                : `${UPLOADS_URL}/${product.image}`)
                              : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
                          }
                          alt={product.name}
                          className="h-10 w-10 rounded-full border object-cover p-1 bg-muted/50"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>{product.sku || 'N/A'}</TableCell>

                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price}</TableCell>



                    <TableCell>
                      <Badge className={product.isServicePage ? "bg-purple-100 text-purple-600 dark:bg-purple-500/20" : "bg-muted text-muted-foreground"} variant="outline">
                        {product.isServicePage ? "On Services" : "Off"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">

                        <Button
                          variant={product.isServicePage ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleServicePage(product)}
                          className={product.isServicePage ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}
                        >
                          {product.isServicePage ? "On Services" : "To Service"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(product)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProduct(product._id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination controls */}
          <div className="flex items-center justify-between px-2 py-2">
            <div className="text-sm text-muted-foreground">
              {filteredOrders.length === 0
                ? "Showing 0 of 0"
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1} - ${Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of ${filteredOrders.length}`}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPageState((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>

              <span className="text-sm">Page {currentPage} of {totalPages}</span>

              <Button
                onClick={() => setPageState((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingProduct && (
        <EditProductModal
          key={editingProduct._id}
          product={editingProduct}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingProduct(null)
          }}
          onUpdate={() => {
            fetchProducts()
            setIsEditModalOpen(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

/* KPI CARD */
function StatCard({
  title,
  value,
  trend,
  icon,
  positive,
}: {
  title: string
  value: string
  trend: string
  icon: React.ReactNode
  positive?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-6">
        <div>
          <p className="text-md text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-medium">{value}</h3>
          <div className="flex items-center gap-1 mt-1 text-sm font-medium mt-2">
            {positive ? (
              <ArrowUpRight className="h-4 w-5 text-emerald-600" />
            ) : (
              <ArrowDownRight className="h-4 w-5 text-rose-600" />
            )}
            <span>{trend}</span>
          </div>
        </div>
        <div className="rounded-xl bg-muted p-3">{icon}</div>
      </CardContent>
    </Card>
  )
}


function EditProductModal({ product, isOpen, onClose, onUpdate }: {
  product: Product,
  isOpen: boolean,
  onClose: () => void,
  onUpdate: () => void
}) {
  const [form, setForm] = useState({
    name: product.name || "",
    sku: product.sku || "",
    category: product.category || "",
    description: product.description || "",
    price: product.price?.toString() || "",
    offer: product.offer || "",
    features: product.features && product.features.length > 0 ? product.features : [""],
    tax: product.tax || "none",
    stockStatus: product.stockStatus || "in",
    bannerImages: product.bannerImages || [],
    aiReviewSummary: product.aiReviewSummary || "",
    reviewKeywords: product.reviewKeywords || [],
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const payload: any = { ...form }
      if (selectedFile) {
        const compressed = await compressImage(selectedFile)
        payload.image = await fileToBase64(compressed)
      }

      await axios.put(`${API_URL}/products/${product._id}`, payload)
      toast.success("Product updated successfully")
      onUpdate()
    } catch (error) {
      toast.error("Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  const addFeature = () => setForm({ ...form, features: [...form.features, ""] })
  const removeFeature = (idx: number) => setForm({ ...form, features: form.features.filter((_, i) => i !== idx) })
  const updateFeature = (idx: number, val: string) => {
    const next = [...form.features]
    next[idx] = val
    setForm({ ...form, features: next })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="media">Media & Banners</TabsTrigger>
            <TabsTrigger value="reviews">Review Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SKU / ID</Label>
                    <Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-70">
                    Edit Features (Points)
                    <Button variant="ghost" size="sm" onClick={addFeature} className="h-6 px-2"><Plus className="h-3 w-3" /></Button>
                  </Label>
                  <div className="space-y-2">
                    {form.features.map((f, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input value={f} onChange={e => updateFeature(i, e.target.value)} />
                        <Button variant="ghost" size="icon" onClick={() => removeFeature(i)} className="h-8 w-8" disabled={form.features.length === 1}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Label>Main Product Image</Label>
                <div className="border rounded-lg p-4 text-center space-y-4">
                  {(previewImage || product.image) && (
                    <img 
                      src={previewImage || (product.image?.startsWith('http') || product.image?.startsWith('data:') ? product.image : `${UPLOADS_URL}/${product.image}`)} 
                      className="h-32 mx-auto rounded object-cover" 
                    />
                  )}
                  <div className="flex justify-center">
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('edit-img-input')?.click()}>
                      <Upload className="h-4 w-4 mr-2" /> Change Image
                    </Button>
                  </div>
                  <input id="edit-img-input" type="file" className="hidden" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSelectedFile(file)
                      setPreviewImage(URL.createObjectURL(file))
                    }
                  }} />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="flex justify-between items-center">
                  Banner Images
                  <Button variant="ghost" size="sm" onClick={() => document.getElementById('edit-banner-input')?.click()}><Plus className="h-3 w-3" /></Button>
                </Label>
                <div className="flex flex-col gap-4">
                  {form.bannerImages.map((src, i) => (
                    <div key={i} className="relative group aspect-video border rounded-xl overflow-hidden">
                      <img src={src.startsWith('data:') ? src : (src.startsWith('http') ? src : `${UPLOADS_URL}/${src}`)} className="w-full h-full object-cover" />
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => {
                        const next = form.bannerImages.filter((_, idx) => idx !== i)
                        setForm({ ...form, bannerImages: next })
                      }}><X className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="h-20 border-dashed" onClick={() => document.getElementById('edit-banner-input')?.click()}>
                    <Plus className="h-4 w-4 mr-2" /> Add Banner
                  </Button>
                </div>
                <input id="edit-banner-input" type="file" multiple className="hidden" accept="image/*" onChange={async e => {
                  const files = e.target.files
                  if (files) {
                    const newImages: string[] = []
                    for (let i = 0; i < files.length; i++) {
                      const compressed = await compressImage(files[i])
                      const base64 = await fileToBase64(compressed)
                      newImages.push(base64)
                    }
                    setForm({ ...form, bannerImages: [...form.bannerImages, ...newImages] })
                  }
                }} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Says Summary</Label>
                <Textarea 
                  rows={6} 
                  value={form.aiReviewSummary} 
                  onChange={e => setForm({ ...form, aiReviewSummary: e.target.value })} 
                  placeholder="Summarize customer feedback..."
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Review Keywords / Tags</Label>
                  <Button variant="outline" size="sm" onClick={() => setForm({ ...form, reviewKeywords: [...form.reviewKeywords, { label: "", count: 0, trend: "up" }] })}>
                    <Plus className="h-3 w-3 mr-2" /> Add Tag
                  </Button>
                </div>
                <div className="grid gap-3">
                  {form.reviewKeywords.map((tag: any, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input 
                        placeholder="Tag" 
                        value={tag.label} 
                        onChange={e => {
                          const next = [...form.reviewKeywords]
                          next[i].label = e.target.value
                          setForm({ ...form, reviewKeywords: next })
                        }} 
                      />
                      <Input 
                        type="number" 
                        className="w-24" 
                        value={tag.count} 
                        onChange={e => {
                          const next = [...form.reviewKeywords]
                          next[i].count = parseInt(e.target.value)
                          setForm({ ...form, reviewKeywords: next })
                        }} 
                      />
                      <Select 
                        value={tag.trend} 
                        onValueChange={val => {
                          const next = [...form.reviewKeywords]
                          next[i].trend = val
                          setForm({ ...form, reviewKeywords: next })
                        }}
                      >
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up">Up</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="down">Down</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, reviewKeywords: form.reviewKeywords.filter((_: any, idx: number) => idx !== i) })}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
