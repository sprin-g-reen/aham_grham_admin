import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Film, Image as ImageIcon } from 'lucide-react'
import { API_URL } from "@/config"
import { fileToBase64 } from "../../lib/image-utils"
import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnContent,
  DialogHeader as ShadcnHeader,
  DialogTitle as ShadcnTitle,
  DialogFooter as ShadcnFooter
} from "@/components/ui/dialog"

interface Glimpse {
  _id: string;
  media: string;
  type: 'image' | 'video';
  title: string;
  order: number;
}

const GlimpsePage = () => {
  const [glimpses, setGlimpses] = useState<Glimpse[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [addForm, setAddForm] = useState({
    title: '',
    media: ''
  })
  const [addFile, setAddFile] = useState<File | null>(null)

  const fetchGlimpses = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/glimpses`)
      setGlimpses(data)
    } catch (error) {
      toast.error("Failed to fetch glimpses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGlimpses()
  }, [])

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addFile) {
      toast.error("Please select a GIF file")
      return
    }

    setIsSaving(true)
    try {
      const payload: any = {
        title: addForm.title,
        type: 'image', // GIF is treated as image
        order: glimpses.length
      }

      if (addFile) {
        payload.media = await fileToBase64(addFile)
      }

      await axios.post(`${API_URL}/glimpses`, payload)
      toast.success("Glimpse added successfully")
      setIsAddOpen(false)
      setAddForm({ title: '', media: '' })
      setAddFile(null)
      fetchGlimpses()
    } catch (error) {
      toast.error("Failed to add glimpse")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/glimpses/${id}`)
      toast.success("Glimpse removed")
      fetchGlimpses()
    } catch (error) {
      toast.error("Failed to remove glimpse")
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery Glimpse</h1>
          <p className="text-muted-foreground">Manage the circular gallery on the Events page. Only GIFs are supported for animations.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Glimpse
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 italic">Loading gallery items...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {glimpses.map((g) => (
            <Card key={g._id} className="overflow-hidden group relative border-primary/10">
              <div className="aspect-[4/5] bg-muted relative">
                <img src={g.media} alt={g.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDelete(g._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 text-white">
                    <ImageIcon className="h-3 w-3" />
                    <span className="text-sm font-medium truncate">{g.title}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {glimpses.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
              No glimpses yet. Add your first GIF to show it in the circular gallery.
            </div>
          )}
        </div>
      )}

      {/* ADD MODAL */}
      <ShadcnDialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <ShadcnContent className="sm:max-w-[450px]">
          <ShadcnHeader>
            <ShadcnTitle>Add New Glimpse</ShadcnTitle>
          </ShadcnHeader>
          <form onSubmit={handleAddSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label>Media Title</Label>
              <Input 
                required 
                placeholder="e.g. Morning Ritual" 
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Required Format: Animated GIF</Label>
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <Film className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">GIF Mode Active</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="media-upload">Upload GIF</Label>
              <input 
                id="media-upload"
                type="file" 
                accept="image/gif, .gif"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                onChange={(e) => setAddFile(e.target.files?.[0] || null)}
              />
              <p className="text-[10px] text-muted-foreground">
                Only GIF format is supported for animations in this section.
              </p>
            </div>

            <ShadcnFooter>
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Uploading..." : "Add to Gallery"}
              </Button>
            </ShadcnFooter>
          </form>
        </ShadcnContent>
      </ShadcnDialog>
    </div>
  )
}

export default GlimpsePage
