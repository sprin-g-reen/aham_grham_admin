import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, MapPin, Search, Plus, Landmark } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Center {
  _id: string;
  name: string;
  location: string;
  description: string;
  status: string;
  image?: string;
}

const CentersPage = () => {
  const [loading, setLoading] = useState(false)
  const [centers, setCenters] = useState<Center[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    status: 'opened',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(Date.now())

  useEffect(() => {
    fetchCenters()
  }, [])

  const fetchCenters = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/centers')
      setCenters(data)
    } catch (error) {
      toast.error("Failed to fetch centers")
    }
  }

  const resetForm = () => {
    setForm({ name: '', location: '', description: '', status: 'opened' })
    setSelectedFile(null)
    setFileInputKey(Date.now())
    setSelectedId(null)
  }

  const compressImage = (file: File, maxWidth = 1280, quality = 0.7): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', quality);
        };
      };
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.location || !form.description) {
      toast.error("Please fill in all required fields.")
      return
    }

    setLoading(true)
    try {
      const payload: any = {
        ...form
      }
      
      if (selectedFile) {
        const compressed = await compressImage(selectedFile);
        payload.image = await fileToBase64(compressed);
      }

      if (isUpdateOpen && selectedId) {
        await axios.put(`http://localhost:5000/api/centers/${selectedId}`, payload)
        toast.success("Center updated successfully")
        setIsUpdateOpen(false)
      } else {
        await axios.post('http://localhost:5000/api/centers', payload)
        toast.success("Center added successfully")
        setIsAddOpen(false)
      }

      resetForm()
      fetchCenters()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save center")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (center: Center) => {
    setSelectedId(center._id)
    setForm({
      name: center.name,
      location: center.location,
      description: center.description,
      status: center.status,
    })
    setIsUpdateOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this center?")) return
    try {
      await axios.delete(`http://localhost:5000/api/centers/${id}`)
      toast.success("Center deleted")
      fetchCenters()
    } catch (error) {
      toast.error("Failed to delete center")
    }
  }

  const filteredCenters = centers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centers</h1>
          <p className="text-muted-foreground">Manage your physical sanctuary locations and their operational status.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search centers..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Center
          </Button>
        </div>
      </div>

      {/* CENTERS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
            <Landmark className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">No centers found.</p>
          </div>
        ) : (
          filteredCenters.map((center) => (
            <Card key={center._id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={center.image ? (center.image.startsWith('http') || center.image.startsWith('data:') ? center.image : `http://localhost:5000${center.image}`) : '/placeholder-center.jpg'} 
                  alt={center.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545208393-2160291ba86e?q=80&w=1000&auto=format&fit=crop' }}
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={center.status === 'opened' ? 'default' : 'destructive'} className="shadow-lg">
                    {center.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{center.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" /> {center.location}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 min-h-[60px]">
                  {center.description}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => handleEdit(center)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(center._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ADD/UPDATE DIALOG */}
      <Dialog open={isAddOpen || isUpdateOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false)
          setIsUpdateOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isUpdateOpen ? "Update Center" : "Add New Center"}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {isUpdateOpen ? "update" : "create"} a sanctuary location.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Center Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. The Midnight Grove"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location / Address</Label>
                <Input
                  id="location"
                  placeholder="e.g. Seattle, WA"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Operational Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(val) => setForm({ ...form, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opened">Opened</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the sanctuary..."
                  className="min-h-[120px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Center Image {isUpdateOpen && "(Optional)"}</Label>
                <Input
                  id="image"
                  key={fileInputKey}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddOpen(false)
                setIsUpdateOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isUpdateOpen ? "Update Center" : "Create Center"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CentersPage
