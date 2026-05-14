import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import axios from "axios"
import { API_URL } from "@/config"
import { compressImage, fileToBase64 } from "../../lib/image-utils"




export default function AddProduct() {
  const [categoriesData, setCategoriesData] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/categories`)
        setCategoriesData(data)
      } catch (error) {
        console.error("Failed to fetch categories")
      }
    }
    fetchCategories()
  }, [])

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    metaDescription: "",
    price: "",
    salePrice: "",
    tax: "",
    stock: "",
    stockStatus: "",
    offer: "",
    features: [""],
    bannerImages: [] as string[],
    aiReviewSummary: "",
    reviewKeywords: [] as { label: string; count: number; trend: string }[],
  })

  const validate = () => {
    const errors: Record<string, string> = {}

    if (!form.name) errors.name = "Product name is required"
    if (!form.sku) errors.sku = "Product ID is required"
    if (!form.price) errors.price = "Price is required"
    if (!form.category) errors.category = "Category is required"
    if (!form.tax) errors.tax = "GST is required"
    if (!form.stockStatus) errors.stockStatus = "Stock Status is required"

    return errors
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploaderKey, setUploaderKey] = useState(Date.now())

  const handleSubmit = async () => {
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        ...form,
        isMostSelling: false
      };

      if (selectedFile) {
        const compressed = await compressImage(selectedFile);
        payload.image = await fileToBase64(compressed);
      }

      // Banner images are already in base64 if they were just uploaded
      // or URLs if we were editing (but this is AddProduct, so mostly base64)

      await axios.post(`${API_URL}/products`, payload);

      toast.success("Product created successfully!")

      setForm({
        name: "",
        sku: "",
        category: "",
        description: "",
        metaDescription: "",
        price: "",
        salePrice: "",
        tax: "",
        stock: "",
        stockStatus: "",
        offer: "",
        features: [""],
        bannerImages: [],
        aiReviewSummary: "",
        reviewKeywords: [],
      })
      setSelectedFile(null)
      setErrors({})
      setUploaderKey(Date.now())
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }



  // State for published status (unused)

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Add New Product</h2>
          <p className="text-sm text-muted-foreground">
            Create a standard product with full details
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline">Discard</Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <GeneralInfoCard form={form} setForm={setForm} errors={errors} setErrors={setErrors} categories={categoriesData} />
          <PricingCard form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
          <InventoryCard form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
          <ProductImageUploader key={uploaderKey} onFileSelect={setSelectedFile} />
          <BannerImagesUploader form={form} setForm={setForm} />
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS TO CLEAN UP MAIN RENDER ---

function GeneralInfoCard({ form, setForm, errors, setErrors, categories }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Product Name</Label>
          <Input
            placeholder="Enter product name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value })
              setErrors({ ...errors, name: "" })
            }}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Product ID</Label>
          <Input
            placeholder="Enter product ID"
            value={form.sku}
            onChange={(e) => {
              setForm({ ...form, sku: e.target.value })
              setErrors({ ...errors, sku: "" })
            }}
          />
          {errors.sku && (
            <p className="text-sm text-red-500">{errors.sku}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(value) => {
              setForm({ ...form, category: value })
              setErrors({ ...errors, category: "" })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories && categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat.name.toLowerCase()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.category && (
            <p className="text-sm text-red-500">{errors.category}</p>
          )}
        </div>



        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            rows={4}
            placeholder="Product description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Dynamic Features Points */}
        <div className="space-y-4 md:col-span-2 pt-2 pb-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Product Features (Points)</Label>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              className="h-8"
              onClick={() => setForm({ ...form, features: [...form.features, ""] })}
            >
              <Plus className="h-3 w-3 mr-1" /> Add Point
            </Button>
          </div>
          <div className="space-y-3">
            {form.features.map((feature: string, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-xs font-bold opacity-30 w-4">{index + 1}</span>
                <Input
                  placeholder={`Feature point ${index + 1}`}
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...form.features];
                    newFeatures[index] = e.target.value;
                    setForm({ ...form, features: newFeatures });
                  }}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    const newFeatures = form.features.filter((_: any, i: number) => i !== index);
                    setForm({ ...form, features: newFeatures });
                  }}
                  disabled={form.features.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Any Offer</Label>
          <Input
            placeholder="e.g. Special festive discount available"
            value={form.offer}
            onChange={(e) => setForm({ ...form, offer: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function PricingCard({ form, setForm, errors, setErrors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            placeholder="₹0.00"
            value={form.price}
            onChange={(e) => {
              setForm({ ...form, price: e.target.value })
              setErrors({ ...errors, price: "" })
            }}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Sale Price</Label>
          <Input
            placeholder="₹0.00"
            value={form.salePrice}
            onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>GST</Label>
          <Select
            value={form.tax}
            onValueChange={(value) => {
              setForm({ ...form, tax: value })
              setErrors({ ...errors, tax: "" })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select GST" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No GST</SelectItem>
              <SelectItem value="5">5% GST</SelectItem>
              <SelectItem value="12">12% GST</SelectItem>
              <SelectItem value="18">18% GST</SelectItem>
              <SelectItem value="28">28% GST</SelectItem>
            </SelectContent>
          </Select>
          {errors.tax && (
            <p className="text-sm text-red-500">{errors.tax}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function InventoryCard({ form, setForm, errors, setErrors }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Stock Quantity</Label>
          <Input
            placeholder="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Stock Status</Label>
          <Select
            value={form.stockStatus}
            onValueChange={(value) => {
              setForm({ ...form, stockStatus: value })
              setErrors({ ...errors, stockStatus: "" })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          {errors.stockStatus && (
            <p className="text-sm text-red-500">{errors.stockStatus}</p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch />
          <Label>Track Inventory</Label>
        </div>
      </CardContent>
    </Card>
  )
}
  





// Separate component for image uploading and preview
function ProductImageUploader({ onFileSelect }: { onFileSelect?: (file: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [images, setImages] = useState<string[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // Handling single image for now as per backend upload.single('image')
    const newImage = URL.createObjectURL(file)

    setImages([newImage])
    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  useEffect(() => {
    return () => {
      images.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])


  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFiles(e.dataTransfer.files)
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground hover:bg-muted/40"
        >
          <Upload className="mb-2 h-6 w-6" />
          <p>
            Drag & drop images here or{" "}
            <span className="font-medium text-primary">
              click to upload
            </span>
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-md border"
              >
                <img
                  src={src}
                  alt="Product"
                  className="h-full w-full object-cover"
                />

                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                  onClick={() =>
                    setImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BannerImagesUploader({ form, setForm }: any) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newImages: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const compressed = await compressImage(file)
      const base64 = await fileToBase64(compressed)
      newImages.push(base64)
    }

    setForm({ ...form, bannerImages: [...form.bannerImages, ...newImages] })
  }

  const removeImage = (index: number) => {
    const next = form.bannerImages.filter((_: any, i: number) => i !== index)
    setForm({ ...form, bannerImages: next })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Banner Images (Very Big Images)</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {(form.bannerImages || []).length === 0 ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFiles(e.dataTransfer.files)
            }}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center text-sm text-muted-foreground hover:bg-muted/40 transition-all border-primary/20 hover:border-primary/40"
          >
            <Upload className="mb-3 h-8 w-8 text-primary/40" />
            <p className="font-medium text-primary/60">
              Drag & drop banner images here or{" "}
              <span className="text-primary underline underline-offset-4">
                click to upload
              </span>
            </p>
            <p className="text-xs mt-2 opacity-50 uppercase tracking-widest">Recommended: 1920x1080 or larger</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {(form.bannerImages || []).map((src: string, index: number) => (
              <div
                key={index}
                className="group relative aspect-video overflow-hidden rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/40 transition-all"
              >
                <img
                  src={src}
                  alt={`Banner ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute right-4 top-4 h-8 w-8 opacity-0 group-hover:opacity-100 shadow-xl"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="absolute left-4 top-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                  Banner ${index + 1}
                </div>
              </div>
            ))}
            
            {/* Prominent + Button at the end */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-32 border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/5 flex flex-col gap-2 rounded-xl transition-all"
              onClick={() => inputRef.current?.click()}
            >
              <Plus className="h-8 w-8 text-primary/40" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Add Another Banner Image</span>
            </Button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </CardContent>
    </Card>
  )
}



