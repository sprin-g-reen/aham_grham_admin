import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit, Search, Plus, User, FileUp, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const TestimonialsPage = () => {
  const [loading, setLoading] = useState(false)
  const [testimonials, setTestimonials] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // States for Adding
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: '',
    testimonialId: '',
    role: '',
    content: '',
  })
  const [addFile, setAddFile] = useState<File | null>(null)
  const [addFileInputKey, setAddFileInputKey] = useState(Date.now())

  // States for Updating
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [updateId, setUpdateId] = useState<string | null>(null)
  const [updateForm, setUpdateForm] = useState({
    name: '',
    testimonialId: '',
    role: '',
    content: '',
  })
  const [updateFile, setUpdateFile] = useState<File | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const response = await axios.get('https://aham-grham-website.vercel.app/api/testimonials')
      setTestimonials(response.data)
    } catch (error) {
      console.error("Failed to fetch testimonials", error)
      toast.error("Failed to load testimonials")
    } finally {
      setLoading(false)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleCsvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      if (!text) return

      // Robust CSV parsing (handles quotes and commas inside quotes)
      const parseCSV = (data: string) => {
        const rows = data.split(/\r?\n/).filter(row => row.trim())
        if (rows.length < 2) return []

        const headers = rows[0].split(',').map(h => h.trim().toLowerCase())

        return rows.slice(1).map(row => {
          const values: string[] = []
          let current = ''
          let inQuotes = false

          for (let i = 0; i < row.length; i++) {
            const char = row[i]
            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim())
              current = ''
            } else {
              current += char
            }
          }
          values.push(current.trim())

          const obj: any = {}
          headers.forEach((header, index) => {
            const val = values[index]?.replace(/^"|"$/g, '') // Remove wrapping quotes
            if (header.includes('name')) obj.name = val
            if (header.includes('id')) obj.testimonialId = val
            if (header.includes('role')) obj.role = val
            if (header.includes('content')) obj.content = val
          })
          return obj
        })
      }

      try {
        const testimonialsToImport = parseCSV(text)
        if (testimonialsToImport.length === 0) {
          toast.error("No valid data found in CSV")
          return
        }

        setLoading(true)
        const response = await axios.post('https://aham-grham-website.vercel.app/api/testimonials/bulk', {
          testimonials: testimonialsToImport
        })

        toast.success(response.data.message)
        fetchTestimonials()
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to import CSV")
      } finally {
        setLoading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  const downloadSampleCSV = () => {
    const headers = "Name,TestimonialID,Role,Content\n"
    const sample = "John Doe,TEST-999,Yoga Student,\"The experience was life changing.\"\n"
    const blob = new Blob([headers + sample], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'testimonials_sample.csv'
    a.click()
  }

  // Handle Add
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.name || !addForm.testimonialId || !addForm.role || !addForm.content) {
      toast.error("Please fill in all required fields.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', addForm.name)
      formData.append('testimonialId', addForm.testimonialId)
      formData.append('role', addForm.role)
      formData.append('content', addForm.content)
      formData.append('rating', '5')
      if (addFile) formData.append('image', addFile)

      await axios.post('https://aham-grham-website.vercel.app/api/testimonials', formData)
      toast.success("Testimonial added successfully")
      setAddForm({ name: '', testimonialId: '', role: '', content: '' })
      setAddFile(null)
      setAddFileInputKey(Date.now())
      setIsAddOpen(false)
      fetchTestimonials()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add testimonial")
    } finally {
      setLoading(false)
    }
  }

  // Handle Update
  const handleUpdateClick = (t: any) => {
    setUpdateId(t._id)
    setUpdateForm({
      name: t.name,
      testimonialId: t.testimonialId,
      role: t.role,
      content: t.content
    })
    setIsUpdateOpen(true)
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', updateForm.name)
      formData.append('testimonialId', updateForm.testimonialId)
      formData.append('role', updateForm.role)
      formData.append('content', updateForm.content)
      formData.append('rating', '5')
      if (updateFile) formData.append('image', updateFile)

      await axios.put(`https://aham-grham-website.vercel.app/api/testimonials/${updateId}`, formData)
      toast.success("Testimonial updated successfully")
      setIsUpdateOpen(false)
      fetchTestimonials()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update testimonial")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await axios.delete(`https://aham-grham-website.vercel.app/api/testimonials/${id}`)
      toast.success("Testimonial deleted")
      fetchTestimonials()
    } catch (error) {
      toast.error("Failed to delete testimonial")
    }
  }

  const filteredTestimonials = testimonials.filter((t: any) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.testimonialId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">Manage and view all your client feedback and testimonials.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={handleCsvFileChange}
          />
          <Button variant="outline" onClick={downloadSampleCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Sample CSV
          </Button>
          <Button variant="outline" onClick={handleImportClick} className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Import CSV
          </Button>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search testimonials..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="grid gap-4">
        {loading && testimonials.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Loading testimonials...</div>
        ) : filteredTestimonials.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 border rounded-xl border-dashed">
            {searchTerm ? "No testimonials match your search." : "No testimonials found."}
          </p>
        ) : (
          filteredTestimonials.map((t: any) => (
            <Card key={t._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Photo Section */}
                  <div className="shrink-0">
                    {t.image ? (
                      <img
                        src={`https://aham-grham-website.vercel.app${t.image}`}
                        alt={t.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/10"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 text-primary">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-grow min-w-0 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h3 className="font-bold text-xl truncate">{t.name}</h3>
                      <span className="inline-flex w-fit mx-auto md:mx-0 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                        {t.testimonialId}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-primary/80 mb-3">{t.role}</p>
                    <p className="text-muted-foreground text-sm italic leading-relaxed line-clamp-3 md:line-clamp-none">
                      "{t.content}"
                    </p>
                  </div>

                  {/* Actions Section */}
                  <div className="flex gap-2 shrink-0 self-center md:self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-primary/5 hover:text-primary border-muted"
                      onClick={() => handleUpdateClick(t)}
                    >
                      <Edit className="h-4 w-4" />
                      Update
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 border-muted"
                      onClick={() => handleDelete(t._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
            <DialogDescription>
              Create a new client feedback record. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Client Name</Label>
                <Input
                  id="add-name"
                  required
                  placeholder="e.g. Sarah Johnson"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-id">Testimonial ID</Label>
                <Input
                  id="add-id"
                  required
                  placeholder="e.g. TEST-001"
                  value={addForm.testimonialId}
                  onChange={(e) => setAddForm({ ...addForm, testimonialId: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-role">Role / Location</Label>
              <Input
                id="add-role"
                required
                placeholder="e.g. Yoga Student, Switzerland"
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-content">Testimonial Content</Label>
              <Textarea
                id="add-content"
                required
                placeholder="What did the client say?"
                className="min-h-[100px]"
                value={addForm.content}
                onChange={(e) => setAddForm({ ...addForm, content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-image">Client Photo (Optional)</Label>
              <Input
                id="add-image"
                key={addFileInputKey}
                type="file"
                accept="image/*"
                onChange={(e) => setAddFile(e.target.files?.[0] || null)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* UPDATE DIALOG */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Testimonial</DialogTitle>
            <DialogDescription>
              Make changes to the testimonial below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="up-name">Client Name</Label>
                <Input
                  id="up-name"
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="up-id">Testimonial ID</Label>
                <Input
                  id="up-id"
                  value={updateForm.testimonialId}
                  onChange={(e) => setUpdateForm({ ...updateForm, testimonialId: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="up-role">Role / Location</Label>
              <Input
                id="up-role"
                value={updateForm.role}
                onChange={(e) => setUpdateForm({ ...updateForm, role: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="up-content">Testimonial Content</Label>
              <Textarea
                id="up-content"
                value={updateForm.content}
                onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="up-image">Update Photo (Optional)</Label>
              <Input
                id="up-image"
                type="file"
                accept="image/*"
                onChange={(e) => setUpdateFile(e.target.files?.[0] || null)}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TestimonialsPage

