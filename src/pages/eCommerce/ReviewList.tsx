import React, { useEffect, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, Plus, X, Trash2, CheckCircle, Clock } from "lucide-react"
import { API_URL } from "@/config"
import axios from "axios"

interface Product {
  _id: string
  name: string
  aiReviewSummary: string
  reviewKeywords: any[]
}

interface Review {
  _id: string
  customerName: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
}

const ReviewList = ({ mode }: { mode?: 'says' | 'reviews' }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`)
        const data = response.data || []
        setProducts(data)
        if (data.length > 0) {
          setSelectedProductId(data[0]._id)
          setSelectedProduct(data[0])
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedProductId) return
      setLoading(true)
      try {
        const response = await axios.get(`${API_URL}/reviews?productId=${selectedProductId}`)
        setReviews(response.data || [])
      } catch (err) {
        console.error("Error fetching reviews:", err)
        toast.error("Failed to load reviews")
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [selectedProductId])

  const handleProductChange = (id: string) => {
    setSelectedProductId(id)
    setSelectedProduct(products.find(p => p._id === id) || null)
  }

  const handleUpdateAISummary = async () => {
    if (!selectedProduct) return
    try {
      await axios.patch(`${API_URL}/products/${selectedProduct._id}`, {
        aiReviewSummary: selectedProduct.aiReviewSummary,
        reviewKeywords: selectedProduct.reviewKeywords
      })
      toast.success("Summary updated successfully!")
    } catch (err) {
      toast.error("Failed to update Summary")
    }
  }

  const toggleReviewStatus = async (reviewId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`${API_URL}/reviews/${reviewId}/status`, {
        isApproved: !currentStatus
      })
      setReviews(reviews.map(r => r._id === reviewId ? { ...r, isApproved: !currentStatus } : r))
      toast.success("Review status updated")
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews & Insights</h1>
          <p className="text-muted-foreground">Manage AI summaries and individual customer reviews.</p>
        </div>
      </div>

      <div className="max-w-xl">
        <Label className="mb-2 block text-sm font-medium">Select Product to Manage</Label>
        <Select value={selectedProductId} onValueChange={handleProductChange}>
          <SelectTrigger className="w-full bg-muted/20 border-primary/20 h-12">
            <SelectValue placeholder="Choose a product..." />
          </SelectTrigger>
          <SelectContent>
            {products.map(p => (
              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct && (
        <Accordion type="multiple" defaultValue={mode === 'says' ? ["customers-say"] : (mode === 'reviews' ? ["individual-reviews"] : ["customers-say", "individual-reviews"])} className="space-y-4">
          
          {/* Section 1: Customers Says (AI Summary) */}
          <AccordionItem value="customers-say" className="border rounded-xl bg-card overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold">Customer Says</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2 space-y-6 border-t border-muted">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Says Summary</Label>
                  <Textarea 
                    rows={5}
                    value={selectedProduct.aiReviewSummary}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, aiReviewSummary: e.target.value })}
                    placeholder="Enter what customers are saying about this product... (This will reflect on the website)"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Review Keywords / Tags</Label>
                    <Button variant="outline" size="sm" onClick={() => {
                      const next = { ...selectedProduct, reviewKeywords: [...selectedProduct.reviewKeywords, { label: "", count: 0, trend: "up" }] }
                      setSelectedProduct(next)
                    }}>
                      <Plus className="h-4 w-4 mr-2" /> Add Tag
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    {selectedProduct.reviewKeywords.map((tag, i) => (
                      <div key={i} className="flex gap-2">
                        <Input 
                          placeholder="Label" 
                          value={tag.label}
                          onChange={(e) => {
                            const next = [...selectedProduct.reviewKeywords]
                            next[i].label = e.target.value
                            setSelectedProduct({ ...selectedProduct, reviewKeywords: next })
                          }}
                        />
                        <Input 
                          type="number" className="w-24"
                          value={tag.count}
                          onChange={(e) => {
                            const next = [...selectedProduct.reviewKeywords]
                            next[i].count = parseInt(e.target.value)
                            setSelectedProduct({ ...selectedProduct, reviewKeywords: next })
                          }}
                        />
                        <Button variant="ghost" size="icon" onClick={() => {
                          const next = selectedProduct.reviewKeywords.filter((_, idx) => idx !== i)
                          setSelectedProduct({ ...selectedProduct, reviewKeywords: next })
                        }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleUpdateAISummary} className="w-full">Update Website Summary</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Customer Review (Individual Reviews) */}
          <AccordionItem value="individual-reviews" className="border rounded-xl bg-card overflow-hidden">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-accent-blue/10 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-accent-blue" />
                </div>
                <span className="text-lg font-bold">Customer Review (Individual)</span>
                <Badge variant="secondary" className="ml-2">{reviews.length} reviews</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2 border-t border-muted">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">Loading reviews...</TableCell></TableRow>
                  ) : reviews.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">No reviews found for this product.</TableCell></TableRow>
                  ) : (
                    reviews.map((r) => (
                      <TableRow key={r._id}>
                        <TableCell className="font-medium">{r.customerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-yellow-500">
                            {r.rating} <Star className="h-3 w-3 ml-1 fill-current" />
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{r.comment}</TableCell>
                        <TableCell>
                          {r.isApproved ? (
                            <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-500 border-orange-500/20">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={r.isApproved ? "outline" : "default"} 
                            size="sm"
                            className={r.isApproved ? "text-orange-500 border-orange-500/20 hover:bg-orange-500/10" : "bg-green-600 hover:bg-green-700"}
                            onClick={() => toggleReviewStatus(r._id, r.isApproved)}
                          >
                            {r.isApproved ? "Unpublish" : "Publish"}
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 ml-2">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      )}
    </div>
  )
}

export default ReviewList

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={`text-sm font-bold uppercase tracking-widest opacity-70 ${className}`}>{children}</label>
}
